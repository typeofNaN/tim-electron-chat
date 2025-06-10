<template>
  <div class="h-full">
    <div class="h-50px bg-#f9f9f9 dark:bg-#1a1a1a flex justify-between items-center px-20px select-none">
      <div class="flex items-center flex-grow-1 h-full text-18px ellipsis-text">
        {{
          chatStore.currentConv.conv_show_name === SystemUserId
            ? $t('chat.systemNotification')
            : chatStore.currentConv.conv_show_name
        }}
      </div>
      <ChatSetting
        v-if="[ConvTypeEnum.C2C, ConvTypeEnum.GROUP].includes(chatStore.currentConv.conv_type) && chatStore.currentConv.conv_show_name !== SystemUserId" />
    </div>
    <div id="chat-box-container" class="relative h-[calc(100%-50px)] bg-#fff dark:bg-#000 overflow-hidden">
      <ChatMessage v-if="chatStore.currentConvID === SystemUserId" @forwardMsg="handleForwardMsg" @editMsg="editMsg"
        @quoteMessage="quoteMsg" />
      <n-split v-else direction="vertical" :default-size="0.72" :max="0.8" :min="0.3" :resize-trigger-size="2">
        <template #1>
          <n-image-group :render-toolbar="renderToolbar">
            <ChatMessage @forwardMsg="handleForwardMsg" @editMsg="editMsg" @quoteMessage="quoteMsg" />
          </n-image-group>
        </template>
        <template #2>
          <div class="relative h-full">
            <multi-select v-if="chatStore.isOpenMultiSelect" @sendMergeData="handleSendMergeData"
              @forwardByItem="handleForwardByItem" />
            <div class="h-full">
              <div class="h-40px bg-#f9f9f9 dark:bg-#1a1a1a flex justify-between items-center px-10px">
                <div class="flex items-center">
                  <Emojis @choose-emojis="emojisClick" />
                  <SendImage :disabled="sendMode !== 'normal'" />
                  <SendVideo :disabled="sendMode !== 'normal'" />
                  <SendFile :disabled="sendMode !== 'normal'" />
                  <div
                    class="flex-center mr-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer">
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <icon-ri:chat-history-line />
                      </template>
                      {{ $t('chat.chatHistory') }}
                    </n-tooltip>
                  </div>
                  <div v-show="sendMode === 'edit'"
                    class="flex-center mr-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer"
                    @click="exitEditMode">
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <icon-ic:sharp-edit-off />
                      </template>
                      {{ $t('chat.exitEditMode') }}
                    </n-tooltip>
                  </div>
                </div>
                <div class="flex items-center">
                  <VideoCall />
                  <VoiceCall />
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
                <div class="flex items-center h-40px"
                  :class="[sendMode === 'quote' ? 'justify-between' : 'justify-end']">
                  <QuoteMsg v-if="sendMode === 'quote'" :msg="currentQuoteMsg" isQuoteMode @exit="exitQuoteMode" />
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
import { computed, h, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ImageRenderToolbarProps } from 'naive-ui'
import { cloneDeep } from 'lodash-es'

import { SystemUserId } from '@/constants/chatConfig'
import { ConvTypeEnum } from '@/constants/conv'
import { MsgTypeEnum } from '@/constants/msg'
import { useClipboard } from '@/hooks'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { getFileBase64Data } from '@/utils/common/file'
import {
  ChatSetting,
  MultiSelect,
  Emojis,
  SendImage,
  SendVideo,
  SendFile,
  VideoCall,
  VoiceCall
} from './components'
import QuoteMsg from '../chat-message/components/quote-msg/index.vue'
import ChatMessage from '../chat-message/index.vue'
import ForwardToFriend from '../forward-to-friend/index.vue'

type SendMode = 'normal' | 'edit' | 'quote'

const { ipcRenderer } = require('electron')

const chatStore = useChatStore()

const chatInputTextarea = ref()

const forwardToFriendRef = ref()
let range: Range | null = null

