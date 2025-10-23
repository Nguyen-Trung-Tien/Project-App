const db = require("../models");

const getAllCarts = async () => {
  try {
    return await db.Cart.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["id", "username", "email"] },
        { model: db.CartItem, as: "cartItems" },
      ],
    });
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const getCartById = async (id) => {
  try {
    return await db.Cart.findByPk(id, {
      include: [
        { model: db.User, as: "user", attributes: ["id", "username", "email"] },
        { model: db.CartItem, as: "cartItems" },
      ],
    });
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const createCart = async (userId) => {
  try {
    return await db.Cart.create({ userId });
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const updateCart = async (id, data) => {
  try {
    const cart = await db.Cart.findByPk(id);
    if (!cart) throw new Error("Cart not found");
    return await cart.update(data);
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const deleteCart = async (id) => {
  try {
    const cart = await db.Cart.findByPk(id);
    if (!cart) throw new Error("Cart not found");
    return await cart.destroy();
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
