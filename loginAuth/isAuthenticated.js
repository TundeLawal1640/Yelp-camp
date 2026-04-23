const isAuthenticated = (req, res, next) => {
  //store intended url before redirecting
  if (!req.isAuthenticated()) {
    req.session.returnToUrl = req.originalUrl;
    req.flash("error", "You must be signed in to access this page!");
    return res.redirect("/users/signin");
  }
  next();
};

export default isAuthenticated;
