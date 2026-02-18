import mongoose from "mongoose";
const Schema = mongoose.Schema;

const review_schema = new Schema({
  body: String,
  rating: Number,
});

export default mongoose.model("Review", review_schema);
