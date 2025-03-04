<template>
  <div class="w-300px">
    <div class="flex items-center gap-20px py-10px">
      <div class="flex-center">
        <custom-avatar :src="props.userInfo.user_profile_face_url" :size="40" />
      </div>
      <n-ellipsis class="flex-grow-1 text-16px">{{ props.userInfo.user_profile_nick_name }}</n-ellipsis>
    </div>
    <n-divider />
    <div class="flex justify-between items-center p-10px text-14px">
      <div class="w-100px text-gray-400">ID</div>
      <div class="flex-grow-1 text-right">{{ props.userInfo.user_profile_identifier }}</div>
    </div>
    <div class="flex justify-between items-center p-10px text-14px">
      <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.nickname') }}</div>
      <n-ellipsis class="flex-grow-1 text-right">{{ props.userInfo.user_profile_nick_name }}</n-ellipsis>
    </div>
    <div class="flex justify-between items-center p-10px text-14px">
      <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.gender') }}</div>
      <div class="flex-grow-1 text-right">
        {{
          GenderMap[props.userInfo.user_profile_gender as GenderEnum]
            ? $t(GenderMap[props.userInfo.user_profile_gender as GenderEnum])
            : $t('gender.unknown')
        }}
      </div>
    </div>
    <div class="flex justify-between items-center p-10px text-14px">
      <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.signature') }}</div>
      <n-ellipsis class="flex-grow-1 text-right">{{ props.userInfo.user_profile_self_signature }}</n-ellipsis>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GenderEnum, GenderMap } from '@/constants/gender'
import { $t } from '@/locales'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})
</script>