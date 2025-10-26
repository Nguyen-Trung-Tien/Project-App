const db = require("../models");
const { Op } = require("sequelize");

const getDashboardData = async () => {
  try {
    const totalProducts = await db.Product.count();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayOrders = await db.Order.count({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
        },
      },
    });
    const totalRevenue = await db.Order.sum("totalPrice");
    const totalUsers = await db.User.count();
    const change = {
      products: 8,
      orders: 5,
      revenue: -3,
      users: 2,
    };

    return {
      totalProducts,
      todayOrders,
      totalRevenue,
      totalUsers,
      change,
    };
  } catch (error) {
    console.error("Error from service!", error);
    throw error;
  }
};

module.exports = {
  getDashboardData,
};
