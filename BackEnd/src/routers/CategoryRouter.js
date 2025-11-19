const express = require("express");
const router = express.Router();
const CategoryController = require("../controller/CategoryController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

router.get("/get-all-category", CategoryController.handleGetAllCategories);
router.get("/:id", CategoryController.handleGetCategoryById);
router.post(
  "/create",
  authenticateToken,
  authorizeRole(["admin"]),
  CategoryController.handleCreateCategory
);
router.put(
  "/update/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  CategoryController.handleUpdateCategory
);
router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  CategoryController.handleDeleteCategory
);

module.exports = router;
