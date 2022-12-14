var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");
const Sport = require("../models/sports");

router.get("/:allEvents", (req, res) => {
  Event.find({
    event: req.params.events,
  }).then((data) => {
    res.json({ result: true, events: data });
  });
});

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
    // console.log(data);
    if (data) {
      const user = data._id;
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
          User.updateOne(
            { _id: user._id },
            { $push: { participate: newDoc._id, events: newDoc._id } }
          ).then((data) => {
            //console.log(data);
            res.json({ result: true });
          });
        });
      });
    }
    return;
  });
});

router.put("/participate", (req, res) => {
  if (!checkBody(req.body, ["token", "eventsId"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({
    token: req.body.token,
  }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    const user = data._id;
    Event.findById(req.body.eventsId).then((event) => {
      if (!event) {
        res.json({ result: false, error: "Event not found" });
        return;
      }
      if (event.user.includes(event._id)) {
        User.updateOne(
          { _id: user._id },
          { $pull: { participate: event._id } }
        ).then(() => {
          res.json({ result: true });
        });
      } else {
        User.updateOne(
          { _id: user._id },
          { $push: { participate: event._id } }
        ).then(() => {
          res.json({ result: true });
        });
      }
    });
  });
});

module.exports = router;
