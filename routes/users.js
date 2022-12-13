var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { token } = require("morgan");

/* GET users listing. */
router.get("/:allUsers", (req, res) => {
  User.find({
    user: req.params.users,
  }).then((data) => {
    res.json({ result: true, sports: data });
  });
});

// Router for the signup
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({
    firstname: req.body.firstname,
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // If the user already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// Router for the signin
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Check if the user signin with the right information
  User.findOne({ email: req.body.email }).then((data) => {
    console.log(data);
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        firstname: data.firstname,
      });
    } else {
      res.json({ result: false, error: "Mail not found or wrong password" });
    }
  });
});

// Update the information
router.put("/update/", (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "userSport",
      "level",
      "dateOfBirth",
      "sex",
      "mixedSex",
      "city",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.updateOne(
    { token: req.body.token },
    {
      userSport: req.body.userSport,
      level: req.body.level,
      dateOfBirth: req.body.dateOfBirth,
      sex: req.body.sex,
      mixedSex: req.body.mixedSex,
      city: req.body.city,
    }
  ).then((data) => {
    res.json({ result: true });
  });
});

module.exports = router;
