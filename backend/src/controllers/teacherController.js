const User = require('../models/User');
const LiveSession = require('../models/LiveSession');
const Recording = require('../models/Recording');
const Material = require('../models/Material');

// @desc    Get teacher's assigned classes and subjects
// @route   GET /api/teacher/my-classes
// @access  Teacher
exports.getMyClasses = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.user._id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.status(200).json(teacher.assignedSubjects || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher's assigned classes and subjects (formatted for dropdowns)
// @route   GET /api/teacher/my-assignments
// @access  Teacher
exports.getMyAssignments = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.user._id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const assignments = (teacher.assignedSubjects || []).map(item => {
      let label = '';
      if (item.assignmentType === 'bundle') {
        label = `${item.classLevel} (Full Bundle)`;
      } else {
        label = `${item.subjectName} (${item.classLevel})`;
      }

      return {
        id: item.subjectId || item.classLevel, // fallback to classLevel for bundles
        name: label,
        type: item.assignmentType,
        classLevel: item.classLevel,
        subjectName: item.subjectName
      };
    });

    res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule/Start a Live Class
// @route   POST /api/teacher/live-sessions
// @access  Teacher
exports.createLiveSession = async (req, res, next) => {
  try {
    const { classLevel, subjectName, subjectId, title, platform, link, startTime } = req.body;
    
    const session = await LiveSession.create({
      teacherId: req.user._id,
      subjectId,
      classLevel,
      subjectName,
      title,
      platform,
      link,
      startTime,
      status: 'upcoming'
    });

    res.status(201).json({
      message: 'Live class scheduled successfully! Notifications sent to students.',
      session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher's live sessions
// @route   GET /api/teacher/live-sessions
// @access  Teacher
exports.getLiveSessions = async (req, res, next) => {
  try {
    const sessions = await LiveSession.find({ teacherId: req.user._id }).sort({ startTime: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload recording / link video
// @route   POST /api/teacher/recordings
// @access  Teacher
exports.uploadRecording = async (req, res, next) => {
  try {
    const { classLevel, subjectName, title, youtubeId } = req.body;
    
    const recording = await Recording.create({
      teacherId: req.user._id,
      classLevel,
      subjectName,
      title,
      youtubeId
    });

    res.status(201).json(recording);
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher's recordings
// @route   GET /api/teacher/recordings
// @access  Teacher
exports.getRecordings = async (req, res, next) => {
  try {
    const recordings = await Recording.find({ teacherId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(recordings);
  } catch (error) {
    next(error);
  }
};
