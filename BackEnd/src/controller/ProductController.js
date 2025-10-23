const ProductService = require("../services/ProductService");

const handleCreateProduct = async (req, res) => {
  try {
    const result = await ProductService.createProduct(req.body);
    if (result.errCode !== 0) return res.status(400).json(result);
    return res.status(201).json(result);
  } catch (e) {
    console.error("Error in handleCreateProduct:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleGetAllProducts = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const result = await ProductService.getAllProducts(categoryId);
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
    const result = await ProductService.updateProduct(id, req.body);
    const status = result.errCode === 0 ? 200 : 404;
    return res.status(status).json(result);
  } catch (e) {
    console.error("Error in handleUpdateProduct:", e);
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
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.query;
  if (!categoryId)
    return res
      .status(400)
      .json({ errCode: 1, errMessage: "categoryId is required" });

  try {
    const result = await ProductService.getProductsByCategory(categoryId);
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
