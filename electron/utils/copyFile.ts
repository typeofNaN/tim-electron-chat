import fs from 'fs'
import { exec } from 'child_process'

import { clipboard } from 'electron'

/**
 * 复制文件到剪贴板
 * @param filePath 文件路径
 * @returns void
 */
export function copyFile(filePath: string): void {
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error('File does not exist:', filePath)
    return
  }

  try {
    // 根据操作系统执行不同的复制逻辑
    if (process.platform === 'darwin') {
      copyFileOnMac(filePath)
    } else if (process.platform === 'win32') {
      copyFileOnWin(filePath)
    } else {
      // Linux等其他系统
      clipboard.writeBuffer('FileNameW', Buffer.from(filePath, 'utf16le'))
    }
  } catch (error) {
    console.error('Failed to copy file:', error)
  }
}

/**
 * Windows系统下复制文件
 * @param filePath 文件路径
 */
function copyFileOnWin(filePath: string): void {
  const scriptStr = `powershell -Command "& {Set-Clipboard -Path '${filePath}'}"`
  exec(scriptStr, (error) => {
    if (error) {
      console.error('Failed to copy file on Windows:', error)
    }
  })
}

/**
 * Mac系统下复制文件
 * @param filePath 文件路径
 */
function copyFileOnMac(filePath: string): void {
  const scriptStr = `osascript -e 'set the clipboard to POSIX file "${filePath}"'`
  exec(scriptStr, (error) => {
    if (error) {
      console.error('Failed to copy file on Mac:', error)
    }
  })
}
