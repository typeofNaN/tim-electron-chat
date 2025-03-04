import dayjs from 'dayjs'

/**
 * 将日期格式化为指定格式的字符串
 * @param time 要格式化的Date对象
 * @param format 日期格式字符串，默认为'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @example
 * formatterTime(new Date(), 'YYYY-MM-DD') // '2024-01-01'
 * formatterTime(new Date(), 'HH:mm:ss') // '12:00:00'
 * formatterTime(null) // ''
 */
export function formatterTime(time: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!time) {
    return ''
  }
  return dayjs(time).format(format)
}

/**
 * 格式化聊天最后消息时间的时间戳
 * 如果消息是今天的，返回HH:mm格式的时间
 * 如果消息是其他天的，返回YY/M/D格式的日期
 * @param timestamp 毫秒级时间戳
 * @returns 格式化后的时间字符串
 */
export function formatterChatLastMsgTime(timestamp: number): string {
  // 获取今天的日期，格式为YY/M/D
  const todayStr = dayjs().format('YY/M/D')
  // 获取消息的日期，格式为YY/M/D
  const dayStr = dayjs(timestamp).format('YY/M/D')

  // 如果消息是今天的，只返回时间
  if (todayStr === dayStr) {
    return dayjs(timestamp).format('HH:mm')
  }

  // 否则返回日期
  return dayStr
}

/**
 * 将生日数字格式化为 'YYYY-MM-DD' 格式的字符串
 * @param birthday 8位数字格式的生日，如20230915表示2023年09月15日
 * @returns 格式化后的生日字符串，如'2023-09-15'
 * @example
 * formatterBirthday(20230915) // '2023-09-15'
 */
export function formatterBirthday(birthday: number): string {
  // 转为字符串便于截取
  const birthdayStr = String(birthday)

  // 分别截取年月日并用'-'连接
  const year = birthdayStr.slice(0, 4)
  const month = birthdayStr.slice(4, 6)
  const day = birthdayStr.slice(6, 8)

  return `${year}-${month}-${day}`
}

/**
 * 将毫秒级时间戳格式化为 'YYYY/MM/DD' 格式的日期字符串
 * @param timestamp 毫秒级时间戳
 * @returns 格式化后的日期字符串，如'2023/09/15'
 * @example
 * formatterTimestamp(1694764800000) // '2023/09/15'
 */
export function formatterTimestamp(timestamp: number): string {
  if (!timestamp) {
    return ''
  }
  return dayjs(timestamp).format('YYYY/MM/DD')
}
