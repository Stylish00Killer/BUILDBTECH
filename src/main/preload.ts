import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  platform: process.platform
});

export type ElectronAPI = {
  getAppPath: () => Promise<string>;
  platform: string;
};
