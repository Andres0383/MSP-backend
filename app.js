require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
//var eventsRouter = require("./routes/events");
//var reviewsRouter = require("./routes/reviews");
//var sportsRouter = require("./routes/sports");

var app = express();
const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
//app.use("/events", eventsRouter);
//app.use("/reviews", reviewsRouter);
//app.use("/sports", sportsRouter);

module.exports = app;
