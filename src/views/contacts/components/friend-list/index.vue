<template>
  <div class="h-full">
    <div class="flex justify-between items-center px-10px h-80px b-b-2 b-b-solid b-b-#eee dark:b-b-#111">
      <div class="flex items-center">
        <div class="flex-center w-40px h-40px b-rd-50% bg-blue">
          <svg-icon icon="rivet-icons:user-group-solid" class="text-20px color-#fff" />
        </div>
        <div class="pl-10px text-16px select-none">{{ $t('page.contacts.friendList') }}</div>
      </div>
      <AddFriend @refresh="refreshFriendList" />
    </div>
    <n-scrollbar v-if="friendList.length > 0" class="h-[calc(100%-80px)]">
      <div v-for="friend in friendList" :key="friend.friend_profile_identifier"
        class="flex justify-between items-center hover-bg-#f9f9f9 dark:hover-bg-#1a1a1a">
        <div class="flex items-center flex-grow-1 p-10px cursor-pointer" @click="handleSelectFriend(friend)">
          <custom-avatar :src="friend.friend_profile_user_profile.user_profile_face_url" :size="40" />
          <n-ellipsis class="flex-grow-1 ml-20px text-15px select-none">
            {{ friend.friend_show_name }}
          </n-ellipsis>
        </div>
        <div class="flex-center gap-10px px-10px">
          <n-button size="small" quaternary type="error" @click="handleDelete(friend.friend_profile_identifier)">
            {{ $t('page.contacts.delete') }}
          </n-button>
          <n-button size="small" quaternary type="error"
            @click="handleAddToBlacklist(friend.friend_profile_identifier)">
            {{ $t('page.contacts.addToBlacklist') }}
          </n-button>
        </div>
      </div>
    </n-scrollbar>
    <div v-else class="flex-center h-[calc(100%-80px)]">
      <n-empty :description="$t('page.contacts.noneFriend')" size="huge">
        <template #icon>
          <n-icon>
            <icon-mdi:account-star-outline />
          </n-icon>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ConvTypeEnum } from '@/constants/conv'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import AddFriend from './components/add-friend/index.vue'

const router = useRouter()

const chatStore = useChatStore()

const friendList = ref<any[]>([])

onMounted(async () => {
  await getFriendList()
})

/**
 * @description 获取并更新好友列表
 * @returns { Promise<void> }
 */
async function getFriendList() {
  friendList.value = await chatStore.getFriendList()
}

function refreshFriendList() {
  setTimeout(() => {
    getFriendList()
  }, 400)
}

/**
 * @description 处理选择好友操作
 * @param { any } friend - 要选择的好友
 * @returns { void }
 */
async function handleSelectFriend(friend: any) {
  const res = await chatStore.createConv({
    conv_id: friend.friend_profile_identifier,
    conv_type: ConvTypeEnum.C2C,
    conv_face_url: friend.friend_profile_user_profile.user_profile_face_url,
    conv_show_name: friend.friend_profile_remark || friend.friend_profile_user_profile.user_profile_nick_name || friend.friend_profile_user_profile.user_profile_identifier
  })
  if (res) {
    router.push('/home')
  }
}

/**
 * @description 处理删除好友操作
 * @param { string } friendID - 要删除的好友ID
 * @returns { void }
 */
function handleDelete(friendID: string) {
  window.$dialog?.create({
    type: 'error',
    title: $t('page.contacts.delete'),
    content: $t('page.contacts.sureDelete'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    closeOnEsc: false,
    maskClosable: false,
    onPositiveClick: async () => {
      // 调用store方法删除好友
      const res = await chatStore.deleteFriend(friendID)
      if (res) {
        window.$message?.success($t('common.deleteSuccess'))
      } else {
        window.$message?.error($t('common.deleteFail'))
      }
      // 刷新好友列表
      await getFriendList()
    },
    onNegativeClick: () => { }
  })
}

/**
 * @description 处理将好友加入黑名单操作
 * @param { string } friendID - 要加入黑名单的好友ID
 * @returns { void }
 */
function handleAddToBlacklist(friendID: string) {
  window.$dialog?.create({
    type: 'error',
    title: $t('page.contacts.addToBlacklist'),
    content: $t('page.contacts.sureAddToBlacklist'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    closeOnEsc: false,
    maskClosable: false,
    onPositiveClick: async () => {
      // 调用store方法将好友加入黑名单
      const res = await chatStore.addFriendToBlacklist(friendID)
      if (res) {
        window.$message?.success($t('common.operationSuccess'))
      } else {
        window.$message?.error($t('common.operationFail'))
      }
      // 刷新好友列表
      await getFriendList()
    },
    onNegativeClick: () => { }
  })
}
</script>