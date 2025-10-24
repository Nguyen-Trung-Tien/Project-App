const adminService = require("../services/AdminService");

const getDashboard = async (req, res) => {
  try {
    const data = await adminService.getDashboardData();
    res.status(200).json({
      errCode: 0,
      message: "OK",
      data,
    });
  } catch (error) {
    console.error("Lỗi ở controller:", error);
    res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getDashboard,
};
