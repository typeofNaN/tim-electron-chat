<template>
  <div class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <n-split direction="horizontal" :default-size="0.28" :max="0.4" :min="0.2" :resize-trigger-size="2">
      <template #1>
        <div class="h-full bg-#fff dark:bg-#000">
          <global-search />
          <div v-for="item in tabList" :key="item.type" class="flex items-center px-10px h-60px cursor-pointer"
            :class="[{ '!bg-primary_active': currentTab.type === item.type }]" @click="setCurrentTab(item)">
            <div class="flex-center w-40px h-40px b-rd-50% text-20px color-#fff" :class="[item.bgColor]">
              <svg-icon :icon="item.icon" />
            </div>
            <div class="pl-10px text-16px select-none">{{ $t(item.i18nName) }}</div>
          </div>
        </div>
      </template>
      <template #2>
        <div class="h-full bg-#fff dark:bg-#000">
          <AccountSetting v-if="currentTab.type === TabTypeEnum.ACCOUNT_SETTING" />
          <SystemSetting v-else-if="currentTab.type === TabTypeEnum.SYSTEM_SETTING" />
          <About v-else-if="currentTab.type === TabTypeEnum.ABOUT" />
        </div>
      </template>
    </n-split>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { $t } from '@/locales'
import AccountSetting from './components/account-setting/index.vue'
import SystemSetting from './components/system-setting/index.vue'
import About from './components/about/index.vue'

type TabType = {
  type: TabTypeEnum
  i18nName: string
  bgColor: string
  icon: string
}

enum TabTypeEnum {
  ACCOUNT_SETTING,
  SYSTEM_SETTING,
  ABOUT
}

const tabList: TabType[] = [
  {
    type: TabTypeEnum.ACCOUNT_SETTING,
    i18nName: 'page.setting.accountSetting',
    bgColor: 'bg-blue',
    icon: 'ic:twotone-manage-accounts'
  },
  {
    type: TabTypeEnum.SYSTEM_SETTING,
    i18nName: 'page.setting.systemSetting',
    bgColor: 'bg-yellow',
    icon: 'tdesign:system-setting'
  },
  {
    type: TabTypeEnum.ABOUT,
    i18nName: 'page.setting.about',
    bgColor: 'bg-green',
    icon: 'mdi:information-variant'
  }
]

const currentTab = ref(tabList[0])

function setCurrentTab(tabItem: TabType) {
  currentTab.value = tabItem
}
</script>
