import { request } from '@/service/request'

/**
 * @description TRTC Api
 */
export class TRTCApi {
  /**
   * @description 获取签名
   * @param { string } imUserId 用户ID
   */
  public static getSignature(imUserId: string) {
    return request.post<{ imUserId: string, userSig: string }>(
      '/imUser/temp/getUserSig',
      {
        imUserId
      }
    )
  }
}