import { nextTick, unref } from 'vue'
import { defineStore } from 'pinia'
import { md5 } from '@/utils/crypto'

import { useRouterPush } from '@/composables'
import { $t } from '@/locales'
import { router } from '@/router'
import { AuthApi, LoginApi } from '@/service'
import { localStg } from '@/utils'
import { useTabStore } from '../tab'
import { useRouteStore } from '../route'
import { clearAuthStorage, getToken, getUserInfo } from './helpers'

interface AuthState {
  /** 用户信息 */
  // userInfo: Auth.UserInfo
  userInfo: any
  /** 用户token */
  token: string
  /** 登录的加载状态 */
  loginLoading: boolean
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfo: getUserInfo(),
    token: getToken(),
    loginLoading: false
  }),
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token)
    }
  },
  actions: {
    /** 重置auth状态 */
    async resetAuthStore() {
      const { data, error } = await LoginApi.logout()
      if (data === null && error === null) {
        const { toLogin } = useRouterPush(false)
        const { resetTabStore } = useTabStore()
        const { resetRouteStore } = useRouteStore()
        const route = unref(router.currentRoute)

        clearAuthStorage()
        this.$reset()

        if (route.meta.requiresAuth) {
          toLogin()
        }

        nextTick(() => {
          resetTabStore()
          resetRouteStore()
        })
      }
    },
    /**
     * @description 处理登录后成功或失败的逻辑
     * @param { ApiAuth.Token } backendToken - 返回的token
     */
    async handleActionAfterLogin(backendToken: ApiAuth.Token) {
      const route = useRouteStore()
      const { toLoginRedirect } = useRouterPush(false)

      const loginSuccess = await this.loginByToken(backendToken)

      if (loginSuccess) {
        await route.initAuthRoute()

        // 跳转登录后的地址
        toLoginRedirect()

        // 登录成功弹出欢迎提示
        if (route.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName: this.userInfo.nickname }),
            duration: 3000
          })
        }

        return
      }

      // 不成功则重置状态
      this.resetAuthStore()
    },
    /**
     * @description 根据token进行登录
     * @param { any } backendToken - 返回的token
     */
    async loginByToken(backendToken: any) {
      let successFlag = false

      // 先把token存储到缓存中(后面接口的请求头需要token)
      const { token, partyVO } = backendToken
      localStg.set('token', token)
      // localStg.set('refreshToken', refreshToken)

      // 获取用户信息
      // 成功后把用户信息存储到缓存中
      localStg.set('userInfo', partyVO)

      // 更新状态
      this.userInfo = partyVO
      this.token = token

      successFlag = true

      return successFlag
    },
    /**
     * @description 登录
     * @param { string } account - 用户名
     * @param { string } password - 密码
     */
    async login(loginInfo: any) {
      this.loginLoading = true
      const { account, password, offset, imgValidKey } = loginInfo
      const { data: loginResData } = await LoginApi.login({
        account,
        password: md5(password.trim() + account.trim()),
        offset,
        key: imgValidKey
      })
      // const { data } = await AuthApi.fetchLogin(account, password)
      if (loginResData) {
        await this.handleActionAfterLogin(loginResData)
      }
      this.loginLoading = false
    },
    /**
     * @description 更换用户权限(切换账号)
     * @param { Auth.RoleType } userRole
     */
    async updateUserRole(userRole: Auth.RoleType) {
      const { resetRouteStore, initAuthRoute } = useRouteStore()

      const accounts: Record<Auth.RoleType, { userName: string; password: string }> = {
        super: {
          userName: 'Super',
          password: 'super123'
        },
        admin: {
          userName: 'Admin',
          password: 'admin123'
        },
        user: {
          userName: 'User01',
          password: 'user01123'
        }
      }
      const { userName, password } = accounts[userRole]
      const { data } = await AuthApi.fetchLogin(userName, password)
      if (data) {
        await this.loginByToken(data)
        resetRouteStore()
        initAuthRoute()
      }
    }
  }
})
