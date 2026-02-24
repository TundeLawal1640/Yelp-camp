import express from "express";
const router = express.Router();
import Campground from "../models/campground.js";
import { getUnsplashApiImg } from "../utils/unsplash.js";
import { joiCampgroundSchema } from "../error_handler/joi_validation.js";
import appError from "../error_handler/appError.js";
import campground from "../models/campground.js";
import isAuthenticated from "../loginAuth/isAuthenticated.js";

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

// Route render's all campgrounds
router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/allCamps", { campgrounds });
});

// Route render's form to create aa new campground
router.get("/new", isAuthenticated, (req, res) => {
  res.render("campgrounds/new");
});

// Route create POST req for a new campground and save to DB
router.post(
  "/",
  isAuthenticated,
  validate_campground_data,
  async (req, res, next) => {
    try {
      const { name, location, description, price } = req.body;
      let imageUrl;
      try {
        imageUrl = await getUnsplashApiImg();
      } catch (e) {
        console.error("Unsplash error:", e);
        imageUrl = "/images/placeholder.jpg"; // local fallback
      }
      const newCampground = new Campground({
        name,
        location,
        description,
        price,
        imageUrl,
      });
      await newCampground.save();
      req.flash("success", "Campground created successfully!");
      res.redirect("/campgrounds");
    } catch (err) {
      req.flash("error", "Campground creation failed!");
      next(err);
    }
  },
);
// Route that render form to edit camp details
router.get("/edit/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

// Route to update camp details route
router.patch(
  "/edit/:id",
  isAuthenticated,
  validate_campground_data,
  async (req, res) => {
    const { id } = req.params;
    const { name, location, description, price } = req.body;
    const updatedCampground = await Campground.findByIdAndUpdate(
      id,
      { name, location, price, description },
      { runValidators: true, new: true },
    );
    if (!updatedCampground) {
      req.flash("error", "Campground not found!");
      return res.status(404).redirect("/campgrounds");
    }
    req.flash("success", "Campground updated successfully!");
    res.redirect("/campgrounds");
  },
);

// Show route
router.get("/show/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate("reviews");
  if (!campground) {
    return res.status(404).send("Campground not found");
  }
  res.render("campgrounds/show", { campground });
});

//Route to delete a campground
router.delete("/:_id", async (req, res) => {
  const { _id } = req.params;
  const campground = await Campground.findByIdAndDelete({ _id });
  req.flash("success", "Campground deleted successfully!");
  res.redirect("/campgrounds");
});

export default router;
