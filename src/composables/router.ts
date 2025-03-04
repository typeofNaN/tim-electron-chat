import { useRouter, type RouteLocationRaw } from 'vue-router'

import { router as globalRouter, routeName } from '@/router'

/**
 * @description 路由跳转
 * @param { boolean } inSetup - 是否在vue页面/组件的setup里面调用，在axios里面无法使用useRouter和useRoute
 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter
  const route = globalRouter.currentRoute

  /**
   * @description路由跳转
   * @param { RouteLocationRaw } to - 需要跳转的路由
   * @param { boolean } newTab - 是否在新的浏览器Tab标签打开
   */
  function routerPush(to: RouteLocationRaw, newTab = false) {
    if (newTab) {
      const routerData = router.resolve(to)
      window.open(routerData.href, '_blank')
      return Promise.resolve()
    }
    return router.push(to)
  }

  /**
   * @description 返回上一级路由
   */
  function routerBack() {
    router.go(-1)
  }

  /**
   * @description 跳转首页
   * @param { boolean } newTab - 在新的浏览器标签打开
   */
  function toHome(newTab = false) {
    routerPush({ name: routeName('root') }, newTab)
  }

  /**
   * @description 跳转登录页面
   * @param { UnionKey.LoginModule } loginModule - 展示的登录模块
   * @param { string } redirectUrl - 重定向地址(登录成功后跳转的地址),默认undefined表示取当前地址为重定向地址
   */
  function toLogin(loginModule?: UnionKey.LoginModule, redirectUrl?: string) {
    const module: UnionKey.LoginModule = loginModule || 'sign-login'
    const routeLocation: RouteLocationRaw = {
      name: routeName('login'),
      params: { module }
    }
    const redirect = redirectUrl || route.value.fullPath
    Object.assign(routeLocation, { query: { redirect } })
    routerPush(routeLocation)
  }

  /**
   * @description 登录页切换其他模块
   * @param { UnionKey.LoginModule } module - 切换后的登录模块
   */
  function toLoginModule(module: UnionKey.LoginModule) {
    const { query } = route.value
    routerPush({ name: routeName('login'), params: { module }, query })
  }

  /**
   * @description 登录成功后跳转重定向的地址
   */
  function toLoginRedirect() {
    const { query } = route.value
    if (query?.redirect) {
      routerPush(query.redirect as string)
    } else {
      toHome()
    }
  }

  return {
    routerPush,
    routerBack,
    toHome,
    toLogin,
    toLoginModule,
    toLoginRedirect
  }
}
