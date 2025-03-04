<template>
  <ChatLayout>
    <template #header>
      <ChatHeader />
    </template>
    <template #sider>
      <ChatSider />
    </template>
    <global-content :show-padding="false" />
  </ChatLayout>
</template>

<script setup lang="ts">
import { ChatLayout, ChatHeader, ChatSider } from './components'
import { GlobalContent } from '../common'

defineOptions({ name: 'ChatLayout' })
</script>
