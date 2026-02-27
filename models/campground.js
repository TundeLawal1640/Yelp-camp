import mongoose from "mongoose";
import Review from "./review.js";

const Schema = mongoose.Schema;

// creating a schema for campground
const CampGroundSchema = new Schema({
  name: String,
  price: Number,
  location: String,
  description: String,
  stateDetails: String,
  imageUrl: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

// This logic middlewares is triggered immediately a campground is deleted,
// it will also delete all the reviews associated with that campground
// (findbyIdAndDelete triggers findOneAndDelete middleware)
CampGroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

export default mongoose.model("Campground", CampGroundSchema);
