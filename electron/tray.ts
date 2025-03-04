import {
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  nativeImage,
  Tray
} from 'electron'

import packageJson from '../package.json'

export function createTray(win: BrowserWindow, trayIconPath: string) {
  const tray = new Tray(nativeImage.createFromPath(trayIconPath))

  tray.setToolTip(packageJson.name)

  const menu: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: 'Open',
      click: () => {
        win.show()
        win.setSkipTaskbar(false)
      }
    },
    {
      label: 'Exit',
      click: () => {
        win.destroy()
      }
    }
  ]

  tray.setContextMenu(Menu.buildFromTemplate(menu))

  tray.on('click', () => {
    win.show()
    win.setSkipTaskbar(false)
  })
}
