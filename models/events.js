const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "sports" },
  date: Date,
  hour: String,
  description: String,
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  address: String,
  pickUp: Boolean,
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
