import Review from "../models/review.js";
import Campground from "../models/campground.js";

// Controller function to create a new review for a campground
const new_review = async (req, res) => {
  const { _id } = req.params;
  const campground = await Campground.findById(_id).populate("reviews");
  if (!campground) {
    return res.status(404).send("Campground not found");
  }

  const { rating, body } = req.body;
  const new_review = await Review.create({ rating, body });
  new_review.author = req.user._id;
  await new_review.save();
  campground.reviews.push(new_review);
  await campground.save();
  req.flash("success", "Your review have been added successfully!");
  res.redirect(`/campgrounds/show/${_id}`);
};

// function to delete a review | comment on a campground
const delete_review = async (req, res, next) => {
  const { id, newReviewId } = req.params;

  //pull out newReviewId from reviews field in campground
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: newReviewId } });
  await Review.findByIdAndDelete(newReviewId);
  req.flash("success", "You have successfully deleted your review!");
  res.redirect(`/campgrounds/show/${id}`);
};

export default { new_review, delete_review };
