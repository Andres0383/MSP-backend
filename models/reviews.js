const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  note: Number,
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
