const express = require("express");
const router = express.Router();
const ProductController = require("../controller/ProductController");
const upload = require("./multer");

router.post(
  "/create-new-product",
  upload.single("image"),
  ProductController.handleCreateProduct
);
router.get("/get-all-product", ProductController.handleGetAllProducts);
router.get("/get-product/:id", ProductController.handleGetProductById);
router.put(
  "/update-product/:id",
  upload.single("image"),
  ProductController.handleUpdateProduct
);
router.delete("/delete-product/:id", ProductController.handleDeleteProduct);
router.get("/product-by-category", ProductController.getProductsByCategory);
router.get("/search", ProductController.handleSearchProducts);

module.exports = router;
