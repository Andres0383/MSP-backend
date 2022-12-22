var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");

//get all avents
router.get("/all", (req, res) => {
  Event.find()
    .populate("user", [
      "token",
      "firstname",
      "level",
      "dateOfBirth",
      "sport",
      "city",
      "description",
      "events",
      "participate",
    ])

    .then((events) => {
      console.log(events);
      res.json({ result: true, events });
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
      "latitude",
      "longitude",
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
    const { date, hour, description, address, latitude, longitude, sport } =
      req.body;

    //console.log(data);
    const newEvent = new Event({
      author: user,
      user: [user],
      sport,
      date: new Date(date),
      hour,
      description,
      address,
      longitude,
      latitude,
    });
    newEvent.save().then((newDoc) => {
      //console.log(newDoc);
      User.updateOne({ _id: user._id }, { $push: { events: newDoc._id } }).then(
        (data) => {
          //console.log(data);
          res.json({ result: true });
        }
      );
    });
  });
});

// cancel event
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
          User.updateOne(
            { _id: user._id },
            { $pull: { events: event._id } }
          ).then(() => {
            res.json({ result: true });
          });
        });
      });
  });
});

//participate in an event
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

// unsubscribe from an event
router.delete("/participate", (req, res) => {
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
          { $pull: { participate: event._id } }
        ).then(() => {
          res.json({ result: true });
        });
      }
    });
  });
});

//add favorites
router.post("/favorites", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ token: req.body.token }).then((data) => {
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    // console.log(data);
    Event.findById(req.body.eventsId).then((event) => {
      console.log(event);
      if (!event) {
        res.json({ result: false, error: "Event not found" });
      } else {
        User.updateOne(
          { _id: data._id },
          { $push: { favorites: event._id } }
        ).then((data) => {
          //console.log(data);
          res.json({ result: true });
        });
      }
    });
  });
});

// get all favorites

router.get("/favorites/:token", (req, res) => {
  User.findOne({
    token: req.params.token,
  }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    Event.findById(req.body.eventsId).then((event) => {
      //console.log(event);
      if (!event) {
        res.json({ result: false, error: "Event not found" });
      } else {
        Event.findById(req.body.eventsId)
          .populate("user", ["token", "favorites"])
          .then((events) => {
            console.log(events.favorites);
            res.json({ result: true, events });
          });
      }
    });
  });
});

// remove favorites

router.delete("/favorites", (req, res) => {
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
          { $pull: { favorites: event._id } }
        ).then(() => {
          res.json({ result: true });
        });
      }
    });
  });
});

module.exports = router;
