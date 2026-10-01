const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  addMenuItem,
  getMyRestaurant,
  vendorAddMenuItem,
  deleteRestaurant
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Vendor routes (Protected)
router.route('/my-restaurant').get(protect, getMyRestaurant).post(protect, createRestaurant);
router.route('/my-restaurant/menu').post(protect, vendorAddMenuItem);

// Public / Admin routes
router.route('/').get(getRestaurants).post(createRestaurant);
router.route('/:id').get(getRestaurantById).delete(deleteRestaurant);
router.route('/:id/menu').post(addMenuItem);

module.exports = router;
