<template>
  <div class="flex-y-center bg-#f3f3f3 dark:bg-#3a3a3a cursor-pointer" :class="[!props.isQuoteMode && 'b-rd-2px']">
    <div class="flex flex-grow-1 px-6px" :class="[!props.isQuoteMode && 'text-12px py-2px']">
      <div v-if="props.msg.type === 'text'"
        class="flex-y-center max-w-258px overflow-hidden ellipsis-text whitespace-nowrap">
        {{ props.msg.nickname }}：
        <span v-html="transformEmojiText(props.msg.abstract)" class="flex gap-2px" />
      </div>
      <div v-else-if="props.msg.type === 'image'" class="flex-y-center">
        {{ props.msg.nickname }}：
        <img v-if="props.msg.imageUrl" :src="props.msg.imageUrl" alt="" class="h-30px" />
        <template v-else>{{ $t('msgPlaceholders.image') }}</template>
      </div>
      <div v-else-if="props.msg.type === 'video'" class="flex-y-center">
        {{ props.msg.nickname }}：
        <img v-if="props.msg.imageUrl" :src="props.msg.imageUrl" alt="" class="h-30px" />
        <template v-else>{{ $t('msgPlaceholders.video') }}</template>
      </div>
      <div v-else-if="props.msg.type === 'audio'">
        {{ props.msg.nickname }}：{{ $t('msgPlaceholders.sound') }}
      </div>
      <div v-else-if="props.msg.type === 'file'">
        {{ props.msg.nickname }}：{{ $t('msgPlaceholders.file') }}
      </div>
      <div v-else-if="props.msg.type === 'post'">
        {{ props.msg.nickname }}：[Post]
      </div>
      <div v-else-if="props.msg.type === 'note'">
        {{ props.msg.nickname }}：[Note]
      </div>
      <div v-else-if="props.msg.type === 'story'">
        {{ props.msg.nickname }}：[Story]
      </div>
      <div v-else-if="props.msg.type === 'merger'"
        class="flex-y-center max-w-258px overflow-hidden ellipsis-text whitespace-nowrap">
        {{ props.msg.nickname }}：{{ props.msg.abstract }}
      </div>
      <div v-else-if="props.msg.type === 'location'">
        {{ props.msg.nickname }}：{{ $t('msgPlaceholders.location') }}
      </div>
      <div v-else-if="props.msg.type === 'personal_card'">
        {{ props.msg.nickname }}：{{ $t('msgPlaceholders.personalCard') }}
      </div>
      <div v-else-if="props.msg.type === 'personal_other_card'">
        {{ props.msg.nickname }}：{{ $t('msgPlaceholders.personalCard') }}
      </div>
      <div v-else-if="props.msg.type === 'grouped_photos'">
        {{ props.msg.nickname }}：{{ $t('msgPlaceholders.photoGroup') }}
      </div>
      <div v-else>
        {{ props.msg.nickname }}：
      </div>
    </div>
    <div v-if="props.isQuoteMode" class="flex-center w-36px h-36px cursor-pointer" @click="exitQuoteMode">
      <icon-ic:round-close />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { transformEmojiText } from '@/utils/common/emoji'

interface Props {
  msg: any
  isQuoteMode?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isQuoteMode: false
})

interface Emits {
  (e: 'exit'): void
}
const emit = defineEmits<Emits>()

function exitQuoteMode() {
  emit('exit')
}
</script>