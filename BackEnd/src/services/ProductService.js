const db = require("../models");

const createProduct = async (data) => {
  try {
    const product = await db.Product.create(data);
    return { errCode: 0, product };
  } catch (e) {
    console.error("Error creating product:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

const getAllProducts = async (categoryId) => {
  try {
    const query = { include: [{ model: db.Category, as: "category" }] };
    if (categoryId) query.where = { categoryId };
    const products = await db.Product.findAll(query);
    return { errCode: 0, products };
  } catch (e) {
    console.error("Error fetching products:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

const getProductById = async (id) => {
  try {
    const product = await db.Product.findByPk(id, {
      include: [{ model: db.Category, as: "category" }],
    });
    if (!product) return { errCode: 1, errMessage: "Product not found" };
    return { errCode: 0, product };
  } catch (e) {
    console.error("Error fetching product:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

const updateProduct = async (id, data) => {
  try {
    const product = await db.Product.findByPk(id);
    if (!product) return { errCode: 1, errMessage: "Product not found" };
    const updatedProduct = await product.update(data);
    return { errCode: 0, product: updatedProduct };
  } catch (e) {
    console.error("Error updating product:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await db.Product.findByPk(id);
    if (!product) return { errCode: 1, errMessage: "Product not found" };
    await product.destroy();
    return { errCode: 0, errMessage: "Product deleted successfully" };
  } catch (e) {
    console.error("Error deleting product:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

const getProductsByCategory = async (categoryId) => {
  const query = { include: [{ model: db.Category, as: "category" }] };
  if (categoryId) query.where = { categoryId };
  const products = await db.Product.findAll(query);
  return { errCode: 0, products };
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
