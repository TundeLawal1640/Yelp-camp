const express = require("express");
const app = express();

require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

const ejsMate = require("ejs-mate");

// importing Error Handler tools(joi) and Class(appError.js)
const Joi = require("joi");
const {
  joiCampgroundSchema,
  joiReviewSchema,
} = require("./error_handler/joi_validation.js");
const appError = require("./error_handler/appError.js");

const { getUnsplashApiImg } = require("./utils/unsplash.js");

const methodOverride = require("method-override");

const Campground = require("./models/campground.js");
const Review = require("./models/review.js");

// connect database
mongoose
  .connect("mongodb://127.0.0.1:27017/Yelp-camp")
  .then(() => {
    console.log("Connected to a database");
  })
  .catch((e) => {
    console.log("unable to connect", e);
  });

// set view engine and views directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validate_campground_data = (req, res, next) => {
  // Validate and check for errors in submitted data from (req.body)
  const { error, value } = joiCampgroundSchema.validate(req.body);
  //extract error message from joi
  if (error) {
    const msg = error.details.map((k) => k.message).join(",");
    console.log(error);
    throw new appError(msg, 400);
  } else {
    next();
  }
};

// validate and check for error on submitted review data (req.body)

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

// Route render's all campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/allCamps", { campgrounds });
});

// Route render's form to create aa new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// Route create POST req for a new campground and save to DB
app.post("/campgrounds", validate_campground_data, async (req, res, next) => {
  // validated data (req.body)
  const { name, location, description, price } = req.body;
  const imageUrl = await getUnsplashApiImg();
  const newCampground = new Campground({
    name,
    location,
    description,
    price,
    imageUrl,
  });

  await newCampground.save();
  res.redirect("/campgrounds");
});

// Route that render form to edit camp details
app.get("/campgrounds/edit/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

// Route to update camp details route
app.patch(
  "/campgrounds/edit/:id",
  validate_campground_data,
  async (req, res) => {
    const { id } = req.params;
    const { name, location, description, price } = req.body;
    await Campground.findByIdAndUpdate(
      id,
      { name, location, price, description },
      { runValidators: true },
    );
    res.redirect("/campgrounds");
  },
);

// Show route
app.get("/campgrounds/show/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate("reviews");
  if (!campground) {
    return res.status(404).send("Campground not found");
  }
  res.render("campgrounds/show", { campground });
});

//Route to delete a campground
app.delete("/campgrounds/:_id", async (req, res) => {
  const { _id } = req.params;
  const campground = await Campground.findByIdAndDelete({ _id });
  res.redirect("/campgrounds");
});

// Route to make a new review for a campground
app.post("/campgrounds/:_id/review", validate_review_data, async (req, res) => {
  const { _id } = req.params;
  const campground = await Campground.findById(_id).populate("reviews");

  if (!campground) {
    return res.status(404).send("Campground not found");
  }

  const { rating, body } = req.body;
  const new_review = await Review.create({ rating, body });
  campground.reviews.push(new_review);
  await campground.save();
  res.redirect(`/campgrounds/show/${_id}`);
});

//Route to delete a review | comment on a campground
app.delete("/campgrounds/:id/review/:newReviewId", async (req, res, next) => {
  const { id, newReviewId } = req.params;

  //pull out newReviewId from reviews field in campground
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: newReviewId } });
  await Review.findByIdAndDelete(newReviewId);
  res.redirect(`/campgrounds/show/${id}`);
});

// 404 handler - if url does not match any of the route
app.use((req, res, next) => {
  next(new appError("Page Not found", 404));
});

// Error handling route
app.use((err, req, res, next) => {
  const { message = "Internal Server Error", statusCode = 500, stack } = err;
  res
    .status(statusCode)
    .render("campgrounds/errorTemplate", { message, statusCode, stack });
});
// start server
app.listen(8080, () => {
  console.log("App listening on port 8080");
});
