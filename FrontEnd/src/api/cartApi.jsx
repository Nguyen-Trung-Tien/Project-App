import axiosClient from "../utils/axiosClient";

export const getAllCarts = async (token) => {
  try {
    const res = await axiosClient.get("/cart/get-all-cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting all carts:", error);
    throw error;
  }
};

export const getCartById = async (id, token) => {
  try {
    const res = await axiosClient.get(`/cart/get-cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting cart by id:", error);
    throw error;
  }
};

export const createCart = async (userId, token) => {
  try {
    const res = await axiosClient.post(
      "/cart/create-cart",
      { userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

export const updateCart = async (id, data, token) => {
  try {
    const res = await axiosClient.put(`/cart/update-cart/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const deleteCart = async (id, token) => {
  try {
    const res = await axiosClient.delete(`/cart/delete-cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw error;
  }
};

export const getAllCartItems = async (token) => {
  try {
    const res = await axiosClient.get("/cartItem/get-all-cartItem", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting all cart items:", error);
    throw error;
  }
};

export const getCartItemById = async (id, token) => {
  try {
    const res = await axiosClient.get(`/cartItem/get-cartItem/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting cart item by id:", error);
    throw error;
  }
};

export const addCart = async ({ cartId, productId, quantity = 1 }, token) => {
  try {
    const res = await axiosClient.post(
      "/cartItem/create-cartItem",
      { cartId, productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding cart item:", error);
    throw error;
  }
};

export const updateCartItem = async (id, quantity, token) => {
  try {
    const res = await axiosClient.put(
      `/cartItem/update-cartItem/${id}`,
      { quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (id, token) => {
  try {
    const res = await axiosClient.delete(`/cartItem/delete-cartItem/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};
