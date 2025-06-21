import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  shell
} from 'electron'
import { v4 as uuidV4 } from 'uuid'

import checkForUpdates from './updater'
import {
  extractFirstFrame,
  getFileByteSize,
  getImageInfo,
  getVideoInfo,
  saveBase64File
} from './utils/getFileInfo'
import { copyFile } from './utils/copyFile'
import { downloadFile } from './utils/downloadFile'
import packageJson from '../package.json'

let callWindow: BrowserWindow | null = null
let mediaPreviewWindow: BrowserWindow | null = null

// 窗口事件处理
export const windowEventHandle = (win: BrowserWindow) => {
  // 窗口准备好时显示
  win.on('ready-to-show', () => {
    win.show()
    checkForUpdates(win)
  })

  // 窗口最大化时发送消息
  win.on('maximize', () => {
    win.webContents.send('maximize')
  })

  // 窗口取消最大化时发送消息
  win.on('unmaximize', () => {
    win.webContents.send('unmaximize')
  })

  // 窗口关闭时隐藏任务栏
  win.on('close', (event) => {
    event.preventDefault()
    win.hide()
    win.setSkipTaskbar(true)
  })
}

const callWindowEventHandle = (win: BrowserWindow) => {
  win.on('ready-to-show', () => {
    win.show()
  })

  win.on('close', (event) => {
    callWindow = null
  })
}

const mediaPreviewWindowEventHandle = (win: BrowserWindow, data: any) => {
  win.on('ready-to-show', () => {
    win.show()
    setTimeout(() => {
      win.webContents.send('showPreview', data)
    }, 150)
  })

  win.on('close', (event) => {
    mediaPreviewWindow = null
  })
}

