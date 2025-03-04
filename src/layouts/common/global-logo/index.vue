<template>
  <router-link :to="routeHomePath" class="flex-center w-full nowrap-hidden">
    <!-- <system-logo class="text-32px text-primary" /> -->
    <n-image width="32" :src="logoImg" :preview-disabled="true" />
    <h2 v-show="showTitle" class="pl-8px text-16px font-bold text-primary transition duration-300 ease-in-out">
      {{ $t('system.title') }}
    </h2>
  </router-link>
</template>

<script setup lang="ts">
import { $t } from '@/locales'
import { routePath } from '@/router'
import logoImg from '@/assets/images/logo.png'

defineOptions({ name: 'GlobalLogo' })

interface Props {
  /** 显示名字 */
  showTitle: boolean
}

defineProps<Props>()

const routeHomePath = routePath('root')
</script>
