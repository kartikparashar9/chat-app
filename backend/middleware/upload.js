import multer from "multer";
import { cloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new cloudinaryStorage({
    cloudinary,
    params: {
        folder: "chat-app/avatars",
        allowed_format:["jpg", "png", "jpeg", "webp"]
    },
});

const upload = multer({storage});

export default upload;