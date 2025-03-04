<template>
  <div class="h-50px bg-#f9f9f9 dark:bg-#1a1a1a flex justify-between items-center p-10px">
    <div
      class="flex items-center px-10px w-[calc(100%-40px)] h-30px b-solid b-1px b-rd-15px b-color-#ccc cursor-text color-#777"
      @click="showSearchModal">
      <icon-ri:search-line class="text-16px" />
      <span class="ml-6px text-13px select-none">{{ $t('common.search') }}</span>
    </div>
    <div class="flex-center w-30px h-30px text-24px" @click="showCreateGroupModal">
      <icon-material-symbols:add class="cursor-pointer" />
    </div>
    <n-modal :show="searchModalShow" preset="card" class="w-800px" @close="searchModalShow = false">
      <template #header>
        <div class="flex items-center">
          <n-input type="text" v-model:value="searchText" round @input="search"
            :placeholder="$t('common.search') + ' ...'">
            <template #prefix>
              <icon-ri:search-line class="text-16px" />
            </template>
          </n-input>
        </div>
      </template>
      <n-tabs type="segment" animated>
        <n-tab-pane name="contacts" :tab="$t('chat.search.contacts') + ' (' + contactsCount + ')'">
          <n-scrollbar class="h-400px">
            <div v-for="item in contactsList" :key="item.friend_profile_identifier"
              class="flex items-center hover-bg-#f9f9f9">
              <div class="flex items-center flex-grow-1 p-10px cursor-pointer">
                <custom-avatar :src="item.friend_profile_user_profile.user_profile_face_url" :size="40" />
                <n-ellipsis class="flex-grow-1 ml-20px text-gray-900 text-15px">
                  {{
                    item.friend_profile_user_profile.user_profile_nick_name ||
                    item.friend_profile_user_profile.user_profile_identifier
                  }}
                </n-ellipsis>
              </div>
            </div>
          </n-scrollbar>
        </n-tab-pane>
        <n-tab-pane name="group" :tab="$t('chat.search.group') + ' (' + groupCount + ')'">
          <n-scrollbar class="h-400px"></n-scrollbar>
        </n-tab-pane>
        <n-tab-pane name="message" :tab="$t('chat.search.message') + ' (' + messageCount + ')'">
          <n-scrollbar class="h-400px"></n-scrollbar>
        </n-tab-pane>
      </n-tabs>
    </n-modal>
    <CreateGroupModal ref="createGroupModalRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { $t } from '@/locales'
import { useChatStore } from '@/store'
import CreateGroupModal from '@/views/contacts/components/my-group/components/create-group/index.vue'

defineOptions({ name: 'GlobalSearch' })

const chatStore = useChatStore()

const searchModalShow = ref(false)

const searchText = ref('')
const contactsCount = ref(0)
const contactsList = ref<any[]>([])
const groupCount = ref(0)
const messageCount = ref(0)

const createGroupModalRef = ref()

function showSearchModal() {
  searchText.value = ''
  searchModalShow.value = true
}

function showCreateGroupModal() {
  createGroupModalRef.value?.showModal()
}

async function search(text: string) {
  await searchFriends(text)
}

async function searchFriends(searchText: string) {
  const res = await chatStore.searchFriends(searchText)
  contactsList.value = res
}
</script>

<style lang="scss">
.search-modal {
  input {
    outline: none !important;
  }
}
</style>