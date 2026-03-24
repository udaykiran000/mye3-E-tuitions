const User = require('../models/User');
const LiveSession = require('../models/LiveSession');
const Recording = require('../models/Recording');
const Material = require('../models/Material');

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

// @desc    Get active live sessions for enrolled courses
// @route   GET /api/student/live-alerts
// @access  Student
exports.getLiveAlerts = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    const enrolledIds = student.activeSubscriptions
      .filter(sub => new Date() < new Date(sub.expiryDate))
      .map(sub => sub.referenceId.toString());

    // Find sessions that are currently 'live' and in student's enrolled subjects
    const liveSessions = await LiveSession.find({
      status: 'live',
      $or: [
        { classLevel: { $in: student.activeSubscriptions.map(s => s.name) } }, // For bundles
        { subjectName: { $in: student.activeSubscriptions.map(s => s.name) } } // For individual subjects
      ]
    }).populate('teacherId', 'name');

    // Filter by referenceId (more accurate)
    // Note: This logic assumes LiveSession might need a referenceId field in future
    // For now, matching by name is a good fallback

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

    // Find the subscription for this course
    const subscription = student.activeSubscriptions.find(sub => sub.name === courseName);

    if (!subscription) {
      return res.status(403).json({ message: 'No active subscription for this course', type: 'buy' });
    }

    // Check expiry
    if (new Date() > new Date(subscription.expiryDate)) {
      return res.status(403).json({ message: 'Subscription expired', type: 'renew', expiryDate: subscription.expiryDate });
    }

    // Fetch recordings and materials
    const recordings = await Recording.find({ 
      $or: [
        { classLevel: courseName },
        { subjectName: courseName }
      ]
    }).sort({ createdAt: -1 });

    const materials = await Material.find({
      $or: [
        { classLevel: courseName },
        { subjectName: courseName }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ recordings, materials });
  } catch (error) {
    next(error);
  }
};
