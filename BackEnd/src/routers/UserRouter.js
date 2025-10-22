const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { updateUser } = require("../services/UserService");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post(
  "/create-new-user",
  upload.single("avatar"),
  authenticateToken,
  authorizeRole(["admin"]),
  UserController.handleCreateNewUser
);

router.post("/login", UserController.handleLogin);

router.put(
  "/update-user",
  authenticateToken,
  authorizeRole(["admin"]),
  upload.single("avatar"),
  async (req, res) => {
    try {
      const userId = req.body.id;
      const data = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role,
        avatar: req.file
          ? `/uploads/avatars/${req.file.filename}`
          : req.body.avatar,
      };

      const result = await updateUser(userId, data);
      res.json(result);
    } catch (err) {
      console.error("Update User Error:", err);
      res.status(500).json({ errCode: 2, errMessage: "Server error" });
    }
  }
);

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

router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  UserController.handleDeleteUser
);

router.post("/logout", UserController.handleLogout);

module.exports = router;
