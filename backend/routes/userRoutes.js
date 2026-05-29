const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer.js');

const {
  login,
  signup,
  googleLogin,
  searchUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controller/userController.js");

const { protect } = require("../middleware/jwtAuthMiddleware.js");

// auth
router.post("/signup", upload.single("avatar"), signup);
router.post("/login", login);
router.post("/google-login", googleLogin);

// search users
router.get("/search", protect, searchUsers);

// other user APIs
router.get("/users/:id", protect, getUserById);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

module.exports = router;