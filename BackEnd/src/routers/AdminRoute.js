const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole(["admin"]),
  AdminController.getDashboard
);

module.exports = router;
