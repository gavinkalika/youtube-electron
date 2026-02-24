import type { Video } from '../types/video';

export interface ApiResult {
  ok: boolean;
  value?: Video;
  error?: string;
}

// Type for the API function - allows dependency injection
export type GetVideoFn = (videoId: string) => Promise<ApiResult>;

export async function getVideo(videoId: string): Promise<ApiResult> {
  const response = await fetch(`/api/video/${videoId}`);
  return response.json();
}
