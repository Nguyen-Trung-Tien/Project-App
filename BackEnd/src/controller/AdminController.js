const AdminService = require("../services/AdminService");

const getDashboard = async (req, res) => {
  try {
    const data = await AdminService.getDashboardData();
    res.status(200).json({
      errCode: 0,
      message: "OK",
      data,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errCode: 1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  getDashboard,
};
