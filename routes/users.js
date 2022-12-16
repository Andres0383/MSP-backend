var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const Event = require("../models/events");
const Reviews = require("../models/reviews");

const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/:token", (req, res) => {
  User.findOne({
    token: req.params.token,
  }).then((user) => {
    console.log(user);
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    User.findOne({
      token: req.params.token,
    }).then((data) => {
      res.json({ result: true, user: data });
    });
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

// Update the information (quizz)
router.put("/update/", (req, res) => {
  console.log(req.body);
  if (
    !checkBody(req.body, [
      "token",
      "sport",
      "level",
      "dateOfBirth",
      "sex",
      "mixedSex",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { sport, level, dateOfBirth, sex, mixedSex, city, description } =
    req.body;
  User.updateOne(
    { token: req.body.token },
    {
      sport,
      level,
      dateOfBirth: new Date(dateOfBirth),
      sex,
      mixedSex,
      city,
      description,
    }
  ).then((data) => {
    res.json({ result: true });
  });
});

// description
router.put("/description", (req, res) => {
  console.log(req.body);
  if (!checkBody(req.body, ["token", "description"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { description } = req.body;
  User.updateOne(
    { token: req.body.token },
    {
      description,
    }
  ).then((data) => {
    res.json({ result: true });
  });
});
//account deletion
router.delete("/delete", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      console.log(user);
      res.json({ result: false, error: "User not found" });
      return;
    }

    User.deleteOne({ _id: user._id }).then(() => {
      Event.deleteMany({ author: user._id }).then((data) => {
        Reviews.deleteMany({ user: user._id }).then((data) => {
          res.json({ result: "account deleted" });
        });
      });
    });
  });
});

module.exports = router;
