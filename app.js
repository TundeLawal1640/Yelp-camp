const express = require("express");
const app = express();

require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const { getUnsplashApiImg } = require("./utils/unsplash.js");

const methodOverride = require("method-override");

const Campground = require("./models/campground.js");

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
app.post("/campgrounds", async (req, res) => {
  const { name, location, description } = req.body;
  const imageUrl = await getUnsplashApiImg();

  const newCampground = new Campground({
    name,
    location,
    description,
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
app.patch("/campgrounds/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, location, description } = req.body;
  await Campground.findByIdAndUpdate(
    id,
    { name, location, description },
    { runValidators: true },
  );
  res.redirect("/campgrounds");
});

// Show route
app.get("/campgrounds/show/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
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

// start server
app.listen(8080, () => {
  console.log("App listening on port 8080");
});
