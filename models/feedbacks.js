const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  note: Number,
  comment: String,
});

const Feedback = mongoose.model("feedbacks", feedbackSchema);

module.exports = Feedback;
