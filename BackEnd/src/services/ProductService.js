const db = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");
const { getLuckyColorsByYear } = require("../utils/fortuneUtils");

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

const getAllProducts = async (categoryId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const whereCondition = categoryId ? { categoryId } : {};

  const { count, rows } = await db.Product.findAndCountAll({
    where: whereCondition,
    include: [
      { model: db.Category, as: "category" },
      { model: db.Brand, as: "brand" },
      { model: db.Review, as: "reviews" },
    ],
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
      include: [
        { model: db.Category, as: "category" },
        { model: db.Brand, as: "brand" },
      ],
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

const searchProducts = async (query, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const { Op } = db.Sequelize;

  const whereCondition = query ? { name: { [Op.like]: `%${query}%` } } : {};

  // 1. Tìm sản phẩm phân trang (dùng cho trang kết quả tìm kiếm)
  const { count, rows } = await db.Product.findAndCountAll({
    where: whereCondition,
    include: [
      { model: db.Category, as: "category" },
      { model: db.Brand, as: "brand" },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  // 2. GỢI Ý PRODUCT (lightweight → dành cho Smart Search)
  const productSuggestions = await db.Product.findAll({
    where: {
      name: { [Op.like]: `%${query}%` },
    },
    attributes: ["id", "name", "price", "image"],
    limit: 8,
    order: [["sold", "DESC"]],
  });

  // 3. GỢI Ý KEYWORD (simple + hiệu quả)
  const keywordSuggestions = [`${query}`];

  // 4. GỢI Ý BRAND
  const brandSuggestions = await db.Brand.findAll({
    where: { name: { [Op.like]: `%${query}%` } },
    attributes: ["id", "name"],
    limit: 5,
  });

  // 5. GỢI Ý CATEGORY
  const categorySuggestions = await db.Category.findAll({
    where: { name: { [Op.like]: `%${query}%` } },
    attributes: ["id", "name"],
    limit: 5,
  });

  return {
    errCode: 0,
    products: rows.map((p) => ({ ...p.toJSON(), image: p.image || null })),
    totalItems: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),

    // 🎯 Dành cho Smart Search
    suggestions: {
      products: productSuggestions,
      keywords: keywordSuggestions,
      brands: brandSuggestions,
      categories: categorySuggestions,
    },
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

const getDiscountedProducts = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await db.Product.findAndCountAll({
    where: {
      discount: { [db.Sequelize.Op.gt]: 0 },
      isActive: true,
    },
    include: [
      { model: db.Category, as: "category" },
      { model: db.Brand, as: "brand" },
    ],
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

const filterProducts = async ({
  brandId,
  categoryId,
  minPrice = 0,
  maxPrice = 99999999,
  search = "",
  sort,
  page = 1,
  limit = 12,
}) => {
  try {
    const conditions = {
      price: { [Op.between]: [minPrice, maxPrice] },
      isActive: true,
    };

    if (brandId) conditions.brandId = brandId;
    if (categoryId) conditions.categoryId = categoryId;
    if (search) conditions.name = { [Op.iLike]: `%${search}%` };

    // SORT
    let order = [];
    if (sort === "price_asc") order = [["price", "ASC"]];
    if (sort === "price_desc") order = [["price", "DESC"]];
    if (sort === "newest") order = [["createdAt", "DESC"]];

    const offset = (page - 1) * limit;

    const products = await db.Product.findAndCountAll({
      where: conditions,
      include: [
        { model: db.Brand, as: "brand" },
        { model: db.Category, as: "category" },
      ],
      order,
      limit,
      offset,
    });

    return {
      errCode: 0,
      data: products.rows,
      total: products.count,
      page,
      totalPages: Math.ceil(products.count / limit),
    };
  } catch (error) {
    console.error(error);
    return { errCode: 1, errMessage: error.message };
  }
};

const recommendProducts = async (productId, page = 1, limit = 6) => {
  try {
    const product = await db.Product.findByPk(productId);
    if (!product) {
      return { errCode: 1, errMessage: "Product not found" };
    }

    const price = Number(product.price);
    const priceLow = price * 0.8;
    const priceHigh = price * 1.2;

    const where = {
      id: { [Op.ne]: productId },
      isActive: true,
      [Op.or]: [
        { categoryId: product.categoryId },
        { brandId: product.brandId },
        { price: { [Op.between]: [priceLow, priceHigh] } },
      ],
    };

    const total = await db.Product.count({ where });

    const offset = (page - 1) * limit;

    const rows = await db.Product.findAll({
      where,
      include: [
        { model: db.Brand, as: "brand" },
        { model: db.Category, as: "category" },
      ],
      order: [
        ["sold", "DESC"],
        ["discount", "DESC"],
        ["createdAt", "DESC"],
      ],
      offset,
      limit,
    });

    return {
      errCode: 0,
      data: rows.map((p) => p.toJSON()),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (e) {
    console.error("Error recommending products:", e);
    return { errCode: 1, errMessage: e.message };
  }
};

const recommendFortuneProducts = async ({
  birthYear,
  brandId,
  minPrice,
  maxPrice,
  categoryId,
  page = 1,
  limit = 6,
}) => {
  try {
    if (!birthYear) return { errCode: 1, errMessage: "birthYear is required" };

    const luckyColors = getLuckyColorsByYear(Number(birthYear));

    // Build điều kiện where
    const where = {
      color: { [Op.in]: luckyColors },
      isActive: true,
    };

    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

    const total = await db.Product.count({ where });
    const offset = (page - 1) * limit;

    const rows = await db.Product.findAll({
      where,
      include: [
        { model: db.Brand, as: "brand" },
        { model: db.Category, as: "category" },
      ],
      order: [
        ["sold", "DESC"], // ưu tiên bán chạy
        ["discount", "DESC"], // ưu tiên giảm giá
        ["createdAt", "DESC"], // sản phẩm mới
      ],
      offset,
      limit,
    });

    return {
      errCode: 0,
      data: rows.map((p) => p.toJSON()),
      luckyColors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (e) {
    console.error("Error in recommendFortuneProducts:", e);
    return { errCode: -1, errMessage: e.message };
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  updateProductSold,
  getDiscountedProducts,
  filterProducts,
  recommendProducts,
  recommendFortuneProducts,
};
