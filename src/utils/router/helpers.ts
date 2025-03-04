/**
 * @description 获取所有固定路由的名称集合
 * @param { AuthRoute.Route[] } routes - 固定路由
 */
export function getConstantRouteNames(routes: AuthRoute.Route[]) {
  return routes.map(route => getConstantRouteName(route)).flat(1)
}

/**
 * @description 获取所有固定路由的名称集合
 * @param { AuthRoute.Route } route - 固定路由
 */
function getConstantRouteName(route: AuthRoute.Route) {
  const names = [route.name]
  if (route.children?.length) {
    names.push(...route.children!.map(item => getConstantRouteName(item)).flat(1))
  }
  return names
}
