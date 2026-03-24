const express = require('express');
const router = express.Router();
const { 
  getMySubscriptions, 
  getLiveAlerts, 
  getCourseContent,
  getMyLearning,
  getMaterialsByAssignment,
  processMockPayment,
  getCatalog
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All student routes are protected
router.use(protect);
router.use(authorizeRoles('student'));

router.get('/subscriptions', getMySubscriptions);
router.get('/my-learning', getMyLearning);
router.get('/live-alerts', getLiveAlerts);
router.get('/content/:courseName', getCourseContent);
router.get('/materials/:assignmentId', getMaterialsByAssignment);
router.post('/mock-payment-success', processMockPayment);
router.get('/catalog', getCatalog);

module.exports = router;
