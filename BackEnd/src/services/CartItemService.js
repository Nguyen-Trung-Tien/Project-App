const db = require("../models");

const getAllCartItems = async () => {
  try {
    return await db.CartItem.findAll({
      include: [
        {
          model: db.Cart,
          as: "cart",
          include: [{ model: db.User, as: "user" }],
        },
        { model: db.Product, as: "product" },
      ],
    });
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const getCartItemById = async (id) => {
  try {
    return await db.CartItem.findByPk(id, {
      include: [
        {
          model: db.Cart,
          as: "cart",
          include: [{ model: db.User, as: "user" }],
        },
        { model: db.Product, as: "product" },
      ],
    });
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const createCartItem = async ({ cartId, productId, quantity }) => {
  try {
    return await db.CartItem.create({ cartId, productId, quantity });
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const updateCartItem = async (id, data) => {
  try {
    const cartItem = await db.CartItem.findByPk(id);
    if (!cartItem) throw new Error("CartItem not found");
    return await cartItem.update(data);
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const deleteCartItem = async (id) => {
  try {
    const cartItem = await db.CartItem.findByPk(id);
    if (!cartItem) throw new Error("CartItem not found");
    return await cartItem.destroy();
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

module.exports = {
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
