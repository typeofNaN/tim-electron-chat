<template>
  <div class="flex flex-wrap" :style="{ width: `${imageBaseWidth}px` }">
    <template v-if="groupTemplateLayout === '1'">
      <SingleMedia :media="props.msg.content.medias[0]" />
    </template>
    <template v-else-if="groupTemplateLayout === '11'">
      <Media v-for="(item, index) in props.msg.content.medias" :key="index" :media="item" :wh="imageBaseWidth" />
    </template>
    <template v-else-if="groupTemplateLayout === '12'">
      <Media v-for="(item, index) in props.msg.content.medias" :key="index" :media="item"
        :wh="index === 0 ? imageBaseWidth : (imageBaseWidth / 2)" />
    </template>
    <template v-else-if="groupTemplateLayout === '22...'">
      <Media v-for="(item, index) in props.msg.content.medias" :key="index" :media="item" :wh="imageBaseWidth / 2" />
    </template>
    <template v-else-if="groupTemplateLayout === '22...3'">
      <Media v-for="(item, index) in props.msg.content.medias" :key="index" :media="item"
        :wh="index < mediaNumber - 3 ? imageBaseWidth / 2 : imageBaseWidth / 3" />
    </template>
    <div v-if="props.msg.content.text"
      class="flex gap-4px items-center flex-wrap py-4px px-10px mt-.5px w-full text-gray-900"
      :class="[isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:text-gray-100 dark:bg-gray-800']"
      v-html="transformEmojiText(props.msg.content.text)" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { transformEmojiText } from '@/utils/common/emoji'
import SingleMedia from './components/single-media.vue'
import Media from './components/media.vue'

type GroupTmp = '1' | '11' | '12' | '22...' | '22...3'

interface Props {
  msg: any
  isMyMsg: boolean
}
const props = defineProps<Props>()

const imageBaseWidth = 240

const mediaNumber = computed(() => (props.msg.content.medias || []).length)

const groupTemplateLayout = computed<GroupTmp>(() => {
  const len = mediaNumber.value
  if (len === 0 || len === 1) {
    return '1'
  } else if (len === 2) {
    return '11'
  } else if (len === 3) {
    return '12'
  } else {
    return len % 2 === 0 ? '22...' : '22...3'
  }
})
</script>