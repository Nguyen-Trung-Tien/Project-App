const db = require("../models");

const getAllCartItems = async (userId, { limit, offset }) => {
  try {
    const total = await db.CartItem.count({
      include: [
        {
          model: db.Cart,
          as: "cart",
          where: { userId },
        },
      ],
    });

    const items = await db.CartItem.findAll({
      include: [
        {
          model: db.Cart,
          as: "cart",
          where: { userId },
          attributes: ["id"],
          include: [
            { model: db.User, as: "user", attributes: ["id", "username"] },
          ],
        },
        {
          model: db.Product,
          as: "product",
          attributes: ["id", "name", "price", "image"],
        },
      ],
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    return { items, total };
  } catch (error) {
    throw new Error("Error fetching cart items");
  }
};

const getCartItemById = async (id, userId) => {
  try {
    const item = await db.CartItem.findOne({
      where: { id },
      include: [
        {
          model: db.Cart,
          as: "cart",
          where: { userId },
          include: [{ model: db.User, as: "user" }],
        },
        { model: db.Product, as: "product" },
      ],
    });
    if (!item) throw new Error("CartItem not found or not yours");
    return item;
  } catch (error) {
    throw new Error(error.message || "Error from server");
  }
};

const createCartItem = async ({ cartId, productId, quantity }, userId) => {
  if (!cartId) throw new Error("cartId is required");
  if (!productId) throw new Error("productId is required");
  if (!quantity || quantity < 1) throw new Error("quantity must be at least 1");

  const cart = await db.Cart.findOne({ where: { id: cartId, userId } });
  if (!cart) throw new Error("Cart not found or not yours");

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

const updateCartItem = async (id, data, userId) => {
  const cartItem = await db.CartItem.findOne({
    where: { id },
    include: [{ model: db.Cart, as: "cart", where: { userId } }],
  });
  if (!cartItem) throw new Error("CartItem not found or not yours");
  return await cartItem.update(data);
};

const deleteCartItem = async (id, userId) => {
  const cartItem = await db.CartItem.findOne({
    where: { id },
    include: [{ model: db.Cart, as: "cart", where: { userId } }],
  });
  if (!cartItem) throw new Error("CartItem not found or not yours");
  await cartItem.destroy();
  return true;
};

module.exports = {
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
