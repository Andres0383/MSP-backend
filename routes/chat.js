var express = require("express");
var router = express.Router();

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1523540",
  key: "20d4ff0a04f440d2d436",
  secret: "a48ece1ef92926b4fcf3",
  cluster: "eu",
  useTLS: true,
});

router.put("/users/:firstname", (req, res) => {
  pusher.trigger("chat", "join", {
    firstname: req.params.firstname,
  });

  res.json({ result: true });
});

router.delete("/users/:firstname", (req, res) => {
  pusher.trigger("chat", "leave", {
    firstname: req.params.firstname,
  });

  res.json({ result: true });
});

router.post("/message", (req, res) => {
  const message = req.body;

  pusher.trigger("chat", "message", message);

  res.json({ result: true, data: message });
});

module.exports = router;
