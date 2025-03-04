<template>
  <div class="relative flex-center wh-full" :style="{ backgroundColor: bgColor }">
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
    <n-card :bordered="false" size="large" class="z-4 !w-auto rounded-20px shadow-sm">
      <div class="w-300px sm:w-360px">
        <header class="flex-y-center justify-between">
          <!-- <system-logo class="text-64px text-primary" /> -->
          <n-image width="64" :src="logoImg" :preview-disabled="true" />
          <n-gradient-text type="primary" :size="28">{{ $t('system.title') }}</n-gradient-text>
        </header>
        <main class="pt-24px">
          <h3 class="text-18px text-primary font-medium">{{ activeModule.label }}</h3>
          <div class="pt-24px">
            <transition name="fade-slide" mode="out-in" appear>
              <component :is="activeModule.component" />
            </transition>
          </div>
        </main>
      </div>
    </n-card>
    <login-bg :theme-color="bgThemeColor" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { useI18n } from 'vue-i18n'

import { loginModuleLabels } from '@/constants'
import { $t } from '@/locales'
import { useAppStore, useThemeStore } from '@/store'
import { getColorPalette, localStg, mixColor } from '@/utils'
import { AppCtrl } from '@/layouts/common/global-header/components'
import {
  BindWechat,
  CodeLogin,
  LoginBg,
  PwdLogin,
  Register,
  ResetPwd,
  SignLogin
} from './components'
import logoImg from '@/assets/images/logo.png'

interface Props {
  /** 登录模块分类 */
  module: UnionKey.LoginModule
}

const props = defineProps<Props>()

const appStore = useAppStore()
const theme = useThemeStore()

interface LoginModule {
  key: UnionKey.LoginModule
  label: string
  component: Component
}

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

const modules: LoginModule[] = [
  { key: 'pwd-login', label: loginModuleLabels['pwd-login'], component: PwdLogin },
  { key: 'code-login', label: loginModuleLabels['code-login'], component: CodeLogin },
  { key: 'register', label: loginModuleLabels.register, component: Register },
  { key: 'reset-pwd', label: loginModuleLabels['reset-pwd'], component: ResetPwd },
  { key: 'bind-wechat', label: loginModuleLabels['bind-wechat'], component: BindWechat },
  { key: 'sign-login', label: loginModuleLabels['sign-login'], component: SignLogin }
]

const activeModule = computed(() => {
  const active: LoginModule = { ...modules[modules.length - 1] }
  const findItem = modules.find(item => item.key === props.module)
  console.log(props.module)
  if (findItem) {
    Object.assign(active, findItem)
  }
  return active
})

const bgThemeColor = computed(() => (theme.darkMode ? getColorPalette(theme.themeColor, 7) : theme.themeColor))

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff'
  const ratio = theme.darkMode ? 0.5 : 0.2
  return mixColor(COLOR_WHITE, theme.themeColor, ratio)
})
</script>
