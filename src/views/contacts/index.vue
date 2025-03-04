<template>
  <div class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <n-split direction="horizontal" :default-size="0.28" :max="0.4" :min="0.2" :resize-trigger-size="2">
      <template #1>
        <div class="h-full bg-#fff dark:bg-#000">
          <global-search />
          <div v-for="item in tabList" :key="item.type" class="flex items-center px-10px h-60px cursor-pointer"
            :class="[{ '!bg-primary_active': currentTab.type === item.type }]" @click="setCurrentTab(item)">
            <n-badge v-if="item.type === TabTypeEnum.FRIEND_APPLY" :value="newApply" :max="99">
              <div class="flex-center w-40px h-40px b-rd-50%" :class="[item.bgColor]">
                <svg-icon :icon="item.icon" class="text-20px color-#fff" />
              </div>
            </n-badge>
            <div v-else class="flex-center w-40px h-40px b-rd-50%" :class="[item.bgColor]">
              <svg-icon :icon="item.icon" class="text-20px color-#fff" />
            </div>
            <div class="pl-10px text-16p select-none">{{ $t(item.i18nName) }}</div>
          </div>
        </div>
      </template>
      <template #2>
        <div v-if="currentTab.type === TabTypeEnum.FRIEND_LIST" class="h-full bg-#fff dark:bg-#000">
          <FriendList />
        </div>
        <div v-else-if="currentTab.type === TabTypeEnum.MY_GROUP" class="h-full bg-#fff dark:bg-#000">
          <MyGroup />
        </div>
        <div v-else-if="currentTab.type === TabTypeEnum.FRIEND_APPLY" class="h-full bg-#fff dark:bg-#000">
          <FriendApply />
        </div>
        <div v-else-if="currentTab.type === TabTypeEnum.BLACKLIST" class="h-full bg-#fff dark:bg-#000">
          <Blacklist />
        </div>
      </template>
    </n-split>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { $t } from '@/locales'
import FriendList from './components/friend-list/index.vue'
import MyGroup from './components/my-group/index.vue'
import FriendApply from './components/friend-apply/index.vue'
import Blacklist from './components/blacklist/index.vue'

type TabType = {
  type: TabTypeEnum
  i18nName: string
  bgColor: string
  icon: string
}

enum TabTypeEnum {
  FRIEND_LIST,
  MY_GROUP,
  FRIEND_APPLY,
  BLACKLIST
}

const tabList: TabType[] = [
  {
    type: TabTypeEnum.FRIEND_LIST,
    i18nName: 'page.contacts.friendList',
    bgColor: 'bg-blue',
    icon: 'rivet-icons:user-group-solid'
  },
  {
    type: TabTypeEnum.MY_GROUP,
    i18nName: 'page.contacts.myGroup',
    bgColor: 'bg-yellow',
    icon: 'ic:round-window'
  },
  {
    type: TabTypeEnum.FRIEND_APPLY,
    i18nName: 'page.contacts.friendApply',
    bgColor: 'bg-green',
    icon: 'ic:round-person-add-alt-1'
  },
  {
    type: TabTypeEnum.BLACKLIST,
    i18nName: 'page.contacts.blacklist',
    bgColor: 'bg-gray',
    icon: 'ic:sharp-person-off'
  }
]

const currentTab = ref(tabList[0])

const newApply = ref(0)

function setCurrentTab(tabItem: TabType) {
  currentTab.value = tabItem
}
</script>
