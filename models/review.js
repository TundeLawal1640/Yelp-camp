const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const review_schema = new Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", review_schema);
