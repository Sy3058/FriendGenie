const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;

app.use(
  cors({
    origin: "http://43.203.206.180:8000", // 요청을 허용할 도메인
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.get("/", (req, res) => {
  res.send("CORS 설정 완료");
});

app.get("/hello", async (req, res) => {
  var url = "http://43.203.206.180:3000/streamaudio";
  url += req.query.date;
  const streamAudio = await axios.get("http://43.203.206.180:3000/streamaudio");
});
