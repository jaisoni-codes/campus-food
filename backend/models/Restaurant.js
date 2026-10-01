const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }, // Exactly same as restaurant menu price
  category: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  image: { type: String },
});

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // If we want to link restaurant to a user login
    },
    location: {
      address: String,
      proximityToCampus: String, // e.g., '1km from IIT Main Gate'
    },
    contactNumber: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    menu: [menuItemSchema],
    commissionRate: {
      type: Number,
      default: 5, // Default 5% commission from restaurant
    },
    deliveryFee: {
      type: Number,
      default: 20, // Default delivery fee
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
