# 대화가 필요한 당신에게 필요한 챗봇 서비스, 오, 릴리? (Oh, really?)

![MainPage](https://github.com/user-attachments/assets/06316ee6-2ae2-4d71-87a4-16589d54af59)

## 📌목차

1. [프로젝트 소개](#project)
2. [개발 일정](#period)
3. [개발 환경](#environment)
4. [프로젝트 구조](#structure)
5. [페이지별 기능](#function)
6. [프로젝트 후기](#review)

<br>

## <span id="project">1. 프로젝트 소개</span>

- 대화가 필요한 사용자에게 실제 대화 전 **연습 기회** 제공
- 챗봇과의 대화 및 저장한 대화를 **날짜별로 요약**하고 음성으로 재생

<br>

## <span id="period">2. 개발 일정</span>

- 전체 개발 기간: 2024-05-13 ~ 2024-05-31

<br>

## <span id="environment">3. 개발 환경</span>

- Front: HTML, css, JavaScript
- Back: Node.js, FastAPI, Amazon Polly
- db: Amazon S3
- AI: OpenAI Whisper
- 배포 및 관리: Amazon EC2, Docker
- 디자인: Figma 

<br>

## <span id="structure">4. 프로젝트 구조</span>

```
├── README.md
├── node/
│   ├── public/
│   │   ├── image/
│   │   │   ├── images.jpg
│   │   │   ├── index.png
│   │   │   └── nosummary.png
│   │   │   
│   │   ├── check.css
│   │   ├── check.html
│   │   ├── check.js
│   │   ├── index.css
│   │   ├── index.html
│   │   └── index.js
│   ├── routes/
│   │   └── main.js
│   ├── app.js
│   └── package.json
└── python/
    ├── Makefile
    └── app.py
```

<br>

## <span id="function">5. 페이지별 기능</span>

### [메인 페이지]
![레이아웃명세서1](https://github.com/user-attachments/assets/29dc9f3d-81fe-4cda-bd03-626180747285)


### [이전 대화 기록]
![레이아웃명세서2](https://github.com/user-attachments/assets/a5106a5d-f0bb-45e9-9738-295cfe8eea48)


### [당일 대화 기록]
![레이아웃명세서3](https://github.com/user-attachments/assets/10445a90-90ad-4884-86d3-b2797bc16691)


<br>

## <span id="review">6. 프로젝트 후기</span>

팀장을 맡아 기획부터 프론트, 백 전반적인 개발에 참여했습니다. 프로젝트 기간이 짧아 처음 기획했던 모든 부분을 구현하지 못한 것이 아쉽지만, OpenAI를 이용하여 챗봇 서비스를 구현하고 STT와 TTS를 이용하는 등 처음 사용해보는 기술들을 많이 이용해볼 수 있어 좋았습니다. Docker를 통해 배포하는 과정에서 secret 파일 처리에 어려움을 겪었지만 팀원과 함께 다양한 코드를 리뷰하여 해결하였습니다.
