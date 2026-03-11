import User from "../models/user.js";

//function to render signup form
const signup_form = (req, res) => {
  res.render("user/signup");
};

//function to handle user registration
const signup = async (req, res, next) => {
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
};

//function to render signin form
const signin_form = (req, res) => {
  res.render("user/signin");
};

//function to handle user logout\
const logout = (req, res) => {
  req.flash("success", "You have successfully logged out!");
  req.logout(() => {
    res.redirect("/campgrounds/home");
  });
};

//function to handle user login is handled by passport.authenticate()
const signin = (req, res) => {
  const redirectUrl = res.locals.returnToUrl || "/campgrounds";
  req.flash("success", "Welcome back!");
  res.redirect(redirectUrl);
};

export default {
  signup_form,
  signup,
  signin_form,
  signin,
  logout,
};
