const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  lastName: String,
  fistName: String,
  email: String,
  password: String,
  userSport: { type: mongoose.Schema.Types.ObjectId, ref: "sports" },
  token: String,
  frequency: String,
  dateOfBirth: Date,
  sex: String,
  city: String,
  mixedSex: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  participate: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;