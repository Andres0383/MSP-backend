const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  email: String,
  password: String,
  sport: [String],
  token: String,
  level: String,
  dateOfBirth: Date,
  sex: String,
  city: String,
  mixedSex: String,
  description: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  participate: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: "feedback" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
