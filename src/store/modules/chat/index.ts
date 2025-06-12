import { h } from 'vue'
import { NButton, NSpace } from 'naive-ui'
import { defineStore } from 'pinia'
import { v4 as uuidV4 } from 'uuid'

import { ConvRecvOptEnum, ConvTypeEnum } from '@/constants/conv'
import { MsgTypeEnum } from '@/constants/msg'
import { $t } from '@/locales'
import { router } from '@/router'
import { formatterBirthday } from '@/utils/common/datetime'
import { sendNotification } from '@/utils/common/notification'
import { useRtcStore } from '../rtc'

const { ipcRenderer } = require('electron')

const TimRender = require('im_electron_sdk/dist/renderer')

/**
 * @description 聊天模块状态接口
 */
interface ChatState {
  /** IM实例 */
  imInstance: any
  /** 用户数据 */
  userData: any
  /** 用户ID */
  userID: string
  /** 用户信息 */
  userInfo: any
  /** 会话列表 */
  convList: any[]
  /** 当前会话ID */
  currentConvID: string
  /** 总未读消息数 */
  totalUnreadCount: number
  /** 会话消息列表 */
  msgList: any[]
  /** 是否打开多选 */
  isMultiSelect: boolean
  /** 多选消息列表 */
  multiSelectMsgList: any[]
}

