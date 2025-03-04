<template>
  <n-modal v-model:show="modalShow">
    <n-card :bordered="false" :title="$t('page.chat.msg.forwardToFriend')" size="huge" role="dialog" aria-modal="true"
      class="w-500px">
      <template #header-extra>
        <icon-material-symbols:close-rounded class="text-20px cursor-pointer" @click="modalShow = false" />
      </template>
      <n-scrollbar class="max-h-400px">
        <div v-for="friend in friendList" :key="friend.friend_profile_identifier"
          @click="chooseFriend = friend.friend_profile_identifier"
          class="flex items-center px-10px hover:bg-#f5f5f5 dark:hover:bg-#1a1a1a cursor-pointer">
          <n-radio :checked="chooseFriend === friend.friend_profile_identifier"
            :value="friend.friend_profile_identifier" name="choose-friend">
          </n-radio>
          <div class="flex items-center flex-grow-1 p-10px cursor-pointer">
            <custom-avatar :src="friend.friend_profile_user_profile.user_profile_face_url" :size="40" />
            <n-ellipsis class="flex-grow-1 ml-20px text-gray-900 dark:text-gray-100 text-15px select-none">
              {{ friend.friend_show_name }}
            </n-ellipsis>
          </div>
        </div>
      </n-scrollbar>
      <template #footer>
        <div class="flex-center gap-20px">
          <n-button @click="modalShow = false">{{ $t('common.cancel') }}</n-button>
          <n-button type="primary" @click="handleForward">{{ $t('chat.send') }}</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { ConvTypeEnum } from '@/constants/conv'
import { $t } from '@/locales'
import { useChatStore } from '@/store'

defineOptions({
  name: 'ForwardToFriend'
})

defineExpose({
  openChooseFriendModal,
  openChooseFriendModalByItem
})

const chatStore = useChatStore()

const modalShow = ref(false)
const chooseFriend = ref('')
const friendList = ref<any[]>([])

const msgData = ref<any>(null)
const msgList = ref<any[]>([])
const sendType = ref<'merge' | 'item'>('merge')

async function getFriendList() {
  friendList.value = await chatStore.getFriendList()
}

async function openChooseFriendModal(data: any) {
  await getFriendList()
  chooseFriend.value = ''
  msgData.value = data
  sendType.value = 'merge'
  modalShow.value = true
}

async function openChooseFriendModalByItem(data: any[]) {
  await getFriendList()
  chooseFriend.value = ''
  sendType.value = 'item'
  msgList.value = [...data]
  modalShow.value = true
}

async function handleForward() {
  if (sendType.value === 'merge') {
    await chatStore.sendMsg(
      chooseFriend.value,
      ConvTypeEnum.C2C,
      {
        ...msgData.value,
        message_is_forward_message: true
      }
    )
  } else {
    msgList.value.forEach(async (item: any) => {
      await chatStore.sendMsg(
        chooseFriend.value,
        ConvTypeEnum.C2C,
        {
          ...item,
          message_is_forward_message: true
        }
      )
    })
  }
  modalShow.value = false
  chatStore.setIsMultiSelect(false)
}
</script>
