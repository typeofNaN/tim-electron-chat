<template>
  <div class="flex flex-col justify-between items-center h-full select-none">
    <div class="pt-20px">
      <n-popover :overlap="false" placement="right-start" trigger="click">
        <template #trigger>
          <div class="flex-center mb-20px cursor-pointer">
            <custom-avatar :src="chatStore.myInfo?.user_profile_face_url" :size="40" />
          </div>
        </template>
        <MyInfo :user-info="chatStore.myInfo" />
      </n-popover>
      <div :class="['flex-center', 'menu-item', isChatActive && 'color-primary!']" @click="toChat">
        <n-badge :value="chatStore.totalUnreadMsgCount" :max="99">
          <icon-mdi:chat-processing class="cursor-pointer" />
        </n-badge>
      </div>
      <div :class="['flex-center', 'menu-item', isContactsActive && 'color-primary!']" @click="toContacts">
        <icon-fluent:book-contacts-24-filled class="cursor-pointer" />
      </div>
    </div>
    <div class="pb-10px">
      <div class="flex-center menu-item">
        <n-dropdown :options="options" trigger="click" :value="language" @select="handleSelectLanguage">
          <icon-cil:language class="text-22px outline-transparent cursor-pointer" />
        </n-dropdown>
      </div>
      <div :class="['flex-center', 'menu-item', isSettingActive && 'color-primary!']" @click="toSetting">
        <icon-material-symbols:settings-rounded class="cursor-pointer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useChatStore } from '@/store'
import { localStg } from '@/utils'
import MyInfo from './components/my-info/index.vue'

const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()

const { locale } = useI18n()

const language = ref<I18nType.LangType>(localStg.get('lang') || 'zh-CN')
const options = [
  {
    label: '中文',
    key: 'zh-CN'
  },
  {
    label: 'English',
    key: 'en'
  }
]

const isChatActive = computed(() => route.name === 'home')

const isContactsActive = computed(() => route.name === 'contacts')

const isSettingActive = computed(() => route.name === 'setting')

/**
 * @description 跳转到聊天页面
 * 如果当前已在聊天页面则不跳转
 */
function toChat() {
  if (isChatActive.value) {
    return
  }
  router.push({ name: 'home' })
}

/**
 * @description 跳转到联系人页面
 * 如果当前已在联系人页面则不跳转
 */
function toContacts() {
  if (isContactsActive.value) {
    return
  }
  router.push({ name: 'contacts' })
}

/**
 * @description 跳转到设置页面
 * 如果当前已在设置页面则不跳转
 */
function toSetting() {
  if (isSettingActive.value) {
    return
  }
  router.push({ name: 'setting' })
}

/**
 * @description 处理语言切换
 * @param { string } key - 语言标识符
 */
function handleSelectLanguage(key: string) {
  language.value = key as I18nType.LangType
  locale.value = key
  localStg.set('lang', key as I18nType.LangType)
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 60px;
  height: 50px;
  font-size: 26px;
  color: #aaa;
}
</style>