<template>
  <dark-mode-container class="global-header flex-y-center h-full" :inverted="theme.header.inverted">
    <global-logo v-if="showLogo" :show-title="true" class="h-full" :style="{ width: theme.sider.width + 'px' }" />
    <div v-if="!showHeaderMenu" class="flex-1-hidden flex-y-center h-full">
      <menu-collapse v-if="showMenuCollapse || isMobile" />
      <global-breadcrumb v-if="theme.header.crumb.visible && !isMobile" />
    </div>
    <header-menu v-else />
    <div class="flex justify-end h-full">
      <!-- <full-screen /> -->
      <theme-mode />
      <toggle-lang />
      <setting-button v-if="showButton" />
      <user-avatar />
      <div class="flex items-center h-full">
        <n-divider vertical />
      </div>
      <app-ctrl />
    </div>
  </dark-mode-container>
</template>

<script lang="ts" setup>
import { useBasicLayout } from '@/composables'
import { useThemeStore } from '@/store'
import {
  // FullScreen,
  GlobalBreadcrumb,
  HeaderMenu,
  MenuCollapse,
  SettingButton,
  ThemeMode,
  ToggleLang,
  UserAvatar,
  AppCtrl
} from './components'
import GlobalLogo from '../global-logo/index.vue'

defineOptions({ name: 'GlobalHeader' })

interface Props {
  /** 显示logo */
  showLogo: App.GlobalHeaderProps['showLogo']
  /** 显示头部菜单 */
  showHeaderMenu: App.GlobalHeaderProps['showHeaderMenu']
  /** 显示菜单折叠按钮 */
  showMenuCollapse: App.GlobalHeaderProps['showMenuCollapse']
}

defineProps<Props>()

const theme = useThemeStore()
const { isMobile } = useBasicLayout()

const showButton = import.meta.env.PROD && import.meta.env.VITE_VERCEL !== 'Y'
</script>

<style lang="scss" scoped>
.global-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
