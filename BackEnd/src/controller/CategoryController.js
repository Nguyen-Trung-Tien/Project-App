const CategoryService = require("../services/CategoryService");

const handleGetAllCategories = async (req, res) => {
  try {
    const data = await CategoryService.getAllCategories();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
};

const handleGetCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CategoryService.getCategoryById(id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
};

const handleCreateCategory = async (req, res) => {
  try {
    const data = await CategoryService.createCategory(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
};

const handleUpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CategoryService.updateCategory(id, req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
};

const handleDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CategoryService.deleteCategory(id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  handleGetAllCategories,
  handleGetCategoryById,
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
