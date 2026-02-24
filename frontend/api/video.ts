import type { Video } from '../types/video';

interface ApiResult {
  ok: boolean;
  value?: Video;
  error?: string;
}

export async function getVideo(videoId: string): Promise<ApiResult> {
  const response = await fetch(`/api/video/${videoId}`);
  return response.json();
}
