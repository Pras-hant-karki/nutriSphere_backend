// controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require("sequelize");

const registerUser = async (req, res, next) => {
  const { username, password, fullname, email } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Duplicate username or email" });
    }

    if (!username || !password || !fullname || !email) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
      fullname,
      email,
    });

    res.status(201).json({ status: "success", message: "User created" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "User is not registered" });
    }

    if (!username || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Password does not match" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ status: "success", token: token });
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      data: [user],
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { username, fullname, email, phoneNumber } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Build update object
    const updates = {};

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      updates.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already taken" });
      }
      updates.email = email;
    }

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingUser = await User.findOne({ where: { phoneNumber } });
      if (existingUser) {
        return res.status(400).json({ error: "Phone number is already taken" });
      }
      updates.phoneNumber = phoneNumber;
    }

    if (fullname) updates.fullname = fullname;

    // Update user
    await user.update(updates);

    const updatedUser = await User.findByPk(userId);
    res.json({
      data: [updatedUser],
    });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  try {
    const userId = req.user.id;
    const image = req.file.filename;

    await User.update({ image }, { where: { id: userId } });

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update the user's profile picture",
    });
  }
};

const getUserInfoById = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] }, // Exclude sensitive data
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadImage,
  getUserInfoById,
};
