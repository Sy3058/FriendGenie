from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import boto3
import os
import openai
from botocore.exceptions import ClientError, BotoCoreError
from datetime import datetime

api_key = os.getenv('OPENAI_API_KEY')
app = FastAPI()

ai_client = openai.OpenAI(api_key=api_key)
s3_client = boto3.client('s3')
polly_client = boto3.client('polly')
transcribe_client = boto3.client('transcribe')

class SpeechToTextResponse(BaseModel):
    msg: str

class TextToSpeechResponse(BaseModel):
    summary: str
    date: str

BUCKET_NAME = 'kibwa08'
PREFIX1 = 'dailysummaryspeech/'
PREFIX2 = 'temp/'

response1 = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PREFIX1)
response2 = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PREFIX2)

def checkFolder(BUCKET_NAME, PREFIX, response):
    if 'Contents' not in response:
        s3_client.put_object(Bucket=BUCKET_NAME, Key=PREFIX)
        print(f"Folder '{PREFIX}' created successfully")
    else:
        print(f"Folder '{PREFIX}' already exists")

checkFolder(BUCKET_NAME, PREFIX1, response1)
checkFolder(BUCKET_NAME, PREFIX2, response2)

@app.get("/")
def Hello():
  return "Hello World!"

@app.post("/speechtotext/", response_model=SpeechToTextResponse)
async def speechToText():
    try:
        filename = "uservoice.mp3"
        filepath = f"{PREFIX2}{filename}"
        try:
            s3_client.download_file(BUCKET_NAME, filepath, filename)
        except ClientError as error:
            if error.response['Error']['Code'] == "404":
                raise HTTPException(status_code=404, detail="File not found")
            else:
                raise HTTPException(status_code=500, detail=str(error))    

        with open(filename, 'rb') as audiofile:      
            # OpenAI Whisper API 호출
            response = ai_client.audio.transcriptions.create(
                model="whisper-1",
                file = audiofile,
            )

        # 텍스트 반환
        text = response.text
        return SpeechToTextResponse(msg=text)
    
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/texttospeech/")
async def textToSpeech(request: TextToSpeechResponse):
    try:
        # Amazon Polly 호출
        response = polly_client.synthesize_speech(
            Text=request.summary,
            OutputFormat='mp3',
            VoiceId="Seoyeon",
        )
        print(request)

        # 오디오 스트림을 파일로 저장
        audio_stream = response.get('AudioStream')
        if audio_stream:
            # 현재 날짜와 시간을 파일명에 추가
            filename = f"{request.date}_output.mp3"
            with open(filename, 'wb') as file:
                file.write(audio_stream.read())

            # s3에 업로드
            s3_client.upload_file(filename, BUCKET_NAME, f"{PREFIX1}{filename}")
            os.remove(filename)

            return {"message": "Text converted to speech successfully", "file": f"{filename}"}

    except (BotoCoreError, ClientError) as error:
        raise HTTPException(status_code=500, detail=str(error))

    return {"message": "Failed to convert text to speech"}
    
@app.get("/streamaudio/{date}")
async def streamAudio(date: str):
    try:
        filename = f"{date}_output.mp3"
        filepath = f"{PREFIX1}{date}_output.mp3"
        try:
            s3_client.download_file(BUCKET_NAME, filepath, filename)
        except ClientError as error:
            if error.response['Error']['Code'] == "404":
                raise HTTPException(status_code=404, detail="File not found")
            else:
                raise HTTPException(status_code=500, detail=str(error))    
        def iterfile():
            with open(filename, 'rb') as file:
                yield from file
        
        return StreamingResponse(iterfile(), media_type='audio/mpeg')

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

@app.post("/test")
async def test(request):
    print(request)
    return request

if __name__ == '__main__' :
  uvicorn.run(app, host="0.0.0.0", port=3000)