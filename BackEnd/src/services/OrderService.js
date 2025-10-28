const db = require("../models");

const getAllOrders = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await db.Order.findAndCountAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "email", "phone"],
        },
        { model: db.OrderItem, as: "orderItems" },
        { model: db.Payment, as: "payment" },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      errCode: 0,
      errMessage: "OK",
      data: orders,
      pagination: {
        total: count,
        page,
        limit,
        totalPages,
      },
    };
  } catch (e) {
    console.error("Error in getAllOrders:", e);
    throw e;
  }
};

const getOrderById = async (id) => {
  try {
    const order = await db.Order.findByPk(id, {
      include: [
        { model: db.User, as: "user", attributes: ["id", "username", "email"] },
        { model: db.OrderItem, as: "orderItems" },
        { model: db.Payment, as: "payment" },
      ],
    });

    if (!order) {
      return { errCode: 1, errMessage: "Order not found" };
    }

    return { errCode: 0, errMessage: "OK", data: order };
  } catch (e) {
    console.error("Error in getOrderById:", e);
    throw e;
  }
};

const createOrder = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      userId,
      totalPrice,
      shippingAddress,
      paymentMethod,
      note,
      orderItems = [],
    } = data;

    if (!userId || !shippingAddress || !orderItems.length) {
      return {
        errCode: 1,
        errMessage:
          "Missing required fields (userId, shippingAddress, orderItems)",
      };
    }

    const formattedItems = orderItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));

    const order = await db.Order.create(
      {
        userId,
        totalPrice,
        shippingAddress,
        paymentMethod,
        note: note || "",
        orderItems: formattedItems,
      },
      { include: [{ model: db.OrderItem, as: "orderItems" }], transaction: t }
    );

    for (const item of orderItems) {
      const product = await db.Product.findByPk(item.productId, {
        transaction: t,
      });

      if (!product) continue;

      if (product.stock < item.quantity) {
        await t.rollback();
        return {
          errCode: 2,
          errMessage: `Sản phẩm ${product.name} không đủ số lượng`,
        };
      }

      product.stock -= item.quantity;
      product.sold = (product.sold || 0) + item.quantity;
      await product.save({ transaction: t });
    }
    const cartItemIds = orderItems
      .map((item) => item.cartItemId)
      .filter(Boolean);
    if (cartItemIds.length > 0) {
      await db.CartItem.destroy({ where: { id: cartItemIds }, transaction: t });
    }

    await t.commit();

    return {
      errCode: 0,
      errMessage: "Order created successfully",
      data: order,
    };
  } catch (e) {
    await t.rollback();
    console.error("Error creating order:", e);
    return { errCode: -1, errMessage: e.message || "Error creating order" };
  }
};

const updateOrderStatus = async (id, status) => {
  const t = await db.sequelize.transaction();
  try {
    const order = await db.Order.findByPk(id, {
      include: [{ model: db.OrderItem, as: "orderItems" }],
      transaction: t,
    });

    if (!order) return { errCode: 1, errMessage: "Order not found" };

    const prevStatus = order.status;

    const history = Array.isArray(order.confirmationHistory)
      ? order.confirmationHistory
      : [];
    history.push({ status, date: new Date().toISOString() });

    order.status = status;
    order.confirmationHistory = history;

    if (!order.orderItems?.length) {
      console.warn("No orderItems found for order:", id);
    }

    if (
      ["delivered", "completed"].includes(status) &&
      !["delivered", "completed"].includes(prevStatus)
    ) {
      for (const item of order.orderItems) {
        const product = await db.Product.findByPk(item.productId, {
          transaction: t,
        });
        if (product) {
          product.sold = (product.sold || 0) + item.quantity;
          product.stock = Math.max(0, (product.stock || 0) - item.quantity);
          await product.save({ transaction: t });
        }
      }
    }

    if (
      status === "cancelled" &&
      ["delivered", "completed"].includes(prevStatus)
    ) {
      for (const item of order.orderItems) {
        const product = await db.Product.findByPk(item.productId, {
          transaction: t,
        });
        if (product) {
          product.sold = Math.max(0, (product.sold || 0) - item.quantity);
          product.stock += item.quantity;
          await product.save({ transaction: t });
        }
      }
    }

    if (
      status === "cancelled" &&
      !["delivered", "completed"].includes(prevStatus)
    ) {
      for (const item of order.orderItems) {
        const product = await db.Product.findByPk(item.productId, {
          transaction: t,
        });
        if (product) {
          product.stock += item.quantity;
          await product.save({ transaction: t });
        }
      }
    }

    await order.save({ transaction: t });
    await t.commit();

    return {
      errCode: 0,
      errMessage: "Order status updated successfully",
      data: order,
    };
  } catch (e) {
    await t.rollback();
    console.error("Error updating order status:", e);
    return {
      errCode: -1,
      errMessage: e.message || "Error updating order status",
    };
  }
};

const deleteOrder = async (id) => {
  try {
    const order = await db.Order.findByPk(id);
    if (!order) return { errCode: 1, errMessage: "Order not found" };

    await order.destroy();
    return { errCode: 0, errMessage: "Order deleted successfully" };
  } catch (e) {
    console.error("Error deleting order:", e);
    throw e;
  }
};

const updatePaymentStatus = async (id, paymentStatus) => {
  try {
    const order = await db.Order.findByPk(id);
    if (!order) return { errCode: 1, errMessage: "Order not found" };

    const validStatuses = ["unpaid", "paid", "refunded"];
    if (!validStatuses.includes(paymentStatus)) {
      return { errCode: 2, errMessage: "Invalid payment status" };
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    return {
      errCode: 0,
      errMessage: "Payment status updated successfully",
      data: order,
    };
  } catch (e) {
    console.error("Error updating payment status:", e);
    return {
      errCode: -1,
      errMessage: e.message || "Error updating payment status",
    };
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  updatePaymentStatus,
};
