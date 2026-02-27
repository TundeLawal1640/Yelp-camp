import Campground from "../models/campground.js";

// Middleware to check if the user is the author of the campground
const isAuthor = async (req, res, next) => {
  const { id, _id } = req.params;
  const campId = id || _id;

  const campground = await Campground.findById(campId);

  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }

  // Guard against campgrounds with no author set
  if (!campground.author) {
    req.flash("error", "This campground has no author assigned!");
    return res.redirect("/campgrounds");
  }

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/campgrounds/show/${campId}`);
  }

  next();
};
export default isAuthor;
