const CategoryService = require("../services/CategoryService");

const handleGetAllCategories = async (req, res) => {
  const data = await CategoryService.getAllCategories();
  return res.status(200).json(data);
};

const handleGetCategoryById = async (req, res) => {
  const { id } = req.params;
  const data = await CategoryService.getCategoryById(id);
  return res.status(200).json(data);
};

const handleCreateCategory = async (req, res) => {
  const data = await CategoryService.createCategory(req.body);
  return res.status(200).json(data);
};

const handleUpdateCategory = async (req, res) => {
  const { id } = req.params;
  const data = await CategoryService.updateCategory(id, req.body);
  return res.status(200).json(data);
};

const handleDeleteCategory = async (req, res) => {
  const { id } = req.params;
  const data = await CategoryService.deleteCategory(id);
  return res.status(200).json(data);
};

module.exports = {
  handleGetAllCategories,
  handleGetCategoryById,
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
