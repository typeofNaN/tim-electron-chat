<template>
  <div class="h-full">
    <div class="flex justify-between items-center px-10px h-80px b-b-2 b-b-solid b-b-#eee dark:b-b-#111">
      <div class="flex items-center">
        <div class="flex-center w-40px h-40px b-rd-50% bg-gray text-20px color-#fff">
          <svg-icon icon="ic:sharp-person-off" />
        </div>
        <div class="pl-10px text-16px select-none">{{ $t('page.contacts.blacklist') }}</div>
      </div>
    </div>
    <n-scrollbar v-if="blacklist.length > 0" class="h-[calc(100%-80px)]">
      <div v-for="friend in blacklist" :key="friend.friend_profile_identifier"
        class="flex justify-between items-center hover-bg-#f9f9f9">
        <div class="flex items-center flex-grow-1 p-10px cursor-pointer">
          <custom-avatar :src="friend.friend_profile_user_profile.user_profile_face_url" :size="40" />
          <n-ellipsis class="flex-grow-1 ml-20px text-gray-900 text-15px select-none">
            {{
              friend.friend_profile_remark ||
              friend.friend_profile_user_profile.user_profile_nick_name ||
              friend.friend_profile_user_profile.user_profile_identifier
            }}
          </n-ellipsis>
        </div>
        <div class="flex justify-around items-center px-10px">
          <n-button size="small" quaternary type="error"
            @click="handleRemoveFromBlacklist(friend.friend_profile_identifier)">
            {{ $t('page.contacts.removeFromBlacklist') }}
          </n-button>
        </div>
      </div>
    </n-scrollbar>
    <div v-else class="flex-center h-[calc(100%-80px)]">
      <n-empty :description="$t('page.contacts.noneBlacklist')" size="huge">
        <template #icon>
          <n-icon>
            <icon-ic:sharp-person-off />
          </n-icon>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { $t } from '@/locales'
import { useChatStore } from '@/store'

const chatStore = useChatStore()

const blacklist = ref<any[]>([])

onMounted(async () => {
  await getBlacklist()
})

/**
 * @description 获取并更新黑名单列表
 * @returns { Promise<void> }
 */
async function getBlacklist() {
  blacklist.value = await chatStore.getBlacklist()
}

/**
 * @description 处理将好友从黑名单中移除
 * @param { string } friendID - 要移除的好友ID
 */
function handleRemoveFromBlacklist(friendID: string) {
  window.$dialog?.create({
    type: 'error',
    title: $t('page.contacts.removeFromBlacklist'),
    content: $t('page.contacts.sureRemoveFromBlacklist'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    closeOnEsc: false,
    maskClosable: false,
    onPositiveClick: async () => {
      // 调用store方法将好友从黑名单移除
      const res = await chatStore.removeFriendFromBlacklist(friendID)
      if (res) {
        window.$message?.success($t('common.operationSuccess'))
      } else {
        window.$message?.error($t('common.operationFail'))
      }
      // 刷新黑名单列表
      await getBlacklist()
    },
    onNegativeClick: () => { }
  })
}
</script>