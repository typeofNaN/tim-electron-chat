<template>
  <div class="flex-1-hidden h-full px-10px">
    <n-scrollbar :x-scrollable="true" class="flex-1-hidden h-full" content-class="h-full">
      <div class="flex-y-center h-full" :style="{ justifyContent: theme.menu.horizontalPosition }">
        <n-menu :value="activeKey" mode="horizontal" :options="menus" :inverted="theme.header.inverted"
          @update:value="handleUpdateMenu" />
      </div>
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuOption } from 'naive-ui'

import { useRouterPush } from '@/composables'
import { useRouteStore, useThemeStore } from '@/store'
import { translateMenuLabel } from '@/utils'

defineOptions({ name: 'HeaderMenu' })

const route = useRoute()
const routeStore = useRouteStore()
const theme = useThemeStore()
const { routerPush } = useRouterPush()

const menus = computed(() => translateMenuLabel(routeStore.menus as App.GlobalMenuOption[]))
const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string)

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as App.GlobalMenuOption
  routerPush(menuItem.routePath)
}
</script>

<style lang="scss" scoped>
:deep(.n-menu-item-content-header) {
  overflow: inherit !important;
}
</style>
