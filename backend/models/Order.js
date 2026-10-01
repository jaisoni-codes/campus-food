const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant',
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assigned rider
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Restaurant.menu', // Reference to the menu item inside Restaurant
        },
      },
    ],
    deliveryLocation: {
      hostelName: { type: String, required: true },
      roomNumber: { type: String },
      campus: { type: String, enum: ['IIT Jammu', 'IIM Jammu'], required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Cash on Delivery',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    deliveryCharge: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Placed', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
