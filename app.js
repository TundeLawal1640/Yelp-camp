//importing dotenv to use environment variables
import dotenv from "dotenv";
dotenv.config();

//importing express and creating an instance of it
import express from "express";
const app = express();

//helmet to set various HTTP headers for security
import helmet, { contentSecurityPolicy } from "helmet";

// importing session to use express-session for session management
import session from "express-session";

//importing connect-flash to use flash messages for success and error notifications
import flash from "connect-flash";

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

// importing user routes
import users_routes from "./router/user.js";

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
import User from "./models/user.js";
import Review from "./models/review.js";

// importing passport and passport-local for authentication
import passport from "passport";
import LocalStrategy from "passport-local";

// importing mongoose to connect to a database
import mongoose from "mongoose";

const dbUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Yelp-camp";

// connect database
mongoose
  .connect(dbUrl)
  .then(() => {
    const dbType = dbUrl.includes("mongodb+srv")
      ? "MongoDB Atlas"
      : "Local MongoDB";
    console.log(`Connected to database: ${dbType}`);
  })
  .catch((e) => {
    console.log("unable to connect", e);
  });
console.log("MONGODB_URI =", process.env.MONGODB_URI);

//importing connect-mongo to use MongoDB as session store
import MongoStore from "connect-mongo";

// set view engine and views directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// session store configuration to use MongoDB for storing session data
const sessionStore = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60, //  only update session once per 24 hours
  crypto: {
    secret: process.env.SESSION_SECRET || "thisisabadwayofsavingasecret",
  },
});

// Listen for session store errors
sessionStore.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store: sessionStore,
  name: "session", // change the default session name for security
  secret: process.env.SESSION_SECRET || "thisisabadwayofsavingasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    // secure: true, // we'll uncomment this for production later
  },
};

//  session middleware with the defined configuration
app.use(session(sessionConfig));

// Middleware to set flash messages in res.locals for access in all views
app.use(flash());

// initialize passport and use passport session for persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This middleware passes variables to ALL your EJS templates automatically
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// to serve static files in public directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/campgrounds/home");
});

// Routes handles campground and related request
app.use("/campgrounds", campground_routes);

// use review routes with campground id as params
app.use("/campgrounds", review_routes);

// use user routes
app.use("/users", users_routes);

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
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
