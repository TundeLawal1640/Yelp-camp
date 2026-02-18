//importing express and creating an instance of it
import express from "express";
const app = express();

//importing dotenv to use environment variables
import dotenv from "dotenv";
dotenv.config();

// importing mongoose to connect to a database
import mongoose from "mongoose";

//importing path to work with file and directory paths
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// to get the current file path and directory path
import ejsMate from "ejs-mate";

// importing campground routes
import campground_routes from "./router/campground.js";

// importing review routes
import review_routes from "./router/review.js";

// importing Error Handler tools(joi) and Class(appError.js)
import Joi from "joi";
import {
  joiCampgroundSchema,
  joiReviewSchema,
} from "./error_handler/joi_validation.js";

//importing appError class to create custom error
import appError from "./error_handler/appError.js";

// importing function to get random image from unsplash api
import { getUnsplashApiImg } from "./utils/unsplash.js";

//importing method-override to use HTTP verbs
import methodOverride from "method-override";

//importing campground and review models
import Campground from "./models/campground.js";
import Review from "./models/review.js";

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

// use campground and review routes
app.use("/campgrounds", campground_routes);
// use review routes with campground id as params
app.use("/campgrounds", review_routes);

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
