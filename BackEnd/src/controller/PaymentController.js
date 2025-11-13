require("dotenv").config();
const PaymentService = require("../services/PaymentService");

const handleGetAllPayments = async (req, res) => {
  try {
    const result = await PaymentService.getAllPayments();
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleGetPaymentById = async (req, res) => {
  try {
    const result = await PaymentService.getPaymentById(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleCreatePayment = async (req, res) => {
  try {
    const result = await PaymentService.createPayment(req.body);
    return res.status(201).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleUpdatePayment = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await PaymentService.updatePayment(orderId, req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleDeletePayment = async (req, res) => {
  try {
    const result = await PaymentService.deletePayment(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleCompletePayment = async (req, res) => {
  try {
    const result = await PaymentService.completePayment(
      req.params.id,
      req.body.transactionId
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleRefundPayment = async (req, res) => {
  try {
    const result = await PaymentService.refundPayment(
      req.params.id,
      req.body.note
    );
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
  handleGetAllPayments,
  handleGetPaymentById,
  handleCreatePayment,
  handleUpdatePayment,
  handleDeletePayment,
  handleCompletePayment,
  handleRefundPayment,
};
