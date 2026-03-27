const express = require('express');
const router = express.Router();
const { 
  updatePricing, 
  getReports, 
  getClassBundles, 
  updateClassPricing, // Updated
  getSubjects, 
  addSubject, 
  updateSubject, 
  deleteSubject, 
  getTeachersList, 
  getStudentsList, 
  extendSubscription, 
  addTeacher, 
  updateUser, 
  deleteUser, 
  updateBundleSubjects, 
  addMaterial, 
  getMaterials, 
  assignSubjectToTeacher, 
  removeAssignmentFromTeacher, 
  addStudent, 
  assignSubscription, 
  getDashboardStats,
  toggleStatus, // New
  grantManualAccess // New
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/pricing', protect, authorizeRoles('admin'), updatePricing);
router.get('/classes', protect, authorizeRoles('admin'), getClassBundles);
router.put('/classes/:id', protect, authorizeRoles('admin'), updateClassPricing); // Updated
router.put('/classes/:id/subjects', protect, authorizeRoles('admin'), updateBundleSubjects);
router.put('/toggle-status', protect, authorizeRoles('admin'), toggleStatus); // New
router.post('/grant-access', protect, authorizeRoles('admin'), grantManualAccess); // New

router.get('/materials/:classId', protect, authorizeRoles('admin'), getMaterials);
router.post('/materials', protect, authorizeRoles('admin'), upload.single('file'), addMaterial);

router.get('/subjects', protect, authorizeRoles('admin'), getSubjects);
router.post('/subjects', protect, authorizeRoles('admin'), addSubject);
router.put('/subjects/:id', protect, authorizeRoles('admin'), updateSubject);
router.delete('/subjects/:id', protect, authorizeRoles('admin'), deleteSubject);

router.get('/teachers-list', protect, authorizeRoles('admin'), getTeachersList);
router.post('/teachers', protect, authorizeRoles('admin'), addTeacher);
router.put('/teachers/:id/assign', protect, authorizeRoles('admin'), assignSubjectToTeacher);
router.delete('/teachers/:id/assign/:assignmentId', protect, authorizeRoles('admin'), removeAssignmentFromTeacher);

router.get('/students', protect, authorizeRoles('admin'), getStudentsList);
router.post('/students', protect, authorizeRoles('admin'), addStudent);
router.put('/students/assign-subscription/:id', protect, authorizeRoles('admin'), assignSubscription);
router.put('/students/:id/extend', protect, authorizeRoles('admin'), extendSubscription);

router.put('/users/:id', protect, authorizeRoles('admin'), updateUser);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);

router.get('/stats', protect, authorizeRoles('admin'), getDashboardStats);
router.get('/reports', protect, authorizeRoles('admin'), getReports);

module.exports = router;
