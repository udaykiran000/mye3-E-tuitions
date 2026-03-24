const express = require('express');
const router = express.Router();
const { 
  getMyClasses, 
  getMyAssignments,
  createLiveSession, 
  getLiveSessions, 
  uploadRecording, 
  getRecordings 
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All teacher routes are protected
router.use(protect);
router.use(authorizeRoles('teacher'));

router.get('/my-classes', getMyClasses);
router.get('/my-assignments', getMyAssignments);
router.post('/schedule-live', createLiveSession);
router.get('/live-sessions', getLiveSessions);
router.post('/recordings', uploadRecording);
router.get('/recordings', getRecordings);

module.exports = router;
