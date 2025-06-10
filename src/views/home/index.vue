<template>
  <div class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <n-split direction="horizontal" default-size="280px" max="400px" min="200px" :resize-trigger-size="2">
      <template #1>
        <div class="h-full bg-#fff dark:bg-#000">
          <global-search />
          <n-scrollbar class="h-[calc(100%-50px)]">
            <template v-if="chatStore.convChatList.length > 0">
              <ChatUser v-for="i in chatStore.convChatList" :key="i.conv_id" :chatUser="i"
                :isActive="chatStore.currentConvUserID === i.conv_id" />
            </template>
            <div v-else class="pt-100px">
              <n-empty :description="$t('page.chat.noneChat')" size="huge">
                <template #icon>
                  <n-icon>
                    <icon-tabler:message-2-off />
                  </n-icon>
                </template>
              </n-empty>
            </div>
          </n-scrollbar>
        </div>
      </template>
      <template #2>
        <ChatBox v-if="chatStore.currentConv" @click="handleChatBoxClick" />
        <div v-else class="h-full flex-center">
          <n-image :src="logo" :preview-disabled="true" class="w-180px filter-grayscale opacity-10" />
        </div>
      </template>
    </n-split>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import ChatUser from './components/chat-user/index.vue'
import ChatBox from './components/chat-box/index.vue'
import logo from '@/assets/images/logo.png'

const chatStore = useChatStore()

function handleChatBoxClick() {
  if (chatStore.currentConv) {
    chatStore.reportRead({
      conv_id: chatStore.currentConvUserID,
      conv_type: chatStore.currentConv.conv_type
    })
  }
}
</script>
