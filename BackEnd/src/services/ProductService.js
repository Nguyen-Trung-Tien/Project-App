const db = require("../models");
const fs = require("fs");

const createProduct = async (data) => {
  try {
    const newData = { ...data };
    if (data.image && data.image.path) {
      const fs = require("fs");
      newData.image = fs.readFileSync(data.image.path);
    }
    const product = await db.Product.create(newData);
    return { errCode: 0, product };
  } catch (e) {
    console.error("Error creating product:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

const getAllProducts = async (categoryId, page, limit) => {
  const offset = (page - 1) * limit;
  const whereCondition = categoryId ? { categoryId } : {};

  const { count, rows } = await db.Product.findAndCountAll({
    where: whereCondition,
    include: [{ model: db.Category, as: "category" }],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    errCode: 0,
    products: rows.map((p) => ({ ...p.toJSON(), image: p.image || null })),
    totalItems: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  };
};

const getProductById = async (id) => {
  try {
    const product = await db.Product.findByPk(id, {
      include: [{ model: db.Category, as: "category" }],
    });

    if (!product) return { errCode: 1, errMessage: "Product not found" };

    return {
      errCode: 0,
      product: {
        ...product.toJSON(),
        image: product.image || null,
        sold: product.sold || 0,
      },
    };
  } catch (e) {
    console.error("Error fetching product:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

const updateProduct = async (id, data) => {
  try {
    const product = await db.Product.findByPk(id);
    if (!product) return { errCode: 1, errMessage: "Product not found" };
    const updatedData = { ...data };
    if (data.image && data.image.path) {
      updatedData.image = fs.readFileSync(data.image.path);
    }

    const updatedProduct = await product.update(updatedData);
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

const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const whereCondition = categoryId ? { categoryId } : {};

  const { count, rows } = await db.Product.findAndCountAll({
    where: whereCondition,
    include: [{ model: db.Category, as: "category" }],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    errCode: 0,
    products: rows,
    totalItems: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  };
};

const searchProducts = async (query, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const whereCondition = query
    ? { name: { [db.Sequelize.Op.like]: `%${query}%` } }
    : {};

  const { count, rows } = await db.Product.findAndCountAll({
    where: whereCondition,
    include: [{ model: db.Category, as: "category" }],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    errCode: 0,
    products: rows.map((p) => ({ ...p.toJSON(), image: p.image || null })),
    totalItems: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  };
};
const updateProductSold = async (productId, quantity) => {
  try {
    const product = await db.Product.findByPk(productId);
    if (!product) return { errCode: 1, errMessage: "Product not found" };

    await product.increment("sold", { by: quantity });
    await product.decrement("stock", { by: quantity });

    return { errCode: 0, errMessage: "Updated product sold count" };
  } catch (e) {
    console.error("Error updating sold count:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  updateProductSold,
};
