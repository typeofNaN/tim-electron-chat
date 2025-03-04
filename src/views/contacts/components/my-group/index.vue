<template>
  <div class="h-full">
    <div class="flex justify-between items-center px-10px h-80px b-b-2 b-b-solid b-b-#eee dark:b-b-#111">
      <div class="flex items-center">
        <div class="flex-center w-40px h-40px b-rd-50% bg-yellow">
          <svg-icon icon="ic:round-window" class="text-20px color-#fff" />
        </div>
        <div class="pl-10px text-16px select-none">{{ $t('page.contacts.myGroup') }}</div>
      </div>
      <n-button type="primary" secondary round @click="showCreateGroupModal">
        <template #icon>
          <svg-icon icon="material-symbols:add" class="text-20px" />
        </template>
        {{ $t('page.contacts.createGroup') }}
      </n-button>
    </div>
    <n-scrollbar v-if="groupList.length > 0" class="h-[calc(100%-80px)]"></n-scrollbar>
    <div v-else class="flex-center h-[calc(100%-80px)]">
      <n-empty :description="$t('page.contacts.noneGroup')" size="huge">
        <template #icon>
          <n-icon>
            <icon-material-symbols:groups-outline-rounded />
          </n-icon>
        </template>
      </n-empty>
    </div>
    <CreateGroupModal ref="createGroupModalRef" @refresh="getGroupList" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { $t } from '@/locales'
import { useChatStore } from '@/store'
import CreateGroupModal from './components/create-group/index.vue'

const chatStore = useChatStore()

const groupList = ref<any[]>([])

const createGroupModalRef = ref()

onMounted(async () => {
  await getGroupList()
})

async function getGroupList() {
  groupList.value = await chatStore.getGroupList()
}

function showCreateGroupModal() {
  createGroupModalRef.value?.showModal()
}
</script>
