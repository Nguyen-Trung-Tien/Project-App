const CartItemService = require("../services/CartItemService");

const getAllCartItems = async (req, res) => {
  try {
    const items = await CartItemService.getAllCartItems();
    res.status(200).json({ errCode: 0, data: items });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

const getCartItemById = async (req, res) => {
  try {
    const item = await CartItemService.getCartItemById(req.params.id);
    if (!item)
      return res.status(404).json({
        errCode: 1,
        errMessage: "CartItem not found",
      });
    res.status(200).json({ errCode: 0, data: item });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

const createCartItem = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;
    const newItem = await CartItemService.createCartItem({
      cartId,
      productId,
      quantity,
    });
    res.status(201).json({ errCode: 0, data: newItem });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const updatedItem = await CartItemService.updateCartItem(
      req.params.id,
      req.body
    );
    res.status(200).json({ errCode: 0, data: updatedItem });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    await CartItemService.deleteCartItem(req.params.id);
    res.status(200).json({ errCode: 0, message: "CartItem deleted" });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

module.exports = {
  getAllCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
};
