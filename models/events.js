const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  sport: String,
  date: Date,
  hour: String,
  description: String,
  latitude: Number,
  longitude: Number,
  address: String,
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
