const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    restaurantId,
    orderItems,
    deliveryLocation,
    paymentMethod,
    itemsPrice,
    deliveryCharge,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      student: req.user._id,
      restaurant: restaurantId,
      orderItems,
      deliveryLocation,
      paymentMethod,
      itemsPrice,
      deliveryCharge,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('student', 'name email hostelDetails')
      .populate('restaurant', 'name contactNumber')
      .populate('rider', 'name contactNumber');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validTransitions = {
  'Placed': ['Accepted', 'Cancelled'],
  'Accepted': ['Preparing', 'Cancelled'],
  'Preparing': ['Ready'],
  'Ready': ['Out for Delivery'],
  'Out for Delivery': ['Delivered'],
  'Delivered': [],
  'Cancelled': []
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Restaurant/Admin/Rider)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const newStatus = req.body.status;
      if (newStatus && validTransitions[order.status].includes(newStatus)) {
        order.status = newStatus;
        
        if (newStatus === 'Delivered') {
          order.deliveredAt = Date.now();
          order.isPaid = true; // Assuming paid when delivered for COD
          order.paidAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(400).json({ message: `Invalid status transition from ${order.status} to ${newStatus}` });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign a rider to an order
// @route   PUT /api/orders/:id/assign
// @access  Private (Admin/Rider)
const assignRider = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.rider = req.user._id;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for the logged-in vendor's restaurant
// @route   GET /api/orders/vendor
// @access  Private (Vendor)
const getVendorOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('student', 'name contactNumber hostelDetails')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  assignRider,
  getMyOrders,
  getVendorOrders,
};
