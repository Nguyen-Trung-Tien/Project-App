const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

router.post("/create-new-user", UserController.handleCreateNewUser);
router.post("/login", UserController.handleLogin);
router.post("/refresh-token", UserController.handleRefreshToken);

module.exports = router;
