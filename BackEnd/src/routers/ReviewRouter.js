const express = require("express");
const router = express.Router();
const ReviewController = require("../controller/ReviewController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

router.get("/product/:productId", ReviewController.handleGetReviewsByProduct);
router.post(
  "/create",
  authenticateToken,
  authorizeRole(["admin", "customer"]),
  ReviewController.handleCreateReview
);

module.exports = router;
