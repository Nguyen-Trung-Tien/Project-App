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
    throw new Error("Error from server");
  }
};

const getCartItemById = async (id) => {
  try {
    const item = await db.CartItem.findByPk(id, {
      include: [
        {
          model: db.Cart,
          as: "cart",
          include: [{ model: db.User, as: "user" }],
        },
        { model: db.Product, as: "product" },
      ],
    });
    if (!item) throw new Error("CartItem not found");
    return item;
  } catch (error) {
    throw new Error(error.message || "Error from server");
  }
};

const createCartItem = async ({ cartId, productId, quantity }) => {
  if (!cartId) throw new Error("cartId is required");
  if (!productId) throw new Error("productId is required");
  if (!quantity || quantity < 1) throw new Error("quantity must be at least 1");
  const cart = await db.Cart.findByPk(cartId);
  if (!cart) throw new Error("Cart not found");
  const product = await db.Product.findByPk(productId);
  if (!product) throw new Error("Product not found");
  let cartItem = await db.CartItem.findOne({ where: { cartId, productId } });
  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    cartItem = await db.CartItem.create({ cartId, productId, quantity });
  }
  return await db.CartItem.findByPk(cartItem.id, {
    include: [
      { model: db.Cart, as: "cart", include: [{ model: db.User, as: "user" }] },
      { model: db.Product, as: "product" },
    ],
  });
};

const updateCartItem = async (id, data) => {
  try {
    const cartItem = await db.CartItem.findByPk(id);
    if (!cartItem) throw new Error("CartItem not found");
    return await cartItem.update(data);
  } catch (error) {
    throw new Error(error.message || "Error from server");
  }
};

const deleteCartItem = async (id) => {
  try {
    const cartItem = await db.CartItem.findByPk(id);
    if (!cartItem) throw new Error("CartItem not found");
    await cartItem.destroy();
    return true;
  } catch (error) {
    throw new Error(error.message || "Error from server");
  }
};

module.exports = {
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
