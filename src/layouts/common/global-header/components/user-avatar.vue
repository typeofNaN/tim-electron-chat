<template>
  <n-dropdown :options="options" @select="handleDropdown">
    <hover-container class="px-12px" :inverted="theme.header.inverted">
      <n-avatar v-if="auth.userInfo.avatar" round :size="32" :src="auth.userInfo.avatar"
        :fallback-src="defaultAvatar" />
      <icon-local-avatar v-else class="text-32px" />
      <span class="pl-8px text-16px font-medium">{{ auth.userInfo.nickname }}</span>
    </hover-container>
  </n-dropdown>
</template>

<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui'

import { useIconRender } from '@/composables'
import { $t } from '@/locales'
import { useAuthStore, useThemeStore } from '@/store'
import defaultAvatar from '@/assets/svg-icon/avatar.svg'

defineOptions({ name: 'UserAvatar' })

const auth = useAuthStore()
const theme = useThemeStore()
const { iconRender } = useIconRender()

const options: DropdownOption[] = [
  // {
  //   label: '用户中心',
  //   key: 'user-center',
  //   icon: iconRender({ icon: 'carbon:user-avatar' })
  // },
  // {
  //   type: 'divider',
  //   key: 'divider'
  // },
  {
    label: $t('layout.userAvatar.logout'),
    key: 'logout',
    icon: iconRender({ icon: 'carbon:logout' })
  }
]

type DropdownKey = 'user-center' | 'logout'

function handleDropdown(optionKey: string) {
  const key = optionKey as DropdownKey
  if (key === 'logout') {
    window.$dialog?.info({
      title: $t('layout.userAvatar.tip'),
      content: $t('layout.userAvatar.askLogout'),
      positiveText: $t('common.confirm'),
      negativeText: $t('common.cancel'),
      onPositiveClick: () => {
        auth.resetAuthStore()
      }
    })
  }
}
</script>
