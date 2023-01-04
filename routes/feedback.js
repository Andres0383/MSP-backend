var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
require("../models/connection");
const User = require("../models/users");
const Feedback = require("../models/feedbacks");

router.post("/", (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ token: req.body.token }).then((data) => {
    console.log(data);
    if (data === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    const user = data._id;
    const newFeedback = new Feedback({
      user: [user],
      note: req.body.note,
      comment: req.body.comment,
    });

    newFeedback.save().then((newDoc) => {
      //console.log(newDoc);
      User.updateOne(
        { _id: user._id },
        { $push: { feedback: newDoc._id } }
      ).then((data) => {
        //console.log(data);
        res.json({ result: true });
      });
    });
  });
});

module.exports = router;
