const express = require("express");
const router = express.Router();
const ProductController = require("../controller/ProductController");
const upload = require("./multer");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

router.post(
  "/create-new-product",
  upload.single("image"),
  authenticateToken,
  authorizeRole(["admin"]),
  ProductController.handleCreateProduct
);
router.get("/get-all-product", ProductController.handleGetAllProducts);
router.get("/get-product/:id", ProductController.handleGetProductById);
router.get("/product-by-category", ProductController.getProductsByCategory);
router.get("/search", ProductController.handleSearchProducts);

router.put(
  "/update-product/:id",
  upload.single("image"),
  authenticateToken,
  authorizeRole(["admin"]),
  ProductController.handleUpdateProduct
);
router.delete(
  "/delete-product/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  ProductController.handleDeleteProduct
);

module.exports = router;
