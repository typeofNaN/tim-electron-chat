<template>
  <n-scrollbar ref="scrollbarRef" class="h-full">
    <div v-show="showLoadMore && chatMsgList.length > 30" class="flex-center h-40px">
      <n-button text type="primary" size="mini" @click="loadMoreMsg">
        {{ $t('page.chat.loadMoreMessage') }}
      </n-button>
    </div>
    <div v-for="item in chatMsgList" :key="item.message_msg_id" :id="item.message_msg_id"
      class="flex gap-10px relative px-10px py-15px"
      :class="[{ 'flex-row-reverse': item.message_sender === chatStore.myInfo.user_profile_identifier }]">
      <!-- 消息被撤回 -->
      <template v-if="item.message_revoker_user_id">
        <RevokeMsg :msg="item" :is-my-msg="item.message_revoker_user_id === chatStore.userID" />
      </template>
      <!-- 打招呼消息 -->
      <template
        v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.CUSTOM && item.message_elem_array[0].custom_elem_data.subtype === 'greet'">
        <GreetMsg :msg="item" :is-my-msg="item.message_sender === chatStore.userID" />
      </template>
      <template v-else>
        <template v-if="chatStore.isOpenMultiSelect">
          <n-checkbox v-if="chatStore.isOpenMultiSelect"
            :checked="chatStore.multiSelectMessageList.findIndex(msg => msg.message_msg_id === item.message_msg_id) > -1" />
          <div class="absolute inset-0 cursor-pointer" @click="checkMsg(item)"></div>
        </template>
        <custom-avatar :src="item.message_sender_profile.user_profile_face_url" :size="40" />
        <div class="w-70%">
          <div class="flex gap-10px items-center mb-6px lh-[1.5]"
            :class="[{ 'flex-row-reverse': item.message_sender === chatStore.myInfo.user_profile_identifier }]">
            <div
              v-if="item.message_conv_type === ConvTypeEnum.GROUP && item.message_sender !== chatStore.myInfo.user_profile_identifier"
              class="text-14px">
              {{
                item.message_sender_profile.user_profile_friend_remark ||
                item.message_sender_profile.user_profile_nick_name ||
                item.message_sender_profile.user_profile_identifier
              }}
            </div>
            <div class="text-12px text-gray-400 lh-[1] select-none">
              {{ formatterTime(new Date((item.message_server_time || item.message_client_time) * 1000)) }}
            </div>
            <svg-icon :icon="item.message_is_read ? 'solar:unread-outline' : 'hugeicons:check-unread-03'"
              class="color-#999 text-16px" />
          </div>
          <div
            :class="['flex', 'gap-10px', 'items-center', item.message_sender === chatStore.myInfo.user_profile_identifier && 'flex-row-reverse']">
            <TextMsg v-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.TEXT" :msg="item"
              @forwardMsg="forwardMsg" />
            <ImageMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.IMAGE" :msg="item"
              @forwardMsg="forwardMsg" />
            <SoundMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.SOUND" :msg="item"
              @forwardMsg="forwardMsg" />
            <CustomMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.CUSTOM" :msg="item"
              @forwardMsg="forwardMsg" />
            <FileMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.FILE" :msg="item"
              @forwardMsg="forwardMsg" />
            <LocationMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.LOCATION" :msg="item"
              @forwardMsg="forwardMsg" />
            <VideoMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.VIDEO" :msg="item"
              @forwardMsg="forwardMsg" />
            <MergeMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.MERGE" :msg="item"
              @forwardMsg="forwardMsg" />
            <icon-ic:sharp-error v-if="item.message_server_time === 0" class="color-red text-18px" />
          </div>
        </div>
      </template>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'

import { ConvTypeEnum } from '@/constants/conv'
import { MsgTypeEnum } from '@/constants/msg'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { formatterTime } from '@/utils/common/datetime'
import {
  RevokeMsg,
  GreetMsg,
  TextMsg,
  ImageMsg,
  SoundMsg,
  CustomMsg,
  FileMsg,
  LocationMsg,
  VideoMsg,
  MergeMsg
} from './components'

interface Emits {
  (e: 'forwardMsg', msg: any): void
}
const emit = defineEmits<Emits>()

const chatStore = useChatStore()

const scrollbarRef = ref()
const chatMsgList = computed(() => chatStore.chatMsgList)

const showLoadMore = ref(true)

/**
 * 监听消息列表长度和当前会话ID的变化
 * 当会话切换时,滚动到底部并显示加载更多按钮
 * 当消息数量增加时,滚动到底部显示最新消息
 * 当消息数量减少或不变时,保持当前滚动位置
 */
watch(
  [() => chatMsgList.value.length, () => chatStore.currentConvUserID],
  ([newLength, newConvID], [oldLength, oldConvID]) => {
    nextTick(() => {
      if (newConvID !== oldConvID) {
        scrollToBottom()
        showLoadMore.value = true
        return
      }
      // 如果消息数量减少或不变,不需要滚动到底部
      if (oldLength && (newLength < oldLength)) {
        return
      }
      // 新消息时滚动到底部
      scrollToBottom()
    })
  },
  { immediate: true }
)

/**
 * 加载更多历史消息
 */
async function loadMoreMsg() {
  // 记录当前消息数量
  const oldLength = chatMsgList.value.length
  // 记录第一条消息ID,用于定位
  const msgId = chatMsgList.value[0].message_msg_id
  // 构造会话数据
  const convData = {
    conv_id: chatStore.currentConv.conv_id,
    conv_type: chatStore.currentConv.conv_type,
    conv_last_msg: chatMsgList.value[0]
  }
  // 获取历史消息
  await chatStore.getConvMsgList(convData, true)
  // 滚动到加载前第一条消息位置
  scrollbarRef.value.scrollTo({
    el: document.getElementById(msgId)
  })
  // 如果没有新消息了,隐藏加载更多按钮
  if (chatMsgList.value.length <= oldLength) {
    showLoadMore.value = false
    window.$message?.info($t('page.chat.noMoreMessage'))
  }
}

function scrollToBottom() {
  // export interface ScrollTo {
  //   (x: number, y: number): void;
  //   (options: {
  //     left?: number;
  //     top?: number;
  //     behavior?: ScrollBehavior;
  //     debounce?: boolean;
  //   }): void;
  //   (options: {
  //     el: HTMLElement;
  //     behavior?: ScrollBehavior;
  //     debounce?: boolean;
  //   }): void;
  //   (options: {
  //     index: number;
  //     elSize: number;
  //     behavior?: ScrollBehavior;
  //     debounce?: boolean;
  //   }): void;
  //   (options: {
  //     position: 'top' | 'bottom';
  //     behavior?: ScrollBehavior;
  //     debounce?: boolean;
  //   }): void;
  // }
  // export interface ScrollBy {
  //   (x: number, y: number): void;
  //   (options: {
  //     left?: number;
  //     top?: number;
  //     behavior?: ScrollBehavior;
  //   }): void;
  // }
  scrollbarRef.value.scrollTo({
    position: 'bottom'
  })
}

function checkMsg(data: any) {
  chatStore.multiSelectMessageClick(data)
}

function forwardMsg(data: any) {
  emit('forwardMsg', data)
}
</script>
