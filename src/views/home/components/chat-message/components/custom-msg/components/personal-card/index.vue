<template>
  <div class="p-10px w-240px b-rd-4px cursor-pointer"
    :class="[props.isMyMsg ? 'bg-#95ec69' : 'bg-gray-100 dark:bg-gray-800']" @click="openPersonalCardModal">
    <div class="flex items-center">
      <custom-avatar :src="props.msg.content.imageUrl" :size="40" />
      <n-ellipsis class="pl-10px w-[calc(100%-40px)] text-14px"
        :class="[props.isMyMsg ? 'text-gray-900' : 'text-gray-100']">
        {{ props.msg.content.nickname }}
      </n-ellipsis>
    </div>
    <div class="my-10px h-1px" :class="[props.isMyMsg ? 'bg-gray-400' : 'bg-gray-300']"></div>
    <div class="text-12px" :class="[props.isMyMsg ? 'text-gray-500' : 'text-gray-400']">
      {{ $t('page.chat.personalCard') }}
    </div>
    <n-modal v-model:show="modalShow">
      <n-card v-if="profileInfo" :bordered="false" size="huge" role="dialog" aria-modal="true" class="w-400px">
        <template #header>
          <div v-if="isMyFriend" class="flex items-center">
            <custom-avatar :src="profileInfo.friend_profile_user_profile.user_profile_face_url" :size="40" />
            <n-ellipsis class="pl-10px w-[calc(100%-40px)] text-14px">
              {{
                profileInfo.friend_profile_remark ||
                profileInfo.friend_profile_user_profile.user_profile_nick_name ||
                profileInfo.friend_profile_user_profile.user_profile_identifier
              }}
            </n-ellipsis>
          </div>
          <div v-else class="flex items-center">
            <custom-avatar :src="profileInfo.user_profile_face_url" :size="40" />
            <n-ellipsis class="pl-10px w-[calc(100%-40px)] text-14px">
              {{ profileInfo.user_profile_nick_name || profileInfo.user_profile_identifier }}
            </n-ellipsis>
          </div>
        </template>
        <template #header-extra>
          <icon-material-symbols:close-rounded class="text-20px cursor-pointer" @click="modalShow = false" />
        </template>
        <template v-if="isMyFriend">
          <div class="flex justify-between items-center py-10px text-14px">
            <div class="w-100px text-gray-400">ID</div>
            <div class="flex-grow-1 text-right">
              {{ profileInfo.friend_profile_user_profile.user_profile_identifier }}
            </div>
          </div>
          <div class="flex justify-between items-center py-10px text-14px">
            <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.nickname') }}</div>
            <n-ellipsis class="flex-grow-1 text-right">
              {{ profileInfo.friend_profile_user_profile.user_profile_nick_name }}
            </n-ellipsis>
          </div>
          <div class="flex justify-between items-center py-10px text-14px">
            <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.remark') }}</div>
            <n-ellipsis class="flex-grow-1 text-right">
              {{ profileInfo.friend_profile_remark }}
            </n-ellipsis>
          </div>
          <div class="flex justify-between items-center py-10px text-14px">
            <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.addTime') }}</div>
            <n-ellipsis class="flex-grow-1 text-right">
              {{ formatterTimestamp(profileInfo.friend_profile_add_time * 1000) }}
            </n-ellipsis>
          </div>
          <div class="flex justify-between items-center py-10px text-14px">
            <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.gender') }}</div>
            <div class="flex-grow-1 text-right">
              {{
                GenderMap[profileInfo.friend_profile_user_profile.user_profile_gender as GenderEnum]
                  ? $t(GenderMap[profileInfo.friend_profile_user_profile.user_profile_gender as GenderEnum])
                  : $t('gender.unknown')
              }}
            </div>
          </div>
          <div class="flex justify-between items-center py-10px text-14px">
            <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.signature') }}</div>
            <n-ellipsis class="flex-grow-1 text-right">
              {{ profileInfo.friend_profile_user_profile.user_profile_self_signature }}
            </n-ellipsis>
          </div>
          <div v-if="profileInfo.friend_profile_user_profile.user_profile_identifier !== chatStore.currentConvUserID"
            class="flex-center py-10px">
            <n-button type="primary" block @click="handleSendMessage">
              {{ $t('page.contacts.sendMessage') }}
            </n-button>
          </div>
        </template>
        <template v-else>
          <div class="flex justify-between items-center p-10px text-14px">
            <div class="w-100px text-gray-400">ID</div>
            <div class="flex-grow-1 text-right">
              {{ profileInfo.user_profile_identifier }}
            </div>
          </div>
          <div class="flex justify-between items-center p-10px text-14px">
            <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.nickname') }}</div>
            <n-ellipsis class="flex-grow-1 text-right">
              {{ profileInfo.user_profile_nick_name }}
            </n-ellipsis>
          </div>
          <div class="flex justify-between items-center p-10px text-14px">
            <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.gender') }}</div>
            <div class="flex-grow-1 text-right">
              {{
                GenderMap[profileInfo.user_profile_gender as GenderEnum]
                  ? $t(GenderMap[profileInfo.user_profile_gender as GenderEnum])
                  : $t('gender.unknown')
              }}
            </div>
          </div>
          <div class="flex justify-between items-center p-10px text-14px">
            <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.signature') }}</div>
            <n-ellipsis class="flex-grow-1 text-right">
              {{ profileInfo.user_profile_self_signature }}
            </n-ellipsis>
          </div>
          <div class="flex-center py-10px">
            <n-button type="primary" block @click="handleAddFriend">
              {{ $t('page.contacts.addFriend') }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { FriendTypeEnum } from '@/constants/friendType'
import { GenderEnum, GenderMap } from '@/constants/gender'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { formatterTimestamp } from '@/utils/common/datetime'
import { ConvTypeEnum } from '@/constants/conv'

enum FriendType {
  SINGLE,
  BOTH
}

interface Props {
  msg: any
  isMyMsg: boolean
}
const props = defineProps<Props>()

const chatStore = useChatStore()

const modalShow = ref(false)
const isMyFriend = ref(true)
const profileInfo = ref<any>(null)

/**
 * 获取用户资料信息
 * 1. 先检查好友关系类型
 * 2. 如果是好友则获取好友资料
 * 3. 如果不是好友则获取用户资料
 */
async function getProfileInfo() {
  // 检查好友关系类型
  const friendType = await chatStore.checkFriendType(props.msg.content.imUserId)
  if (friendType) {
    // 判断是否为好友关系(单向好友或双向好友)
    const isFriend = [FriendTypeEnum.ONLY_MY_FRIEND, FriendTypeEnum.BOTH_FRIEND].includes(
      friendType.friendship_check_friendtype_result_relation
    )
    isMyFriend.value = isFriend
    if (isFriend) {
      // 获取好友资料
      const res = await chatStore.getFriendProfile(props.msg.content.imUserId)
      if (res) {
        profileInfo.value = res.friendship_friend_info_get_result_field_info
      }
    } else {
      // 获取用户资料
      const res = await chatStore.getUserInfo(props.msg.content.imUserId)
      console.log(res)
      if (res) {
        profileInfo.value = res
      }
    }
  }
}

async function openPersonalCardModal() {
  // 初始化获取用户资料
  await getProfileInfo()
  modalShow.value = true
}

async function handleSendMessage() {
  const res = await chatStore.createConv({
    conv_id: profileInfo.value.friend_profile_user_profile.user_profile_identifier,
    conv_type: ConvTypeEnum.C2C,
    conv_face_url: profileInfo.value.friend_profile_user_profile.user_profile_face_url,
    conv_show_name: profileInfo.value.friend_profile_remark ||
      profileInfo.value.friend_profile_user_profile.user_profile_nick_name ||
      profileInfo.value.friend_profile_user_profile.user_profile_identifier
  })

  if (res) {
    modalShow.value = false
  }
}

async function handleAddFriend() {
  const postData = {
    friendship_add_friend_param_identifier: props.msg.content.imUserId, // 请求加好友对应的UserID
    friendship_add_friend_param_friend_type: FriendType.BOTH, // 请求添加好友的好友类型
    friendship_add_friend_param_remark: '', // 预备注
    friendship_add_friend_param_group_name: '', // 预分组名
    friendship_add_friend_param_add_source: '', // 加好友来源描述
    friendship_add_friend_param_add_wording: '' // 加好友附言
  }
  const res = await chatStore.addFriend(postData)
  if (res) {
    modalShow.value = false
    window.$message?.success($t('page.contacts.addFriendModal.applySuccess'))
  } else {
    window.$message?.error($t('page.contacts.addFriendModal.applyFailed'))
  }
}
</script>
