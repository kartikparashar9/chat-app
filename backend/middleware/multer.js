const multer = require("multer");

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

// CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "chat-app/avatars",

    allowed_formats: [
      "jpg",
      "png",
      "jpeg",
      "webp",
    ],

    public_id:
      Date.now() +
      "-" +
      file.originalname.split(".")[0],
  }),
});

// MULTER
const upload = multer({
  storage,
});

module.exports = upload;