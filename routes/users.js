var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { token } = require("morgan");

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

// Router for the signup
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstName", "lastName", "mail", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({
    firstName: req.body.firstName,
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mail: req.body.mail,
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
  if (!checkBody(req.body, ["mail", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Check if the user signin with the right information
  User.findOne({ mail: req.body.mail }).then((data) => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        firstName: data.firstName,
        lastName: data.lastName,
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
      "sport",
      "frequency",
      "dateOfBirth",
      "sex",
      "mixedSex",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.updateOne(
    { token: req.body.token },
    {
      sport: req.body.sport,
      frequency: req.body.frequency,
      dateOfBirth: req.body.dateOfBirth,
      sex: req.body.sex,
      mixedSex: req.body.mixedSex,
    }
  ).then((data) => {
    res.json({ result: true });
  });
});

module.exports = router;
