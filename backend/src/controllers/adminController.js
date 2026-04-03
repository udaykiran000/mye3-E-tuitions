const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Payment = require('../models/Payment');
const ClassBundle = require('../models/ClassBundle');
const Material = require('../models/Material');
const Transaction = require('../models/Transaction');
const LiveSession = require('../models/LiveSession');

exports.updatePricing = async (req, res, next) => {
  try {
    const { type, id, newPrice } = req.body;

    if (type === 'bundle') {
      const classItem = await Class.findByIdAndUpdate(id, { bundlePrice: newPrice }, { new: true });
      return res.status(200).json(classItem);
    } else if (type === 'subject') {
      const subjectItem = await Subject.findByIdAndUpdate(id, { individualPrice: newPrice }, { new: true });
      return res.status(200).json(subjectItem);
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalTeachers = await User.countDocuments({ role: 'Teacher' });

    const payments = await Payment.find({ status: 'captured' });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({
      totalStudents,
      totalTeachers,
      totalRevenue,
      transactionsCount: payments.length
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get all class bundles (6-10)
// @route   GET /api/admin/classes
// @access  Admin
exports.getClassBundles = async (req, res, next) => {
  try {
    const bundles = await ClassBundle.find({}).sort({ className: 1 });
    res.status(200).json(bundles);
  } catch (error) {
    next(error);
  }
};

// @desc    Update class bundle price
// @route   PUT /api/admin/classes/:id
// @access  Admin
exports.updateClassBundlePrice = async (req, res, next) => {
  try {
    const { price } = req.body;
    const bundle = await ClassBundle.findByIdAndUpdate(
      req.params.id,
      { price: Number(price) },
      { new: true, runValidators: true }
    );

    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    res.status(200).json(bundle);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subjects (11-12)
// @route   GET /api/admin/subjects
// @access  Admin
exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({}).sort({ classLevel: 1 });
    res.status(200).json(subjects);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new subject
// @route   POST /api/admin/subjects
// @access  Admin
exports.addSubject = async (req, res, next) => {
  try {
    const { name, classLevel, pricing, syllabus } = req.body;
    const subject = await Subject.create({
      name,
      classLevel: Number(classLevel),
      pricing,
      syllabus
    });
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a subject
// @route   PUT /api/admin/subjects/:id
// @access  Admin
exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subject
// @route   DELETE /api/admin/subjects/:id
// @access  Admin
exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json({ message: 'Subject removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teachers (for dropdown)
// @route   GET /api/admin/teachers-list
// @access  Admin
exports.getTeachersList = async (req, res, next) => {
  try {
    const teachers = await User.find({ 
      $or: [{ role: 'teacher' }, { _id: req.user._id }] 
    }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get teachers filtered by assignment (classLevel + subjectName)
// @route   GET /api/admin/teachers-for-subject?classLevel=Class 10&subjectName=Maths
// @access  Admin
exports.getTeachersForSubject = async (req, res, next) => {
  try {
    const { classLevel, subjectName } = req.query;

    // Build match filter
    const matchFilter = { role: 'teacher' };
    if (classLevel || subjectName) {
      matchFilter.assignedSubjects = {
        $elemMatch: {
          ...(classLevel ? { classLevel } : {}),
          ...(subjectName ? { subjectName } : {})
        }
      };
    }

    const teachers = await User.find(matchFilter)
      .select('name email assignedSubjects')
      .sort({ name: 1 });

    res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign subject to teacher
// @route   PUT /api/admin/teachers/:id/assign
// @access  Admin
exports.assignSubjectToTeacher = async (req, res, next) => {
  try {
    const { assignments } = req.body;
    const teacher = await User.findById(req.params.id);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Support both single assignment and batch assignments
    const assignmentsToAdd = Array.isArray(assignments) ? assignments : [req.body];

    assignmentsToAdd.forEach(a => {
      // Avoid exact duplicates
      const exists = teacher.assignedSubjects.some(
        existing => existing.classLevel === a.classLevel && existing.subjectName === a.subjectName
      );
      
      if (!exists) {
        teacher.assignedSubjects.push({ 
          assignmentType: a.assignmentType, 
          classLevel: a.classLevel, 
          subjectName: a.subjectName, 
          subjectId: a.subjectId || null 
        });
      }
    });
    
    await teacher.save();
    res.status(200).json(teacher);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove assignment from teacher
// @route   DELETE /api/admin/teachers/:id/assign/:assignmentId
// @access  Admin
exports.removeAssignmentFromTeacher = async (req, res, next) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    teacher.assignedSubjects = teacher.assignedSubjects.filter(
      a => a._id.toString() !== req.params.assignmentId
    );

    await teacher.save();
    res.status(200).json(teacher);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Admin
exports.getStudentsList = async (req, res, next) => {
  try {
    const students = await User.find({ 
      $or: [{ role: 'student' }, { _id: req.user._id }] 
    }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin manually add student
// @route   POST /api/admin/students
// @access  Admin
exports.addStudent = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const student = await User.create({
      name,
      email,
      password,
      role: 'student'
    });

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

// @desc    Manually assign subscription to student
// @route   PUT /api/admin/students/assign-subscription/:id
// @access  Admin
exports.assignSubscription = async (req, res, next) => {
  try {
    const { type, referenceId, name, durationDays } = req.body;
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(durationDays));

    student.activeSubscriptions.push({
      type,
      referenceId,
      name,
      expiryDate
    });

    await student.save();
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const teacherCount = await User.countDocuments({ role: 'teacher' });

    const liveSessions = await LiveSession.find({ 
      status: { $in: ['live', 'upcoming'] } 
    }).populate('teacherId', 'name').sort({ status: 1, startTime: 1 });
    const liveCount = liveSessions.length;
    
    // Revenue logic - Sum of all successful payments/transactions
    const [txs, payments] = await Promise.all([
      Transaction.find({ status: 'success' }).populate('studentId', 'name email').sort({ date: -1 }),
      Payment.find({ status: 'captured' }).populate('userId', 'name email').sort({ createdAt: -1 })
    ]);

    const totalRevenue = txs.reduce((acc, curr) => acc + (curr.amount || 0), 0) + 
                         payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // --- CHART DATA LOGIC: Last 7 Days ---
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      
      const dailyTx = txs.filter(t => new Date(t.date || t.createdAt).toDateString() === date.toDateString());
      const dailyPay = payments.filter(p => new Date(p.createdAt).toDateString() === date.toDateString());
      
      const dailySum = dailyTx.reduce((acc, curr) => acc + (curr.amount || 0), 0) + 
                       dailyPay.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      
      chartData.push({ name: dateStr, revenue: dailySum });
    }

    // Normalize and take top 5 for "Recent Transactions"
    const normalizedPayments = payments.map(p => ({
      _id: p._id,
      name: p.userId?.name || 'Manual Grant',
      packageName: p.subscriptionDetails?.type === 'bundle' ? 'Class Bundle' : 'Individual Subject',
      amount: `₹${(p.amount || 0).toLocaleString()}`,
      status: 'SUCCESS',
      date: p.createdAt
    }));

    const normalizedtxs = txs.map(t => ({
      _id: t._id,
      name: t.studentId?.name || 'Manual Grant',
      packageName: t.packageName || 'Unknown Package',
      amount: `₹${(t.amount || 0).toLocaleString()}`,
      status: t.status ? (t.status === 'success' ? 'SUCCESS' : t.status.toUpperCase()) : 'PENDING',
      date: t.date || t.createdAt
    }));

    const recentTransactions = [...normalizedtxs, ...normalizedPayments]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5);

    // Expiring soon logic
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);
    
    const expiringSoonCount = await User.countDocuments({
      role: 'student',
      'activeSubscriptions.expiryDate': { $gte: now, $lte: thirtyDaysLater }
    });

    res.status(200).json({
      totalStudents: studentCount,
      totalTeachers: teacherCount,
      totalRevenue,
      expiringSoon: expiringSoonCount,
      liveSessionsCount: liveCount,
      activeSessions: liveSessions.slice(0, 5),
      recentTransactions,
      revenueChartData: chartData
    });
  } catch (error) {
    console.error('DASHBOARD ERROR FAIL:', error);
    next(error);
  }
};

// @desc    Extend student subscription
// @route   PUT /api/admin/students/:id/extend
// @access  Admin
exports.extendSubscription = async (req, res, next) => {
  try {
    const { subscriptionId, newExpiryDate } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'Student not found' });

    const subscription = user.activeSubscriptions.id(subscriptionId);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    subscription.expiryDate = newExpiryDate;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new teacher
// @route   POST /api/admin/teachers
// @access  Admin
exports.addTeacher = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const teacher = await User.create({
      name,
      email,
      password,
      role: 'teacher'
    });

    res.status(201).json({ _id: teacher._id, name: teacher.name, email: teacher.email });
  } catch (error) {
    next(error);
  }
};

// @desc    Update any user
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();
    res.status(200).json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    next(error);
  }
};
// @desc    Update subjects in a bundle
// @route   PUT /api/admin/classes/:id/subjects
// @access  Admin
exports.updateBundleSubjects = async (req, res, next) => {
  try {
    const { subjects } = req.body;
    const bundle = await ClassBundle.findByIdAndUpdate(
      req.params.id,
      { subjects },
      { new: true }
    );
    if (!bundle) return res.status(404).json({ message: 'Bundle not found' });
    res.status(200).json(bundle);
  } catch (error) {
    next(error);
  }
};

// @desc    Add study material
// @route   POST /api/admin/materials
// @access  Admin
exports.addMaterial = async (req, res, next) => {
  try {
    const { classId, subjectName, title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save the relative path to be served statically
    const fileUrl = `/uploads/${req.file.filename}`;

    const material = await Material.create({
      classId,
      subjectName,
      title,
      fileUrl
    });
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
};

// @desc    Get materials for a class
// @route   GET /api/admin/materials/:classId
// @access  Admin
exports.getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find({ classId: req.params.classId }).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    next(error);
  }
};
// @desc    Update pricing for a class (All Subjects + Individual Subjects)
// @route   PUT /api/admin/classes/:id
// @access  Admin
exports.updateClassPricing = async (req, res, next) => {
  try {
    const { pricing, subjects, syllabus } = req.body;
    const updateData = {};
    if (pricing !== undefined) updateData.pricing = pricing;
    if (syllabus !== undefined) updateData.syllabus = syllabus;
    if (subjects !== undefined) updateData.subjects = subjects;

    const bundle = await ClassBundle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!bundle) return res.status(404).json({ message: 'All Subjects package not found' });
    res.status(200).json(bundle);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new class bundle
// @route   POST /api/admin/classes
// @access  Admin
exports.addClassBundle = async (req, res, next) => {
  try {
    const { className, syllabus, pricing, subjects } = req.body;
    const bundle = await ClassBundle.create({
      className,
      syllabus,
      pricing,
      subjects: subjects || []
    });
    res.status(201).json(bundle);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Active status for Class (6-10) or Subject (11-12)
// @route   PUT /api/admin/toggle-status
// @access  Admin
exports.toggleStatus = async (req, res, next) => {
  try {
    const { type, id, isActive } = req.body;
    let item;

    if (type === 'class') {
      item = await ClassBundle.findByIdAndUpdate(id, { isActive }, { new: true });
    } else {
      item = await Subject.findByIdAndUpdate(id, { isActive }, { new: true });
    }

    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Manual Grant access to student via email
// @route   POST /api/admin/grant-access
// @access  Admin
exports.grantManualAccess = async (req, res, next) => {
  try {
    const { email, type, referenceId, name, subscriptionType, durationDays } = req.body;
    const student = await User.findOne({ email });

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student with this email not found' });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(durationDays || 365));

    student.activeSubscriptions.push({
      type, // 'bundle' or 'subject'
      referenceId,
      name,
      subscriptionType: subscriptionType || 'full',
      expiryDate
    });

    student.markModified('activeSubscriptions');
    await student.save();

    // Create Transaction Record for History
    await Transaction.create({
      studentId: student._id,
      amount: 0, // Manual grant is usually free or handled differently
      status: 'success',
      packageName: `Manual Grant: ${name}`,
      referenceId: referenceId,
      type: type,
      date: new Date()
    });

    // Emit global update for Admin Dashboard
    if (req.app.get('io')) {
      req.app.get('io').emit('admin-stats-update');
    }

    res.status(200).json({ message: `Access granted to ${student.name} successfully!` });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform transactions
// @route   GET /api/admin/transactions
// @access  Admin
exports.getAllTransactions = async (req, res, next) => {
  try {
    const [txs, payments] = await Promise.all([
      Transaction.find({}).populate('studentId', 'name email').sort({ createdAt: -1 }),
      Payment.find({ status: 'captured' }).populate('userId', 'name email').sort({ createdAt: -1 })
    ]);

    // Normalize payments into transaction format
    const normalizedPayments = payments.map(p => ({
      _id: p._id,
      studentId: p.userId,
      amount: p.amount,
      status: 'success', // 'captured' means success
      packageName: p.subscriptionDetails.type === 'bundle' ? 'Class Bundle' : 'Individual Subject',
      type: p.subscriptionDetails.type,
      referenceId: p.subscriptionDetails.referenceIds[0],
      date: p.createdAt,
      isLegacy: true
    }));

    const allTransactions = [...txs, ...normalizedPayments].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(allTransactions);
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule/Start Live Classes
// @route   POST /api/admin/live-sessions
// @access  Admin
exports.createLiveSession = async (req, res, next) => {
  try {
    const { sessions } = req.body;
    
    // Validate if it's a bulk creation (sessions array) or single legacy format
    const sessionsToCreate = sessions || [req.body];

    const createdSessions = await LiveSession.insertMany(sessionsToCreate.map(s => {
      const cleanSession = { 
        ...s, 
        title: s.title || `${s.subjectName} Live`,
        status: 'upcoming' 
      };
      // If subjectId is not a valid ObjectId (24 hex chars), remove it to prevent CastError
      if (s.subjectId && !/^[0-9a-fA-F]{24}$/.test(s.subjectId)) {
        delete cleanSession.subjectId;
      }
      return cleanSession;
    }));

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      createdSessions.forEach(session => {
        io.emit('live-session-update', { type: 'create', session });
      });
    }

    res.status(201).json({
      message: `${createdSessions.length} Live class(es) scheduled successfully!`,
      sessions: createdSessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Live Session
// @route   PUT /api/admin/live-sessions/:id
// @access  Admin
exports.updateLiveSession = async (req, res, next) => {
  try {
    const { title, platform, link, teacherId, startTime, classLevel, subjectName, subjectId } = req.body;
    
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.title = title || `${subjectName || session.subjectName} Live`;
    session.platform = platform || session.platform;
    session.link = link || session.link;
    session.teacherId = teacherId || session.teacherId;
    session.startTime = startTime || session.startTime;
    session.classLevel = classLevel || session.classLevel;
    session.subjectName = subjectName || session.subjectName;
    
    if (subjectId) {
      session.subjectId = /^[0-9a-fA-F]{24}$/.test(subjectId) ? subjectId : undefined;
    }

    const updatedSession = await session.save();

    // Populate teacher info before emitting
    const populated = await LiveSession.findById(updatedSession._id).populate('teacherId', 'name email');

    // Emit socket event
    const io = req.app.get('io');
    if (io) io.emit('live-session-update', { type: 'update', session: populated });

    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Live Session
// @route   DELETE /api/admin/live-sessions/:id
// @access  Admin
exports.deleteLiveSession = async (req, res, next) => {
  try {
    const session = await LiveSession.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Emit socket event
    const io = req.app.get('io');
    if (io) io.emit('live-session-update', { type: 'delete', sessionId: req.params.id });

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Live Sessions (Scheduled/Live for Roster)
// @route   GET /api/admin/live-sessions
// @access  Admin
exports.getAllLiveSessions = async (req, res, next) => {
  try {
    // Only fetch sessions from the last 2 days to keep the dashboard snappy
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const sessions = await LiveSession.find({ 
      startTime: { $gte: twoDaysAgo }
    })
      .populate('teacherId', 'name email')
      .sort({ startTime: 1 });
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};
