const express = require("express");
const router = express.Router();
const CategoryController = require("../controller/CategoryController");

router.get("/get-all-category", CategoryController.handleGetAllCategories);
router.get("/:id", CategoryController.handleGetCategoryById);
router.post("/create", CategoryController.handleCreateCategory);
router.put("/update/:id", CategoryController.handleUpdateCategory);
router.delete("/delete/:id", CategoryController.handleDeleteCategory);

module.exports = router;
