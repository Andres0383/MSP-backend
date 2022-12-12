const mongoose = require("mongoose");

const eventSchema = mongoose.Event({
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "sports" },
  date: Date,
  hour: Date,
  description: String,
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  address: String,
  pickUp: Boolean,
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
