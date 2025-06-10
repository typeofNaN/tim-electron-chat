import path from 'path'

import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import Log from 'electron-log'

autoUpdater.logger = Log
// @ts-ignore
autoUpdater.logger.transports.file.level = 'info'

const isDevelopment = process.env.NODE_ENV === 'development'

// 防止报错no such file or directory dev-app-update.yml
if (isDevelopment) {
  autoUpdater.updateConfigPath = path.join(__dirname, '../dev-app-update.yml')
}

export default (win: Electron.BrowserWindow) => {
  // 设置自动下载
  autoUpdater.autoDownload = false

  // 检测是否有新版本
  autoUpdater.checkForUpdates()

  autoUpdater.on('checking-for-update', () => {
    Log.info('获取版本信息')
  })

  autoUpdater.on('update-not-available', () => {
    Log.info('没有可更新版本')
    win.webContents.send('notNeedUpdate')
  })

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '软件更新',
      message: '发现新版本, 确定更新？',
      buttons: ['确定', '取消']
    }).then(res => {
      if (res.response == 0) {
        autoUpdater.downloadUpdate()
      }
    })
  })

  autoUpdater.on('download-progress', res => {
    Log.info('下载监听:' + res)
    win.webContents.send('downloadProgress', res)
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      title: '下载完成',
      message: '最新版本已下载完成, 退出程序进行安装！'
    }).then(() => {
      autoUpdater.quitAndInstall()
      win.destroy()
    })
  })
}