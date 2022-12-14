var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
require("../models/connection");
const User = require("../models/users");
const Review = require("../models/reviews");

router.post("/", (req, res) => {
  if (!checkBody(req.body, ["token", "note"])) {
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
    const newReview = new Review({
      user: [user],
      note: req.body.note,
    });

    newReview.save().then((newDoc) => {
      //console.log(newDoc);
      User.updateOne(
        { _id: user._id },
        { $push: { reviews: newDoc._id } }
      ).then((data) => {
        //console.log(data);
        res.json({ result: true });
      });
    });
  });
});

// Get a review
router.get("/:allReviews", (req, res) => {
  Review.find({
    review: req.params.reviews,
  }).then((data) => {
    res.json({ result: true, review: data });
  });
});

module.exports = router;
