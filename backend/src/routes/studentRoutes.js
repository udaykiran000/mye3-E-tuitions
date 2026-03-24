const express = require('express');
const router = express.Router();
const { 
  getMySubscriptions, 
  getLiveAlerts, 
  getCourseContent 
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All student routes are protected
router.use(protect);
router.use(authorizeRoles('student'));

router.get('/subscriptions', getMySubscriptions);
router.get('/live-alerts', getLiveAlerts);
router.get('/content/:courseName', getCourseContent);

module.exports = router;
