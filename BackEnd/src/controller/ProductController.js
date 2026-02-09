const ProductService = require("../services/ProductService");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};
const handleCreateProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.brandId) data.brandId = parseInt(data.brandId);
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      data.image = result.secure_url;
    }
    const product = await ProductService.createProduct(data);
    return res.status(201).json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleGetAllProducts = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await ProductService.getAllProducts(categoryId, page, limit);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in handleGetAllProducts:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleGetProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductService.getProductById(id);
    const status = result.errCode === 0 ? 200 : 404;
    return res.status(status).json(result);
  } catch (e) {
    console.error("Error in handleGetProductById:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      data.image = result.secure_url;
    }
    const product = await ProductService.updateProduct(id, data);
    return res.status(200).json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductService.deleteProduct(id);
    const status = result.errCode === 0 ? 200 : 404;
    return res.status(status).json(result);
  } catch (e) {
    console.error("Error in handleDeleteProduct:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleSearchProducts = async (req, res) => {
  try {
    const query = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await ProductService.searchProducts(query, page, limit);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in handleSearchProducts:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleSearchSuggestions = async (req, res) => {
  try {
    const query = req.query.q || "";
    const limit = parseInt(req.query.limit) || 8;

    const result = await ProductService.searchSuggestions(query, limit);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in handleSearchSuggestions:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleGetDiscountedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await ProductService.getDiscountedProducts(page, limit);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in handleGetDiscountedProducts:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};
const handleFilterProducts = async (req, res) => {
  try {
    const {
      brandId,
      categoryId,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filters = {
      brandId,
      categoryId,
      minPrice,
      maxPrice,
      search,
      sort,
      page: Number(page),
      limit: Number(limit),
    };

    const result = await ProductService.filterProducts(filters);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error filtering products:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleRecommendProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;

    const result = await ProductService.recommendProducts(id, page, limit);

    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in handleRecommendProducts:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleRecommendFortuneProducts = async (req, res) => {
  try {
    const { birthYear, brandId, minPrice, maxPrice, categoryId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const result = await ProductService.recommendFortuneProducts({
      birthYear,
      brandId,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      categoryId,
      page,
      limit,
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in handleRecommendFortuneProducts:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

module.exports = {
  handleCreateProduct,
  handleGetAllProducts,
  handleGetProductById,
  handleUpdateProduct,
  handleDeleteProduct,
  handleSearchProducts,
  handleSearchSuggestions,
  handleGetDiscountedProducts,
  handleFilterProducts,
  handleRecommendProducts,
  handleRecommendFortuneProducts,
};
