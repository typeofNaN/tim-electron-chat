<template>
  <div class="h-full">
    <div class="flex justify-between items-center px-10px h-80px b-b-2 b-b-solid b-b-#eee dark:b-b-#111">
      <div class="flex items-center">
        <div class="flex-center w-40px h-40px b-rd-50% bg-green">
          <svg-icon icon="ic:round-person-add-alt-1" class="text-20px color-#fff" />
        </div>
        <div class="pl-10px text-16px">{{ $t('page.contacts.friendApply') }}</div>
      </div>
    </div>
    <n-scrollbar v-if="applyList.length > 0" class="h-[calc(100%-80px)] bg-#fafafa dark:bg-#1a1a1a">
      <div v-for="apply in applyList" :key="apply.friend_add_pendency_info_identifier"
        class="mb-10px p-10px bg-#fff dark:bg-#000">
        <n-thing>
          <template #avatar>
            <custom-avatar :src="apply.friend_add_pendency_info_face_url" :size="50" />
          </template>
          <template #header>
            {{ apply.friend_add_pendency_info_nick_name || apply.friend_add_pendency_info_identifier }}
          </template>
          <template #header-extra>
            <div class="text-13px text-#999">
              {{ formatterTime(new Date((apply.friend_add_pendency_info_add_time) * 1000)) }}
            </div>
          </template>
          <template #description>
            {{ $t('page.contacts.friendApplySource.from') }}
            {{ $t(FriendApplyFromMap[apply.friend_add_pendency_info_add_source as FriendApplyFromEnum]) }}
          </template>
          <div class="text-14px text-#777 bg-gray-100 dark:bg-gray-900 p-10px b-rd-4px">
            {{ $t('page.contacts.wording') }}
            {{ apply.friend_add_pendency_info_add_wording }}
          </div>
          <template #action>
            <!-- 别人发给我的申请 -->
            <div v-if="apply.friend_add_pendency_info_type === ApplyType.RECEIVE" class="flex justify-end">
              <n-space>
                <n-button type="success" tertiary round
                  @click="handleAgree(apply, ApplyAgreeType.ResponseActionAgreeAndAdd)">
                  {{ $t('page.contacts.agree') }}
                </n-button>
                <n-button type="error" tertiary round @click="handleAgree(apply, ApplyAgreeType.ResponseActionReject)">
                  {{ $t('page.contacts.reject') }}
                </n-button>
              </n-space>
            </div>
            <!-- 我发给别人的申请 -->
            <div v-else-if="apply.friend_add_pendency_info_type === ApplyType.SEND"
              class="text-14px text-yellow text-right">
              {{ $t('page.contacts.waitAgree') }}
            </div>
            <!-- 双向申请 -->
            <template v-else></template>
          </template>
        </n-thing>
      </div>
    </n-scrollbar>
    <div v-else class="flex-center h-[calc(100%-80px)]">
      <n-empty :description="$t('page.contacts.noneApply')" size="huge">
        <template #icon>
          <n-icon>
            <icon-ic:round-person-add-alt-1 />
          </n-icon>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { FriendApplyFromEnum, FriendApplyFromMap } from '@/constants/friendApplyFrom'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { formatterTime } from '@/utils/common/datetime'

enum ApplyType {
  RECEIVE,
  SEND,
  BOTH
}

enum ApplyAgreeType {
  ResponseActionAgree,
  ResponseActionAgreeAndAdd,
  ResponseActionReject
}

const chatStore = useChatStore()

const applyList = ref<any[]>([])

onMounted(async () => {
  await getFriendShipPendencyList()
})

async function getFriendShipPendencyList() {
  const res = await chatStore.getFriendShipPendencyList()
  applyList.value = [...res]
}

async function handleAgree(apply: any, type: ApplyAgreeType) {
  const res = await chatStore.handleFriendAdd({
    friend_respone_identifier: apply.friend_add_pendency_info_identifier,
    friend_respone_action: type
  })
  if (res) {
    window.$message?.success($t('common.success'))
    await getFriendShipPendencyList()
  }
}
</script>