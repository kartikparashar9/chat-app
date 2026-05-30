const User = require("../models/userModel.js");

// GET ALL FRIENDS
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate(
        "friends",
        "name username avatar bio isOnline"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      friends: user.friends,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getFriends,
};