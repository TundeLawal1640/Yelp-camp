import express from "express";
const router = express.Router();
import passport from "passport";
import User from "../models/user.js";

//This extract value of intended Url from session and avail it res.locals
// before deletion by passport.authenticate()
const redirectUrl = (req, res, next) => {
  if (req.session.returnToUrl) {
    res.locals.returnToUrl = req.session.returnToUrl;
  }
  next();
};

// route renders signup form
router.get("/signup", (req, res) => {
  res.render("user/signup");
});

//route handles signup
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    //extract the intended URL from the session, or default to "/campgrounds" before exec login() to avoid wipe out
    const redirectUrl = req.session.returnToUrl || "/campgrounds";

    //This method login the user immediately after registration,
    // so they don't have to login again after signing up
    req.login(registeredUser, (error) => {
      if (error) return next(error);
      req.flash("success", `You are welcome to yelpcamp, ${username}`);
      res.redirect(redirectUrl);
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/users/signup");
  }
});

// route renders signin form
router.get("/signin", (req, res) => {
  res.render("user/signin");
});

//route handles signing in
router.post(
  "/signin",
  redirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "users/login",
  }),
  (req, res) => {
    const redirectUrl = res.locals.returnToUrl || "/campgrounds";
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
  },
);

router.get("/logout", (req, res) => {
  req.flash("success", "You have successfully logged out!");
  req.logout(() => {
    res.redirect("/campgrounds");
  });
});

export default router;
