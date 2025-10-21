const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const multer = require("multer");
const { updateUser } = require("../services/userService");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-new-user", UserController.handleCreateNewUser);
router.post("/login", UserController.handleLogin);
router.put("/update-user", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.body.id;
    const data = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      avatar: req.file ? req.file.buffer : undefined,
    };

    const result = await updateUser(userId, data);
    res.json(result);
  } catch (err) {
    console.error("Update User Error:", err); // 🔹 log chi tiết
    res.status(500).json({ errCode: 2, errMessage: "Server error" });
  }
});
router.post("/refresh-token", UserController.handleRefreshToken);
router.get(
  "/get-all-user",
  authenticateToken,
  authorizeRole(["admin"]),
  UserController.handleGetAllUsers
);
router.get(
  "/get-user/:id",
  authenticateToken,
  UserController.handleGetUserById
);

module.exports = router;
