var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");

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
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ token: req.body.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    // console.log(data);
    const user = data._id;
    const { date, hour, description, address, pickup, sport } = req.body;

    //console.log(data);
    const newEvent = new Event({
      author: user,
      user: [user],
      sport,
      date: new Date(date),
      hour,
      description,
      address,
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

router.delete("/", (req, res) => {
  if (!checkBody(req.body, ["token", "eventsId"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }

    Event.findById(req.body.eventsId)
      .populate("author")
      .then((event) => {
        if (!event) {
          res.json({ result: false, error: "Event not found" });
          return;
        } else if (String(event.author._id) !== String(user._id)) {
          // ObjectId needs to be converted to string (JavaScript cannot compare two objects)
          res.json({
            result: false,
            error: "Event can only be deleted by its author",
          });
          return;
        }

        Event.deleteOne({ _id: event._id }).then(() => {
          res.json({ result: true });
        });
      });
  });
});

module.exports = router;
