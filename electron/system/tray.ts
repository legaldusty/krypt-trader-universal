import { app, Menu, Tray, nativeImage } from 'electron';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

let tray: Tray | null = null;

interface TrayHandlers {
  openWindow: () => void;
  toggleTrading: () => void;
  isTrading: () => boolean;
  quit: () => void;
}

function iconPath(): string {
  const ico = process.platform === 'darwin' ? 'krypt.png' : 'krypt.ico';
  const candidates = [
    app.isPackaged
      ? join(process.resourcesPath, 'app.asar.unpacked', 'resources', ico)
      : join(process.cwd(), 'resources', ico),
    app.isPackaged
      ? join(process.resourcesPath, ico)
      : join(process.cwd(), 'resources', ico),
    join(__dirname, '..', 'resources', ico),
    join(__dirname, '..', 'resources', 'krypt.png'),
    join(process.cwd(), 'resources', 'krypt.png'),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return candidates[candidates.length - 1];
}

export function installTray(handlers: TrayHandlers): Tray {
  if (tray && !tray.isDestroyed()) return tray;
  let img = nativeImage.createFromPath(iconPath());
  if (!img.isEmpty() && process.platform === 'darwin') {
    img = img.resize({ width: 18, height: 18 });
  }
  tray = new Tray(img.isEmpty() ? nativeImage.createEmpty() : img);
  tray.setToolTip('Krypt Trader');
  tray.on('click', () => handlers.openWindow());
  tray.on('double-click', () => handlers.openWindow());
  rebuild(handlers);
  return tray;
}

export function rebuild(handlers: TrayHandlers): void {
  if (!tray) return;
  const trading = handlers.isTrading();
  const menu = Menu.buildFromTemplate([
    { label: 'Open Krypt Trader', click: () => handlers.openWindow() },
    { type: 'separator' },
    {
      label: trading ? 'Pause Trading' : 'Resume Trading',
      click: () => handlers.toggleTrading(),
    },
    { type: 'separator' },
    { label: 'Quit', click: () => handlers.quit() },
  ]);
  tray.setContextMenu(menu);
}

export function destroyTray(): void {
  if (tray && !tray.isDestroyed()) tray.destroy();
  tray = null;
}
