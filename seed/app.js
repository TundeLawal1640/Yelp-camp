// Seed file to create 5 new campground in the database
import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
// console.log("KEY:", process.env.UNSPLASH_ACCESS_KEY);
// console.log("DEBUGGING KEYS:");
// console.log("All Env Keys:", Object.keys(process.env));
// console.log("Unsplash Key:", process.env.UNSPLASH_ACCESS_KEY);

// Import mongoose,model,api function import file, obj of camp names, descriptions & state details files.
import mongoose from "mongoose";
import Campground from "../models/campground.js";
import { getUnsplashApiImg } from "../utils/unsplash.js";
import campname from "./campname.js";
import { stateDetails } from "./stateDetails.js";
import { description } from "./descriptor.js";

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
        author: "699da83521083c28635ff8a7",
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