// IPC事件处理
export const ipcEventHandle = (win: BrowserWindow) => {
  // 启动IM
  ipcMain.once('setupIM', (event, sdkappid) => {
    const TimMain = require('im_electron_sdk/dist/main')
    new TimMain({ sdkappid })
  })

  // 打开文件所在目录
  ipcMain.on('openDir', (event, filePath) => {
    shell.showItemInFolder(filePath)
  })

  // 在浏览器中打开URL
  ipcMain.on('openBrowser', (event, url) => {
    shell.openExternal(url)
  })

  // 处理文件下载
  ipcMain.on('downloadFile', (event, downloadOptions) => {
    const ext = path.extname(downloadOptions.fileName)
    // 设置文件过滤器
    const filters = [
      {
        name: '*',
        extensions: ['*']
      }
    ]
    // 如果有文件扩展名,添加到过滤器
    if (ext && ext !== '.') {
      filters.unshift({
        name: '',
        extensions: [(ext.match(/[a-zA-Z0-9]+$/) as string[])[0]]
      })
    }

    // 打开或下载文件
    const openOrDownload = (savePath: string) => {
      if (fs.existsSync(savePath)) {
        // 如果文件已存在且需要打开,则直接打开
        if (downloadOptions.openFile) {
          shell.openPath(savePath)
        }
      } else {
        downloadFile(downloadOptions.downloadPath, savePath)
          .then(filePath => {
            if (downloadOptions.openFile) {
              shell.openPath(filePath)
            }
          })
          .catch(err => {
            console.error('Failed to download file:', err)
          })
      }
    }

    if (downloadOptions.customSavePath) {
      // 如果需要自定义保存路径,显示保存对话框
      dialog.showSaveDialog(win, {
        filters,
        defaultPath: downloadOptions.fileId
      })
        .then(result => {
          openOrDownload(result.filePath)
        })
        .catch(() => { })
    } else {
      // 否则使用默认下载路径
      const savePath = path.join(app.getPath('downloads')) + '/' + downloadOptions.fileId
      openOrDownload(savePath)
    }
  })

  // 复制文件
  ipcMain.on('copyFile', (event, data) => {
    const savePath = path.join(app.getPath('documents'), `/${packageJson.name}/${data.userId}/${data.convId}/copy-temp/${data.fileId}`)
    if (fs.existsSync(savePath)) {
      copyFile(savePath)
    } else {
      downloadFile(data.downloadPath, savePath)
        .then(filePath => {
          copyFile(filePath)
        })
        .catch(err => {
          console.error('Failed to download file:', err)
        })
    }
  })

  // 监听视频上传消息事件
  ipcMain.on('uploadVideoMsg', (event, data) => {
    // 生成视频截图保存路径，使用临时目录+唯一ID
    const outputPath = path.join(app.getPath('documents'), `/${packageJson.name}/${data.userId}/${data.convId}/video-screenshot/${uuidV4()}.png`)

    // 从视频中提取第一帧作为封面图
    extractFirstFrame(data.filePath, outputPath)
      .then(async () => {
        const imageInfo = await getImageInfo(outputPath)
        // 提取成功后返回视频信息
        event.reply('videoMsgInfoRes', {
          convId: data.convId, // 会话ID
          videoInfo: await getVideoInfo(data.filePath), // 获取视频元信息(宽高、时长等)
          imageInfo: {
            path: outputPath, // 封面图路径
            width: imageInfo.width, // 封面图宽度
            height: imageInfo.height, // 封面图高度
            type: imageInfo.type, // 封面图类型
            size: getFileByteSize(outputPath) // 封面图大小
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
  })

  // 保存base64图片文件到临时文件夹
  ipcMain.on('saveBase64ImageFile', (event, data) => {
    const outputPath = path.join(app.getPath('documents'), `/${packageJson.name}/${data.userId}/${data.convId}/temp-file/${uuidV4()}.${data.fileType}`)
    saveBase64File(data.base64, outputPath)
    event.reply('saveBase64ImageFileRes', {
      path: outputPath
    })
  })

  // 截图
  ipcMain.on('captureScreen', async (event, data) => {
    if (process.platform === 'win32') {
      // exec('snippingtool.exe')
      exec('powershell -Command "Start-Process snippingtool"')
    }
  })

  // 创建音视频通话
  ipcMain.on('createCallWindow', (event, data) => {
    if (callWindow) {
      return
    }

    callWindow = new BrowserWindow({
      show: false,
      width: 360,
      height: 600,
      minWidth: 360,
      minHeight: 600,
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

    require('@electron/remote/main').enable(callWindow.webContents)

    callWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // app.isPackaged 字段存在bug，即使正常打包后，仍然为false，所以不能用来判断项目是否经过打包
    if (process.env.NODE_ENV === 'development') {
      // 开发环境
      // process.env.VITE_DEV_SERVER_URL获取开发服务器的url
      // vite版本不同，VITE_DEV_SERVER_URL字段也有所变化，打印process.env查找具体的名称
      callWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string + '#/call-chat')
    } else {
      // 生产环境
      callWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
        hash: 'call-chat'
      })
      callWindow.removeMenu()
    }

    callWindowEventHandle(callWindow)
  })

  // 创建图片预览窗口
  ipcMain.on('createMediaPreviewWindow', (event, data) => {
    if (!mediaPreviewWindow) {
      mediaPreviewWindow = new BrowserWindow({
        show: false,
        width: 900,
        height: 600,
        minWidth: 900,
        minHeight: 600,
        frame: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
          height: 30,
          color: '#fff'
        },
        webPreferences: {
          // 允许渲染进程使用node
          contextIsolation: false,
          nodeIntegration: true,
          webSecurity: false
        },
        icon: path.join(__dirname, '../src/assets/images/logo.png')
      })

      require('@electron/remote/main').enable(mediaPreviewWindow.webContents)

      mediaPreviewWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
      })

      // app.isPackaged 字段存在bug，即使正常打包后，仍然为false，所以不能用来判断项目是否经过打包
      if (process.env.NODE_ENV === 'development') {
        // 开发环境
        // process.env.VITE_DEV_SERVER_URL获取开发服务器的url
        // vite版本不同，VITE_DEV_SERVER_URL字段也有所变化，打印process.env查找具体的名称
        mediaPreviewWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string + '#/media-preview')
      } else {
        // 生产环境
        mediaPreviewWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
          hash: 'media-preview'
        })
        mediaPreviewWindow.removeMenu()
      }

      mediaPreviewWindowEventHandle(mediaPreviewWindow, data)
    }

    mediaPreviewWindow.webContents.send('showPreview', data)
  })

  // 闪烁窗口
  ipcMain.on('toggleFlashFrame', (event, isFlashFrame) => {
    win.flashFrame(isFlashFrame)
    win.once('focus', () => {
      win.flashFrame(false)
    })
  })

  // 显示窗口
  ipcMain.on('showWindow', () => {
    win.show()
  })

  // 置顶窗口
  ipcMain.on('toggleTopUp', (event, isTopUp) => {
    win.setAlwaysOnTop(isTopUp)
  })

  // 最小化窗口
  ipcMain.on('minimizeApp', () => {
    win.minimize()
  })

  // 最大化/还原窗口
  ipcMain.on('maximizeApp', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  // 关闭应用
  ipcMain.on('closeApp', (event, type) => {
    switch (type) {
      case 'mini': {
        win.minimize() // 最小化
        break
      }
      case 'exit': {
        win.close() // 关闭
        break
      }
    }
  })

  // 检查更新
  ipcMain.on('checkUpdate', () => {
    checkForUpdates(win)
  })

  // 置顶音视频窗口
  ipcMain.on('toggleCallChatTopUp', (event, isTopUp) => {
    callWindow?.setAlwaysOnTop(isTopUp)
  })

  // 最小化音视频窗口
  ipcMain.on('minimizeCallChat', () => {
    callWindow?.minimize()
  })

  // 最大化/还原音视频窗口
  ipcMain.on('maximizeCallChat', () => {
    if (callWindow?.isMaximized()) {
      callWindow?.unmaximize()
    } else {
      callWindow?.maximize()
    }
  })

  // 关闭音视频窗口
  ipcMain.on('closeCallChat', (event, type) => {
    switch (type) {
      case 'mini': {
        callWindow?.minimize() // 最小化
        break
      }
      case 'exit': {
        callWindow?.close() // 关闭
        callWindow = null
        break
      }
    }
  })

  // 请求关闭音视频通话
  ipcMain.on('requestExitCallRoom', () => {
    callWindow?.webContents.send('requestExitCallRoom')
  })

  // 退出音视频通话
  ipcMain.on('exitCallRoom', (event, data) => {
    win.webContents.send('exitCallRoom', data)
  })
}