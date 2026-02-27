import mongoose from "mongoose";
const Schema = mongoose.Schema;

const review_schema = new Schema({
  body: String,
  rating: Number,
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Review", review_schema);
