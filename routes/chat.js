var express = require("express");
var router = express.Router();

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
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
