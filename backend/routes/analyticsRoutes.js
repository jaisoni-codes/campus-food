const express = require('express');
const router = express.Router();
const { getDashboardSummary, getRestaurantPerformance } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

// Add a middleware to check if user is admin, for now just using protect
// router.get('/summary', protect, admin, getDashboardSummary);
router.get('/summary', protect, getDashboardSummary);
router.get('/restaurants', protect, getRestaurantPerformance);

module.exports = router;
