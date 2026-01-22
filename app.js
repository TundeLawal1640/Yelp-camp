const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//home route
app.get("/", (req, res) => {
  res.render("home");
});

// all campgrounds route
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/allCamps", { campgrounds });
});

// Render form page to create new campground | route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// post new campground to allCampground page route
app.post("/campgrounds", (req, res) => {
  const { name, location } = req.body;
  console.log(req.body);
  const newCampground = new Campground({ name, location });
  newCampground.save();
  res.redirect("/campgrounds");
});

// Route that render form to edit camp details
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

// Route update camp details route
app.patch("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { name, location },
    { runValidators: true },
  );
  res.redirect("/campgrounds");
});

// Show route
app.get("/campgrounds/show/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
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
