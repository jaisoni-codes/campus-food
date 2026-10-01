const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// @desc    Get total revenue and profit
// @route   GET /api/analytics/summary
// @access  Private (Admin)
const getDashboardSummary = async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true }).populate('restaurant');
    
    let totalRevenue = 0; // Total money handled (item price + delivery charge)
    let totalProfit = 0;  // Platform profit: commission from item price + delivery charge (assume full delivery charge goes to rider, maybe platform keeps a cut? Let's just calculate commission)

    orders.forEach(order => {
      totalRevenue += order.totalPrice;
      if (order.restaurant && order.restaurant.commissionRate) {
        const commission = (order.itemsPrice * order.restaurant.commissionRate) / 100;
        totalProfit += commission;
      }
    });

    res.json({
      totalRevenue,
      totalProfit,
      totalOrders: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant performance
// @route   GET /api/analytics/restaurants
// @access  Private (Admin)
const getRestaurantPerformance = async (req, res) => {
  try {
    const orders = await Order.find({ isPaid: true }).populate('restaurant', 'name commissionRate');
    
    const performance = {};

    orders.forEach(order => {
      const restId = order.restaurant ? order.restaurant._id.toString() : 'Unknown';
      if (!performance[restId]) {
        performance[restId] = {
          name: order.restaurant ? order.restaurant.name : 'Unknown',
          totalOrders: 0,
          revenue: 0,
          profitGenerated: 0
        };
      }
      
      performance[restId].totalOrders += 1;
      performance[restId].revenue += order.itemsPrice;
      
      if (order.restaurant && order.restaurant.commissionRate) {
        performance[restId].profitGenerated += (order.itemsPrice * order.restaurant.commissionRate) / 100;
      }
    });

    res.json(Object.values(performance));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardSummary, getRestaurantPerformance };
