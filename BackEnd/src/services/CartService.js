const db = require("../models");

const getAllCarts = async (userId) => {
  try {
    return await db.Cart.findAll({
      where: { userId },
      include: [
        { model: db.User, as: "user", attributes: ["id", "username", "email"] },
        { model: db.CartItem, as: "cartItems" },
      ],
    });
  } catch (error) {
    throw new Error("Error from server");
  }
};

const getCartById = async (id, userId) => {
  try {
    const cart = await db.Cart.findOne({
      where: { id, userId },
      include: [
        { model: db.User, as: "user", attributes: ["id", "username", "email"] },
        { model: db.CartItem, as: "cartItems" },
      ],
    });
    if (!cart) throw new Error("Cart not found");
    return cart;
  } catch (error) {
    throw new Error(error.message || "Error from server");
  }
};

const createCart = async (userId) => {
  try {
    return await db.Cart.create({ userId });
  } catch (error) {
    throw new Error("Error from server");
  }
};

const updateCart = async (id, data, userId) => {
  try {
    const cart = await db.Cart.findOne({ where: { id, userId } });
    if (!cart) throw new Error("Cart not found or not yours");
    return await cart.update(data);
  } catch (error) {
    throw new Error(error.message || "Error from server");
  }
};

const deleteCart = async (id, userId) => {
  try {
    const cart = await db.Cart.findOne({ where: { id, userId } });
    if (!cart) throw new Error("Cart not found or not yours");
    await cart.destroy();
    return true;
  } catch (error) {
    throw new Error(error.message || "Error from server");
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
