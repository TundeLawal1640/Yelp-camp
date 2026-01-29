// Seed file to create 5 new campground in the database
require("dotenv").config({
  path: require("path").resolve(__dirname, "..", ".env"),
});
const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const { getUnsplashApiImg } = require("../utils/unsplash.js");
const campname = require("./campname.js");
const { stateDetails } = require("./stateDetails.js");
const { description } = require("./descriptor.js");

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

// Function to (seed) create 5 new campground in the database
const newCampGround = async () => {
  try {
    await Campground.deleteMany({});

    for (let i = 0; i <= 2; i++) {
      const randomDescriptionIndex = Math.floor(
        Math.random() * description.length,
      );

      // Generate random indices for description and place arrays, campname, and cities
      const randomCampNameIndex = Math.floor(Math.random() * campname.length);
      const randomStateIndex = Math.floor(Math.random() * stateDetails.length);
      const randomPrice = Math.floor(Math.random() * 1000);

      // Create a 10 new campground

      const imgUrl = await getUnsplashApiImg();
      if (!imgUrl) {
        console.warn("Skipping campground: Could not fetch image");
        continue;
      }

      const newCamp = new Campground({
        name: `${campname[randomCampNameIndex].name}`,
        location: `${stateDetails[randomStateIndex].state}, ${stateDetails[randomStateIndex].city}`,
        imageUrl: `${imgUrl}`,
        description: `${description[randomDescriptionIndex]}`,
        price: randomPrice,
      });
      await newCamp.save();
      console.log("Saved:", newCamp);
    }

    // catch errors if any
  } catch (e) {
    console.log("unable to create camp", e);
  }
};
