const cartService = require("../services/CartService");

const getAllCarts = async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.status(200).json({ errCode: 0, data: carts });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.id);
    if (!cart)
      return res.status(404).json({ errCode: 1, errMessage: "Cart not found" });
    res.status(200).json({ errCode: 0, data: cart });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

const createCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const newCart = await cartService.createCart(userId);
    res.status(201).json({ errCode: 0, data: newCart });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const updatedCart = await cartService.updateCart(req.params.id, req.body);
    res.status(200).json({ errCode: 0, data: updatedCart });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    await cartService.deleteCart(req.params.id);
    res.status(200).json({ errCode: 0, message: "Cart deleted" });
  } catch (err) {
    res.status(500).json({ errCode: 1, errMessage: err.message });
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
