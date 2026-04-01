const User = require('../models/User');
const LiveSession = require('../models/LiveSession');
const Recording = require('../models/Recording');
const Material = require('../models/Material');
const Transaction = require('../models/Transaction');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const ClassBundle = require('../models/ClassBundle');

// @desc    Get all available classes and subjects for the store
// @route   GET /api/student/catalog
// @access  Student
exports.getCatalog = async (req, res, next) => {
  try {
    const [classes, subjects] = await Promise.all([
      ClassBundle.find({ isActive: true }).sort({ className: 1 }),
      Subject.find({ isActive: true }).sort({ classLevel: 1 })
    ]);

    const catalog = [
      ...classes.map(c => ({
        id: c._id,
        name: `${c.className || 'Unknown Class'} (Full Course)`,
        type: 'bundle',
        price: c.price || 0,
        classLevel: c.className || 'Unknown',
        subjects: c.subjects || []
      })),
      ...subjects.map(s => ({
        id: s._id,
        name: s.subjectName || s.name || 'Unknown Subject',
        type: 'subject',
        price: s.price || 0,
        classLevel: `Class ${s.classLevel || 'N/A'}`
      }))
    ];

    res.status(200).json(catalog);
    res.status(200).json(catalog);
  } catch (error) {
    console.error('CATALOG ERROR FAIL:', error);
    next(error);
  }
};

// @desc    Process mock payment success
// @route   POST /api/student/mock-payment-success
// @access  Student
exports.processMockPayment = async (req, res, next) => {
  try {
    const { amount, packageName, referenceId, type } = req.body;

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

    // Update student's subscriptions
    if (!student.activeSubscriptions) student.activeSubscriptions = [];
    
    // Check if subscription already exists, if so, extend it
    const existingSubIndex = student.activeSubscriptions.findIndex(sub => sub.name === packageName);
    
    if (existingSubIndex > -1) {
      student.activeSubscriptions[existingSubIndex].expiryDate = expiryDate;
    } else {
      student.activeSubscriptions.push({
        name: packageName,
        type,
        subscriptionType: req.body.subscriptionType || 'full', // Updated
        referenceId,
        expiryDate,
        purchaseDate: new Date()
      });
    }

    // Explicitly mark modified for mixed/array types
    student.markModified('activeSubscriptions');
    await student.save();

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
    // Admin bypass: return all active class bundles and subjects for testing
    if (req.user.role === 'admin') {
      const [classes, subjects] = await Promise.all([
        ClassBundle.find({ isActive: true }),
        Subject.find({ isActive: true })
      ]);
      const allSubs = [
        ...classes.map(c => ({ name: c.className, type: 'bundle', subscriptionType: 'full', expiryDate: new Date('2099-12-31') })),
        ...subjects.map(s => ({ name: s.name, type: 'subject', subscriptionType: 'single', expiryDate: new Date('2099-12-31') }))
      ];
      return res.status(200).json(allSubs);
    }

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
    // Admin bypass: return all active learning items for testing
    if (req.user.role === 'admin') {
      const [classes, subjects] = await Promise.all([
        ClassBundle.find({ isActive: true }),
        Subject.find({ isActive: true })
      ]);
      const allLearning = [
        ...classes.map(c => ({ name: c.className, type: 'bundle', subscriptionType: 'full', expiryDate: new Date('2099-12-31'), isExpired: false })),
        ...subjects.map(s => ({ name: s.name, type: 'subject', subscriptionType: 'single', expiryDate: new Date('2099-12-31'), isExpired: false }))
      ];
      return res.status(200).json(allLearning);
    }

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

// @desc    Get active and upcoming live sessions for enrolled courses
// @route   GET /api/student/live-alerts
// @access  Student
exports.getLiveAlerts = async (req, res, next) => {
  try {
    // Admin bypass: return all live and upcoming sessions for testing
    if (req.user.role === 'admin') {
      const liveSessions = await LiveSession.find({ 
        status: { $in: ['live', 'upcoming', 'ended'] } 
      }).populate('teacherId', 'name').sort({ startTime: -1 });
      return res.status(200).json(liveSessions);
    }

    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const activeSubs = (student.activeSubscriptions || []).filter(sub => new Date() < new Date(sub.expiryDate));
    const enrolledNames = activeSubs.map(sub => sub.name);

    // Find sessions that are 'live' or 'upcoming' and in student's enrolled subjects/bundles
    // Also include 'ended' sessions from the last 24 hours for recap
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const liveSessions = await LiveSession.find({
      $or: [
        { status: { $in: ['live', 'upcoming'] } },
        { status: 'ended', updatedAt: { $gte: yesterday } }
      ],
      $and: [
        {
          $or: [
            { classLevel: { $in: enrolledNames } },
            { subjectName: { $in: enrolledNames } }
          ]
        }
      ]
    }).populate('teacherId', 'name').sort({ status: 1, startTime: 1 }); 

    // Fetch materials for each session
    const sessionsWithMaterials = await Promise.all(liveSessions.map(async (session) => {
      const materials = await Material.find({ sessionId: session._id });
      return {
        ...session.toObject(),
        materials
      };
    }));

    res.status(200).json(sessionsWithMaterials);
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
    
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Clean names (e.g., "Class 10 (Full Course)" -> "Class 10")
    const cleanName = courseName.replace(' (Full Course)', '');
    const classLevelMatch = courseName.match(/Class \d+/i)?.[0];

    // Access Logic:
    // 1. Check for Active "Full Course" for this grade
    const fullCourseSub = student.activeSubscriptions.find(sub => 
      (sub.name === cleanName || sub.name === courseName || sub.name === classLevelMatch) && 
      sub.subscriptionType === 'full' && 
      new Date() < new Date(sub.expiryDate)
    );

    // 2. Check for Active "Single Subject" for this specific subject
    const singleSubjectSub = student.activeSubscriptions.find(sub => 
      (sub.name === cleanName || sub.name === courseName) && 
      sub.subscriptionType === 'single' && 
      new Date() < new Date(sub.expiryDate)
    );

    // BYPASS FOR ADMIN/TEACHER OR MOCK COURSES
    const isBypass = req.user.role === 'admin' || req.user.role === 'teacher' || courseName.includes('(Mock)');

    if (!fullCourseSub && !singleSubjectSub && !isBypass) {
      return res.status(403).json({ 
        message: 'No active subscription found. Subscribe to the Full Course or this individual subject to unlock.', 
        type: 'buy' 
      });
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

// @desc    Get student's transaction history
// @route   GET /api/student/transactions
// @access  Student
exports.getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
