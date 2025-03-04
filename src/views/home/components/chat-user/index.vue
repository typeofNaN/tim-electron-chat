<template>
  <div id="chat-user">
    <div
      class="flex justify-between items-center p-10px h-70px hover-bg-#f9f9f9 dark:hover-bg-#1a1a1a cursor-pointer select-none relative"
      :class="[{ '!bg-primary_active': props.isActive }]" @click="handleClickUser"
      @contextmenu="handleContextMenu($event)">
      <template v-if="props.chatUser.conv_recv_opt === ConvRecvOptEnum.RECEIVE">
        <n-badge :value="props.chatUser.conv_unread_num" :max="99">
          <custom-avatar :src="props.chatUser.conv_face_url" :size="50" />
        </n-badge>
      </template>
      <template v-else>
        <n-badge v-if="props.chatUser.conv_unread_num" dot :offset="[0, 3]">
          <custom-avatar :src="props.chatUser.conv_face_url" :size="50" />
        </n-badge>
        <custom-avatar v-else :src="props.chatUser.conv_face_url" :size="50" />
      </template>
      <div class="w-[calc(100%-50px)] pl-16px">
        <div class="flex justify-between items-center mb-4px">
          <n-ellipsis :tooltip="false" class="text-15px">
            {{ props.chatUser.conv_show_name }}
          </n-ellipsis>
          <div v-if="lastMsg" class="text-gray-300 text-12px">
            {{
              formatterChatLastMsgTime((lastMsg.message_server_time ||
                lastMsg.message_client_time) * 1000)
            }}
          </div>
        </div>
        <div class="flex justify-between items-center text-12px">
          <n-ellipsis :tooltip="false" class="w-[calc(100%-16px)] text-gray-500">
            <template v-if="lastMsg">
              <!-- 消息被撤回 -->
              <template v-if="lastMsg.message_revoker_user_id">
                {{
                  `${lastMsg.message_revoker_user_id === chatStore.userID
                    ? $t('page.chat.you')
                    : (lastMsg.message_revoker_nick_name || lastMsg.message_revoker_user_id)
                  } ${$t('page.chat.revokeAMessage')}`
                }}
              </template>
              <template v-else>
                <div v-if="msgType === MsgTypeEnum.TEXT"
                  v-html="transformEmojiText(lastMsg.message_elem_array[0].text_elem_content)"
                  class="text-msg overflow-hidden whitespace-nowrap text-ellipsis" />
                <template v-else-if="msgType === MsgTypeEnum.IMAGE">
                  {{ $t('msgPlaceholders.image') }}
                </template>
                <template v-else-if="msgType === MsgTypeEnum.SOUND">
                  {{ $t('msgPlaceholders.sound') }}
                </template>
                <CustomMsg v-else-if="msgType === MsgTypeEnum.CUSTOM" :last-msg="lastMsg" />
                <template v-else-if="msgType === MsgTypeEnum.FILE">
                  {{ $t('msgPlaceholders.file') }}
                </template>
                <template v-else-if="msgType === MsgTypeEnum.LOCATION">
                  {{ $t('msgPlaceholders.location') }}
                </template>
                <template v-else-if="msgType === MsgTypeEnum.VIDEO">
                  {{ $t('msgPlaceholders.video') }}
                </template>
                <template v-else-if="msgType === MsgTypeEnum.MERGE">
                  {{ lastMsg.message_elem_array[0].merge_elem_title }}
                </template>
              </template>
            </template>
          </n-ellipsis>
          <div class="flex-center w-16px text-gray-300">
            <icon-fa6-regular:bell-slash v-if="props.chatUser.conv_recv_opt === 2" />
          </div>
        </div>
      </div>
      <icon-codicon:pinned-small v-if="props.chatUser.conv_is_pinned" class="absolute top-2px right-2px color-gray" />
    </div>
    <context-menu :visible="dropdown.visible" :current-conv="dropdown.currentConv" :x="dropdown.x" :y="dropdown.y"
      @update:visible="handleDropdownVisible" />
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'

import { ConvRecvOptEnum } from '@/constants/conv'
import { MsgTypeEnum } from '@/constants/msg'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { formatterChatLastMsgTime } from '@/utils/common/datetime'
import { transformEmojiText } from '@/utils/common/emoji'
import ContextMenu from './components/context-menu/index.vue'
import CustomMsg from './components/custom-msg/index.vue'

interface DropdownConfig {
  visible: boolean
  x: number
  y: number
  currentConv: any
}

interface Props {
  chatUser: any
  isActive: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
})

const chatStore = useChatStore()

const dropdown: DropdownConfig = reactive({
  visible: false,
  x: 0,
  y: 0,
  currentConv: null
})

const msgType = computed(() => props.chatUser.conv_last_msg.message_elem_array[0]?.elem_type)
const lastMsg = computed(() => props.chatUser.conv_last_msg)

function setDropdown(config: Partial<DropdownConfig>) {
  Object.assign(dropdown, config)
}

let isClickContextMenu = false

function handleDropdownVisible(visible: boolean) {
  if (!isClickContextMenu) {
    setDropdown({ visible })
  }
}

/** 点击右键菜单 */
async function handleContextMenu(e: MouseEvent) {
  e.preventDefault()

  const { clientX, clientY } = e

  isClickContextMenu = true

  const DURATION = dropdown.visible ? 150 : 0

  setDropdown({ visible: false })

  setTimeout(() => {
    setDropdown({
      visible: true,
      x: clientX,
      y: clientY,
      currentConv: props.chatUser
    })
    isClickContextMenu = false
  }, DURATION)
}

function handleClickUser() {
  if (props.chatUser.conv_id === chatStore.currentConvUserID) {
    return
  }
  chatStore.setCurrentConvID(props.chatUser.conv_id)
}
</script>

<style lang="scss">
#chat-user {
  .text-msg {
    vertical-align: middle;

    img {
      display: inline-block;
      margin-right: 4px;
      width: 12px;
      height: 12px;
    }
  }
}
</style>
