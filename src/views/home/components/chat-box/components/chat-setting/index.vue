<template>
  <div>
    <icon-mingcute:more-1-fill class="text-16px cursor-pointer" @click="toggleDrawer" />
    <n-drawer v-model:show="active" :width="320" placement="right" :trap-focus="false" :block-scroll="false"
      to="#chat-box-container">
      <n-drawer-content :native-scrollbar="false">
        <template v-if="chatStore.currentConv.conv_type === ConvTypeEnum.C2C">
          <n-row :gutter="[4, 10]">
            <n-col :span="6">
              <UserProfile :user-id="chatStore.currentConv.conv_id" />
            </n-col>
            <n-col :span="6" class="flex flex-col flex-center">
              <div class="flex-center w-40px h-40px bg-gray-100 dark:bg-gray-900 b-rd-4px cursor-pointer">
                <icon-material-symbols:add class="text-20px" />
              </div>
              <div class="mt-2px text-13px text-center select-none">{{ $t('common.add') }}</div>
            </n-col>
          </n-row>
          <n-divider />
          <div class="flex justify-between items-center select-none cursor-pointer">
            {{ $t('page.chat.chatSetting.chatHistory') }}
            <icon-ic:sharp-keyboard-arrow-right class="text-20px" />
          </div>
          <n-divider />
          <div class="flex justify-between items-center mb-20px select-none">
            {{ $t('page.chat.chatSetting.messageWithoutInterruption') }}
            <n-switch v-model:value="chatSetting.messageWithoutInterruption"
              @update:value="handleMessageWithoutInterruptionChange" />
          </div>
          <div class="flex justify-between items-center mb-20px select-none">
            {{ $t('page.chat.chatSetting.chatTop') }}
            <n-switch v-model:value="chatSetting.chatTop" @update:value="handleChatTopChange" />
          </div>
          <n-divider />
          <div class="flex-center px-20px">
            <n-button text type="error">{{ $t('page.chat.chatSetting.clearChatHistory') }}</n-button>
          </div>
        </template>
        <template v-else-if="chatStore.currentConv.conv_type === ConvTypeEnum.GROUP">
          <n-row :gutter="[4, 10]">
            <n-col :span="6">
              <UserProfile :user-id="chatStore.currentConv.conv_id" />
            </n-col>
            <n-col :span="6" class="flex flex-col flex-center">
              <div class="flex-center w-40px h-40px bg-gray-100 b-rd-4px cursor-pointer">
                <icon-material-symbols:add class="text-20px" />
              </div>
              <div class="mt-2px text-13px text-center">{{ $t('common.add') }}</div>
            </n-col>
          </n-row>
          <n-divider />
          <div class="flex justify-between items-center cursor-pointer">
            {{ $t('page.chat.chatSetting.chatHistory') }}
            <icon-ic:sharp-keyboard-arrow-right class="text-20px" />
          </div>
          <n-divider />
          <div class="flex-center px-20px">
            <n-button text type="error">{{ $t('page.chat.chatSetting.clearChatHistory') }}</n-button>
          </div>
          <n-divider />
          <div class="flex-center px-20px">
            <n-button text type="error">{{ $t('page.chat.chatSetting.exitGroupChat') }}</n-button>
          </div>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

import { ConvRecvOptEnum, ConvTypeEnum } from '@/constants/conv'
import { $t } from '@/locales'
import { useChatStore } from '@/store/modules/chat'
import UserProfile from '../user-profile/index.vue'

const chatStore = useChatStore()

const active = ref(false)

const chatSetting = ref({
  messageWithoutInterruption: false,
  chatTop: false
})

watch(
  () => chatStore.currentConvUserID,
  () => {
    if (active.value) {
      active.value = false
    }
  }
)

/**
 * @description 切换抽屉的显示状态，并初始化聊天设置
 */
function toggleDrawer() {
  chatSetting.value = {
    // 设置消息免打扰状态
    messageWithoutInterruption: chatStore.currentConv.conv_recv_opt === ConvRecvOptEnum.NOT_NOTICE,
    // 设置会话置顶状态
    chatTop: chatStore.currentConv.conv_is_pinned
  }
  active.value = !active.value
}

/**
 * @description 处理消息免打扰状态变更
 * @param value - 是否开启消息免打扰
 */
function handleMessageWithoutInterruptionChange(value: boolean) {
  chatStore.setConvRecvStatus(chatStore.currentConv.conv_id, value ? ConvRecvOptEnum.NOT_NOTICE : ConvRecvOptEnum.RECEIVE)
}

/**
 * @description 处理会话置顶状态变更
 * @param value - 是否置顶会话
 */
function handleChatTopChange(value: boolean) {
  chatStore.setConvPinConversation(chatStore.currentConv.conv_id, chatStore.currentConv.conv_type, value)
}
</script>
