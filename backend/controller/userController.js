const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/jwtAuthMiddleware.js");

// ------------------ LogIn ------------------
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // GOOGLE LOGIN CHECK
    if (!user.password) {
      return res.status(400).json({
        message: "Please login with Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    const token = generateToken(user);

    user.password = undefined;

    return res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ------------------ SignUp ------------------
const signup = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      gender,
      bio,
      dob,
    } = req.body;

    // REQUIRED FIELDS
    if (!name || !username || !email || !password || !dob) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // USERNAME VALIDATION
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username can only contain letters, numbers, _ and .",
      });
    }

    // CHECK EMAIL
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // CHECK USERNAME
    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CLOUDINARY IMAGE
    const avatarUrl = req.file ? req.file.path : "";

    // CREATE USER
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
      gender,
      bio,
      dob,
    });

    // TOKEN
    const token = generateToken(user);

    user.password = undefined;

    return res.status(201).json({
      message: "User Successfully Created",
      token,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ------------------ Google Login ------------------
async function googleLogin(req, res) {
  try {
    const { name, email, googleId, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        username: email.split("@")[0],
        email,
        googleId,
        avatar,
        dob: "",
      });
    }

    const token = generateToken(user);

    user.password = undefined;

    return res.status(200).json({
      message: "User Successfully Login",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ------------------ Get User By Id ------------------
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ------------------ Update User ------------------
async function updateUser(req, res) {
  try {
    const {
      name,
      username,
      email,
      avatar,
      gender,
      bio,
      dob,
    } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (username) updateData.username = username;
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

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ------------------ Delete User ------------------
async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ------------------ Search User ------------------
const searchUsers = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    // VALIDATION
    if (!search) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    // SEARCH QUERY
    const keyword = {
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          username: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    // FIND USERS
    const users = await User.find({
      ...keyword,

      _id: {
        $ne: req.user._id,
      },
    }).select(
      "name username avatar bio isOnline"
    );

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
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
  searchUsers,
};