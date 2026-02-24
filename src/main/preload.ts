import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import type { Video } from '../shared/types/video';

export interface ElectronAPI {
  getVideo: (videoId: string) => Promise<{ ok: true; value: Video } | { ok: false; error: string }>;
}

contextBridge.exposeInMainWorld('electronAPI', {
  getVideo: (videoId: string) => ipcRenderer.invoke(IPC_CHANNELS.YOUTUBE_GET_VIDEO, videoId),
} satisfies ElectronAPI);
