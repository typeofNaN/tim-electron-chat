import { MsgTypeEnum } from '@/constants/msg'
import { $t } from '@/locales'
import { router } from '@/router'
import { useChatStore } from '@/store'

const { ipcRenderer } = require('electron')

/**
 * 发送系统通知
 * @description 当收到新消息时,发送系统通知提醒用户
 * @param {any} message - 消息对象,包含发送者信息和消息内容
 * @param {object} message.message_sender_profile - 消息发送者的个人资料
 * @param {string} message.message_sender_profile.user_profile_friend_remark - 发送者的好友备注名
 * @param {string} message.message_sender_profile.user_profile_nickname - 发送者的昵称
 * @param {string} message.message_sender_profile.user_profile_identifier - 发送者的用户ID
 * @param {array} message.message_elem_array - 消息内容数组
 */
export function sendNotification(message: any) {
  // 获取消息发送者信息和消息内容
  const sender = message.message_sender_profile
  const msg = message.message_elem_array[0]

  if (sender && msg) {
    // 根据消息类型获取要显示的消息内容
    let msgContent = ''
    switch (msg.elem_type) {
      case MsgTypeEnum.TEXT: {
        // 文本消息超过15个字符则截断并添加省略号
        const maxLength = 15
        msgContent = msg.text_elem_content.length > maxLength
          ? `${msg.text_elem_content.slice(0, maxLength)}...`
          : msg.text_elem_content
        break
      }
      case MsgTypeEnum.IMAGE:
        // 图片消息,显示[图片]占位符
        msgContent = $t('msgNotification.image')
        break
      case MsgTypeEnum.SOUND:
        // 语音消息,显示[语音]占位符
        msgContent = $t('msgNotification.sound')
        break
      case MsgTypeEnum.CUSTOM:
        // 自定义消息,显示[自定义消息]占位符
        msgContent = $t('msgNotification.customMessage')
        if (msg.custom_elem_data?.data?.subtype === 'call') {
          if (msg.custom_elem_data?.data?.content?.isVideoCall === 'Y') {
            msgContent = $t('msgNotification.inviteVideoChat', { userName: '' })
          } else if (msg.custom_elem_data?.data?.content?.isVideoCall === 'N') {
            msgContent = $t('msgNotification.inviteVoiceChat', { userName: '' })
          }
        } else if (msg.custom_elem_data?.data?.subtype === 'new_friend_online') {
          msgContent = $t('page.chat.friendIsOnline')
        }
        break
      case MsgTypeEnum.FILE:
        // 文件消息,显示[文件]占位符
        msgContent = $t('msgNotification.file')
        break
      case MsgTypeEnum.VIDEO:
        // 视频消息,显示[视频]占位符
        msgContent = $t('msgNotification.video')
        break
      default: {
        // 其他未知类型的消息,显示默认提示语
        msgContent = $t('msgNotification.sendAMessageToYou')
        break
      }
    }

    // 发送系统通知,优先显示备注名>昵称>用户ID作为通知标题
    const notification = new Notification(
      `${sender.user_profile_friend_remark || sender.user_profile_nick_name || sender.user_profile_identifier}`,
      {
        body: msgContent // 通知内容为消息内容
      }
    )

    notification.onclick = () => {
      const chatStore = useChatStore()
      const conv = chatStore.convChatList.find(i => i.conv_id === message.message_conv_id)
      if (conv) {
        chatStore.setCurrentConvID(conv.conv_id)
        if (router.currentRoute.value.name !== 'home') {
          router.push({
            name: 'home'
          })
        }
        ipcRenderer.send('showWindow')
      }
    }
  }
}