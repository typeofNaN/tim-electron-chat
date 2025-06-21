<template>
  <div class="relative flex-center gap-40px wh-full">
    <div class="absolute top-0px left-140px right-220px h-70px" style="-webkit-app-region: drag;" />
    <dark-mode-switch :dark="theme.darkMode" class="absolute left-48px top-24px z-3 text-20px"
      @update:dark="theme.setDarkMode" />
    <div class="absolute left-88px top-24px z-3 cursor-pointer">
      <n-dropdown :options="options" trigger="hover" :value="language" @select="handleSelect">
        <icon-cil:language class="text-22px outline-transparent" />
      </n-dropdown>
    </div>
    <div class="absolute right-28px top-24px z-3">
      <app-ctrl />
    </div>
    <div class="w-400px text-center">
      <h2 class="mb-20px text-20px font-medium">IM Electron Chat 即时通讯</h2>
      <p>企业数字化转型的通信助手</p>
      <p>接入简单、稳定必达、覆盖全球的即时通讯云服务</p>
      <n-image width="340" :src="workImg" :preview-disabled="true" />
    </div>
    <n-card :bordered="false" size="large" class="relative z-4 !w-auto rounded-20px shadow-sm overflow-hidden">
      <div class="toggle-login" @click="toggleLoginType">
        <svg-icon :icon="loginType === 'sign-login' ? 'uil:qrcode-scan' : 'material-symbols:phone-android-outline'" />
      </div>
      <div class="w-300px sm:w-360px">
        <header class="flex-y-center justify-between pr-40px">
          <!-- <system-logo class="text-64px text-primary" /> -->
          <n-image width="64" :src="logoImg" :preview-disabled="true" />
          <n-gradient-text type="primary" :size="28">{{ $t('system.title') }}</n-gradient-text>
        </header>
        <main class="pt-24px">
          <h3 class="text-18px text-primary font-medium">
            {{
              loginType === 'sign-login'
                ? $t('page.login.signLogin.title')
                : $t('page.login.scanLogin.title')
            }}
          </h3>
          <div class="flex-center h-280px">
            <transition name="fade-slide" mode="out-in" appear>
              <sign-login v-if="loginType === 'sign-login'" />
              <scan-login v-else />
            </transition>
          </div>
        </main>
      </div>
    </n-card>
    <!-- <login-bg :theme-color="bgThemeColor" /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// import { loginModuleLabels } from '@/constants'
import { $t } from '@/locales'
import { useAppStore, useThemeStore } from '@/store'
import { localStg } from '@/utils'
import { AppCtrl } from '@/layouts/common/global-header/components'
import {
  // BindWechat,
  // CodeLogin,
  // LoginBg,
  // PwdLogin,
  // Register,
  // ResetPwd,
  SignLogin,
  ScanLogin
} from './components'
import workImg from '@/assets/images/work.png'
import logoImg from '@/assets/images/logo.png'

// interface Props {
//   /** 登录模块分类 */
//   module: UnionKey.LoginModule
// }

type LoginType = 'sign-login' | 'scan-login'

const loginType = ref<LoginType>('sign-login')

// const props = defineProps<Props>()

const appStore = useAppStore()
const theme = useThemeStore()

// interface LoginModule {
//   key: UnionKey.LoginModule
//   label: string
//   component: Component
// }

const { locale } = useI18n()

const language = ref<I18nType.LangType>(localStg.get('lang') || 'zh-CN')
const options = [
  {
    label: '中文',
    key: 'zh-CN'
  },
  {
    label: 'English',
    key: 'en'
  }
]
const handleSelect = (key: string) => {
  language.value = key as I18nType.LangType
  locale.value = key
  appStore.setLocale(key as I18nType.LangType)
  window.location.reload()
}

// const modules: LoginModule[] = [
//   { key: 'pwd-login', label: loginModuleLabels['pwd-login'], component: PwdLogin },
//   { key: 'sign-login', label: loginModuleLabels['sign-login'], component: CodeLogin },
//   { key: 'register', label: loginModuleLabels.register, component: Register },
//   { key: 'reset-pwd', label: loginModuleLabels['reset-pwd'], component: ResetPwd },
//   { key: 'bind-wechat', label: loginModuleLabels['bind-wechat'], component: BindWechat },
//   { key: 'sign-login', label: loginModuleLabels['sign-login'], component: SignLogin }
// ]

// const activeModule = computed(() => {
//   const active: LoginModule = { ...modules[modules.length - 1] }
//   const findItem = modules.find(item => item.key === props.module)
//   console.log(props.module)
//   if (findItem) {
//     Object.assign(active, findItem)
//   }
//   return active
// })

// const bgThemeColor = computed(() => (theme.darkMode ? getColorPalette(theme.themeColor, 7) : theme.themeColor))

// const bgColor = computed(() => {
//   const COLOR_WHITE = '#ffffff'
//   const ratio = theme.darkMode ? 0.5 : 0.2
//   return mixColor(COLOR_WHITE, theme.themeColor, ratio)
// })

function toggleLoginType() {
  if (loginType.value === 'sign-login') {
    loginType.value = 'scan-login'
  } else {
    loginType.value = 'sign-login'
  }
}
</script>

<style lang="scss" scoped>
.toggle-login {
  --uno: flex-center absolute top-0 right-0 pl-30px pb-30px w-100px h-100px bg-primary:30 cursor-pointer text-40px text-#333 dark:text-#999;
  clip-path: polygon(0 0, 100% 100%, 100% 0);
}
</style>