const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const axios = require("axios");

app.set("port", process.env.PORT || 8000);
app.set("view engine", "ejs");
app.set("view", path.join(__dirname, "views"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var main = require("./routes/main.js");
app.use("/", main);

app.listen(app.get("port"), () => {
  console.log("8000 Port: Server Started~!!");
});
