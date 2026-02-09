import axiosClient from "../utils/axiosClient";

export const getVariantsByProduct = async (productId, token) => {
  try {
    const res = await axiosClient.get(`/variant/product/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Get variants error:", err);
    throw err;
  }
};

export const createVariant = async (data, token) => {
  try {
    const res = await axiosClient.post(`/variant/create`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Create variant error:", err);
    throw err;
  }
};

export const updateVariant = async (id, data, token) => {
  try {
    const res = await axiosClient.put(`/variant/update/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Update variant error:", err);
    throw err;
  }
};

export const deleteVariant = async (id, token) => {
  try {
    const res = await axiosClient.delete(`/variant/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Delete variant error:", err);
    throw err;
  }
};
