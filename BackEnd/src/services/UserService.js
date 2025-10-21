const db = require("../models");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../services/jwtService");

const hashUserPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const checkUserEmail = async (email) => {
  const user = await db.User.findOne({ where: { email } });
  return !!user;
};

const createNewUser = async (data) => {
  try {
    const emailExists = await checkUserEmail(data.email);
    if (emailExists) {
      return {
        errCode: 1,
        errMessage: "Email already exists, please use another email.",
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
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const handleUserLogin = async (email, password) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return { errCode: 1, errMessage: "User not found!" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { errCode: 2, errMessage: "Wrong password!" };
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { password: _, ...userData } = user.toJSON();

    return {
      errCode: 0,
      errMessage: "OK",
      data: { user: userData, accessToken, refreshToken },
    };
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const getAllUsers = async () => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password"] },
    });

    return { errCode: 0, errMessage: "OK", data: users };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
const updateUser = async (userId, data) => {
  try {
    const user = await db.User.findByPk(userId);
    if (!user) return { errCode: 1, errMessage: "User not found" }
    const fields = ["username", "email", "phone", "address", "avatar"];
    fields.forEach((field) => {
      if (data[field] !== undefined) user[field] = data[field];
    });
    await user.save();
    const { password, ...userData } = user.toJSON();
    return { errCode: 0, errMessage: "User updated", data: userData };
  } catch (err) {
    console.error(err);
    return { errCode: 2, errMessage: "Error from server" };
  }
};

const getUserById = async (userId) => {
  try {
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return { errCode: 1, errMessage: "User not found" };
    }

    return { errCode: 0, errMessage: "OK", data: user };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
module.exports = {
  createNewUser,
  handleUserLogin,
  verifyRefreshToken,
  generateAccessToken,
  updateUser,
  getAllUsers,
  getUserById,
};
