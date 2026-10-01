const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  assignRider,
  getMyOrders,
  getVendorOrders,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/vendor').get(protect, getVendorOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, updateOrderStatus);
router.route('/:id/assign').put(protect, assignRider);

module.exports = router;
