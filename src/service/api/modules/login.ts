import { request } from '@/service/request'
import { sessionStg } from '@/utils'

/**
 * @description Login Api
 */
export class LoginApi {
  /**
   * @description 登录
   * @param { data } 登录的用户名、密码、验证码等信息
   */
  public static login(data: any) {
    return request.post<ApiAuth.Token>(
      '/login',
      data,
      {
        baseURL: sessionStg.get('envUrl') as string,
      }
    )
  }

  /**
   * @description 获取登录校验图片偏移量
   */
  public static getOffset() {
    return request.get<{ key: string, offset: number }>(
      '/getOffset',
      {
        baseURL: sessionStg.get('envUrl') as string
      }
    )
  }

  /**
   * @description 退出登录
   */
  public static logout() {
    return request.get<null>(
      '/logout',
      {
        baseURL: sessionStg.get('envUrl') as string
      }
    )
  }
}