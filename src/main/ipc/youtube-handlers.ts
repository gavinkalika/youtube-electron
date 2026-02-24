import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import { getVideo } from '../services/youtube-api';

export function registerYouTubeHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.YOUTUBE_GET_VIDEO, async (_, videoId: string) => {
    if (typeof videoId !== 'string' || videoId.trim() === '') {
      return { ok: false, error: 'Invalid video ID' };
    }

    return await getVideo(videoId.trim());
  });
}
