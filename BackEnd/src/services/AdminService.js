const db = require("../models");
const { Op } = require("sequelize");

const getDashboardData = async () => {
  try {
    // 🧮 Tổng sản phẩm
    const totalProducts = await db.Product.count();

    // 📅 Đơn hàng hôm nay
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayOrders = await db.Order.count({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
        },
      },
    });

    // 💰 Tổng doanh thu
    const totalRevenue = await db.Order.sum("totalPrice");

    // 👥 Tổng người dùng
    const totalUsers = await db.User.count();

    // 📈 Tạm thời hardcode phần thay đổi %
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
    console.error("❌ Lỗi ở service:", error);
    throw error;
  }
};

module.exports = {
  getDashboardData,
};
