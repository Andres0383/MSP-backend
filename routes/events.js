var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");
const Sport = require("../models/sports");

//create event
router.post("/newevent", (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
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
    //console.log(data);
    const user = data._id;
    if (data) {
      const { date, hour, description, address, pickup, sport } = req.body;
      Sport.findOne({ sport }).then((data) => {
        //console.log(data);
        const newEvent = new Event({
          user: [user],
          sport: data._id,
          date: new Date(date),
          hour,
          description,
          address,
          pickup,
        });

        newEvent.save().then((newDoc) => {
          //console.log(newDoc);
          res.json({ result: true, newDoc });
        });
      });
    }
    return;
  });
  User.updateOne({ token: req.body.token }, {}).then((data) => {
    console.log(data);
    res.json({ result: true });
  });
});

module.exports = router;
