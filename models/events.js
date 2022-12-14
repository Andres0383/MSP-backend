const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "sports" },
  date: Date,
  hour: String,
  description: String,
  address: String,
  pickup: Boolean,
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
