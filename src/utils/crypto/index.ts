import CryptoJS from 'crypto-js'

const CryptoSecret = '__CryptoJS_Secret__'

/**
 * @description 加密数据
 * @param { any } data - 数据
 */
export function encrypt(data: any) {
  const newData = JSON.stringify(data)
  return CryptoJS.AES.encrypt(newData, CryptoSecret).toString()
}

/**
 * @description 解密数据
 * @param { string } cipherText - 密文
 */
export function decrypt(cipherText: string) {
  const bytes = CryptoJS.AES.decrypt(cipherText, CryptoSecret)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  if (originalText) {
    return JSON.parse(originalText)
  }
  return null
}

export function md5(text: string) {
  return CryptoJS.MD5(text).toString()
}