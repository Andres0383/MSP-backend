const mongoose = require("mongoose");

const sportSchema = mongoose.Schema({
  sport: String,
});

const Sport = mongoose.model("sports", sportSchema);

module.exports = Sport;
