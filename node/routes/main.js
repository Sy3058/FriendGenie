const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;

// summarytts
app.post("/texttospeech", (req, res) => {
  // 클라이언트에서 전송한 요약 데이터 가져오기
  const summary = req.body.summary;
  const date = req.body.datestr;

  // 외부 API에 요청을 보내기 위해 요약 데이터를 전송
  axios
    .post("http://43.203.206.180:3000/texttospeech/", { summary, date })
    .then((response) => {
      console.log(response.data); // 서버에서 받은 데이터 출력
      res.send(response.data); // 클라이언트에게 응답 전송
    })
    .catch((error) => {
      if (error.response) {
        // 서버가 응답했지만 상태 코드는 2xx 범위를 벗어남
        console.error("Error response from external API:", error.response.data);
        res.status(500).send(`External API error: ${error.response.data}`);
      } else if (error.request) {
        // 요청이 만들어졌지만 응답을 받지 못함
        console.error("No response received from external API:", error.request);
        res.status(500).send("No response received from external API");
      } else {
        // 요청을 설정하는 중에 문제가 발생
        console.error(
          "Error setting up request to external API:",
          error.message
        );
        res
          .status(500)
          .send(`Error setting up request to external API: ${error.message}`);
      }
    });
});
