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
        className: c.className,
        classLevel: c.className.replace(/\D/g, ''), // Extract "10" from "Class 10"
        name: `${c.className || 'Unknown Class'} (All Subjects)`,
        type: 'bundle',
        pricing: c.pricing,
        board: c.board,
        subjects: c.subjects || []
      })),
      ...subjects.map(s => ({
        id: s._id,
        className: `Class ${s.classLevel}`, // Standardize to "Class X"
        name: s.name || 'Unknown Subject',
        type: 'subject',
        pricing: s.pricing,
        classLevel: s.classLevel ? String(s.classLevel) : '',
        board: s.board || 'TS Board',
      }))
    ];

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
    const { amount, packageName, referenceId, type, subscriptionType } = req.body;

    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Calculate duration in months
    let monthsToAdd = 1;
    if (subscriptionType === 'threeMonths') monthsToAdd = 3;
    else if (subscriptionType === 'sixMonths') monthsToAdd = 6;
    else if (subscriptionType === 'twelveMonths') monthsToAdd = 12;

    // Create the transaction record
    const transaction = await Transaction.create({
      studentId: req.user._id,
      amount: amount || 0,
      packageName,
      referenceId: String(referenceId),
      type: type || 'bundle',
      status: 'success'
    });

    // Update student's subscriptions
    if (!student.activeSubscriptions) student.activeSubscriptions = [];

    const existingSubIndex = student.activeSubscriptions.findIndex(sub =>
      String(sub.referenceId) === String(referenceId)
    );

    let baseDate = new Date(); // Default: Start from today
    if (existingSubIndex > -1) {
      const currentExpiry = new Date(student.activeSubscriptions[existingSubIndex].expiryDate);
      if (currentExpiry > new Date()) {
        baseDate = currentExpiry; // Additive: Start from existing expiry
      }
    }

    const expiryDate = new Date(baseDate);
    expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);

    if (existingSubIndex > -1) {
      // Additive / Extension
      student.activeSubscriptions[existingSubIndex].expiryDate = expiryDate;
      student.activeSubscriptions[existingSubIndex].subscriptionType = subscriptionType || 'full';
    } else {
      // New Enrollment
      student.activeSubscriptions.push({
        name: packageName.split(' - ')[0], // Pure name without duration suffix
        type: type || 'bundle',
        subscriptionType: subscriptionType || 'full',
        referenceId: String(referenceId),
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
    const now = new Date();

    // Helper function to expand a bundle name into multiple subject entries
    const expandBundle = async (item) => {
      if (item.type !== 'bundle' || item.isExpired) return [item];

      const classLevelNum = parseInt(item.name.replace(/\D/g, ''));
      if (!classLevelNum) return [item];

      let subjects = await Subject.find({ classLevel: classLevelNum, isActive: true }).sort({ name: 1 });

      // FALLBACK: If no subjects in DB for this class level, provide defaults for 6-10
      if (subjects.length === 0 && classLevelNum >= 6 && classLevelNum <= 10) {
        const defaults = ['Mathematics', 'Science', 'Social Studies', 'English'];
        subjects = defaults.map(name => ({
          name,
          classLevel: classLevelNum,
          isActive: true,
          _id: `fallback-${classLevelNum}-${name}` // Mock ID
        }));
      }

      if (subjects.length === 0) {
        return [{
          ...item.toObject ? item.toObject() : item,
          originalBundleName: item.type === 'bundle' ? item.name : undefined
        }];
      }

      return subjects.map(s => ({
        ...item.toObject ? item.toObject() : item,
        name: s.name,
        originalBundleName: item.name,
        type: 'subject', // Present it as a subject to the frontend
        subscriptionType: item.subscriptionType || 'full',
        isExpandedFromBundle: true
      }));
    };

    // Admin bypass: expand all active bundles and return individual subjects
    if (req.user.role === 'admin') {
      const [classes, subjects] = await Promise.all([
        ClassBundle.find({ isActive: true }),
        Subject.find({ isActive: true })
      ]);

      const bundleItems = classes.map(c => ({ name: c.className, type: 'bundle', isExpired: false, expiryDate: new Date('2099-12-31') }));
      const subjectItems = subjects.map(s => ({ name: s.name, type: 'subject', isExpired: false, expiryDate: new Date('2099-12-31') }));

      const expandedBundles = await Promise.all(bundleItems.map(expandBundle));
      const flattenedLearning = [...expandedBundles.flat(), ...subjectItems];

      return res.status(200).json(flattenedLearning);
    }

    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

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
    // Normalize names to match LiveSessions (e.g., "Class 10 (All Subjects)" -> "Class 10")
    const enrolledNames = activeSubs.map(sub => {
      const clean = sub.name
        .replace(' (All Subjects)', '')
        .replace(' (Full Course)', '')
        .replace(' (Full Bundle)', '')
        .replace(' - Full Bundle', '');
      return [sub.name, clean];
    }).flat();

    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    // Board filter: match sessions that have no board OR match student's board
    const boardFilter = student.board
      ? { $or: [{ board: student.board }, { board: { $exists: false } }, { board: null }] }
      : {};

    const liveSessions = await LiveSession.find({
      ...boardFilter,
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

    // Clean names (e.g., "Class 10 (All Subjects)" -> "Class 10")
    const cleanName = courseName
      .replace(' (Full Course)', '')
      .replace(' (All Subjects)', '')
      .replace(' (Full Bundle)', '');
    const classLevelMatch = courseName.match(/Class \d+/i)?.[0];

    // 0. Lookup subject to find its class level if it's a direct subject name
    let subjectClassLevel = null;
    const subjectEntry = await Subject.findOne({ name: courseName });
    if (subjectEntry) {
      subjectClassLevel = `Class ${subjectEntry.classLevel}`;
    }

    // Access Logic:
    // 1. Check for Active "Full Course", "All Subjects", or any Duration Bundle for this grade
    const fullCourseSub = student.activeSubscriptions.find(sub => {
      const subNameClean = sub.name.replace(' (All Subjects)', '').replace(' (Full Course)', '').replace(' (Full Bundle)', '').trim();
      const isActive = new Date() < new Date(sub.expiryDate);

      // Match if: 
      // - Exact name match
      // - Sub name is "Class X" and course is in that class
      // - Name includes target
      const nameMatch = subNameClean === cleanName || sub.name === courseName || sub.name.includes(cleanName);
      const bundleMatch = (classLevelMatch && subNameClean === classLevelMatch) || (subjectClassLevel && subNameClean === subjectClassLevel);

      return isActive && (nameMatch || bundleMatch) && (sub.type === 'bundle' || sub.subscriptionType === 'full' || sub.name.includes('All Subjects'));
    });

    // 2. Check for Active "Single Subject" for this specific subject
    const singleSubjectSub = student.activeSubscriptions.find(sub => {
      const subNameClean = sub.name.replace(' (All Subjects)', '').replace(' (Full Course)', '').replace(' (Full Bundle)', '').trim();
      const isActive = new Date() < new Date(sub.expiryDate);
      return isActive && (subNameClean === cleanName || sub.name === courseName) && sub.subscriptionType === 'single';
    });

    // BYPASS FOR ADMIN/TEACHER OR MOCK COURSES
    const isBypass = req.user.role === 'admin' || req.user.role === 'teacher' || courseName.includes('(Mock)');

    if (!fullCourseSub && !singleSubjectSub && !isBypass) {
      return res.status(403).json({
        message: 'No active subscription found. Subscribe to the All Subjects package or this individual subject to unlock.',
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
      ...boardFilter,
      isVisible: true,
      $or: [
        { classLevel: cleanName },
        { subjectName: cleanName },
        { classLevel: courseName },
        { subjectName: courseName }
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
// @desc    Get all materials across all active subscriptions
// @route   GET /api/student/all-materials
// @access  Student
exports.getAllMaterials = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const activeSubs = (student.activeSubscriptions || []).filter(sub => new Date() < new Date(sub.expiryDate));

    // Normalize names to match Materials
    const enrolledNames = activeSubs.map(sub => {
      const clean = sub.name
        .replace(' (All Subjects)', '')
        .replace(' (Full Course)', '')
        .replace(' (Full Bundle)', '')
        .replace(' - Full Bundle', '');
      return [sub.name, clean];
    }).flat();

    const uniqueEnrolledNames = [...new Set(enrolledNames)];

    const boardFilter = student.board
      ? { $or: [{ board: student.board }, { board: { $exists: false } }, { board: null }] }
      : {};

    const materials = await Material.find({
      ...boardFilter,
      isVisible: true,
      $or: [
        { classLevel: { $in: uniqueEnrolledNames } },
        { subjectName: { $in: uniqueEnrolledNames } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(materials);
  } catch (error) {
    console.error('FETCH_ALL_MATERIALS_FAIL:', error);
    next(error);
  }
};
