// importing multer and cloudinary storage configuration for handling file uploads
import multer from "multer";
import { storage } from "../utils/cloudinary.js";

const upload = multer({ storage });

// max 5 images, input name = "images"
const uploadArray = upload.array("images", 5);

export { uploadArray };
