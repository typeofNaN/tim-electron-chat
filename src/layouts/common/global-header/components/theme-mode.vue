<template>
  <hover-container class="w-40px" :inverted="theme.header.inverted" :tooltip-content="$t('common.themeMode')">
    <dark-mode-switch :dark="theme.darkMode" :customize-transition="theme.isCustomizeDarkModeTransition" class="wh-full"
      @update:dark="theme.setDarkMode" />
  </hover-container>
</template>

<script lang="ts" setup>
import { $t } from '@/locales'
import { useThemeStore } from '@/store'

defineOptions({ name: 'ThemeMode' })

const theme = useThemeStore()
</script>
