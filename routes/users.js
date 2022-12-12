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
    lastName: req.body.lastName,
    mail: req.body.mail,
    password: bcrypt.hash,
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
  User.findOne({ mail: req.body.mail, password: req.body.password }).then(
    (data) => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, token: data.token });
      } else {
        res.json({ result: false, error: "Mail not found or wrong password" });
      }
    }
  );
});

// Update the information
router.put("/update", (req, res) => {
  if (
    !checkBody(req.body, [
      "sport",
      "frequency",
      "dateOfBirth",
      "sexe",
      "mixedSex",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }

    /*if (tweet.likes.includes(user._id)) { // User already liked the tweet
    Tweet.updateOne({ _id: tweet._id }, { $pull: { likes: user._id } }) // Remove user ID from likes
      .then(() => {
        res.json({ result: true });
      });
  } else { // User has not liked the tweet
    Tweet.updateOne({ _id: tweet._id }, { $push: { likes: user._id } }) // Add user ID to likes
      .then(() => {
        res.json({ result: true });
      });
  }
});
*/
  });
});

module.exports = router;
