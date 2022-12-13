var express = require("express");
var router = express.Router();

require("../models/connection");
const Sports = require("../models/sports");

const { checkBody } = require("../modules/checkBody");

/* GET sports listing. */
router.get("/:sports", (req, res) => {
  Sports.find({
    sport: { $regex: new RegExp(req.params.sport, "i") },
  }).then((data) => {
    res.json({ result: true, sports: data });
  });
});

// Router for the sport
router.post("/select", (req, res) => {
  if (!checkBody(req.body, ["sport"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the sport has not already been registered
  Sports.findOne({
    sport: req.body.sport,
  }).then((data) => {
    if (data === null) {
      const newSport = new Sports({
        sport: req.body.sport,
      });

      newSport.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // If sport already exists in database
      res.json({ result: false, error: "Sport already exists" });
    }
  });
});

module.exports = router;
