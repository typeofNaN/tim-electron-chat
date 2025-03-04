<template>
  <div class="flex-center flex-col py-10px w-full select-none">
    <div class="mb-10px text-12px text-gray-400">
      {{ formatterTime(new Date((props.msg.message_server_time || props.msg.message_client_time) * 1000)) }}
    </div>
    <div class="px-10px py-2px bg-gray-100 dark:bg-gray-800 b-rd-4px text-13px text-gray-400">
      {{
        `${props.isMyMsg
          ? $t('page.chat.you')
          : (props.msg.message_sender_profile.user_profile_friend_remark ||
            props.msg.message_sender_profile.user_profile_nick_name ||
            props.msg.message_sender_profile.user_profile_identifier)
        }
      ${$t('page.chat.saidAGreet')}`
      }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/locales'
import { formatterTime } from '@/utils/common/datetime'

interface Props {
  msg: any
  isMyMsg: boolean
}
const props = defineProps<Props>()
</script>