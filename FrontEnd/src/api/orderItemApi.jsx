import axiosClient from "../utils/axiosClient";

export const getAllOrderItems = async (token) => {
  try {
    const res = await axiosClient.get("/order-item/get-order-item", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting all order items:", error);
    throw error;
  }
};

export const getOrderItemById = async (id, token) => {
  try {
    const res = await axiosClient.get(`/order-item/order-item/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(`Error getting order item with id ${id}:`, error);
    throw error;
  }
};

export const createOrderItem = async (data, token) => {
  try {
    const res = await axiosClient.post(
      "/order-item/create-new-order-item",
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating order item:", error);
    throw error;
  }
};

export const updateOrderItem = async (id, data, token) => {
  try {
    const res = await axiosClient.put(
      `/order-item/update-order-item/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(`Error updating order item ${id}:`, error);
    throw error;
  }
};

export const deleteOrderItem = async (id, token) => {
  try {
    const res = await axiosClient.delete(
      `/order-item/delete-order-item/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(`Error deleting order item ${id}:`, error);
    throw error;
  }
};

export const requestReturn = async (id, reason, token) => {
  try {
    const res = await axiosClient.put(
      `/order-item/request/${id}/request-return`,
      { reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(`Error requesting return for order item ${id}:`, error);
    throw error;
  }
};

export const processReturn = async (id, status, token) => {
  try {
    const res = await axiosClient.put(
      `/order-item/process/${id}/process-return`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(`Error processing return for order item ${id}:`, error);
    throw error;
  }
};
