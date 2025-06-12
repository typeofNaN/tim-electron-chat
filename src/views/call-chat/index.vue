<template>
  <div ref="callChatRef" id="call-chat" class="relative h-full select-none bg-#333">
    <div class="call-bg absolute inset-0" :style="{ backgroundImage: `url(${chatBg})` }" />
    <div v-show="hasRemoteVideoStream" ref="remotePreviewRef" class="absolute w-full h-full" />
    <div ref="localPreviewRef" class="absolute"
      :class="[isRemoteJoin || hasRemoteVideoStream ? 'top-40px right-10px w-100px h-180px b-rd-10px overflow-hidden' : 'w-full h-full']" />
    <div class="absolute inset-0 text-#fff text-shadow-color-black text-shadow-sm">
      <div v-if="isRemoteJoin" class="flex-x-center pt-60px h-60%">
        {{ betweenTime }}
      </div>
      <div v-else class="flex-center flex-col gap-6px h-60%">
        <custom-avatar :src="callUserInfo.avatar" :size="70" />
        <p>{{ callUserInfo.name }}</p>
        <p>{{ $t('callChat.waiting') }}</p>
      </div>
      <div v-show="isActive" class="flex-center flex-col gap-20px w-300px m-auto h-40% z-999">
        <div class="flex items-center justify-around w-full">
          <div class="flex-center flex-col gap-4px text-center">
            <div class="flex-center relative w-60px h-60px b-rd-50% bg-#fff cursor-pointer" @click="toggleMicrophone">
              <icon-carbon:microphone-filled class="text-#111 text-24px" />
              <div v-if="!microphoneIsOpen" class="close-line" />
            </div>
            {{ microphoneIsOpen ? $t('callChat.microphoneIsOpen') : $t('callChat.microphoneIsClose') }}
          </div>
          <div class="flex-center flex-col gap-4px text-center">
            <div class="flex-center relative w-60px h-60px b-rd-50% bg-#fff cursor-pointer" @click="toggleSpeaker">
              <icon-fluent:speaker-24-filled class="text-#111 text-24px" />
              <div v-if="!speakerIsOpen" class="close-line" />
            </div>
            {{ speakerIsOpen ? $t('callChat.speakerIsOpen') : $t('callChat.speakerIsClose') }}
          </div>
          <div v-if="rtcStore.callType === 'video'" class="flex-center flex-col gap-4px text-center">
            <div class="flex-center relative w-60px h-60px b-rd-50% bg-#fff cursor-pointer" @click="toggleCamera">
              <icon-material-symbols:videocam-rounded class="text-#111 text-24px" />
              <div v-if="!cameraIsOpen" class="close-line" />
            </div>
            {{ cameraIsOpen ? $t('callChat.cameraIsOpen') : $t('callChat.cameraIsClose') }}
          </div>
        </div>
        <div class="flex items-center justify-around w-full">
          <div class="flex-center w-60px h-60px b-rd-50% bg-red-5" @click="exitRoom">
            <icon-material-symbols:call-end-sharp class="text-#fff text-24px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import TRTCCloud, {
  TRTCAppScene,
  TRTCAudioQuality,
  TRTCParams,
  TRTCVideoEncParam,
  TRTCVideoResolution,
  TRTCVideoResolutionMode,
  TRTCVideoStreamType
} from 'trtc-electron-sdk'

import { ConvTypeEnum } from '@/constants/conv'
import { $t } from '@/locales'
import { TRTCApi } from '@/service'
import { useRtcStore } from '@/store'
import { diffTime } from '@/utils/common/datetime'
import defaultAvatar from '@/assets/images/logo.png'

const { ipcRenderer } = require('electron')

const rtcStore = useRtcStore()

const callChatRef = ref<HTMLDivElement>()

const chatBg = ref(defaultAvatar)

const localPreviewRef = ref()
const remotePreviewRef = ref()

let rtcInstance: TRTCCloud | null = null

