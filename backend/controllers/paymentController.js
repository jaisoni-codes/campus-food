const Order = require('../models/Order');

// @desc    Mock Razorpay/UPI Payment Initiation
// @route   POST /api/payment/initiate
// @access  Private
const initiatePayment = async (req, res) => {
  const { orderId, amount, method } = req.body;
  // In a real scenario, you'd call Razorpay/UPI API here to generate a payment order/intent
  try {
    const order = await Order.findById(orderId);
    if (order) {
      res.json({
        success: true,
        transactionId: `txn_${Math.random().toString(36).substring(7)}`,
        amount,
        method,
        message: 'Payment initiated successfully (Mock)',
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mock Payment Verification
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  const { orderId, transactionId, status } = req.body;
  // In a real scenario, you'd verify the signature from Razorpay
  try {
    const order = await Order.findById(orderId);
    if (order) {
      if (status === 'SUCCESS') {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: transactionId,
          status: status,
          update_time: Date.now().toString(),
        };
        const updatedOrder = await order.save();
        res.json({ success: true, message: 'Payment successful', order: updatedOrder });
      } else {
        res.status(400).json({ success: false, message: 'Payment failed' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { initiatePayment, verifyPayment };
