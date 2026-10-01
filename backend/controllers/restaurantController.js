const Restaurant = require('../models/Restaurant');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new restaurant & auto-generate vendor account
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
  const { name, contactNumber, location, commissionRate, deliveryFee } = req.body;
  const bcrypt = require('bcryptjs');
  const User = require('../models/User');

  try {
    // 1. Generate credentials
    const generatedEmail = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000) + '@campusfood.com';
    const generatedPassword = 'password123'; // Simple default password for MVP/Demo

    // 2. Hash password and create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const vendorUser = await User.create({
      name: name + ' Owner',
      email: generatedEmail,
      password: hashedPassword,
      role: 'vendor'
    });

    // 3. Create Restaurant linked to new User
    const restaurant = new Restaurant({
      name,
      contactNumber,
      location,
      commissionRate,
      deliveryFee,
      owner: vendorUser._id,
      menu: []
    });

    const createdRestaurant = await restaurant.save();
    
    // 4. Return restaurant + credentials so Admin can copy them
    res.status(201).json({
      restaurant: createdRestaurant,
      credentials: {
        email: generatedEmail,
        password: generatedPassword
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add menu item to restaurant
// @route   POST /api/restaurants/:id/menu
// @access  Private/Owner or Admin
const addMenuItem = async (req, res) => {
  const { name, description, price, category, image } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      const menuItem = {
        name,
        description,
        price,
        category,
        image,
      };

      restaurant.menu.push(menuItem);
      await restaurant.save();
      res.status(201).json({ message: 'Menu item added' });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in vendor's restaurant
// @route   GET /api/restaurants/my-restaurant
// @access  Private/Vendor
const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'No restaurant found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add menu item to vendor's own restaurant
// @route   POST /api/restaurants/my-restaurant/menu
// @access  Private/Vendor
const vendorAddMenuItem = async (req, res) => {
  const { name, description, price, category, image } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (restaurant) {
      restaurant.menu.push({ name, description, price, category, image });
      await restaurant.save();
      res.status(201).json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (restaurant) {
      res.json({ message: 'Restaurant removed' });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  addMenuItem,
  getMyRestaurant,
  vendorAddMenuItem,
  deleteRestaurant,
};
