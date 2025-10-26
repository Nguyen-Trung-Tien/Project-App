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
        {
          model: db.User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
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

    const order = await db.Order.findByPk(orderId);
    if (!order) {
      return { errCode: 3, errMessage: "Order not found" };
    }

    const autoPaidMethods = ["momo", "paypal", "vnpay", "bank"];
    const isAutoPaid = autoPaidMethods.includes(method);

    const payment = await db.Payment.create({
      orderId,
      userId,
      amount,
      method,
      note,
      transactionId,
      status: isAutoPaid ? "completed" : "pending",
    });
    if (isAutoPaid) {
      await order.update({ paymentStatus: "paid" });
    }
    return {
      errCode: 0,
      errMessage: "Payment created successfully",
      data: payment,
    };
  } catch (e) {
    console.error("Error createPayment:", e);
    return { errCode: 1, errMessage: "Internal server error" };
  }
};

const updatePayment = async (orderId, data) => {
  try {
    const order = await db.Order.findByPk(orderId);
    if (!order) return { errCode: 2, errMessage: "Order not found" };

    let payment = await db.Payment.findOne({ where: { orderId } });

    const statusMap = {
      paid: "completed",
      refunded: "refunded",
      unpaid: "pending",
    };
    const paymentStatus = statusMap[data.paymentStatus] || "pending";

    if (paymentStatus === "refunded") {
      const method = order.paymentMethod?.toLowerCase();
      const isOnlineMethod = ["momo", "paypal", "vnpay", "bank"].includes(
        method
      );

      if (isOnlineMethod) {
        const refundResult = await simulateRefund(order, method);
        if (!refundResult.success) {
          return {
            errCode: 3,
            errMessage: `Refund failed: ${refundResult.message}`,
          };
        }
      }
    }

    if (!payment) {
      payment = await db.Payment.create({
        orderId,
        userId: data.userId || order.userId,
        amount: data.amount || order.totalPrice,
        method: data.method || order.paymentMethod || "cod",
        status: paymentStatus,
        note: data.note || "",
      });
    } else {
      await payment.update({
        amount: data.amount || payment.amount,
        method: data.method || payment.method,
        status: paymentStatus,
        note: data.note || payment.note,
      });
    }

    // Cập nhật trạng thái thanh toán của Order
    const orderStatusMap = {
      completed: "paid",
      refunded: "refunded",
      pending: "unpaid",
    };
    await order.update({
      paymentStatus: orderStatusMap[paymentStatus] || "unpaid",
    });

    const updatedOrder = await db.Order.findByPk(orderId, {
      include: [{ model: db.Payment, as: "payment" }],
    });

    return {
      errCode: 0,
      errMessage: "Payment updated successfully",
      data: updatedOrder.toJSON(),
    };
  } catch (e) {
    console.error("Error updatePayment:", e);
    return { errCode: 1, errMessage: e.message || "Lỗi cập nhật thanh toán" };
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
