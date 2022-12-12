const mongoose = require("mongoose");

const reviewSchema = mongoose.Shema({
  note: Number,
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  text: String,
});

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
