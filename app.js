require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var chatRouter = require("./routes/chat");
var usersRouter = require("./routes/users");
var eventsRouter = require("./routes/events");
var reviewsRouter = require("./routes/reviews");
var feedbackRouter = require("./routes/feedback");

var app = express();
const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/chat", chatRouter);
app.use("/users", usersRouter);
app.use("/events", eventsRouter);
app.use("/reviews", reviewsRouter);
app.use("/feedbacks", feedbackRouter);

module.exports = app;
