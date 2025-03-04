import { emojiMap } from '@/constants/emojiMap'

/**
 * 将表情标签转换为表情图片的HTML标签
 * @param emojiTag 表情标签，如 [Smile]
 * @returns 表情图片的HTML标签字符串，如果没有对应的表情则返回原标签
 */
export function emojiTagToEmojiImg(emojiTag: string) {
  // 检查表情标签是否存在对应的表情图片
  if (emojiMap[emojiTag as keyof typeof emojiMap]) {
    // 获取表情图片的URL
    const imgSrc = emojiMap[emojiTag as keyof typeof emojiMap]
    // 返回表情图片的HTML标签
    return `<img src="${imgSrc}" alt="${emojiTag}" class="w-16px h-16px" draggable="false" />`
  }
  // 如果没有对应的表情图片，返回原标签
  return emojiTag
}

export function transformEmojiText(text: string) {
  const reg = new RegExp('\\[[a-zA-Z0-9_!！\\/ \\u4e00-\\u8fa5]+\\]', 'g')
  const textValue = text.replace(reg, (emojiStr: string) => {
    return emojiTagToEmojiImg(emojiStr)
  })
  return textValue
}