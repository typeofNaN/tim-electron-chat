<template>
  <div class="flex-center mr-10px w-30px h-30px text-20px text-gray-500 dark:text-gray-300 cursor-pointer">
    <n-popover placement="top-start" trigger="click">
      <template #trigger>
        <n-tooltip trigger="hover">
          <template #trigger>
            <icon-bx:smile />
          </template>
          {{ $t('chat.emojis') }}
        </n-tooltip>
      </template>
      <n-tabs type="segment" class="w-400px">
        <n-tab-pane name="emoji-img">
          <template #tab>
            <div class="flex-center h-20px">
              <n-image :src="emojiImgList[0].value" :width="14" :preview-disabled="true" />
            </div>
          </template>
          <n-scrollbar class="h-300px">
            <div class="flex flex-wrap w-400px">
              <div v-for="emoji in emojiImgList" :key="emoji.label"
                class="flex-center w-40px h-40px cursor-pointer hover-bg-gray-2 b-rd-4px select-none text-16px"
                @click="handleClick(emoji.label)">
                <n-image :src="emoji.value" :width="16" :preview-disabled="true" />
              </div>
            </div>
          </n-scrollbar>
        </n-tab-pane>
        <n-tab-pane v-for="group in emojisGroup" :key="group.slug" :name="group.slug">
          <template #tab>
            <div class="flex-center h-20px">{{ group.emojis[0].emoji }}</div>
          </template>
          <n-scrollbar class="h-300px">
            <div class="flex flex-wrap w-400px">
              <div v-for="emoji in group.emojis" :key="emoji.slug"
                class="flex-center w-40px h-40px cursor-pointer hover-bg-gray-2 b-rd-4px select-none text-16px"
                @click="handleClick(emoji.emoji)">
                {{ emoji.emoji }}
              </div>
            </div>
          </n-scrollbar>
        </n-tab-pane>
      </n-tabs>
    </n-popover>
  </div>
</template>

<script lang="ts" setup>
import { $t } from '@/locales'
// import emojis from '@/assets/emojis/emojis.json'
import { emojiImgList } from '@/constants/emojiMap'
import emojisGroup from '@/assets/emojis/emoji-group.json'

interface Emits {
  (e: 'chooseEmojis', emojiStr: string): void
}
const emit = defineEmits<Emits>()

function handleClick(emojiStr: string) {
  emit('chooseEmojis', emojiStr)
}
</script>
