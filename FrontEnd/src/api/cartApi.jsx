import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllCarts = async () => {
  try {
    const res = await API.get("/cart/get-all-cart");
    return res.data;
  } catch (error) {
    console.error("Error getting all carts:", error);
    throw error;
  }
};

export const getCartById = async (id) => {
  try {
    const res = await API.get(`/cart/get-cart/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting cart by id:", error);
    throw error;
  }
};

export const createCart = async (userId) => {
  try {
    const res = await API.post("/cart/create-cart", { userId });
    return res.data;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

export const updateCart = async (id, data) => {
  try {
    const res = await API.put(`/cart/update-cart/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const deleteCart = async (id) => {
  try {
    const res = await API.delete(`/cart/delete-cart/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw error;
  }
};

export const getAllCartItems = async () => {
  try {
    const res = await API.get("/cartItem/get-all-cartItem");
    return res.data;
  } catch (error) {
    console.error("Error getting all cart items:", error);
    throw error;
  }
};

export const getCartItemById = async (id) => {
  try {
    const res = await API.get(`/cartItem/get-cartItem/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting cart item by id:", error);
    throw error;
  }
};

export const addCart = async ({ cartId, productId, quantity = 1 }) => {
  try {
    const res = await API.post("/cartItem/create-cartItem", {
      cartId,
      productId,
      quantity,
    });
    return res.data;
  } catch (error) {
    console.error("Error adding cart item:", error);
    throw error;
  }
};

export const updateCartItem = async (id, quantity) => {
  try {
    const res = await API.put(`/cartItem/update-cartItem/${id}`, { quantity });
    return res.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (id) => {
  try {
    const res = await API.delete(`/cartItem/delete-cartItem/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};
