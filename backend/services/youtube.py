import os
from googleapiclient.discovery import build
from typing import TypedDict


class Video(TypedDict):
    title: str
    url: str


class Result:
    def __init__(self, ok: bool, value: Video | None = None, error: str | None = None):
        self.ok = ok
        self.value = value
        self.error = error

    def to_dict(self):
        if self.ok:
            return {"ok": True, "value": self.value}
        return {"ok": False, "error": self.error}


def get_video(video_id: str) -> Result:
    api_key = os.getenv("YOUTUBE_API_KEY")

    if not api_key:
        return Result(ok=False, error="YouTube API key not configured")

    try:
        youtube = build("youtube", "v3", developerKey=api_key)

        response = youtube.videos().list(
            part="snippet",
            id=video_id
        ).execute()

        items = response.get("items", [])

        if not items:
            return Result(ok=False, error="Video not found")

        video = items[0]
        title = video.get("snippet", {}).get("title")

        if not title:
            return Result(ok=False, error="Video title not available")

        return Result(
            ok=True,
            value={
                "title": title,
                "url": f"https://www.youtube.com/watch?v={video_id}"
            }
        )

    except Exception as e:
        return Result(ok=False, error=str(e))
