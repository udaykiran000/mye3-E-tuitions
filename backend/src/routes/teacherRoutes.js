const express = require('express');
const router = express.Router();
const { 
  getMyClasses, 
  getMyAssignments,
  createLiveSession, 
  getLiveSessions, 
  uploadRecording, 
  getRecordings,
  getMaterials,
  uploadMaterial,
  deleteMaterial
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All teacher routes are protected
router.use(protect);
router.use(authorizeRoles('teacher'));

router.get('/my-classes', getMyClasses);
router.get('/my-assignments', getMyAssignments);
router.post('/schedule-live', createLiveSession);
router.get('/live-sessions', getLiveSessions);
router.post('/recordings', uploadRecording);
router.get('/recordings', getRecordings);
router.get('/materials', getMaterials);
router.post('/materials', upload.single('file'), uploadMaterial);
router.delete('/materials/:id', deleteMaterial);

module.exports = router;