const microphoneIsOpen = ref(false)
const speakerIsOpen = ref(false)
const cameraIsOpen = ref(false)

const isActive = ref(true)
let activeTimer: NodeJS.Timeout | null = null

const isRemoteJoin = ref(false)
const hasRemoteVideoStream = ref(false)

const callUserInfo = ref({
  id: '',
  name: '',
  avatar: '',
  inviteId: ''
})

const chatBeginTime = ref(0)
const betweenTime = ref('')
let rafId: any

onMounted(() => {
  callUserInfo.value = rtcStore.currentCallUser
  if (callUserInfo.value.avatar) {
    chatBg.value = callUserInfo.value.avatar.startsWith('http') ? callUserInfo.value.avatar : (import.meta.env.VITE_BASE_FILE_URL + callUserInfo.value.avatar)
  }
  initRtc()
  enterRoom({
    scene: rtcStore.callType === 'video' ? TRTCAppScene.TRTCAppSceneVideoCall : TRTCAppScene.TRTCAppSceneAudioCall
  })
  if (rtcStore.callType === 'video') {
    toggleCamera()
  }

  ipcRenderer.on('requestExitCallRoom', () => {
    exitRoom()
  })
})

function toggleMicrophone() {
  if (microphoneIsOpen.value) {
    stopLocalAudio()
  } else {
    startLocalAudio()
  }
  microphoneIsOpen.value = !microphoneIsOpen.value
}

function toggleSpeaker() {
  if (speakerIsOpen.value) {
    rtcInstance?.muteRemoteAudio('', true)
  } else {
    rtcInstance?.muteRemoteAudio('', false)
  }
  speakerIsOpen.value = !speakerIsOpen.value
}

function toggleCamera() {
  if (cameraIsOpen.value) {
    stopLocalPreview()
  } else {
    startLocalPreview(localPreviewRef.value)
  }
  cameraIsOpen.value = !cameraIsOpen.value
}

function initRtc() {
  isActive.value = true
  isRemoteJoin.value = false
  hasRemoteVideoStream.value = false
  rtcInstance = TRTCCloud.getTRTCShareInstance()
  eventListener()
}

async function enterRoom(options: { scene: TRTCAppScene }) {
  const { data } = await TRTCApi.getSignature(rtcStore.userId)
  if (data) {
    const param = new TRTCParams()
    param.sdkAppId = Number(import.meta.env.VITE_TENCENT_CLOUD_SDK_APP_ID)
    param.userId = data.imUserId
    param.strRoomId = rtcStore.currentStrRoomId
    param.userSig = data.userSig

    rtcInstance?.enterRoom(param, options.scene)
  }
}

function startLocalPreview(dom: HTMLDivElement) {
  setVideoEncoderParam()
  rtcInstance?.startLocalPreview(dom)
}

function setVideoEncoderParam() {
  const encParams = new TRTCVideoEncParam()
  encParams.videoResolution = TRTCVideoResolution.TRTCVideoResolution_640_360
  encParams.resMode = TRTCVideoResolutionMode.TRTCVideoResolutionModePortrait
  encParams.videoFps = 15
  rtcInstance?.setVideoEncoderParam(encParams)
}

function stopLocalPreview() {
  rtcInstance?.stopLocalPreview()
}

function startLocalAudio() {
  rtcInstance?.startLocalAudio(TRTCAudioQuality.TRTCAudioQualityDefault)
}

function stopLocalAudio() {
  rtcInstance?.stopLocalAudio()
}

function startRemoteView() {
  isRemoteJoin.value = true
  hasRemoteVideoStream.value = true
  rtcInstance?.startRemoteView(callUserInfo.value.id, remotePreviewRef.value, TRTCVideoStreamType.TRTCVideoStreamTypeBig)
  callChatRef.value?.addEventListener('mouseenter', () => {
    isActive.value = true
    activeTimer && clearTimeout(activeTimer)
  })
  callChatRef.value?.addEventListener('mouseleave', () => {
    activeTimer = setTimeout(() => {
      isActive.value = false
    }, 3000)
  })
}

