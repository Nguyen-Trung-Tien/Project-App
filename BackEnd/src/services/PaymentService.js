const db = require("../models");

const getAllPayments = async () => {
  try {
    const payments = await db.Payment.findAll({
      include: [
        {
          model: db.Order,
          as: "order",
          attributes: ["id", "status", "totalPrice"],
        },
        { model: db.User, as: "user", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return { errCode: 0, errMessage: "OK", data: payments };
  } catch (e) {
    console.error("Error getAllPayments:", e);
    throw e;
  }
};

const getPaymentById = async (id) => {
  try {
    const payment = await db.Payment.findByPk(id, {
      include: [
        {
          model: db.Order,
          as: "order",
          attributes: ["id", "status", "totalPrice"],
        },
        { model: db.User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });

    if (!payment) return { errCode: 1, errMessage: "Payment not found" };

    return { errCode: 0, errMessage: "OK", data: payment };
  } catch (e) {
    console.error("Error getPaymentById:", e);
    throw e;
  }
};

const createPayment = async (data) => {
  try {
    const { orderId, userId, amount, method, note, transactionId } = data;

    if (!orderId || !amount) {
      return { errCode: 2, errMessage: "Missing required fields" };
    }

    const payment = await db.Payment.create({
      orderId,
      userId,
      amount,
      method,
      note,
      transactionId,
      status: "pending",
    });

    return {
      errCode: 0,
      errMessage: "Payment created successfully",
      data: payment,
    };
  } catch (e) {
    console.error("Error createPayment:", e);
    throw e;
  }
};

const updatePayment = async (id, data) => {
  try {
    const payment = await db.Payment.findByPk(id);
    if (!payment) return { errCode: 1, errMessage: "Payment not found" };

    await payment.update(data);
    return {
      errCode: 0,
      errMessage: "Payment updated successfully",
      data: payment,
    };
  } catch (e) {
    console.error("Error updatePayment:", e);
    throw e;
  }
};

const deletePayment = async (id) => {
  try {
    const payment = await db.Payment.findByPk(id);
    if (!payment) return { errCode: 1, errMessage: "Payment not found" };

    await payment.destroy();
    return { errCode: 0, errMessage: "Payment deleted successfully" };
  } catch (e) {
    console.error("Error deletePayment:", e);
    throw e;
  }
};

const completePayment = async (id, transactionId) => {
  try {
    const payment = await db.Payment.findByPk(id);
    if (!payment) return { errCode: 1, errMessage: "Payment not found" };

    payment.status = "completed";
    payment.transactionId = transactionId || payment.transactionId;
    payment.paymentDate = new Date();
    await payment.save();

    const order = await db.Order.findByPk(payment.orderId);
    if (order) {
      order.paymentStatus = "paid";
      await order.save();
    }

    return { errCode: 0, errMessage: "Payment completed", data: payment };
  } catch (e) {
    console.error("Error completePayment:", e);
    throw e;
  }
};

const refundPayment = async (id, note) => {
  try {
    const payment = await db.Payment.findByPk(id);
    if (!payment) return { errCode: 1, errMessage: "Payment not found" };

    payment.status = "refunded";
    payment.note = note || payment.note;
    await payment.save();
    const order = await db.Order.findByPk(payment.orderId);
    if (order) {
      order.paymentStatus = "refunded";
      await order.save();
    }

    return { errCode: 0, errMessage: "Payment refunded", data: payment };
  } catch (e) {
    console.error("Error refundPayment:", e);
    throw e;
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  completePayment,
  refundPayment,
};
