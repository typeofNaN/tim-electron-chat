<template>
  <n-dropdown :show="dropdownVisible" size="small" :options="options" placement="bottom-start" :x="x" :y="y"
    @clickoutside="hide" @select="handleDropdown" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { DropdownDividerOption, DropdownOption } from 'naive-ui'

import { ConvRecvOptEnum, ConvTypeEnum } from '@/constants/conv'
import { useIconRender } from '@/composables'
import { $t } from '@/locales'
import { useChatStore } from '@/store'

defineOptions({ name: 'ContextMenu' })

// 聊天存储
const chatStore = useChatStore()

interface Props {
  /** 右键菜单可见性 */
  visible?: boolean
  /** 当前会话 */
  currentConv?: any
  /** 鼠标x坐标 */
  x: number
  /** 鼠标y坐标 */
  y: number
}

// 组件属性默认值
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  currentConv: null
})

interface Emits {
  (e: 'update:visible', visible: boolean): void
}

// 组件事件
const emit = defineEmits<Emits>()

// 图标渲染
const { iconRender } = useIconRender()

// 下拉菜单显示状态
const dropdownVisible = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  }
})

/**
 * 隐藏下拉菜单
 */
function hide() {
  dropdownVisible.value = false
}

// 下拉菜单选项的key类型
type DropdownKey =
  | 'chat-top'                              // 置顶聊天
  | 'cancel-top'                            // 取消置顶
  | 'message-without-interruption'          // 消息免打扰
  | 'remove-message-without-interruption'   // 移除消息免打扰
  | 'badge-read'                            // 标记已读
  // | 'badge-unread'                          // 标记未读
  | 'remove-chat-and-clear-message'         // 移除会话并清空消息
  | 'clear-message'                         // 清空消息

// 扩展naive-ui的DropdownOption类型,添加key字段
type Option = DropdownOption | DropdownDividerOption & {
  key: DropdownKey
}

// 下拉菜单选项配置
const options = computed<Option[]>(() => [
  {
    label: $t('page.chat.chatTop'),
    key: 'chat-top',
    show: !props.currentConv?.conv_is_pinned,
    icon: iconRender({ icon: 'memory:table-top-door-one-way-up' })
  },
  {
    label: $t('page.chat.cancelTop'),
    key: 'cancel-top',
    show: props.currentConv?.conv_is_pinned,
    icon: iconRender({ icon: 'memory:table-top-door-one-way-down' })
  },
  {
    label: $t('page.chat.messageWithoutInterruption'),
    key: 'message-without-interruption',
    show: props.currentConv?.conv_recv_opt === ConvRecvOptEnum.RECEIVE,
    icon: iconRender({ icon: 'fa6-regular:bell-slash' })
  },
  {
    label: $t('page.chat.removeMessageWithoutInterruption'),
    key: 'remove-message-without-interruption',
    show: props.currentConv?.conv_recv_opt === ConvRecvOptEnum.NOT_NOTICE,
    icon: iconRender({ icon: 'fa6-regular:bell' })
  },
  {
    label: $t('page.chat.badgeRead'),
    key: 'badge-read',
    show: props.currentConv?.conv_unread_num > 0,
    icon: iconRender({ icon: 'mdi:eye-outline' })
  },
  // {
  //   label: $t('page.chat.badgeUnRead'),
  //   key: 'badge-unread',
  //   icon: iconRender({ icon: 'mdi:eye-off-outline' })
  // },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: $t('page.chat.removeChatAndClearMessage'),
    key: 'remove-chat-and-clear-message',
    icon: iconRender({ icon: 'tabler:message-off' })
  },
  {
    label: $t('page.chat.clearMessage'),
    key: 'clear-message',
    icon: iconRender({ icon: 'lucide:remove-formatting' })
  }
])

// 下拉菜单选项对应的操作映射
const actionMap = new Map<DropdownKey, () => void>([
  [
    'chat-top',
    () => {
      chatStore.setConvPinConversation(props.currentConv.conv_id, props.currentConv.conv_type, true)
    }
  ],
  [
    'cancel-top',
    () => {
      chatStore.setConvPinConversation(props.currentConv.conv_id, props.currentConv.conv_type, false)
    }
  ],
  [
    'message-without-interruption',
    () => {
      if (props.currentConv.conv_type === ConvTypeEnum.C2C) {
        chatStore.setConvRecvStatus(props.currentConv.conv_id, ConvRecvOptEnum.NOT_NOTICE)
      }
    }
  ],
  [
    'remove-message-without-interruption',
    () => {
      if (props.currentConv.conv_type === ConvTypeEnum.C2C) {
        chatStore.setConvRecvStatus(props.currentConv.conv_id, ConvRecvOptEnum.RECEIVE)
      }
    }
  ],
  [
    'badge-read',
    () => {
      chatStore.reportRead({
        conv_id: props.currentConv.conv_id,
        conv_type: props.currentConv.conv_type
      })
    }
  ],
  // [
  //   'badge-unread',
  //   () => {
  //   }
  // ],
  [
    'remove-chat-and-clear-message',
    () => {
      window.$dialog?.warning({
        title: $t('page.chat.removeChat'),
        content: $t('page.chat.sureRemoveChatAndClearMessage'),
        positiveText: $t('common.confirm'),
        negativeText: $t('common.cancel'),
        onPositiveClick: async () => {
          const res = await chatStore.deleteConv(props.currentConv.conv_id, props.currentConv.conv_type)
          if (res) {
            window.$message?.success($t('common.success'))
          } else {
            window.$message?.error($t('common.fail'))
          }
        }
      })
    }
  ],
  [
    'clear-message',
    () => {
      window.$dialog?.warning({
        title: $t('page.chat.clearMessage'),
        content: $t('page.chat.sureClearMessage'),
        positiveText: $t('common.confirm'),
        negativeText: $t('common.cancel'),
        onPositiveClick: async () => {
          const res = await chatStore.clearConvMsg({
            conv_id: props.currentConv.conv_id,
            conv_type: props.currentConv.conv_type
          })
          if (res) {
            window.$message?.success($t('common.success'))
          } else {
            window.$message?.error($t('common.fail'))
          }
        }
      })
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
  hide()
}
</script>
