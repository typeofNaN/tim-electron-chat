import { mockRequest } from '../../request'

/**
 * @description AuthApi
 */
export class AuthApi {
  /**
   * @description 获取验证码
   * @param { string } phone - 手机号
   */
  public static fetchSmsCode(phone: string) {
    return mockRequest.post<boolean>(
      '/getSmsCode',
      {
        phone
      }
    )
  }

  /**
   * @description 登录
   * @param { string } userName - 用户名
   * @param { string } password - 密码
   */
  public static fetchLogin(userName: string, password: string) {
    return mockRequest.post<ApiAuth.Token>(
      '/login',
      {
        userName,
        password
      }
    )
  }

  /**
   * @description 获取用户信息
   */
  public static fetchUserInfo() {
    return mockRequest.get<ApiAuth.UserInfo>('/getUserInfo')
  }

  /**
   * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
   * @param { string } userId - 用户id
   */
  public static fetchUserRoutes(userId: string) {
    return mockRequest.post<ApiRoute.Route>(
      '/getUserRoutes',
      {
        userId
      }
    )
  }

  /**
   * @description 刷新token
   * @param { string } refreshToken
   */
  public static fetchUpdateToken(refreshToken: string) {
    return mockRequest.post<ApiAuth.Token>(
      '/updateToken',
      {
        refreshToken
      }
    )
  }
}