<template>
  <hover-container class="w-40px h-full" :tooltip-content="$t('common.themeConfig')" :inverted="theme.header.inverted"
    @click="app.toggleSettingDrawerVisible">
    <icon-ant-design-setting-outlined class="text-20px" />
  </hover-container>
</template>

<script lang="ts" setup>
import { $t } from '@/locales'
import { useAppStore, useThemeStore } from '@/store'

defineOptions({ name: 'SettingButton' })

const app = useAppStore()
const theme = useThemeStore()
</script>
