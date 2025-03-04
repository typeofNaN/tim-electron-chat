/**
 * @description 根据数字获取对应的汉字
 * @param { number } num - 数字(0-10)
 */
export function getHanByNumber(num: number) {
  const HAN_STR = '零一二三四五六七八九十'
  return HAN_STR.charAt(num)
}

/**
 * @description 将总秒数转换成 分：秒
 * @param { number } seconds - 秒
 */
export function transformToTimeCountDown(seconds: number) {
  const SECONDS_A_MINUTE = 60
  function fillZero(num: number) {
    return num.toString().padStart(2, '0')
  }
  const minuteNum = Math.floor(seconds / SECONDS_A_MINUTE)
  const minute = fillZero(minuteNum)
  const second = fillZero(seconds - minuteNum * SECONDS_A_MINUTE)
  return `${minute}: ${second}`
}

/**
 * @description 获取指定整数范围内的随机整数
 * @param { number } start - 开始范围
 * @param { number } end - 结束范围
 */
export function getRandomInteger(end: number, start = 0) {
  const range = end - start
  const random = Math.floor(Math.random() * range + start)
  return random
}