function stopRemoteView() {
  hasRemoteVideoStream.value = false
  rtcInstance?.stopRemoteView(callUserInfo.value.id, TRTCVideoStreamType.TRTCVideoStreamTypeBig)
}

function exitRoom() {
  rafId && cancelAnimationFrame(rafId)
  rtcInstance?.exitRoom()

  const postData: Record<string, any> = {
    convId: rtcStore.callUser.id,
    convType: ConvTypeEnum.C2C,
    applyUser: rtcStore.currentApplyUser,
    inviteId: rtcStore.callUser.inviteId,
    roomId: rtcStore.currentStrRoomId,
    msgData: {
      isVideoCall: rtcStore.callType === 'video' ? 'Y' : 'N'
    }
  }

  if (isRemoteJoin.value) {
    const now = new Date().getTime()
    postData.msgData.result = 'accept'
    postData.msgData.duration = Math.floor((now - chatBeginTime.value) / 1000)
  } else {
    postData.msgData.result = 'cancelled'
  }
  ipcRenderer.send('exitCallRoom', postData)

  ipcRenderer.send('closeCallChat', 'exit')
}

function eventListener() {
  rtcInstance?.on('onError', (errCode: number, errMsg: string) => {
    console.log(errCode, errMsg)
  })

  rtcInstance?.on('onWarning', (warningCode: number, warningMsg: string) => {
    console.log(warningCode, warningMsg)
  })

  rtcInstance?.on('onEnterRoom', (result: number) => {
    if (result > 0) {
      console.log('Enter room succeed')
    } else {
      // 参见进房错误码 https://cloud.tencent.com/document/product/647/32257#.E8.BF.9B.E6.88.BF.E7.9B.B8.E5.85.B3.E9.94.99.E8.AF.AF.E7.A0.81
      console.log('Enter room failed')
    }
  })

  // rtcInstance?.on('exitRoom', () => {
  //   const postData: Record<string, any> = {
  //     convId: rtcStore.callUser.id,
  //     convType: ConvTypeEnum.C2C,
  //     applyUser: rtcStore.currentApplyUser,
  //     inviteId: rtcStore.callUser.inviteId,
  //     msgData: {
  //       isVideo: rtcStore.callType === 'video' ? 'Y' : 'N'
  //     }
  //   }
  //   if (isRemoteJoin.value) {
  //     const now = new Date().getTime()
  //     postData.msgData.result = 'accept'
  //     postData.msgData.duration = Math.floor((now - chatBeginTime.value) / 1000)
  //   } else {
  //     postData.msgData.result = 'cancelled'
  //   }
  //   ipcRenderer.send('exitCallRoom', postData)
  // })

  rtcInstance?.on('onRemoteUserEnterRoom', () => {
    startRemoteView()
    toggleMicrophone()
    toggleSpeaker()
    chatBeginTime.value = new Date().getTime()
    requestAnimationFrame(getBetweenTime)
  })

  rtcInstance?.on('onRemoteUserLeaveRoom', () => {
    stopRemoteView()
    exitRoom()
  })

  rtcInstance?.on('onSendFirstLocalVideoFrame', () => { })

  rtcInstance?.on('onUserVideoAvailable', (userId: string, available: number) => {
    hasRemoteVideoStream.value = available === 1
  })
}

function getBetweenTime() {
  const now = new Date().getTime()
  betweenTime.value = diffTime(chatBeginTime.value, now)
  rafId = requestAnimationFrame(getBetweenTime)
}
</script>

<style lang="scss" scoped>
#call-chat {
  .call-bg {
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    filter: blur(10px);
  }

  :deep(video) {
    height: 100% !important;
    width: 100% !important;
    object-fit: cover;
  }

  .close-line {
    --uno: absolute top-50% left-50% w-2px h-30px bg-#333;
    transform: translate(-50%, -50%) rotate(45deg);
  }
}
</style>