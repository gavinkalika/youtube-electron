from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from services.youtube import get_video

load_dotenv()

app = FastAPI(title="YouTube API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/video/{video_id}")
async def fetch_video(video_id: str):
    result = get_video(video_id)
    return result.to_dict()


@app.get("/health")
async def health():
    return {"status": "ok"}
