import express from "express";
const router = express.Router();
import review_controller from "../controller/reviews.js";
import Campground from "../models/campground.js";
import appError from "../error_handler/appError.js";
import Review from "../models/review.js";
import { joiReviewSchema } from "../error_handler/joi_validation.js";
import isAuthenticated from "../loginAuth/isAuthenticated.js";

// function to validate and check for error on submitted review data (req.body)
const validate_review_data = async (req, res, next) => {
  const { error, value } = joiReviewSchema.validate(req.body);
  //extract error message from joi
  if (error) {
    const msg = error.details.map((k) => k.message).join(",");
    console.log(error);
    throw new appError(msg, 400);
  } else {
    next();
  }
};

// Route to make a new review for a campground
router.post(
  "/:_id/review",
  isAuthenticated,
  validate_review_data,
  review_controller.new_review,
);

//Route to delete a review | comment on a campground
router.delete("/:id/review/:newReviewId", review_controller.delete_review);

export default router;
