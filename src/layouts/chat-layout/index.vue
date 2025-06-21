<template>
  <chat-layout>
    <template #header>
      <chat-header />
    </template>
    <template #sider>
      <chat-sider />
    </template>
    <global-content :show-padding="false" />
  </chat-layout>
</template>

<script lang="ts" setup>
import { ChatLayout, ChatHeader, ChatSider } from './components'
import { GlobalContent } from '../common'

defineOptions({ name: 'ChatLayout' })
</script>
