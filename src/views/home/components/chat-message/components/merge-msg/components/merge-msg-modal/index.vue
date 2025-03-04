<template>
  <n-modal v-model:show="modalShow">
    <n-card :bordered="false" :title="modalTitle" size="huge" role="dialog" aria-modal="true" class="w-600px">
      <template #header-extra>
        <icon-material-symbols:close-rounded class="text-20px cursor-pointer" @click="modalShow = false" />
      </template>
      <n-scrollbar class="max-h-400px">
        <div v-for="item in msgList" :key="item.message_msg_id" class="flex gap-10px  py-15px">
          <custom-avatar :src="item.message_sender_profile.user_profile_face_url" :size="40" />
          <div class="w-80%">
            <div class="flex gap-10px items-center mb-6px lh-[1.5]">
              <div class="text-14px">
                {{
                  item.message_sender_profile.user_profile_friend_remark ||
                  item.message_sender_profile.user_profile_nick_name ||
                  item.message_sender_profile.user_profile_identifier
                }}
              </div>
              <div class="text-12px text-gray-400 lh-[1]">
                {{ formatterTime(new Date((item.message_server_time || item.message_client_time) * 1000)) }}
              </div>
            </div>
            <div class="flex">
              <TextMsg v-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.TEXT" :msg="item" />
              <ImageMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.IMAGE" :msg="item" />
              <SoundMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.SOUND" :msg="item" />
              <CustomMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.CUSTOM" :msg="item" />
              <FileMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.FILE" :msg="item" />
              <LocationMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.LOCATION" :msg="item" />
              <VideoMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.VIDEO" :msg="item" />
              <MergeMsg v-else-if="item.message_elem_array[0]?.elem_type === MsgTypeEnum.MERGE" :msg="item" />
            </div>
          </div>
        </div>
      </n-scrollbar>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { MsgTypeEnum } from '@/constants/msg'
import { useChatStore } from '@/store'
import { formatterTime } from '@/utils/common/datetime'
import {
  TextMsg,
  ImageMsg,
  SoundMsg,
  CustomMsg,
  FileMsg,
  LocationMsg,
  VideoMsg,
  MergeMsg,
} from './index'

defineOptions({
  name: 'MergeMsgModal'
})

defineExpose({
  handleDownload
})

const chatStore = useChatStore()

const modalShow = ref(false)

const modalTitle = ref('')
const msgList = ref<any[]>([])

async function handleDownload(data: any) {
  const res = await chatStore.downloadMergerMessage(data)
  modalTitle.value = data.message_elem_array[0].merge_elem_title
  msgList.value = res
  console.log('msgList', res)
  modalShow.value = true
}
</script>
