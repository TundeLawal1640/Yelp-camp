const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
  name: String,
  price: Number,
  location: String,
  description: String,
  stateDetails: String,
  imageUrl: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

// This logic middlewares triggers after a immediately a campground is deleted,
// it will also delete all the reviews associated with that campground
// (findbyIdAndDelete triggers findOneAndDelete middleware)
CampGroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

module.exports = mongoose.model("Campground", CampGroundSchema);