export const useChatStore = defineStore('chat-store', {
  state: (): ChatState => ({
    imInstance: null,
    userData: null,
    userID: '',
    userInfo: null,
    convList: [],
    currentConvID: '',
    totalUnreadCount: 0,
    msgList: [],
    isMultiSelect: false,
    multiSelectMsgList: []
  }),
  getters: {
    /**
     * @description 获取会话列表
     */
    convChatList(state) {
      return state.convList
    },
    /**
     * @description 获取当前用户ID
     */
    myUserID(state) {
      return state.userID
    },
    /**
     * @description 获取当前用户信息
     */
    myInfo(state) {
      return state.userInfo
    },
    /**
     * @description 获取当前会话用户ID
     */
    currentConvUserID(state) {
      return state.currentConvID
    },
    /**
     * @description 获取当前会话信息
     */
    currentConv(state) {
      return state.convList.find(item => item.conv_id === state.currentConvID)
    },
    /**
     * @description 获取总未读消息数
     */
    totalUnreadMsgCount(state) {
      return state.totalUnreadCount
    },
    /**
     * @description 获取会话消息列表
     */
    chatMsgList(state) {
      return state.msgList
    },
    /**
     * @description 获取是否打开多选
     */
    isOpenMultiSelect(state) {
      return state.isMultiSelect
    },
    /**
     * @description 获取多选消息列表
     */
    multiSelectMessageList(state) {
      return state.multiSelectMsgList
    },
    /**
     * @description 当前聊天列表的媒体集合
     */
    currentMsgListMedia(state) {
      const mediaList: { url: string, type: string }[] = []
      state.msgList.forEach(item => {
        if (item.message_elem_array[0].elem_type === MsgTypeEnum.IMAGE) {
          mediaList.push({
            url: item.message_elem_array[0].image_elem_orig_url,
            type: 'IMAGE'
          })
        } else if (item.message_elem_array[0].elem_type === MsgTypeEnum.VIDEO) {
          mediaList.push({
            url: item.message_elem_array[0].video_elem_video_url,
            type: 'VIDEO'
          })
        } else if (item.message_elem_array[0].elem_type === MsgTypeEnum.CUSTOM && item.message_elem_array[0].custom_elem_data.subtype === 'grouped_photos') {
          item.message_elem_array[0].custom_elem_data.content.medias.forEach((media: any) => {
            if (media.type === 'IMAGE') {
              mediaList.push({
                url: media.imageUrl,
                type: 'IMAGE'
              })
            } else if (media.type === 'VIDEO') {
              mediaList.push({
                url: media.videoUrl,
                type: 'VIDEO'
              })
            }
          })
        }
      })
      return mediaList
    }
  },
  actions: {
    /**
     * @description 初始化IM实例
     */
    initIM() {
      ipcRenderer.send('setupIM', Number(import.meta.env.VITE_TENCENT_CLOUD_SDK_APP_ID))
      this.imInstance = new TimRender()
      this.imInstance.TIMInit()
    },
    /**
     * @description 登录IM
     * @param { string } userID - 用户ID
     * @param { string } userSig - 用户签名
     * @returns { Promise<boolean> } - 登录是否成功
     */
    async loginIM(userID: string, userSig: string) {
      const { code, user_data } = await this.imInstance.TIMLogin({
        userID,
        userSig
      })
      if (code === 0) {
        this.userData = user_data
        this.getTotalUnreadMsgCount()
        this.getConvList()
        this.getMyUserID()
        this.eventCallback()
        return true
      }
      return false
    },
    /**
     * @description 登出IM
     * @returns { Promise<boolean> } - 登出是否成功
     */
    async logoutIM() {
      const { code } = await this.imInstance.TIMLogout({
        userData: this.userData
      })
      this.setCurrentConvID('')
      console.log('logoutIM', code)
      return true
    },
    /**
     * @description 获取登录用户的UserID并更新用户信息
     * @returns { Promise<void> }
     */
    async getMyUserID() {
      const { code, json_param } = await this.imInstance.TIMGetLoginUserID()
      if (code === 0) {
        this.userID = json_param
        this.getMyInfo()
      }
    },
    /**
     * @description 获取并更新登录用户的用户信息
     * @returns { Promise<void> }
     */
    async getMyInfo() {
      this.userInfo = await this.getUserInfo(this.userID)
    },
    /**
     * @description 获取指定用户的用户信息
     * @param { string } userID - 用户ID
     * @returns { Promise<any|null> } - 用户信息对象或null
     */
    async getUserInfo(userID: string) {
      const { code, json_param } = await this.imInstance.TIMProfileGetUserProfileList({
        json_get_user_profile_list_param: {
          friendship_getprofilelist_param_identifier_array: [userID],
          friendship_getprofilelist_param_force_update: false
        },
        user_data: this.userData
      })
      console.log('UserInfo', json_param)
      if (code === 0) {
        const data = { ...json_param[0] }
        data.user_profile_birthday = formatterBirthday(data.user_profile_birthday || 19900101)
        return data
      }
      return null
    },
    /**
     * @description 更新用户个人信息
     * @param { any } userInfo - 要更新的用户信息
     * @returns { Promise<boolean> } - 更新是否成功
     */
    async updateSelfUserProfile(userInfo: any) {
      const { code } = await this.imInstance.TIMProfileModifySelfUserProfile({
        json_modify_self_user_profile_param: userInfo,
        user_data: this.userData
      })
      console.log('updateSelfUserProfile', code)
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 创建会话
     * @param { any } data - 创建会话的相关参数
     * @returns { Promise<boolean> } - 创建是否成功
     */
    async createConv(data: any) {
      if (this.convList.find(item => item.conv_id === data.conv_id)) {
        this.setCurrentConvID(data.conv_id)
        return true
      }
      // 此接口已废弃，改用手动发送消息创建会话
      // const { code } = await this.imInstance.TIMConvCreate({
      //   ...data,
      //   userData: this.userData
      // })
      // console.log('创建会话响应', code)
      // if (code === 0) {
      //   await this.setCurrentConvID(data.conv_id)
      //   return true
      // }
      // return false
      const insertIndex = this.convList.findIndex(item => item.conv_is_pinned === false)
      this.convList.splice(insertIndex, 0, {
        ...data,
        conv_is_pinned: false,
        conv_last_msg: null,
        conv_recv_opt: ConvRecvOptEnum.RECEIVE
      })
      this.setCurrentConvID(data.conv_id)
      return true
    },
    /**
     * @description 获取并更新会话列表
     * @returns { Promise<void> }
     */
    async getConvList() {
      const { code, json_param } = await this.imInstance.TIMConvGetConvList({
        user_data: this.userData
      })
      console.log('convList', json_param)
      if (code === 0) {
        this.convList = json_param
      }
    },
    /**
     * @description 设置会话置顶状态
     * @param { string } convId - 会话ID
     * @param { number } convType - 会话类型
     * @param { boolean } isPinned - 是否置顶
     * @returns { Promise<boolean> } - 设置是否成功
     */
    async setConvPinConversation(convId: string, convType: number, isPinned: boolean) {
      const { code } = await this.imInstance.TIMConvPinConversation({
        convId,
        convType,
        isPinned,
        user_data: this.userData
      })
      console.log('设置会话置顶', code)
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 获取单聊会话接收消息状态
     * @param { string } convId - 会话ID
     * @returns { Promise<any[]> } - 返回会话接收消息状态列表,如果获取失败则返回空数组
     */
    async getConvRecvStatus(convId: string) {
      const { code, json_params } = await this.imInstance.TIMMsgGetC2CReceiveMessageOpt({
        params: [convId],
        user_data: this.userData
      })
      console.log('getConvRecvStatus', code)
      if (code === 0) {
        return json_params
      }
      return []
    },
    /**
     * @description 设置单聊会话接收消息状态
     * @param { string } convId - 会话ID
     * @param { number } recvOpt - 接收消息状态
     * @returns { Promise<boolean> } - 设置是否成功
     */
    async setConvRecvStatus(convId: string, recvOpt: number) {
      const { code } = await this.imInstance.TIMMsgSetC2CReceiveMessageOpt({
        params: [convId],
        opt: recvOpt,
        user_data: this.userData
      })
      console.log('setConvRecvStatus', code)
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 删除会话
     * @param { string } convId - 会话ID
     * @param { ConvTypeEnum } convType - 会话类型
     * @returns { Promise<boolean> } - 删除是否成功
     */
    async deleteConv(convId: string, convType: ConvTypeEnum) {
      const { code } = await this.imInstance.TIMConvDelete({
        convId,
        convType,
        user_data: this.userData
      })
      console.log('deleteConv', code)
      if (code === 0) {
        // 如果删除的是当前会话，则将当前会话ID设置为空
        if (this.currentConvID === convId) {
          this.setCurrentConvID('')
        }
        return true
      }
      return false
    },
    /**
     * @description 清空会话消息记录
     * @param { any } data - 清空消息的相关参数
     * @returns { Promise<boolean> } - 清空是否成功
     */
    async clearConvMsg(data: any) {
      const { code } = await this.imInstance.TIMMsgClearHistoryMessage({
        ...data,
        user_data: this.userData
      })
      console.log('clearConvMsg', code)
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 设置当前选中的会话ID
     * @param { string } convID - 会话ID
     */
    setCurrentConvID(convID: string) {
      this.currentConvID = convID
      this.msgList = []
      if (convID) {
        this.getConvMsgList(this.currentConv)
      }
      this.setIsMultiSelect(false)
      if (this.currentConv) {
        this.reportRead({
          conv_id: convID,
          conv_type: this.currentConv.conv_type,
        })
      }
    },
    /**
     * @description 获取并更新总未读消息数
     * @returns { Promise<void> }
     */
    async getTotalUnreadMsgCount() {
      const { code, json_param } = await this.imInstance.TIMConvGetTotalUnreadMessageCount({
        user_data: this.userData
      })
      console.log('TotalUnreadCount', json_param)
      if (code === 0) {
        this.totalUnreadCount = json_param.conv_get_total_unread_message_count_result_unread_count
        ipcRenderer.send('toggleFlashFrame', this.totalUnreadCount > 0)
      }
    },
    /**
     * @description 上报已读消息
     * @param { any } data - 上报已读消息的相关参数
     * @returns { Promise<void> }
     */
    async reportRead(data: any) {
      const { code } = await this.imInstance.TIMMsgReportReaded({
        ...data,
        json_msg_param: data.conv_last_msg || null,
        user_data: this.userData
      })
      console.log('reportRead', code)
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 获取会话消息列表
     * @param { any } data - 获取消息列表的相关参数
     * @param { boolean } - 是否加载历史消息
     */
    async getConvMsgList(data: any, loadHistoryMsg = false) {
      if (!data || !data.conv_last_msg) {
        this.msgList = []
        return
      }
      const postData = {
        conv_id: data.conv_id,
        conv_type: data.conv_type,
        params: {
          msg_getmsglist_param_last_msg: loadHistoryMsg ? data.conv_last_msg : null,
          msg_getmsglist_param_count: 100,
          msg_getmsglist_param_is_ramble: true,
          msg_getmsglist_param_is_forward: false
        },
        user_data: this.userData
      }
      console.log('拉取历史消息请求参数', postData)
      const { code, json_params } = await this.imInstance.TIMMsgGetMsgList(postData)
      // 忽略信令消息
      const filterMsgList = json_params
        .map((item: any) => {
          if (item.message_elem_array[0]?.elem_type === MsgTypeEnum.CUSTOM) {
            item.message_elem_array[0].custom_elem_data = JSON.parse(item.message_elem_array[0].custom_elem_data)
            if (item.message_elem_array[0].custom_elem_data.data && typeof item.message_elem_array[0].custom_elem_data.data === 'string') {
              item.message_elem_array[0].custom_elem_data.data = JSON.parse(item.message_elem_array[0].custom_elem_data.data)
            }
          }
          if (item.message_cloud_custom_str) {
            item.message_cloud_custom_str = JSON.parse(item.message_cloud_custom_str)
          }
          return item
        })
        .filter((item: any) => {
          if (item.message_elem_array[0]?.elem_type === MsgTypeEnum.CUSTOM) {
            return item.message_elem_array[0].custom_elem_data.actionType === void 0
          }
          return true
        })
      console.log('拉取历史消息返回数据', filterMsgList)
      if (code === 0) {
        if (loadHistoryMsg) {
          this.msgList = [...filterMsgList.reverse(), ...this.msgList]
        } else {
          this.msgList = filterMsgList.reverse()
        }
      }
    },
    /**
     * @description 撤回消息
     * @param { any } data - 撤回消息的相关参数
     * @returns { Promise<boolean> } - 撤回是否成功
     */
    async revokeMsg(data: any) {
      const { code } = await this.imInstance.TIMMsgRevoke({
        conv_id: this.currentConv.conv_id,
        conv_type: this.currentConv.conv_type,
        json_msg_param: data,
        user_data: this.userData
      })
      console.log('revokeMsg', code)
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 删除消息
     * @param { any } data - 删除消息的相关参数
     * @returns { Promise<boolean> } - 删除是否成功
     */
    async deleteMsg(data: any) {
      const { code } = await this.imInstance.TIMMsgDelete({
        conv_id: this.currentConv.conv_id,
        conv_type: this.currentConv.conv_type,
        params: {
          msg_delete_param_msg: data,
          msg_delete_param_is_ramble: false
        },
        user_data: this.userData
      })
      console.log('deleteMsg', code)
      if (code === 0) {
        const index = this.msgList.findIndex(item => item.message_msg_id === data.message_msg_id)
        if (index !== -1) {
          this.msgList.splice(index, 1)
        }
        return true
      }
      return false
    },
    /**
     * @description 发送消息
     * @param { string } convId - 会话ID
     * @param { ConvTypeEnum } convType - 会话类型
     * @param { any } msgData - 发送消息的相关参数
     */
    async sendMsg(convId: string, convType: ConvTypeEnum, msgData: any, messageId?: string) {
      await this.imInstance.TIMMsgSendMessageV2({
        params: msgData,
        conv_id: convId,
        conv_type: convType,
        callback: (sendMsgRes: any) => {
          console.log('sendMsgRes', sendMsgRes)
          if (convId === this.currentConvUserID && sendMsgRes.length) {
            if (sendMsgRes[0].code === 0) {
              if (messageId) {
                const index = this.msgList.findIndex(item => item.message_msg_id === messageId)
                if (index !== -1) {
                  this.msgList[index] = JSON.parse(sendMsgRes[0].json_param)
                }
              } else {
                const msg = JSON.parse(sendMsgRes[0].json_param)
                msg.message_cloud_custom_str = msg.message_cloud_custom_str
                  ? JSON.parse(msg.message_cloud_custom_str)
                  : ''
                if (msg.message_elem_array[0]?.elem_type === MsgTypeEnum.CUSTOM) {
                  msg.message_elem_array[0].custom_elem_data = JSON.parse(msg.message_elem_array[0].custom_elem_data)
                  if (msg.message_elem_array[0].custom_elem_data.data && typeof msg.message_elem_array[0].custom_elem_data.data === 'string') {
                    msg.message_elem_array[0].custom_elem_data.data = JSON.parse(msg.message_elem_array[0].custom_elem_data.data)
                  }
                }
                this.msgList.push(msg)
              }
            } else {
              window.$message?.error(sendMsgRes[0].desc)
              if (messageId) {
                const index = this.msgList.findIndex(item => item.message_msg_id === messageId)
                if (index !== -1) {
                  this.msgList[index].message_server_time = 0
                }
              } else {
                this.msgList.push({
                  ...msgData,
                  message_msg_id: uuidV4(),
                  message_client_time: Math.floor(new Date().getTime() / 1000),
                  message_server_time: 0,
                  message_sender: this.userID,
                  message_sender_profile: this.myInfo,
                })
              }
            }
          }
        },
        user_data: this.userData
      })
    },
    /**
     * @description 保存消息
     */
    async saveMsg(convId: string, convType: ConvTypeEnum, msgData: any) {
      const { code, json_params } = await this.imInstance.TIMMsgSaveMsg({
        conv_id: convId,
        conv_type: convType,
        user_data: this.userData,
        params: msgData
      })
      console.log('TIMMsgSaveMsg', code)
      if (code === 0 && this.currentConvID === convId) {
        if (json_params.message_elem_array[0]?.elem_type === MsgTypeEnum.CUSTOM) {
          json_params.message_elem_array[0].custom_elem_data = JSON.parse(json_params.message_elem_array[0].custom_elem_data)
          if (json_params.message_elem_array[0].custom_elem_data.data && typeof json_params.message_elem_array[0].custom_elem_data.data === 'string') {
            json_params.message_elem_array[0].custom_elem_data.data = JSON.parse(json_params.message_elem_array[0].custom_elem_data.data)
          }
        }
        this.pushLocalMsg(json_params)
      }
    },
    /**
     * @description 发送本地消息
     * @param { any } data 本地消息数据
     */
    pushLocalMsg(data: any) {
      this.msgList.push(data)
    },
    /**
     * @description 修改消息
     * @param { any } data 消息数据
     */
    async updateMsg(data: any) {
      const { code, json_param } = await this.imInstance.TIMMsgModifyMessage({
        params: data,
        user_data: this.userData
      })
      console.log('updateMsg', code, json_param)
    },
    /**
     * @description 设置本地消息自定义数据
     * @param { any } data 消息数据
     */
    async setMsgLocalCustomData(data: any) {
      const { code, json_param } = await this.imInstance.TIMMsgSetLocalCustomData({
        json_msg_param: data,
        user_data: this.userData
      })
      console.log('setMsgCustomData', code, json_param)
    },
    /**
     * @description 下载合并消息
     * @param { any } data - 下载合并消息的相关参数
     * @returns { Promise<any[]> } - 返回合并消息列表
     */
    async downloadMergerMessage(data: any) {
      const { code, json_param } = await this.imInstance.TIMMsgDownloadMergerMessage({
        params: data,
        user_data: this.userData
      })
      console.log('downloadMergerMessage', code)
      if (code === 0) {
        return JSON.parse(json_param)
      }
      return []
    },
    /**
     * @description 获取好友列表
     * @returns { Promise<any[]> } - 好友列表数组
     */
    async getFriendList() {
      const { code, json_params } = await this.imInstance.TIMFriendshipGetFriendProfileList({
        user_data: this.userData
      })
      console.log('getFriendList', json_params)
      if (code === 0) {
        return json_params
          .map((friend: any) => ({
            ...friend,
            friend_show_name: friend.friend_profile_remark ||
              friend.friend_profile_user_profile.user_profile_nick_name ||
              friend.friend_profile_user_profile.user_profile_identifier
          }))
          .sort((a: any, b: any) => a.friend_show_name.localeCompare(b.friend_show_name))
      }

      return []
    },
    /**
     * @description 获取指定好友的详细信息
     * @param { string } userID - 好友的用户ID
     * @returns { Promise<any|null> } - 好友信息对象或null
     */
    async getFriendProfile(userID: string) {
      const { code, json_params } = await this.imInstance.TIMFriendshipGetFriendsInfo({
        user_data: this.userData,
        params: [userID]
      })
      console.log('getFriendProfile', code, json_params)
      if (code === 0) {
        return json_params[0]
      }
      return null
    },
    /**
     * @description 检查与指定用户的好友关系类型
     * @param { string } userID - 用户ID
     * @returns { Promise<any|null> } - 好友关系类型信息或null
     */
    async checkFriendType(userID: string) {
      const { code, json_params } = await this.imInstance.TIMFriendshipCheckFriendType({
        user_data: this.userData,
        params: {
          friendship_check_friendtype_param_identifier_array: [userID]
        }
      })
      console.log('checkFriendType', code, json_params)
      if (code === 0) {
        return json_params[0]
      }
      return null
    },
    /**
     * @description 修改好友资料
     * @param { string } identifier - 好友的用户ID
     * @param { any } data - 要修改的资料数据
     * @returns { Promise<boolean> } - 修改是否成功
     */
    async modifyFriendProfile(identifier: string, data: any) {
      const { code } = await this.imInstance.TIMFriendshipModifyFriendProfile({
        params: {
          friendship_modify_friend_profile_param_identifier: identifier,
          friendship_modify_friend_profile_param_item: data
        },
        user_data: this.userData
      })
      console.log('modifyFriendProfile', code)
      if (code === 0) {
        await this.getConvList()
        return true
      }
      return false
    },
    /**
     * @description 添加好友
     * @param { any } data - 添加好友的相关参数
     * @returns { Promise<boolean> } - 添加是否成功
     */
    async addFriend(data: any) {
      const { code } = await this.imInstance.TIMFriendshipAddFriend({
        params: data,
        user_data: this.userData
      })
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 搜索好友
     * @param { string } searchText - 搜索关键词
     * @returns { Promise<any[]> } - 搜索结果列表
     */
    async searchFriends(searchText: string) {
      const { code, json_param } = await this.imInstance.TIMFriendshipSearchFriends({
        params: {
          friendship_search_param_keyword_list: [searchText],
          friendship_search_param_search_field_list: [0]
        },
        user_data: this.userData
      })
      console.log('searchFriend', code, json_param)
      if (code === 0) {
        return json_param
      }
      return []
    },
    /**
     * @description 获取已加入的群组列表
     * @returns { Promise<any[]> } - 群组列表数组
     */
    async getGroupList() {
      const { code, json_param } = await this.imInstance.TIMGroupGetJoinedGroupList()
      console.log('getGroupList', json_param)
      if (code === 0) {
        return json_param
      }
      return []
    },
    /**
     * @description 创建群组
     * @param { any } data - 创建群组的相关参数
     * @returns { Promise<boolean> } - 创建是否成功
     */
    async createGroup(data: any) {
      const { code, json_param } = await this.imInstance.TIMGroupCreate({
        params: data,
        data: ''
      })
      console.log('createGroup', code, json_param)
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 获取好友请求列表
     * @param { any } [data] - 获取请求列表的相关参数
     * @returns { Promise<any[]> } - 好友请求列表数组
     */
    async getFriendShipPendencyList(data?: any) {
      const { code, json_params } = await this.imInstance.TIMFriendshipGetPendencyList({
        params: { ...data },
        user_data: this.userData
      })
      console.log('getFriendShipPendencyList', json_params)
      if (code === 0) {
        return json_params.pendency_page_pendency_info_array
      }
      return []
    },
    /**
     * @description 处理好友申请
     * @param { any } [data] - 处理好友申请的相关参数
     * @returns { Promise<boolean> } - 是否成功
     */
    async handleFriendAdd(data?: any) {
      const { code } = await this.imInstance.TIMFriendshipHandleFriendAddRequest({
        params: { ...data },
        user_data: this.userData
      })
      console.log(code)
      if (code === 0) {
        return true
      }
      return false
    },
    /**
     * @description 获取黑名单列表
     * @returns { Promise<any[]> } - 黑名单用户列表数组
     */
    async getBlacklist() {
      const { code, json_params } = await this.imInstance.TIMFriendshipGetBlackList({
        user_data: this.userData
      })
      if (code === 0) {
        return json_params
      }

      return []
    },
    /**
     * @description 删除好友
     * @param { string } friendID - 要删除的好友ID
     * @returns { Promise<boolean> } - 删除是否成功
     */
    async deleteFriend(friendID: string) {
      const { code } = await this.imInstance.TIMFriendshipDeleteFriend({
        user_data: this.userData,
        params: {
          friendship_delete_friend_param_friend_type: 1,
          friendship_delete_friend_param_identifier_array: [friendID]
        }
      })
      if (code === 0) {
        return true
      }

      return false
    },
    /**
     * @description 将好友加入黑名单
     * @param { string } friendID - 要加入黑名单的好友ID
     * @returns { Promise<boolean> } - 操作是否成功
     */
    async addFriendToBlacklist(friendID: string) {
      const { code } = await this.imInstance.TIMFriendshipAddToBlackList({
        user_data: this.userData,
        params: [friendID]
      })
      if (code === 0) {
        return true
      }

      return false
    },
    /**
     * @description 将好友从黑名单移除
     * @param { string } friendID - 要移出黑名单的好友ID
     * @returns { Promise<boolean> } - 操作是否成功
     */
    async removeFriendFromBlacklist(friendID: string) {
      const { code } = await this.imInstance.TIMFriendshipDeleteFromBlackList({
        user_data: this.userData,
        params: [friendID]
      })
      if (code === 0) {
        return true
      }

      return false
    },
    /**
     * @description 邀请
     * @param { any } data - 数据
     */
    async inviteChat(data: any) {
      const { code, json_params } = await this.imInstance.TIMInvite({
        user_data: this.userData,
        invitee: this.currentConvID,
        online_user_only: true,
        timeout: 60,
        data: JSON.stringify(data)
      })
      console.log('TIMInvite', code, json_params)
      if (code === 0) {
        return json_params
      }

      return ''
    },
    /**
     * @description 取消邀请
     * @param { string } inviteId - 邀请ID
     * @param { any } data - 数据
     */
    async cancelInvite(inviteId: string, data: any) {
      const { code } = await this.imInstance.TIMCancelInvite({
        user_data: this.userData,
        invite_id: inviteId,
        data: JSON.stringify(data)
      })
      console.log('TIMCancelInvite', code)
    },
    /**
     * @description 接受邀请
     * @param { string } inviteId - 邀请ID
     * @param { any } data - 数据
     */
    async acceptInvite(inviteId: string, data: any) {
      const { code } = await this.imInstance.TIMAcceptInvite({
        user_data: this.userData,
        invite_id: inviteId,
        data: JSON.stringify(data)
      })
      console.log('TIMAcceptInvite --- invite_id:', inviteId)
      console.log('TIMAcceptInvite --- Code:', code)
      if (code === 0) {
        return true
      }

      return false
    },
    /**
     * @description 拒绝邀请
     * @param { string } inviteId - 邀请ID
     * @param { any } data - 数据
     */
    async rejectInvite(inviteId: string, data: any) {
      const { code } = await this.imInstance.TIMRejectInvite({
        user_data: this.userData,
        invite_id: inviteId,
        data: JSON.stringify(data)
      })
      console.log('TIMRejectInvite --- invite_id:', inviteId)
      console.log('TIMRejectInvite --- Code:', code)
      if (code === 0) {
        return true
      }

      return false
    },
    /**
     * @description 设置IM相关事件的回调函数
     * - 会话更新事件
     * - 未读消息总数变化事件
     * - 好友黑名单变更事件
     */
    eventCallback() {
      // 会话事件回调
      this.imInstance.TIMSetConvEventCallback({
        user_data: this.userData,
        callback: async (e: any) => {
          console.log('会话事件回调', e)
          await this.getConvList()
        }
      })

      // 未读消息总数事件回调
      this.imInstance.TIMSetConvTotalUnreadMessageCountChangedCallback({
        user_data: this.userData,
        callback: async () => {
          await this.getTotalUnreadMsgCount()
        }
      })

      this.imInstance.TIMOnInvited({
        user_data: this.userData,
        callback: () => { }
      })

      // 接收消息的回调
      this.imInstance.TIMAddRecvNewMsgCallback({
        user_data: this.userData,
        callback: async (data: any) => {
          // 检查接收到的数据是否有效
          if (data && data.length) {
            // 解析消息数据
            const msgData = JSON.parse(data[0])
            console.log('接收消息', msgData)

            // 处理自定义消息
            if (msgData[0].message_elem_array[0]?.elem_type === MsgTypeEnum.CUSTOM) {
              msgData[0].message_elem_array[0].custom_elem_data = JSON.parse(msgData[0].message_elem_array[0].custom_elem_data)
              if (msgData[0].message_elem_array[0].custom_elem_data.data) {
                msgData[0].message_elem_array[0].custom_elem_data.data = JSON.parse(msgData[0].message_elem_array[0].custom_elem_data.data)
              }

              // 忽略信令消息
              if (
                msgData[0].message_elem_array[0].custom_elem_data.actionType !== void 0 ||
                msgData[0].message_elem_array[0].custom_elem_data.subtype === 'typing'
              ) {
                if (msgData[0].message_elem_array[0].custom_elem_data.actionType === 1) {
                  sendNotification(msgData[0])
                  const msg = msgData[0].message_elem_array[0]
                  if (msg.elem_type === MsgTypeEnum.CUSTOM && msg.custom_elem_data?.data?.subtype === 'call') {
                    const sender = msgData[0].message_sender_profile
                    let msgContent = ''
                    if (msg.custom_elem_data?.data?.subtype === 'call') {
                      if (msg.custom_elem_data?.data?.content?.isVideoCall === 'Y') {
                        msgContent = $t('msgNotification.inviteVideoChat', { userName: '' })
                      } else if (msg.custom_elem_data?.data?.content?.isVideoCall === 'N') {
                        msgContent = $t('msgNotification.inviteVoiceChat', { userName: '' })
                      }
                    }
                    const notification = window.$notification?.info({
                      title: sender.user_profile_friend_remark || sender.user_profile_nick_name || sender.user_profile_identifier,
                      content: msgContent,
                      duration: 60000,
                      closable: false,
                      meta: ' ',
                      action: () => {
                        return h(
                          NSpace,
                          {
                            class: 'w-full',
                            justify: 'end'
                          },
                          {
                            default: () => [
                              h(
                                NButton,
                                {
                                  type: 'error',
                                  onClick: async () => {
                                    await this.rejectInvite(
                                      msg.custom_elem_data.inviteID,
                                      {
                                        type: 'signal',
                                        subtype: 'call',
                                        excludeFromHistoryMessage: msg.custom_elem_data?.data?.excludeFromHistoryMessage,
                                        content: {
                                          callerId: msg.custom_elem_data?.data?.content?.callerId,
                                          roomId: msg.custom_elem_data?.data?.content?.roomId,
                                          isVideoCall: msg.custom_elem_data?.data?.content?.isVideoCall,
                                          rejectReason: 'reject'
                                        }
                                      }
                                    )
                                    notification?.destroy()
                                  }
                                },
                                {
                                  default: () => $t('common.reject')
                                }
                              ),
                              h(
                                NButton,
                                {
                                  type: 'success',
                                  onClick: async () => {
                                    const isSuccess = await this.acceptInvite(
                                      msg.custom_elem_data.inviteID,
                                      {
                                        type: 'signal',
                                        subtype: 'call',
                                        excludeFromHistoryMessage: msg.custom_elem_data?.data?.excludeFromHistoryMessage,
                                        content: {
                                          callerId: msg.custom_elem_data?.data?.content?.callerId,
                                          roomId: msg.custom_elem_data?.data?.content?.roomId,
                                          isVideoCall: msg.custom_elem_data?.data?.content?.isVideoCall,
                                        }
                                      }
                                    )
                                    if (isSuccess) {
                                      const rtcStore = useRtcStore()
                                      rtcStore.setStrRoomId(msg.custom_elem_data?.data?.content?.roomId)
                                      rtcStore.setCallUser({
                                        name: msgData[0].message_sender_profile.user_profile_nick_name,
                                        avatar: msgData[0].message_sender_profile.user_profile_face_url,
                                        id: msgData[0].message_sender_profile.user_profile_identifier,
                                        inviteId: msg.custom_elem_data.inviteID
                                      })
                                      rtcStore.setApplyUser('other')
                                      rtcStore.setMyUserId(this.myUserID)
                                      if (msg.custom_elem_data?.data?.content?.isVideoCall === 'Y') {
                                        rtcStore.setCallType('video')
                                      } else if (msg.custom_elem_data?.data?.content?.isVideoCall === 'N') {
                                        rtcStore.setCallType('voice')
                                      }
                                      ipcRenderer.send('createCallWindow')
                                    }
                                    notification?.destroy()
                                  }
                                },
                                {
                                  default: () => $t('common.accept')
                                }
                              )
                            ]
                          }
                        )
                      }
                    })
                  }
                }
                return
              }
            }

            // 获取消息接收选项,默认为接收消息
            let recvOpt = ConvRecvOptEnum.RECEIVE
            // 获取会话的消息接收状态
            const recvOptList = await this.getConvRecvStatus(msgData[0].message_conv_id)
            // 如果有接收状态设置,则使用设置的状态
            if (recvOptList.length) {
              recvOpt = recvOptList[0].msg_recv_msg_opt_result_opt
            }

            // 如果消息属于当前会话
            if (msgData[0].message_conv_id === this.currentConvID) {
              if (msgData[0].message_cloud_custom_str) {
                msgData[0].message_cloud_custom_str = JSON.parse(msgData[0].message_cloud_custom_str)
              }

              // 将新消息添加到会话消息列表
              this.msgList.push(msgData[0])

              // 如果用户不在首页且消息接收状态为接收,则发送系统通知
              if (router.currentRoute.value.name !== 'home') {
                if (recvOpt === ConvRecvOptEnum.RECEIVE && !msgData[0].message_is_from_self) {
                  sendNotification(msgData[0])
                }
              }
            } else {
              // 如果消息不属于当前会话且消息接收状态为接收,则发送系统通知
              if (recvOpt === ConvRecvOptEnum.RECEIVE && !msgData[0].message_is_from_self) {
                sendNotification(msgData[0])
              }
            }
          }
        }
      })

      // 消息撤回的回调
      this.imInstance.TIMSetMsgRevokeCallback({
        user_data: this.userData,
        callback: async () => {
          await this.getConvMsgList(this.currentConv)
        }
      })

      // 消息被云端已读的回调
      this.imInstance.TIMSetMsgReadedReceiptCallback({
        user_data: this.userData,
        callback: async (data: any) => {
          console.log('消息被云端已读', data)
          await this.getConvMsgList(this.currentConv)
        }
      })

      // 消息被云端编辑的回调
      this.imInstance.TIMSetMsgUpdateCallback({
        user_data: this.userData,
        callback: async (data: any) => {
          console.log('消息被云端编辑', data)
          await this.getConvMsgList(this.currentConv)
        }
      })

      // 文件上传的回调
      this.imInstance.TIMSetMsgElemUploadProgressCallback({
        user_data: this.userData,
        callback: (data: any) => {
          console.log('文件上传进度', data)
        }
      })

      // 将好友拉入黑名单的回调
      this.imInstance.TIMSetFriendBlackListAddedCallback({
        callback: async () => {
          await this.getFriendList()
          await this.getBlacklist()
        }
      })

      // 将好友移出黑名单的回调
      this.imInstance.TIMSetFriendBlackListDeletedCallback({
        callback: async () => {
          await this.getFriendList()
          await this.getBlacklist()
        }
      })
    },
    /**
     * @description 设置是否打开多选
     * @param { boolean } isMultiSelect - 是否打开多选
     */
    setIsMultiSelect(isMultiSelect: boolean) {
      if (!isMultiSelect) {
        this.multiSelectMsgList = []
      }
      this.isMultiSelect = isMultiSelect
    },
    /**
     * @description 设置多选消息列表
     * @param { any } msg - 多选消息列表
     */
    multiSelectMessageClick(msg: any) {
      const index = this.multiSelectMsgList.findIndex(item => item.message_msg_id === msg.message_msg_id)
      if (index > -1) {
        this.multiSelectMsgList.splice(index, 1)
      } else {
        // 限制多选消息数量
        if (this.multiSelectMsgList.length >= 300) {
          return
        }
        this.multiSelectMsgList.push(msg)
      }
    }
  }
})
