const OrderService = require("../services/OrderService");

const handleGetAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await OrderService.getAllOrders(page, limit);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleGetOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await OrderService.getOrderById(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleCreateOrder = async (req, res) => {
  try {
    const result = await OrderService.createOrder(req.body);
    return res.status(201).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await OrderService.updateOrderStatus(id, status);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleDeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await OrderService.deleteOrder(id);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleUpdatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    const result = await OrderService.updatePaymentStatus(id, paymentStatus);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

module.exports = {
  handleGetAllOrders,
  handleGetOrderById,
  handleCreateOrder,
  handleUpdateOrderStatus,
  handleDeleteOrder,
  handleUpdatePaymentStatus,
};
