<template>
  <template v-if="customElemData?.subtype === 'personal_card'">
    {{ $t('msgPlaceholders.personalCard') }}
  </template>
  <template v-else-if="customElemData?.subtype === 'call'">
    <div v-if="customElemData?.type !== 'signal'" class="flex items-center gap-4px">
      <svg-icon :icon="customElemData?.content.isVideoCall === 'Y' ? 'ic:round-videocam' : 'ic:round-call'" />
      <template v-if="customElemData?.content.result === CallResultEnum.ACCEPT">
        {{ customElemData?.content.duration }} "
      </template>
      <template v-else>
        {{ $t(CallResultMap[customElemData?.content.result as CallResultEnum]) }}
      </template>
    </div>
  </template>
  <template v-else-if="customElemData?.subtype === 'friend_application'">
    {{ $t('msgPlaceholders.friendApply') }}
  </template>
  <template v-else>{{ $t('msgPlaceholders.customMessage') }}</template>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { CallResultEnum, CallResultMap } from '@/constants/callResult'

interface Props {
  lastMsg: any
}

const props = defineProps<Props>()

const customElemData = computed(() => JSON.parse(props.lastMsg.message_elem_array[0].custom_elem_data))
</script>
