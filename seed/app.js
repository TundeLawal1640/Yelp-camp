//
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const campname = require("./campname.js");
const cities = require("./cities.js");
const { description, place } = require("./descriptor.js");

// Connect to MongoDB && run the newCampGround function after connection
mongoose
  .connect("mongodb://127.0.0.1:27017/Yelp-camp")
  .then(async () => {
    console.log("Connected to a database");
    await newCampGround();
  })
  .catch((e) => {
    console.log("unable to connect", e);
  });

app.set("view engine", "ejs");

// Function to (seed) create 50 new campground in the database
const newCampGround = async () => {
  try {
    await Campground.deleteMany({});

    for (let i = 0; i <= 50; i++) {
      const randomDescriptionIndex = Math.floor(
        Math.random() * description.length,
      );

      // Generate random indices for description and place arrays and campname
      const randomPlaceIndex = Math.floor(Math.random() * place.length);
      const randomCampNameIndex = Math.floor(Math.random() * campname.length);
      const randomPrice = Math.floor(Math.random() * 1000);

      // Create a 50 new campground document
      const newCamp = new Campground({
        name: `${campname[randomCampNameIndex].name}`,
        location: `${description[randomDescriptionIndex]} ${place[randomPlaceIndex]}`,
        price: `${randomPrice}`,
      });
      await newCamp.save();
      console.log("Saved:", newCamp);
    }

    // catch errors if any
  } catch (e) {
    console.log("unable to create camp", e);
  }
};

// Start the server
app.listen(8080, () => {
  console.log("App listening on port 8080");
});
