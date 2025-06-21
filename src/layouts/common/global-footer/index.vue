<template>
  <dark-mode-container class="flex-center h-full" :inverted="theme.footer.inverted">
    <span>&copy; 2024 {{ packageJson.author }} (v{{ packageJson.version }})</span>
  </dark-mode-container>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store'

import packageJson from '~/package.json'

defineOptions({ name: 'GlobalFooter' })

const theme = useThemeStore()
</script>
