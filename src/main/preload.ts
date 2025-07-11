// preload.ts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import Store from 'electron-store';

export type Channels = 'ipc-example';

const store = new Store();

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },

  //todo like state manager
  store: {
    get: (key: string) => store.get(key),
    set: (key: string, value: any) => store.set(key, value),
    delete: (key: string) => store.delete(key),
  },

  // system: {
  //   getGpuInfo: (callback: (gpuInfo: { model: string; memory: number }) => void) => {
  //     ipcRenderer.once('system:getGpuInfo:response', (_e, data) => callback(data));
  //     ipcRenderer.send('system:getGpuInfo');
  //   },
  //   getLocalIp: () => ipcRenderer.invoke('system:getLocalIp'),
  // },

};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;