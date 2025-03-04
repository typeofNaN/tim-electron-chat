import fs from 'fs'
import path from 'path'
import https from 'https'

/**
 * 下载文件到指定路径
 * @param downloadPath - 文件下载URL
 * @param savePath - 文件保存路径
 * @returns Promise<string> - 返回保存的文件路径
 */
export function downloadFile(downloadPath: string, savePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // 创建临时目录,如果不存在则递归创建
      const tempDir = path.dirname(savePath)
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }

      // 创建写入流
      const fileStream = fs.createWriteStream(savePath)

      // 发起HTTPS请求下载文件
      const request = https.get(downloadPath, (response) => {
        // 检查响应状态码
        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status code: ${response.statusCode}`))
          return
        }

        // 将响应流导入文件写入流
        response.pipe(fileStream)

        // 文件写入完成时
        fileStream.on('finish', () => {
          fileStream.close()
          resolve(savePath)
        })
      })

      // 请求错误处理
      request.on('error', (err: Error) => {
        fs.unlink(savePath, () => {}) // 删除下载失败的临时文件
        reject(err)
        console.error('Failed to download file:', err)
      })

      // 写入流错误处理
      fileStream.on('error', (err: Error) => {
        fs.unlink(savePath, () => {}) // 删除下载失败的临时文件
        reject(err)
        console.error('Failed to write file:', err)
      })
    } catch (err) {
      reject(err)
      console.error('Failed to setup download:', err)
    }
  })
}