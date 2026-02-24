import express from "express";
const router = express.Router();
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
  async (req, res) => {
    const { _id } = req.params;
    const campground = await Campground.findById(_id).populate("reviews");

    if (!campground) {
      return res.status(404).send("Campground not found");
    }

    const { rating, body } = req.body;
    const new_review = await Review.create({ rating, body });
    campground.reviews.push(new_review);
    await campground.save();
    req.flash("success", "Your review have been added successfully!");
    res.redirect(`/campgrounds/show/${_id}`);
  },
);

//Route to delete a review | comment on a campground
router.delete("/:id/review/:newReviewId", async (req, res, next) => {
  const { id, newReviewId } = req.params;

  //pull out newReviewId from reviews field in campground
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: newReviewId } });
  await Review.findByIdAndDelete(newReviewId);
  req.flash("success", "You have successfully deleted your review!");
  res.redirect(`/campgrounds/show/${id}`);
});
export default router;
