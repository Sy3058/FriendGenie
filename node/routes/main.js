const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SU_IP = process.env.SU_IP || 3500;
const JI_IP = process.env.JI_IP || 3000;

module.exports = app;

app.post("/ip", (req, res) => {
  res.send({ su_ip: SU_IP, ji_ip: JI_IP });
});

// summarytts
app.post('/texttospeech', async (req, res) => {
  const summary = req.body.summary;
  const date = req.body.datestr;

  console.log(`Received TTS request: summary="${summary}", datestr="${date}"`);

  try {
    const response = await axios.post(`http://${SU_IP}:3500/texttospeech/`, { summary, date });
    console.log('External API response:', response.data); // 외부 API 응답 데이터 출력
    res.send(response.data); // 클라이언트에게 응답 전송
  } catch (error) {
    if (error.response) {
      // 서버가 응답했지만 상태 코드는 2xx 범위를 벗어남
      console.error('Error response from external API:', error.response.data);
      res.status(500).send(`External API error: ${error.response.data}`);
    } else if (error.request) {
      // 요청이 만들어졌지만 응답을 받지 못함
      console.error('No response received from external API:', error.request);
      res.status(500).send('No response received from external API');
    } else {
      // 요청을 설정하는 중에 문제가 발생
      console.error('Error setting up request to external API:', error.message);
      res.status(500).send(`Error setting up request to external API: ${error.message}`);
    }
  }
});