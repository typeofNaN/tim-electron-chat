import path from 'path'

import { app, BrowserWindow, shell } from 'electron'
import Log from 'electron-log'

import { ipcEventHandle, windowEventHandle } from './event'
import { createTray } from './tray'
import { getServiceEnvConfig } from '../.env-config'
import checkForUpdates from './updater'

Log.transports.file.level = 'debug'
Log.transports.console.level = 'debug'
Log.transports.file.fileName = 'log.log'
Log.transports.file.maxSize = 1048576

const TimMain = require('im_electron_sdk/dist/main')

new TimMain({
  sdkappid: getServiceEnvConfig(process.env as ImportMetaEnv).imSdkAppId
})

const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    width: 1000,
    height: 720,
    minWidth: 1000,
    minHeight: 720,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      // 允许渲染进程使用node
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false
    },
    icon: path.join(__dirname, '../src/assets/images/logo.png')
  })

  require('@electron/remote/main').enable(win.webContents)

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  let trayIconPath = ''

  // app.isPackaged 字段存在bug，即使正常打包后，仍然为false，所以不能用来判断项目是否经过打包
  if (process.env.NODE_ENV === 'development') {
    // 开发环境
    // process.env.VITE_DEV_SERVER_URL获取开发服务器的url
    // vite版本不同，VITE_DEV_SERVER_URL字段也有所变化，打印process.env查找具体的名称
    win.loadURL(process.env.VITE_DEV_SERVER_URL as string)
    trayIconPath = path.join(__dirname, '../electron-build/logo.png')
  } else {
    // 生产环境
    win.loadFile(path.join(__dirname, '../dist/index.html'))
    trayIconPath = path.join(path.dirname(app.getPath('exe')), 'resources/electron-build/logo.png')
    win.removeMenu()
  }

  windowEventHandle(win)

  ipcEventHandle(win)

  checkForUpdates(win)

  createTray(win, trayIconPath)
}

app.setAppUserModelId('TimElectronChat')

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})