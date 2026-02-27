import Campground from "../models/campground.js";
import { getUnsplashApiImg } from "../utils/unsplash.js";

// function renders campgrounds
const index = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({}).populate("author");
    res.render("campgrounds/allCamps", { campgrounds });
  } catch (err) {
    next(err);
  }
};

//function renders form to create a new campground
const new_campground = (req, res) => {
  res.render("campgrounds/new");
};

//function to create a new campground and save to DB
const create_campground = async (req, res, next) => {
  try {
    const { name, location, description, price } = req.body;
    let imageUrl;
    try {
      imageUrl = await getUnsplashApiImg();
    } catch (e) {
      req.flash("error", "unable to fetch image");
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

    // Set the author to the currently logged-in user
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Campground created successfully!");
    res.redirect(`/campgrounds/show/${newCampground._id}`);
  } catch (err) {
    req.flash("error", "Campground creation failed!");
    next(err);
  }
};

//function renders form to edit camp details
const edit_campground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
};

//function to update camp details route
const update_campground = async (req, res) => {
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
};

//function to show details of a campground
const show_campground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  if (!campground) {
    return res.status(404).send("Campground not found");
  }
  res.render("campgrounds/show", { campground });
};

//function to delete a campground
const delete_campground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground deleted successfully!");
  res.redirect("/campgrounds");
};

// export the functions as an object
export default {
  index,
  new_campground,
  create_campground,
  edit_campground,
  update_campground,
  show_campground,
  delete_campground,
};
