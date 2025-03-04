import fs from 'fs'
import path from 'path'

import imageSize from 'image-size'

const ffmpegPath = require('@ffmpeg-installer/ffmpeg')
ffmpegPath.path = ffmpegPath.path.replace('app.asar', 'app.asar.unpacked')
const ffprobePath = require('@ffprobe-installer/ffprobe')
ffprobePath.path = ffprobePath.path.replace('app.asar', 'app.asar.unpacked')
const ffmpeg = require('fluent-ffmpeg')

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

export const videoExt = ['WMV', 'RM', 'MOV', 'MPEG', 'MP4', '3GP', 'FLV', 'AVI', 'RMVB', 'TS', 'ASF', 'MPG', 'WEBM', 'MKV ', 'M3U8', 'WM', 'ASX', 'RAM', 'MPE', 'VOB', 'DAT', 'MP4V', 'M4V', 'F4V', 'MXF', 'QT', 'OGG']

/**
 * @description 获取文件字节大小
 * @param filePath 文件路径
 */
export function getFileByteSize(filePath: string) {
  try {
    const data = fs.statSync(filePath)
    return data.size
  } catch (err) {
    return 0
  }
}

/**
 * @description 获取图片宽高
 * @param filePath 文件路径
 */
export function getImageInfo(filePath: string) {
  try {
    const { width, height, type } = imageSize(filePath)
    return { width, height, type }
  } catch (err) {
    return {
      width: 0,
      height: 0,
      type: null
    }
  }
}

/**
 * @description 获取视频文件宽高，时长
 * @param filePath 文件路径
 */
export function getVideoInfo(filePath: string) {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(filePath, (err: Error, metadata: any) => {
      if (err) {
        resolve(null)
      } else {
        resolve(metadata)
      }
    })
  })
}

/**
 * @description 从视频截取第一帧保存为图片
 * @param videoPath 视频文件路径
 * @param outputPath 输出图片路径
 */
export function extractFirstFrame(videoPath: string, outputPath: string) {
  return new Promise((resolve, reject) => {
    // 获取输出图片所在目录路径
    const outputDir = path.dirname(outputPath)
    // 如果输出目录不存在则创建
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }) // recursive:true 递归创建目录
    }

    // 使用ffmpeg处理视频
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [0], // 截取第一帧(0秒处)的画面
        folder: outputDir, // 输出目录
        filename: path.basename(outputPath), // 输出文件名
        count: 1 // 只截取1帧
      })
      .on('end', () => {
        // 处理完成时返回true
        resolve(true)
      })
      .on('error', (err: Error) => {
        // 发生错误时reject错误信息
        reject(err)
      })
  })
}

// 写入base64文件
/**
 * @description 将base64字符串保存为文件
 * @param base64 base64编码的字符串
 * @param outputPath 输出文件路径
 * @returns void
 */
export function saveBase64File(base64: string, outputPath: string): void {
  try {
    // 获取输出目录路径
    const outputDir = path.dirname(outputPath)

    // 如果输出目录不存在则创建
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }) // recursive:true 递归创建目录
    }

    // 移除base64字符串中的前缀部分
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')

    // 将base64内容写入文件
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(outputPath, buffer)
  } catch (error) {
    console.error('Failed to save base64 file:', error)
    throw error
  }
}

/**
 * @description 格式化文件内存大小
 * @param size 内存大小
 */
export function formatFileByteSize(size: number) {
  if (!size) {
    return '0kb'
  }
  return ~~(size / 1024) + 'kb'
}