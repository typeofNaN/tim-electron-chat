<template>
  <template v-if="customElemData?.subtype === 'personal_card'">
    {{ $t('msgPlaceholders.personalCard') }}
  </template>
  <template v-else-if="customElemData?.subtype === 'call'">
    <div v-if="customElemData?.type !== 'signal'" class="flex items-center gap-4px">
      <svg-icon :icon="customElemData?.content.isVideoCall === 'Y' ? 'ic:round-videocam' : 'ic:round-call'" />
      <template v-if="customElemData?.content.result === CallResultEnum.ACCEPT">
        {{ convertSecondsToHMS(customElemData?.content.duration) }}
      </template>
      <template v-else>
        {{ $t(CallResultMap[customElemData?.content.result as CallResultEnum]) }}
      </template>
    </div>
  </template>
  <template v-else-if="customElemData?.subtype === 'grouped_photos'">
    {{
      // 图组只有一个元素时，将其看为单图片或单视频
      customElemData?.content.medias.length === 1
        ? customElemData?.content.medias[0].type === 'IMAGE'
          ? $t('msgPlaceholders.image')
          : $t('msgPlaceholders.video')
        : $t('msgPlaceholders.photoGroup')
    }}
  </template>
  <template v-else-if="customElemData?.subtype === 'friend_application'">
    {{ $t('msgPlaceholders.friendApply') }}
  </template>
  <template v-else-if="customElemData?.subtype === 'new_friend_online'">
    {{ $t('msgPlaceholders.friendOnlineNotification') }}
  </template>
  <template v-else>{{ $t('msgPlaceholders.customMessage') }}</template>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { CallResultEnum, CallResultMap } from '@/constants/callResult'
import { convertSecondsToHMS } from '@/utils/common/datetime'

interface Props {
  lastMsg: any
}

const props = defineProps<Props>()

const customElemData = computed(() => JSON.parse(props.lastMsg.message_elem_array[0].custom_elem_data))
</script>
