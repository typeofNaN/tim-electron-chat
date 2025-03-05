import fs from 'fs'
import path from 'path'

import { app, dialog, ipcMain, shell } from 'electron'
import { v4 as uuidV4 } from 'uuid'

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

// 窗口事件处理
export const windowEventHandle = (win: Electron.BrowserWindow) => {
  // 启动IM
  ipcMain.once('setupIM', (event, sdkappid) => {
    const TimMain = require('im_electron_sdk/dist/main')
    new TimMain({ sdkappid })
  })

  // 窗口准备好时显示
  win.on('ready-to-show', () => {
    win.show()
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

// IPC事件处理
export const ipcEventHandle = (win: Electron.BrowserWindow) => {
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

  // 闪烁窗口
  ipcMain.on('toggleFlashFrame', (event, isFlashFrame) => {
    win.flashFrame(isFlashFrame)
    win.once('focus', () => {
      win.flashFrame(false)
    })
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
}