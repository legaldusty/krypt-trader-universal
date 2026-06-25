import { app } from 'electron';

export function setStartWithWindows(enabled: boolean): void {
  if (process.platform !== 'win32' && process.platform !== 'darwin') return;
  try {
    if (enabled) {
      if (process.platform === 'darwin') {
        app.setLoginItemSettings({ openAtLogin: true, openAsHidden: true });
      } else {
        app.setLoginItemSettings({
          openAtLogin: true,
          path: process.execPath,
          args: ['--autostart'],
        });
      }
    } else {
      app.setLoginItemSettings({ openAtLogin: false });
    }
  } catch {
  }
}
