import { google } from 'googleapis';
import type { Video } from '../../shared/types/video';

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const youtube = google.youtube('v3');

export async function getVideo(videoId: string): Promise<Result<Video>> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return { ok: false, error: 'YouTube API key not configured' };
  }

  try {
    const response = await youtube.videos.list({
      key: apiKey,
      part: ['snippet'],
      id: [videoId],
    });

    const items = response.data.items;

    if (!items || items.length === 0) {
      return { ok: false, error: 'Video not found' };
    }

    const video = items[0];
    const title = video.snippet?.title;

    if (!title) {
      return { ok: false, error: 'Video title not available' };
    }

    return {
      ok: true,
      value: {
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { ok: false, error: message };
  }
}
