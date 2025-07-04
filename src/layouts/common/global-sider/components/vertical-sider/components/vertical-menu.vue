<template>
  <n-scrollbar class="flex-1-hidden">
    <n-menu :value="activeKey" :collapsed="app.siderCollapse" :collapsed-width="theme.sider.collapsedWidth"
      :collapsed-icon-size="22" :options="menus" :expanded-keys="expandedKeys" :indent="18"
      :inverted="!theme.darkMode && theme.sider.inverted" @update:value="handleUpdateMenu"
      @update:expanded-keys="handleUpdateExpandedKeys" />
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuOption } from 'naive-ui'

import { useRouterPush } from '@/composables'
import { useAppStore, useRouteStore, useThemeStore } from '@/store'
import { getActiveKeyPathsOfMenus, translateMenuLabel } from '@/utils'

defineOptions({ name: 'VerticalMenu' })

const route = useRoute()
const app = useAppStore()
const theme = useThemeStore()
const routeStore = useRouteStore()
const { routerPush } = useRouterPush()

const menus = computed(() => translateMenuLabel(routeStore.menus as App.GlobalMenuOption[]))

const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string)
const expandedKeys = ref<string[]>([])

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as App.GlobalMenuOption
  routerPush(menuItem.routePath)
}

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys
}

watch(
  () => route.name,
  () => {
    expandedKeys.value = getActiveKeyPathsOfMenus(activeKey.value, menus.value)
  },
  { immediate: true }
)
</script>
