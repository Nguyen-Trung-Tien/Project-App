const db = require("../models");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../services/jwtService");

/**
 * Hash password
 */
const hashUserPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Check if email exists
 */
const checkUserEmail = async (email) => {
  const user = await db.User.findOne({ where: { email } });
  return !!user;
};

/**
 * Create new user
 */
const createNewUser = async (data) => {
  const emailExists = await checkUserEmail(data.email);
  if (emailExists) {
    return {
      errCode: 1,
      errMessage: "Email đã tồn tại, vui lòng dùng email khác.",
    };
  }

  const hashedPassword = await hashUserPassword(data.password);

  await db.User.create({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    phone: data.phone || null,
    address: data.address || null,
    role: data.role || "customer",
    avatar: data.avatar || null,
    isActive: true,
  });

  return { errCode: 0, errMessage: "User created successfully!" };
};

/**
 * Handle login
 */
const handleUserLogin = async (email, password) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    return { errCode: 1, errMessage: "User not found!" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { errCode: 2, errMessage: "Wrong password!" };
  }

  const payload = { id: user.id, email: user.email, role: user.role };

  // Tạo tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const { password: _, ...userData } = user.toJSON();

  return {
    errCode: 0,
    errMessage: "OK",
    data: { user: userData, accessToken, refreshToken },
  };
};

module.exports = {
  createNewUser,
  handleUserLogin,
  verifyRefreshToken,
  generateAccessToken,
};
