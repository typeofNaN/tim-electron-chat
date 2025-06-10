import { defineStore } from 'pinia'

import { localStg } from '@/utils'

interface RtcState {
  strRoomId: string
  callType: 'video' | 'voice'
  callUser: { name: string, avatar: string, id: string, inviteId: string }
  myUserId: string
  applyUser: 'me' | 'other'
}

export const useRtcStore = defineStore('rtc-store', {
  state: (): RtcState => ({
    strRoomId: localStg.get('strRoomId') || '',
    callType: localStg.get('callType') || 'video',
    callUser: localStg.get('callUser') || { name: '', avatar: '', id: '', inviteId: '' },
    myUserId: localStg.get('myUserId') || '',
    applyUser: localStg.get('applyUser') || 'me'
  }),
  getters: {
    currentStrRoomId: (state) => state.strRoomId,
    currentCallType: (state) => state.callType,
    currentCallUser: (state) => state.callUser,
    userId: (state) => state.myUserId,
    currentApplyUser: (state) => state.applyUser
  },
  actions: {
    setStrRoomId(strRoomId: string) {
      this.strRoomId = strRoomId
      localStg.set('strRoomId', strRoomId)
    },
    setCallType(callType: 'video' | 'voice') {
      this.callType = callType
      localStg.set('callType', callType)
    },
    setCallUser(userInfo: { name: string, avatar: string, id: string, inviteId: string }) {
      this.callUser = userInfo
      localStg.set('callUser', userInfo)
    },
    setMyUserId(userId: string) {
      this.myUserId = userId
      localStg.set('myUserId', userId)
    },
    setApplyUser(user: 'me' | 'other') {
      this.applyUser = user
      localStg.set('applyUser', user)
    }
  }
})
