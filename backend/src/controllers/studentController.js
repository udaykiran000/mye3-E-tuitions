const User = require('../models/User');
const LiveSession = require('../models/LiveSession');
const Recording = require('../models/Recording');
const Material = require('../models/Material');
const Transaction = require('../models/Transaction');
const Class = require('../models/Class');
const Subject = require('../models/Subject');

// @desc    Get all available classes and subjects for the store
// @route   GET /api/student/catalog
// @access  Student
exports.getCatalog = async (req, res, next) => {
  try {
    const [classes, subjects] = await Promise.all([
      Class.find({}).sort({ level: 1 }),
      Subject.find({}).sort({ classLevel: 1 })
    ]);

    const catalog = [
      ...classes.map(c => ({
        id: c._id,
        name: `${c.name} (Full Bundle)`,
        type: 'bundle',
        price: c.bundlePrice,
        classLevel: c.name
      })),
      ...subjects.map(s => ({
        id: s._id,
        name: s.name,
        type: 'subject',
        price: s.price,
        classLevel: `Class ${s.classLevel}`
      }))
    ];

    res.status(200).json(catalog);
  } catch (error) {
    next(error);
  }
};

// @desc    Process mock payment success
// @route   POST /api/student/mock-payment-success
// @access  Student
exports.processMockPayment = async (req, res, next) => {
  try {
    const { amount, packageName, referenceId, type } = req.body;
    console.log('MOCK PAYMENT STARTED:', { body: req.body, user: req.user._id });

    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Calculate expiry date (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Create the transaction record
    const transaction = await Transaction.create({
      studentId: req.user._id,
      amount: amount || 0,
      packageName,
      referenceId: String(referenceId),
      type,
      status: 'success'
    });
    console.log('TRANSACTION CREATED:', transaction._id);

    // Update student's subscriptions
    if (!student.activeSubscriptions) student.activeSubscriptions = [];
    
    // Check if subscription already exists, if so, extend it
    const existingSubIndex = student.activeSubscriptions.findIndex(sub => sub.name === packageName);
    
    if (existingSubIndex > -1) {
      console.log('EXTENDING EXISTING SUB:', packageName);
      student.activeSubscriptions[existingSubIndex].expiryDate = expiryDate;
    } else {
      console.log('ADDING NEW SUB:', packageName);
      student.activeSubscriptions.push({
        name: packageName,
        type,
        referenceId,
        expiryDate,
        purchaseDate: new Date()
      });
    }

    // Explicitly mark modified for mixed/array types
    student.markModified('activeSubscriptions');
    await student.save();
    console.log('STUDENT SAVED SUCCESSFULLY');

    res.status(200).json({
      success: true,
      message: 'Payment simulated successfully!',
      expiryDate,
      activeSubscriptions: student.activeSubscriptions
    });
  } catch (error) {
    console.error('MOCK PAYMENT CRASHED:', error);
    next(error);
  }
};

// @desc    Get student's active and expired subscriptions
// @route   GET /api/student/subscriptions
// @access  Student
exports.getMySubscriptions = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json(student.activeSubscriptions || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Get active subscriptions for the learning grid (Filtered by Expiry)
// @route   GET /api/student/my-learning
// @access  Student
exports.getMyLearning = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const now = new Date();
    const activeLearning = (student.activeSubscriptions || []).map(sub => ({
      ...sub.toObject ? sub.toObject() : sub,
      isExpired: now > new Date(sub.expiryDate)
    }));

    res.status(200).json(activeLearning);
  } catch (error) {
    next(error);
  }
};

// @desc    Get active live sessions for enrolled courses
// @route   GET /api/student/live-alerts
// @access  Student
exports.getLiveAlerts = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const activeSubs = student.activeSubscriptions.filter(sub => new Date() < new Date(sub.expiryDate));
    const enrolledNames = activeSubs.map(sub => sub.name);

    // Find sessions that are currently 'live' and in student's enrolled subjects/bundles
    const liveSessions = await LiveSession.find({
      status: 'live',
      $or: [
        { classLevel: { $in: enrolledNames } },
        { subjectName: { $in: enrolledNames } }
      ]
    }).populate('teacherId', 'name');

    res.status(200).json(liveSessions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get content for a specific course (Recordings & Materials)
// @route   GET /api/student/content/:courseName
// @access  Student
exports.getCourseContent = async (req, res, next) => {
  try {
    const { courseName } = req.params;
    const student = await User.findById(req.user._id);

    // Clean name for bundles (e.g., "Class 10 (Full Bundle)" -> "Class 10")
    const cleanName = courseName.replace(' (Full Bundle)', '');

    // Find the subscription for this course (using original or clean name)
    const subscription = student.activeSubscriptions.find(sub => 
      sub.name === courseName || sub.name === cleanName
    );

    // BYPASS FOR ADMIN/TEACHER OR MOCK COURSES
    const isBypass = req.user.role === 'admin' || req.user.role === 'teacher' || courseName.includes('(Mock)');

    if (!subscription && !isBypass) {
      return res.status(403).json({ message: 'No active subscription for this course', type: 'buy' });
    }

    if (subscription && new Date() > new Date(subscription.expiryDate) && !isBypass) {
      return res.status(403).json({ message: 'Subscription expired', type: 'renew', expiryDate: subscription.expiryDate });
    }

    // Fetch recordings and materials using the clean name
    const recordings = await Recording.find({ 
      $or: [
        { classLevel: cleanName },
        { subjectName: cleanName },
        { classLevel: courseName }, // Backup for legacy
        { subjectName: courseName }  // Backup for legacy
      ]
    }).sort({ createdAt: -1 });

    const materials = await Material.find({
      $or: [
        { classLevel: cleanName },
        { subjectName: cleanName },
        { classLevel: courseName }, // Backup for legacy
        { subjectName: courseName }  // Backup for legacy
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ recordings, materials });
  } catch (error) {
    next(error);
  }
};
// @desc    Get materials for a specific assignment ID
// @route   GET /api/student/materials/:assignmentId
// @access  Student
exports.getMaterialsByAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const materials = await Material.find({ assignmentId }).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
};
