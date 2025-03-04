declare namespace StorageInterface {
  /** localStorage的存储数据的类型 */
  interface Session {
    /** 主题颜色 */
    themeColor: string
    /** 主题配置 */
    themeSettings: Theme.Setting
    /** 环境URL */
    envUrl: string
  }

  /** localStorage的存储数据的类型 */
  interface Local {
    /** 用户token */
    token: string
    /** 用户刷新token */
    refreshToken: string
    /** 用户信息 */
    userInfo: Auth.UserInfo
    /** 多页签路由信息 */
    multiTabRoutes: App.GlobalTabRoute[]
    /** 本地语言缓存 */
    lang: I18nType.LangType
    /** IM用户ID */
    userID: string
    /** IM签名 */
    userSig: string
    /** 主题配置 */
    themeSettings: Theme.Setting
    /** 主题颜色 */
    themeColor: string
  }
}
