const db = require("../models/index");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashUserPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const checkUserEmail = async (userEmail) => {
  try {
    const user = await db.User.findOne({ where: { email: userEmail } });
    return !!user;
  } catch (e) {
    throw e;
  }
};

const createNewUser = async (data) => {
  try {
    const emailExists = await checkUserEmail(data.email);
    if (emailExists) {
      return {
        errCode: 1,
        errMessage: "Your Email is already in use! Please try another email!",
      };
    }

    const hashedPassword = hashUserPassword(data.password);

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
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const handleUserLogin = async (email, password) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return { errCode: 1, errMessage: "User not found!" };
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return { errCode: 2, errMessage: "Wrong password!" };
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Không gửi password về client
    const { password: _, ...userData } = user.toJSON();

    return { errCode: 0, errMessage: "OK", user: userData, token };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = { createNewUser, hashUserPassword, handleUserLogin };
