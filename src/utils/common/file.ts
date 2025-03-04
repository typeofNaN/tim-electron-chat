/**
 * 将文件转换为Base64编码的字符串
 * @param file 要转换的文件对象
 * @returns Promise对象，resolve时返回Base64编码的字符串
 */
export function getFileBase64Data(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    // 监听读取完成事件
    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    })

    // 监听读取错误事件
    reader.addEventListener('error', () => {
      reject(new Error('Failed to read file'))
    })

    // 开始读取文件
    reader.readAsDataURL(file)
  })
}

/**
 * 获取文件扩展名
 * @param fileName 文件名
 * @returns 文件扩展名,如果没有扩展名则返回undefined
 */
export function getFileExt(fileName: string): string | undefined {
  return fileName.split('.').pop()?.toLowerCase()
}

/**
 * 将文件大小转换为人类可读的格式
 * @param size 文件大小(字节)
 * @returns 格式化后的文件大小字符串,如"1.23 MB"
 */
export function getFileSize(size: number): string {
  // 文件大小单位数组
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let convertedSize = size

  // 当文件大小大于等于1024且未达到最大单位时,继续转换
  while (convertedSize >= 1024 && unitIndex < units.length - 1) {
    convertedSize /= 1024
    unitIndex++
  }

  // 保留两位小数并拼接单位
  return `${convertedSize.toFixed(2)} ${units[unitIndex]}`
}
