import Campground from "../models/campground.js";
import { getUnsplashApiImg } from "../utils/unsplash.js";

//functions that render home page
const home = (req, res) => {
  res.render("campgrounds/home");
};

// Main index - used by both /campgrounds and search
const index = async (req, res, next) => {
  try {
    const { search } = req.query;
    let campgrounds;

    if (search && search.trim()) {
      // Search with text index
      campgrounds = await Campground.find(
        { $text: { $search: search.trim() } },
        { score: { $meta: "textScore" } },
      )
        .sort({ score: { $meta: "textScore" } })
        .populate("author");
    } else {
      // No search - show all
      campgrounds = await Campground.find({}).populate("author");
    }

    res.render("campgrounds/allCamps", {
      campgrounds,
      searchQuery: search || "",
    });
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
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
      console.log(req.body, req.files);
    } else {
      // Fallback to Unsplash if no images uploaded
      try {
        const unsplashUrl = await getUnsplashApiImg();
        images.push({ url: unsplashUrl, filename: null });
      } catch (e) {
        req.flash("error", "Unable to fetch image");
        console.error("Unsplash error:", e);
        images.push({ url: "/images/placeholder.jpg", filename: null });
      }
    }

    const { name, location, description, price } = req.body;

    const newCampground = new Campground({
      name,
      location,
      description,
      price,
      images,
    });

    // Set the author to the currently logged-in user
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", "Campground created successfully!");
    res.redirect(`/campgrounds/${newCampground._id}`);
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
  home,
  index,
  new_campground,
  create_campground,
  edit_campground,
  update_campground,
  show_campground,
  delete_campground,
};
