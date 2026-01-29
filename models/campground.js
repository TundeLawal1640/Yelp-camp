const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
  name: String,
  price: Number,
  location: String,
  description: String,
  stateDetails: String,
  imageUrl: String,
});

module.exports = mongoose.model("Campground", CampGroundSchema);
