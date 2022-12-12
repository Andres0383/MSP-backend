const mongoose = require("mongoose");

const sportSchema = mongoose.Schema({
  sportName: String,
  logo: Image,
});

const Sport = mongoose.model("sports", sportSchema);

module.exports = Sport;
