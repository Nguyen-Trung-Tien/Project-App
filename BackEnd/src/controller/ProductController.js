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
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      data.image = result.secure_url;
    }
    const product = await ProductService.createProduct(data);
    return res.status(201).json(product);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
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
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
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
const getProductsByCategory = async (req, res) => {
  const query = req.query || {};
  const categoryId = query.categoryId;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  if (!categoryId) {
    return res
      .status(400)
      .json({ errCode: 1, errMessage: "categoryId is required" });
  }

  try {
    const result = await ProductService.getProductsByCategory(
      categoryId,
      page,
      limit
    );
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errCode: 1, errMessage: error.message });
  }
};

module.exports = {
  handleCreateProduct,
  handleGetAllProducts,
  handleGetProductById,
  handleUpdateProduct,
  handleDeleteProduct,
  getProductsByCategory,
};
