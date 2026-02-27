import express from "express";
const router = express.Router();
import users_controller from "../controller/users.js";
import passport from "passport";
import User from "../models/user.js";
import users from "../controller/users.js";

//This extract value of intended Url from session and avail it res.locals
// before deletion by passport.authenticate()
const redirectUrl = (req, res, next) => {
  if (req.session.returnToUrl) {
    res.locals.returnToUrl = req.session.returnToUrl;
  }
  next();
};

// route renders signup form
router.get("/signup", users_controller.signup_form);

//route handles signup
router.post("/signup", users_controller.signup);

// route renders signin form
router.get("/signin", users_controller.signin_form);

//route handles signing in
router.post(
  "/signin",
  redirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "users/login",
  }),
  users_controller.signin,
);

router.get("/logout", users_controller.logout);

export default router;
