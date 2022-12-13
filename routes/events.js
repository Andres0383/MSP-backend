var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");
const { checkBody } = require("../modules/checkBody");

//create event
router.post("events/newevent/", (req, res) => {
  if (
    !checkBody(req.body, [
      "sport",
      "date",
      "hour",
      "description",
      "address",
      "pickup",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({
    token: req.body.token,
  }).then((data) => {
    if (data === null) {
      const { sport, date, hour, description, address, pickup } = req.body;
      const newEvent = new Event({
        sport,
        date,
        hour,
        description,

        address,
        pickup,
      });

      newEvent.save().then((newDoc) => {
        console.log(newDoc);
        res.json({ result: true, newDoc });
      });
    }
    return;
  });
});
module.exports = router;
