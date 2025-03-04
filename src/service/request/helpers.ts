import type { AxiosRequestConfig } from 'axios'

import { $t } from '@/locales'
import { useAuthStore } from '@/store'
// import { localStg } from '@/utils'
// import { AuthApi } from '../api'

/**
 * @description 刷新token
 * @param { AxiosRequestConfig } axiosConfig - token失效时的请求配置
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const { resetAuthStore } = useAuthStore()
  console.log(axiosConfig)
  // const refreshToken = localStg.get('refreshToken') || ''
  // const { data } = await AuthApi.fetchUpdateToken(refreshToken)
  // if (data) {
  //   localStg.set('token', data.token)
  //   localStg.set('refreshToken', data.refreshToken)

  //   const config = { ...axiosConfig }
  //   if (config.headers) {
  //     config.headers.Authorization = data.token
  //   }
  //   return config
  // }
  window.$message?.warning($t('tip.tokenExpire'))

  resetAuthStore()
  return null
}
