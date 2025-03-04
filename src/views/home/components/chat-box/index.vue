<template>
  <div class="h-full">
    <div class="h-50px bg-#f9f9f9 dark:bg-#1a1a1a flex justify-between items-center px-20px select-none">
      <div class="flex items-center flex-grow-1 h-full text-18px overflow-hidden  whitespace-nowrap text-ellipsis">
        {{ chatStore.currentConv.conv_show_name }}
      </div>
      <ChatSetting v-if="[ConvTypeEnum.C2C, ConvTypeEnum.GROUP].includes(chatStore.currentConv.conv_type)" />
    </div>
    <div id="chat-box-container" class="relative h-[calc(100%-50px)] bg-#fff dark:bg-#000 overflow-hidden">
      <n-split direction="vertical" :default-size="0.72" :max="0.8" :min="0.3" :resize-trigger-size="2">
        <template #1>
          <ChatMessage @forwardMsg="handleForwardMsg" />
        </template>
        <template #2>
          <div class="relative h-full">
            <MultiSelect v-if="chatStore.isOpenMultiSelect" @sendMergeData="handleSendMergeData"
              @forwardByItem="handleForwardByItem" />
            <div class="h-full">
              <div class="h-40px bg-#f9f9f9 dark:bg-#1a1a1a flex justify-between items-center px-10px">
                <div class="flex items-center">
                  <Emojis @choose-emojis="emojisClick" />
                  <SendImage />
                  <SendVideo />
                  <SendFile />
                  <div
                    class="flex-center mr-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer">
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <icon-ri:chat-history-line />
                      </template>
                      {{ $t('chat.chatHistory') }}
                    </n-tooltip>
                  </div>
                </div>
                <div class="flex items-center">
                  <div
                    class="flex-center ml-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer">
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <icon-material-symbols:camera-video-outline-rounded />
                      </template>
                      {{ $t('chat.videoChat') }}
                    </n-tooltip>
                  </div>
                  <div
                    class="flex-center ml-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer">
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <icon-tabler:phone />
                      </template>
                      {{ $t('chat.voiceCall') }}
                    </n-tooltip>
                  </div>
                </div>
              </div>
              <div id="chat-input-box" tabindex="0" class="h-[calc(100%-40px)] p-10px">
                <n-scrollbar class="h-[calc(100%-40px)]">
                  <div id="chat-input-textarea" ref="chatInputTextarea" class="h-full cursor-text outline-none"
                    contenteditable="true" @paste="handlePaste" @contextmenu="handleContextMenu">
                  </div>
                  <n-dropdown :show="dropdownVisible" size="small" :options="dropdownOptions" placement="bottom-start"
                    :x="dropdownX" :y="dropdownY" @clickoutside="hideDropdown" @select="handleDropdown" />
                </n-scrollbar>
                <div class="flex justify-end items-center h-40px">
                  <n-button type="primary" strong secondary @click="sendMsg">
                    <template #icon>
                      <icon-tabler:send class="text-16px" />
                    </template>
                    {{ $t('chat.send') }}
                  </n-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </n-split>
    </div>
    <ForwardToFriend ref="forwardToFriendRef" />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import { ConvTypeEnum } from '@/constants/conv'
import { MsgTypeEnum } from '@/constants/msg'
import { useClipboard } from '@/hooks'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { getFileBase64Data } from '@/utils/common/file'
import ChatSetting from './components/chat-setting/index.vue'
import MultiSelect from './components/multi-select/index.vue'
import ChatMessage from '../chat-message/index.vue'
import Emojis from './components/emojis/index.vue'
import SendImage from './components/send-image/index.vue'
import SendVideo from './components/send-video/index.vue'
import SendFile from './components/send-file/index.vue'
import ForwardToFriend from '../forward-to-friend/index.vue'

const { ipcRenderer } = require('electron')

const chatStore = useChatStore()

const chatInputTextarea = ref()

const forwardToFriendRef = ref()
let range: Range | null = null

watch(
  () => chatStore.currentConvUserID,
  () => {
    nextTick(() => {
      chatInputTextarea.value.innerHTML = ''
      chatInputTextarea.value.focus()
    })
  },
  {
    immediate: true
  }
)

onMounted(() => {
  if (chatInputTextarea.value) {
    chatInputTextarea.value.addEventListener('blur', handlerBlurFn)
    chatInputTextarea.value.addEventListener('keydown', handleKeydownFn)
  }
})

onUnmounted(() => {
  if (chatInputTextarea.value) {
    chatInputTextarea.value.removeEventListener('blur', handlerBlurFn)
    chatInputTextarea.value.removeEventListener('keydown', handleKeydownFn)
  }
})

function handlerBlurFn() {
  range = saveSelection()
}

