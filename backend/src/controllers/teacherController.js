const User = require('../models/User');
const LiveSession = require('../models/LiveSession');
const Recording = require('../models/Recording');
const Material = require('../models/Material');
const Class = require('../models/Class');
const Subject = require('../models/Subject');

// @desc    Get teacher's assigned classes and subjects
// @route   GET /api/teacher/my-classes
// @access  Teacher
exports.getMyClasses = async (req, res, next) => {
  try {
    // Admin bypass: return all classes and subjects
    if (req.user.role === 'admin') {
      const [classes, subjects] = await Promise.all([
        Class.find({}).sort({ level: 1 }),
        Subject.find({}).sort({ classLevel: 1 })
      ]);
      const allAssignments = [
        ...classes.map(c => ({ assignmentType: 'bundle', classLevel: c.name, subjectName: c.name })),
        ...subjects.map(s => ({ assignmentType: 'subject', classLevel: `Class ${s.classLevel}`, subjectName: s.name, subjectId: s._id }))
      ];
      return res.status(200).json(allAssignments);
    }

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
    // Admin bypass: return all classes and subjects formatted for dropdowns
    if (req.user.role === 'admin') {
      const [classes, subjects] = await Promise.all([
        Class.find({}).sort({ level: 1 }),
        Subject.find({}).sort({ classLevel: 1 })
      ]);
      const allAssignments = [
        ...classes.map(c => ({
          id: c._id,
          name: `${c.name} (Full Bundle)`,
          type: 'bundle',
          classLevel: c.name,
          subjectName: c.name
        })),
        ...subjects.map(s => ({
          id: s._id,
          name: `${s.name} (Class ${s.classLevel})`,
          type: 'subject',
          classLevel: `Class ${s.classLevel}`,
          subjectName: s.name
        }))
      ];
      return res.status(200).json(allAssignments);
    }

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
        id: item.subjectId || item.classLevel,
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
    // Admin sees ALL sessions; Teacher sees only their own
    const query = req.user.role === 'admin' ? {} : { teacherId: req.user._id };
    const sessions = await LiveSession.find(query).sort({ startTime: -1 });
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

// @desc    Upload / Link Material (Notes, PDFs)
// @route   POST /api/teacher/materials
// @access  Teacher
exports.uploadMaterial = async (req, res, next) => {
  try {
    console.log('--- UPLOAD MATERIAL REQUEST ---');
    console.log('BODY:', req.body);
    console.log('FILE:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    } : 'NO FILE');

    const { classLevel, subjectName, title, fileUrl: externalUrl, type, assignmentId } = req.body;
    
    // If a file was uploaded via multer, use that path. Otherwise use the provided URL.
    const finalFileUrl = req.file ? `/uploads/${req.file.filename}` : externalUrl;

    if (!finalFileUrl) {
      console.error('ERROR: Missing fileUrl or uploaded file');
      return res.status(400).json({ message: 'File or link is required' });
    }

    const material = await Material.create({
      teacherId: req.user._id,
      assignmentId,
      classLevel,
      subjectName,
      title,
      fileUrl: finalFileUrl,
      type: type || 'notes'
    });

    res.status(201).json({
      message: 'Material uploaded successfully!',
      material
    });
  } catch (error) {
    console.error('SERVER ERROR (Upload Material):', error);
    next(error);
  }
};

// @desc    Get teacher's materials
// @route   GET /api/teacher/materials
// @access  Teacher
exports.getMaterials = async (req, res, next) => {
  try {
    // Admin sees ALL materials; Teacher sees only their own
    const query = req.user.role === 'admin' ? {} : { teacherId: req.user._id };
    const materials = await Material.find(query).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete teacher's material
// @route   DELETE /api/teacher/materials/:id
// @access  Teacher
exports.deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findOneAndDelete({ _id: req.params.id, teacherId: req.user._id });
    if (!material) return res.status(404).json({ message: 'Material not found or unauthorized' });
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    next(error);
  }
};
