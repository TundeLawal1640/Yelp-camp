import express from "express";
const router = express.Router();
import campground_controller from "../controller/campgrounds.js";
import Campground from "../models/campground.js";
import { getUnsplashApiImg } from "../utils/unsplash.js";
import { uploadArray } from "../middleware/upload.js";
import { joiCampgroundSchema } from "../error_handler/joi_validation.js";
import appError from "../error_handler/appError.js";
import User from "../models/user.js";
import isAuthenticated from "../loginAuth/isAuthenticated.js";
import isAuthor from "../loginAuth/isAuthor.js";

//function to validate campGround
const validate_campground_data = (req, res, next) => {
  // Validate and check for errors in submitted data from (req.body)
  const { error, value } = joiCampgroundSchema.validate(req.body);
  //extract error message from joi
  if (error) {
    const msg = error.details.map((k) => k.message).join(",");
    throw new appError(msg, 400);
  } else {
    next();
  }
};

//Route render's home page
router.get("/home", campground_controller.home);

// Route render's all campgrounds + search results
router.get("/", campground_controller.index);
// Route render's form to create aa new campground
router.get("/new", isAuthenticated, campground_controller.new_campground);

// Route create POST req for a new campground and save to DB
router.post(
  "/",
  isAuthenticated,
  uploadArray,
  validate_campground_data,
  campground_controller.create_campground,
);

// Route that render form to edit camp details
router.get(
  "/edit/:id",
  isAuthenticated,
  isAuthor,
  campground_controller.edit_campground,
);

// Route to update camp details route
router.patch(
  "/edit/:id",
  isAuthenticated,
  isAuthor,
  validate_campground_data,
  campground_controller.update_campground,
);

// Show route
router.get("/:id", campground_controller.show_campground);

//Route to delete a campground
router.delete(
  "/:id",
  isAuthenticated,
  isAuthor,
  campground_controller.delete_campground,
);

export default router;
