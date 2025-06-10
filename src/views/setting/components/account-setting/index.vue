<template>
  <div class="h-full">
    <div class="flex justify-between items-center px-10px h-80px b-b-2 b-b-solid b-b-#eee dark:b-b-#111">
      <div class="flex items-center">
        <div class="flex-center w-40px h-40px b-rd-50% bg-blue text-20px color-#fff">
          <svg-icon icon="ic:twotone-manage-accounts" />
        </div>
        <div class="pl-10px text-16px select-none">{{ $t('page.setting.accountSetting') }}</div>
      </div>
      <EditModal />
    </div>
    <n-scrollbar class="h-[calc(100%-80px)]">
      <template v-if="chatStore.myInfo">
        <div class="info-item b-b-#efefef dark:b-b-#101010">
          <div class="w-200px text-gray-400">{{ $t('page.chat.userInfo.avatar') }}</div>
          <div class="flex-center">
            <custom-avatar :src="chatStore.myInfo.user_profile_face_url" :size="40" />
          </div>
        </div>
        <div class="info-item b-b-#efefef dark:b-b-#101010">
          <div class="w-200px text-gray-400">ID</div>
          <div class="flex-grow-1 text-right">{{ chatStore.myInfo.user_profile_identifier }}</div>
        </div>
        <div class="info-item b-b-#efefef dark:b-b-#101010">
          <div class="w-200px text-gray-400">{{ $t('page.chat.userInfo.nickname') }}</div>
          <n-ellipsis class="flex-grow-1 text-right">{{ chatStore.myInfo.user_profile_nick_name }}</n-ellipsis>
        </div>
        <div class="info-item b-b-#efefef dark:b-b-#101010">
          <div class="w-200px text-gray-400">{{ $t('page.chat.userInfo.gender') }}</div>
          <div class="flex-grow-1 text-right">
            {{
              GenderMap[chatStore.myInfo.user_profile_gender as GenderEnum]
                ? $t(GenderMap[chatStore.myInfo.user_profile_gender as GenderEnum])
                : $t('gender.unknown')
            }}
          </div>
        </div>
        <div class="info-item b-b-#efefef dark:b-b-#101010">
          <div class="w-200px text-gray-400">{{ $t('page.chat.userInfo.birthday') }}</div>
          <div class="flex-grow-1 text-right">{{ chatStore.myInfo.user_profile_birthday }}</div>
        </div>
        <div class="info-item b-b-#efefef dark:b-b-#101010">
          <div class="w-200px text-gray-400">{{ $t('page.chat.userInfo.friendAddPermission') }}</div>
          <div class="flex-grow-1 text-right">
            {{
              AddFriendPermissionMap[chatStore.myInfo.user_profile_add_permission as AddFriendPermissionEnum]
                ? $t(AddFriendPermissionMap[chatStore.myInfo.user_profile_add_permission as AddFriendPermissionEnum])
                : $t('page.chat.userInfo.friendAddPermissionOptions.unknown')
            }}
          </div>
        </div>
        <div class="info-item b-b-#efefef dark:b-b-#101010">
          <div class="w-200px text-gray-400">{{ $t('page.chat.userInfo.signature') }}</div>
          <n-ellipsis class="flex-grow-1 text-right">{{ chatStore.myInfo.user_profile_self_signature }}</n-ellipsis>
        </div>
        <div class="mt-80px flex-center">
          <n-button type="error" secondary @click="logout" class="w-200px">
            <template #icon>
              <svg-icon icon="ic:sharp-log-out" class="text-20px" />
            </template>
            {{ $t('layout.userAvatar.logout') }}
          </n-button>
        </div>
      </template>
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

import { AddFriendPermissionEnum, AddFriendPermissionMap } from '@/constants/addFriendPermission'
import { GenderEnum, GenderMap } from '@/constants/gender'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { localStg } from '@/utils'
import EditModal from './components/edit-modal/index.vue'

const router = useRouter()
const chatStore = useChatStore()

async function logout() {
  const res = await chatStore.logoutIM()
  if (res) {
    localStg.remove('userID')
    localStg.remove('userSig')
    router.replace({ name: 'login' })
  }
}
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  font-size: 14px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
</style>