function handleKeydownFn(e: KeyboardEvent) {
  if (e.key === 'Enter' && (navigator.userAgent.indexOf('Mac') !== -1 ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
    document.execCommand('InsertLineBreak')
  } else if (e.key === 'Enter') {
    e.preventDefault()
    sendMsg()
  }
}

function saveSelection() {
  if (window.getSelection) {
    const selection = window.getSelection() as Selection
    if (selection && selection.getRangeAt && selection.rangeCount) {
      return selection.getRangeAt(0)
    }
    return null
  } else if (
    // @ts-ignore
    document.selection && document.selection.createRange
  ) {
    // @ts-ignore
    return document.selection.createRange()
  }

  return null
}

function restoreSelection(range: Range | null) {
  if (range) {
    if (window.getSelection) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }
}

function handleCopy(e: ClipboardEvent) {
  console.log(e)
}

function handlePaste(e: ClipboardEvent) {
  if (e.clipboardData) {
    const clipboardData = e.clipboardData
    if (clipboardData.files && clipboardData.files.length > 0) {
      mapFile(clipboardData.files)
      return
    }
    if (clipboardData.items && clipboardData.items.length > 0) {
      mapFile(clipboardData.items)
      return
    }
  }
}

function mapFile(files: DataTransferItemList | FileList) {
  for (let i = 0; i < files.length; i++) {
    if (files[i].type && files[i].type.split('/')[0] === 'image') {
      getFileBase64Data(files[i] as File)
        .then(res => {
          ipcRenderer.send('saveBase64ImageFile', {
            userId: chatStore.userID,
            convId: chatStore.currentConvUserID,
            base64: res,
            fileType: 'png'
          })
          ipcRenderer.once('saveBase64ImageFileRes', (event, data) => {
            const imgElement = document.createElement('img')
            imgElement.src = res
            imgElement.setAttribute('data-file-path', data.path)
            chatInputTextarea.value.append(imgElement)
            imgElement.addEventListener('copy', (e: ClipboardEvent) => {
              handleCopy(e)
            })
          })
        })
        .catch(err => { })
    }
  }
}

function emojisClick(emojisChar: string) {
  // chatInputTextarea.value.append(emojisChar)
  chatInputTextarea.value.focus()
  restoreSelection(range)
  document.execCommand('insertText', true, emojisChar)
}

async function sendMsg() {
  if (!chatInputTextarea.value.innerHTML) {
    return
  }
  const htmlContent = chatInputTextarea.value.innerHTML
  const contentArray = []
  let currentText = ''
  let currentTag = ''
  let inTag = false

  for (let i = 0; i < htmlContent.length; i++) {
    if (htmlContent[i] === '<') {
      if (currentText) {
        contentArray.push({
          type: 'text',
          content: currentText
        })
        currentText = ''
      }
      inTag = true
      currentTag += htmlContent[i]
    } else if (htmlContent[i] === '>') {
      inTag = false
      currentTag += htmlContent[i]

      // Parse img tag
      if (currentTag.startsWith('<img')) {
        const srcMatch = currentTag.match(/data-file-path="([^"]*)"/)
        if (srcMatch) {
          contentArray.push({
            type: 'image',
            content: srcMatch[1]
          })
        }
      }
      currentTag = ''
    } else if (inTag) {
      currentTag += htmlContent[i]
    } else {
      currentText += htmlContent[i]
    }
  }

  if (currentText) {
    contentArray.push({
      type: 'text',
      content: currentText
    })
  }

  console.log('Content array:', contentArray)
  contentArray.forEach(async item => {
    if (item.type === 'text') {
      chatStore.sendMsg(
        chatStore.currentConv.conv_id,
        chatStore.currentConv.conv_type,
        {
          message_elem_array: [
            {
              elem_type: MsgTypeEnum.TEXT,
              text_elem_content: item.content
            }
          ]
        }
      )
    } else if (item.type === 'image') {
      chatStore.sendMsg(
        chatStore.currentConv.conv_id,
        chatStore.currentConv.conv_type,
        {
          message_elem_array: [
            {
              elem_type: MsgTypeEnum.IMAGE,
              image_elem_orig_path: item.content
            }
          ]
        }
      )
    }
  })
  chatInputTextarea.value.innerHTML = ''
}

function handleSendMergeData(data: any) {
  forwardToFriendRef.value.openChooseFriendModal(data)
}

function handleForwardByItem(data: any) {
  forwardToFriendRef.value.openChooseFriendModalByItem(data)
}

function handleForwardMsg(data: any) {
  forwardToFriendRef.value.openChooseFriendModal(data)
}

const { copyText } = useClipboard()

const dropdownVisible = ref(false)
const dropdownX = ref(0)
const dropdownY = ref(0)
const dropdownOptions = computed(() => [
  {
    label: $t('page.chat.msg.copy'),
    key: 'copy'
  },
  {
    label: $t('page.chat.msg.paste'),
    key: 'paste'
  }
])

function handleContextMenu(e: MouseEvent) {
  e.preventDefault()
  const { clientX, clientY } = e

  dropdownX.value = clientX
  dropdownY.value = clientY

  dropdownVisible.value = true
}

function hideDropdown() {
  dropdownVisible.value = false
}

type DropdownKey =
  | 'copy'      // 复制
  | 'paste'     // 粘贴
const actionMap = new Map<DropdownKey, () => void>([
  [
    'copy',
    () => {
      copyText(chatInputTextarea.value.innerHTML)
    }
  ],
  [
    'paste',
    () => {
      chatInputTextarea.value.focus()
      document.execCommand('paste')
      const range = document.createRange()
      const selection = window.getSelection() as Selection
      range.setStart(chatInputTextarea.value, chatInputTextarea.value.childNodes.length)
      range.setEnd(chatInputTextarea.value, chatInputTextarea.value.childNodes.length)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  ]
])

function handleDropdown(optionKey: string) {
  const key = optionKey as DropdownKey
  const actionFunc = actionMap.get(key)
  if (actionFunc) {
    actionFunc()
  }
  hideDropdown()
}
</script>

<style lang="scss">
#chat-input-textarea {
  user-modify: read-write-plaintext-only;
  -webkit-user-modify: read-write-plaintext-only;

  img {
    display: inline;
    max-height: 60px;
    object-fit: contain;
    border: 1px solid #eee;
  }
}

#chat-input-box {
  .n-scrollbar-content {
    height: 100%;
  }
}
</style>