const sendMode = ref<SendMode>('normal')

let currentEditMsg: any = null
const currentQuoteMsg = ref<any>(null)

watch(
  () => chatStore.currentConvUserID,
  () => {
    nextTick(() => {
      exitEditMode()
      exitQuoteMode()
      if (chatInputTextarea.value) {
        chatInputTextarea.value.innerHTML = ''
        chatInputTextarea.value.focus()
      }
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

  switch (sendMode.value) {
    case 'edit': {
      currentEditMsg.message_cloud_custom_str = currentEditMsg.message_cloud_custom_str
        ? JSON.parse(currentEditMsg.message_cloud_custom_str)
        : {}
      currentEditMsg.message_cloud_custom_str.editContent = {
        count: 1,
        text: chatInputTextarea.value.innerHTML
      }
      currentEditMsg.message_cloud_custom_str = currentEditMsg.message_cloud_custom_str
        ? JSON.stringify(currentEditMsg.message_cloud_custom_str)
        : ''
      if (currentEditMsg.message_elem_array[0].elem_type === MsgTypeEnum.TEXT) {
        currentEditMsg.message_elem_array[0].text_elem_content = chatInputTextarea.value.innerHTML
      }
      await chatStore.updateMsg(currentEditMsg)
      currentEditMsg = null
      break
    }
    case 'quote': {
      chatStore.sendMsg(
        chatStore.currentConv.conv_id,
        chatStore.currentConv.conv_type,
        {
          message_cloud_custom_str: JSON.stringify({ quoteContent: currentQuoteMsg.value }),
          message_elem_array: [
            {
              elem_type: MsgTypeEnum.TEXT,
              text_elem_content: chatInputTextarea.value.innerHTML
            }
          ]
        }
      )
      currentQuoteMsg.value = null
      break
    }
    default: {
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
      break
    }
  }
  sendMode.value = 'normal'
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

function editMsg(data: any) {
  // 如果在引用模式，则退出编辑模式
  sendMode.value === 'quote' && exitQuoteMode()
  sendMode.value = 'edit'
  currentEditMsg = cloneDeep(data)
  chatInputTextarea.value.innerHTML = ''
  switch (data.message_elem_array[0].elem_type) {
    case MsgTypeEnum.TEXT: {
      chatInputTextarea.value.innerHTML = data.message_elem_array[0].text_elem_content
      break
    }
    default: {
      break
    }
  }
}

function exitEditMode() {
  sendMode.value = 'normal'
  currentEditMsg = null
}

function quoteMsg(data: any) {
  // 如果在编辑模式，则退出编辑模式
  sendMode.value === 'edit' && exitEditMode()
  sendMode.value = 'quote'
  currentQuoteMsg.value = cloneDeep(data)
}

function exitQuoteMode() {
  sendMode.value = 'normal'
  currentQuoteMsg.value = null
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

function renderToolbar({ nodes }: ImageRenderToolbarProps) {
  return [
    nodes.prev,
    nodes.next,
    nodes.rotateClockwise,
    nodes.rotateCounterclockwise,
    nodes.zoomIn,
    nodes.zoomOut,
    nodes.resizeToOriginalSize,
    // rewrite download
    h(
      'div',
      {
        style: {
          marginTop: '5px'
        },
        onClickCapture: (e: any) => {
          e.stopPropagation()
          // 获取当前预览图片，由于naive未提供查看图片url的方法，所以通过dom查找
          const img = document.querySelector('.n-image-preview') as HTMLImageElement
          if (img && img.src) {
            const src = img.src
            const a = document.createElement('a')
            const getFilename = (url: string): string => {
              const lastSlashIndex = url.lastIndexOf('/')
              if (lastSlashIndex !== -1) {
                return url.substring(lastSlashIndex + 1)
              }
              return url
            }
            a.href = src
            a.download = getFilename(src)
            a.click()
            a.remove()
          }
        }
      },
      nodes.download
    ),
    nodes.close
  ]
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