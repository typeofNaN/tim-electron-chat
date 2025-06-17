import { computed, ref, watch } from 'vue'
import { DropdownDividerOption, DropdownOption } from 'naive-ui'

import { useIconRender } from '@/composables'
import { MsgTypeEnum } from '@/constants/msg'
import { useClipboard } from '@/hooks'
import { $t } from '@/locales'
import { useChatStore } from '@/store'

const { ipcRenderer } = require('electron')

/**
 * 下拉菜单选项的key类型
 */
type DropdownKey =
  | 'download'    // 下载
  | 'mutedPlay'   // 静音播放
  | 'copy'        // 复制
  | 'speak'       // 朗读
  | 'forward'     // 转发
  | 'multiSelect' // 多选
  | 'quote'       // 引用
  | 'edit'        // 编辑
  | 'delete'      // 删除
  | 'revoke'      // 撤回

/**
 * 扩展naive-ui的DropdownOption类型,添加key字段
 */
type Option = DropdownOption | DropdownDividerOption & {
  key: DropdownKey
}

/**
 * 消息下拉菜单hook
 * @param msg - 消息对象
 * @returns 下拉菜单相关的状态和方法
 */
export default function useMsgDropdown(msg: any, cbOptions?: any) {
  const { copyText } = useClipboard()

  const { iconRender } = useIconRender()

  const chatStore = useChatStore()

  // 下拉菜单显示状态
  const dropdownVisible = ref(false)
  // 下拉菜单显示时间
  const dropdownVisibleTime = ref(0)
  // 下拉菜单x坐标
  const dropdownX = ref(0)
  // 下拉菜单y坐标
  const dropdownY = ref(0)

  // 消息类型
  const msgType = computed(() => msg.message_elem_array[0].elem_type)
  // 是否是自己发送的消息
  const isMyMsg = computed(() => msg.message_sender === chatStore.myInfo.user_profile_identifier)

  watch(
    () => dropdownVisible.value,
    (val) => {
      if (val) {
        dropdownVisibleTime.value = Math.floor(new Date().getTime() / 1000)
      }
    }
  )

  /**
   * 下拉菜单选项配置
   */
  const dropdownOptions = computed<Option[]>(() => [
    {
      label: $t('page.chat.msg.download'),
      key: 'download',
      show: msgType.value === MsgTypeEnum.FILE,
      icon: iconRender({ icon: 'solar:download-minimalistic-outline' })
    },
    {
      label: $t('page.chat.msg.mutedPlay'),
      key: 'mutedPlay',
      show: msgType.value === MsgTypeEnum.VIDEO,
      icon: iconRender({ icon: 'fluent:speaker-off-24-regular' })
    },
    {
      label: $t('page.chat.msg.copy'),
      key: 'copy',
      show: [
        MsgTypeEnum.TEXT,
        MsgTypeEnum.IMAGE,
        MsgTypeEnum.FILE,
        MsgTypeEnum.VIDEO
      ].includes(msgType.value),
      icon: iconRender({ icon: 'ci:copy' })
    },
    {
      label: $t('page.chat.msg.speak'),
      key: 'speak',
      show: msgType.value === MsgTypeEnum.TEXT,
      icon: iconRender({ icon: 'fluent:speaker-2-16-regular' })
    },
    {
      label: $t('page.chat.msg.forward'),
      key: 'forward',
      show: [
        MsgTypeEnum.TEXT,
        MsgTypeEnum.IMAGE,
        MsgTypeEnum.SOUND,
        MsgTypeEnum.FILE,
        MsgTypeEnum.LOCATION,
        MsgTypeEnum.VIDEO,
        MsgTypeEnum.MERGE
      ].includes(msgType.value) ||
        (msgType.value === MsgTypeEnum.CUSTOM && msg.message_elem_array[0].custom_elem_data.subtype !== 'new_friend_online'),
      icon: iconRender({ icon: 'material-symbols:forward' })
    },
    {
      label: $t('page.chat.msg.multiSelect'),
      key: 'multiSelect',
      show: !(msgType.value === MsgTypeEnum.CUSTOM && msg.message_elem_array[0].custom_elem_data.subtype === 'new_friend_online'),
      icon: iconRender({ icon: 'ic:outline-checklist' })
    },
    {
      label: $t('page.chat.msg.quote'),
      key: 'quote',
      icon: iconRender({ icon: 'bxs:quote-alt-right' }),
      show: [
        MsgTypeEnum.TEXT,
        MsgTypeEnum.IMAGE,
        MsgTypeEnum.SOUND,
        MsgTypeEnum.FILE,
        MsgTypeEnum.VIDEO,
        MsgTypeEnum.MERGE,
        MsgTypeEnum.LOCATION,
      ].includes(msgType.value) ||
        (
          msgType.value === MsgTypeEnum.CUSTOM &&
          ['personal_card', 'grouped_photos'].includes(msg.message_elem_array[0].custom_elem_data.subtype)
        )
    },
    {
      label: $t('page.chat.msg.edit'),
      key: 'edit',
      icon: iconRender({ icon: 'ic-round-edit' }),
      show: isMyMsg.value &&
        // 超出15分钟后不可编辑
        (dropdownVisibleTime.value - msg.message_server_time) <= 60 * 15 &&
        // 已编辑过的不可编辑
        (msg.message_cloud_custom_str && !msg.message_cloud_custom_str.editContent) &&
        [
          MsgTypeEnum.TEXT,
          MsgTypeEnum.IMAGE,
          MsgTypeEnum.SOUND,
          MsgTypeEnum.FILE,
          MsgTypeEnum.VIDEO
        ].includes(msgType.value)
    },
    {
      type: 'divider',
      key: 'd1'
    },
    {
      label: $t('page.chat.msg.delete'),
      key: 'delete',
      icon: iconRender({ icon: 'material-symbols:delete-outline' })
    },
    {
      label: $t('page.chat.msg.revoke'),
      key: 'revoke',
      show: isMyMsg.value && dropdownVisibleTime.value - msg.message_server_time <= 60,
      icon: iconRender({ icon: 'material-symbols:undo' })
    }
  ])

  /**
   * 处理右键点击事件,显示下拉菜单
   * @param e - 鼠标事件对象
   */
  function handleContextMenu(e: MouseEvent) {
    e.preventDefault()
    const { clientX, clientY } = e

    dropdownX.value = clientX
    dropdownY.value = clientY

    dropdownVisible.value = true
  }

  /**
   * 隐藏下拉菜单
   */
  function hideDropdown() {
    dropdownVisible.value = false
  }

  /**
   * 下拉菜单选项对应的操作映射
   */
  const actionMap = new Map<DropdownKey, () => void>([
    [
      'download',
      () => {
        ipcRenderer.send('downloadFile', {
          msgId: msg.message_msg_id,
          fileId: msg.message_elem_array[0].file_elem_file_id,
          fileName: msg.message_elem_array[0].file_elem_file_name,
          downloadPath: msg.message_elem_array[0].file_elem_url,
          customSavePath: true,
          openFile: false
        })
      }
    ],
    [
      'mutedPlay',
      () => {
        cbOptions.videoMutedPlay()
      }
    ],
    [
      'copy',
      () => {
        switch (msgType.value) {
          case MsgTypeEnum.TEXT: {
            copyText(msg.message_elem_array[0].text_elem_content)
            break
          }
          case MsgTypeEnum.IMAGE: {
            ipcRenderer.send('copyFile', {
              userId: chatStore.userID,
              convId: chatStore.currentConvUserID,
              fileId: msg.message_elem_array[0].image_elem_orig_id,
              downloadPath: msg.message_elem_array[0].image_elem_orig_url
            })
            break
          }
          case MsgTypeEnum.FILE: {
            ipcRenderer.send('copyFile', {
              userId: chatStore.userID,
              convId: chatStore.currentConvUserID,
              fileId: msg.message_elem_array[0].file_elem_file_id,
              downloadPath: msg.message_elem_array[0].file_elem_url
            })
            break
          }
          case MsgTypeEnum.VIDEO: {
            ipcRenderer.send('copyFile', {
              userId: chatStore.userID,
              convId: chatStore.currentConvUserID,
              fileId: msg.message_elem_array[0].video_elem_video_id,
              downloadPath: msg.message_elem_array[0].video_elem_video_url
            })
            break
          }
          default: {
            break
          }
        }
      }
    ],
    [
      'speak',
      () => {
        // 创建语音合成对象
        const ssu = new window.SpeechSynthesisUtterance()
        // 设置要朗读的文本内容
        ssu.text = msg.message_elem_array[0].text_elem_content
        // 开始朗读文本
        window.speechSynthesis.speak(ssu)
      }
    ],
    [
      'forward',
      () => {
        cbOptions?.forwardMsg()
      }
    ],
    [
      'multiSelect',
      () => {
        chatStore.setIsMultiSelect(true)
      }
    ],
    [
      'quote',
      () => {
        cbOptions?.quoteMsg()
      }
    ],
    [
      'edit',
      () => {
        cbOptions?.editMsg()
      }
    ],
    [
      'delete',
      () => {
        chatStore.deleteMsg(msg)
      }
    ],
    [
      'revoke',
      () => {
        chatStore.revokeMsg(msg)
      }
    ]
  ])

  /**
   * 处理下拉菜单选项点击
   * @param optionKey - 选项的key
   */
  function handleDropdown(optionKey: string) {
    const key = optionKey as DropdownKey
    const actionFunc = actionMap.get(key)
    if (actionFunc) {
      actionFunc()
    }
    hideDropdown()
  }

  return {
    dropdownVisible,
    dropdownX,
    dropdownY,
    dropdownOptions,
    isMyMsg,
    handleContextMenu,
    handleDropdown,
    hideDropdown
  }
}