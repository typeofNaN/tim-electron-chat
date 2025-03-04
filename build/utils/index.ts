import path from 'path'

/**
 * @description 获取项目根路径，末尾不带斜杠
 */
export function getRootPath() {
  return path.resolve(process.cwd())
}

/**
 * @description 获取项目src路径，末尾不带斜杠
 * @param { string } srcName - src目录名称(默认: 'src')
 */
export function getSrcPath(srcName = 'src') {
  const rootPath = getRootPath()

  return `${rootPath}/${srcName}`
}
