const db = require("../models");

const getAllOrders = async () => {
  try {
    const orders = await db.Order.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["id", "username", "email"] },
        { model: db.OrderItem, as: "orderItems" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: orders,
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

    // Tạo đơn hàng kèm orderItems
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

    // Giảm stock cho từng sản phẩm
    for (const item of orderItems) {
      const product = await db.Product.findByPk(item.productId, {
        transaction: t,
      });
      if (product) {
        if (product.stock < item.quantity) {
          await t.rollback();
          return {
            errCode: 2,
            errMessage: `Sản phẩm ${product.name} không đủ số lượng`,
          };
        }
        product.stock -= item.quantity;
        await product.save({ transaction: t });
      }
    }

    // Xóa các item khỏi giỏ hàng nếu có
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
  try {
    const order = await db.Order.findByPk(id);
    if (!order) return { errCode: 1, errMessage: "Order not found" };

    const history = Array.isArray(order.confirmationHistory)
      ? order.confirmationHistory
      : [];

    history.push({ status, date: new Date().toISOString() });

    order.status = status;
    order.confirmationHistory = history;
    await order.save();

    return {
      errCode: 0,
      errMessage: "Order updated successfully",
      data: order,
    };
  } catch (e) {
    console.error("Error updating order status:", e);
    throw e;
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

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
