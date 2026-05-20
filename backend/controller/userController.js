const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../middleware/jwtAuthMiddleware.js");

// ------------------ LogIn ------------------
async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "User not found"
    });
  }

  if (user.googleId) {
    return res.status(400).json({
      message: "Please login with Google"
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Incorrect Password"
    });
  }

  const token = generateToken(user);
  user.password = undefined;

  return res.status(200).json({
    message: "Login Successful",
    token
  });
}


// ------------------ SignUp ------------------
async function signup(req, res) {
  const { name, email, password, avatar, gender, bio, dob } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format"
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
      gender,
      bio,
      dob
    });

    const token = generateToken(user);

    user.password = undefined;

    return res.status(201).json({
      message: "User Successfully Created",
      token,
      user
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}

// ------------------ Google LogIn ------------------
async function googleLogin(req, res) {
  try {
    const { name, email, googleId, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar
      });
    }

    const token = generateToken();
    user.password = undefined;

    return res.status(200).json({
      message: "User Successfully Login",
      token,
      user
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}

// ------------------ Get User By Id------------------
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.status(200).json({ user });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}

// ------------------ Update User ------------------
async function updateUser(req, res) {
  try {
    const { name, email, avatar, gender, bio, dob } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    if (gender) updateData.gender = gender;
    if (bio) updateData.bio = bio;
    if (dob) updateData.dob = dob;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if(!user) {
      return res.status(401).json({
        message: "User not found."
      });
    }

    return res.status(200).json({
      message: "User Updated Successfully",
      user
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}


// ------------------ Delete User ------------------
async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user) {
      return res.status(401).json({
        message: "User not found."
      });
    }

    return res.status(200).json({
      message: "User Deleted Successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}

// ------------------ Search User ------------------
const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
      : {};

    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select("name email avatar");

    return res.status(200).json(users);

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  login,
  signup,
  googleLogin,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers
};