const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  email: String,
  password: String,
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "sports" },
  token: String,
  level: String,
  dateOfBirth: Date,
  sex: Boolean,
  city: String,
  mixedSex: Boolean,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  participate: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
