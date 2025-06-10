<template>
  <div>
    <n-popover v-if="isMyFriend" placement="bottom-end" trigger="click" @update:show="handleUpdateShow">
      <template #trigger>
        <div class="flex flex-col items-center w-full overflow-hidden cursor-pointer select-none">
          <template v-if="profileInfo">
            <custom-avatar :src="profileInfo.friend_profile_user_profile.user_profile_face_url" :size="40" />
            <n-ellipsis class="mt-2px text-13px" :tooltip="{ placement: 'right' }">
              {{
                profileInfo.friend_profile_remark ||
                profileInfo.friend_profile_user_profile.user_profile_nick_name ||
                profileInfo.friend_profile_user_profile.user_profile_identifier
              }}
            </n-ellipsis>
          </template>
        </div>
      </template>
      <div class="w-300px select-none">
        <div class="flex items-center py-10px">
          <div class="flex-center w-40px">
            <custom-avatar :src="profileInfo.friend_profile_user_profile.user_profile_face_url" :size="40" />
          </div>
          <div class="flex justify-between items-center flex-grow-1 pl-20px w-[calc(100%-40px)]">
            <div class="text-16px w-[calc(100%-30px)] ellipsis-text">
              {{
                profileInfo.friend_profile_remark ||
                profileInfo.friend_profile_user_profile.user_profile_nick_name ||
                profileInfo.friend_profile_user_profile.user_profile_identifier
              }}
            </div>
            <div class="flex-center w-30px cursor-pointer" @click="handleEditProfile">
              <icon-mdi:account-edit class="text-18px text-gray-400" />
            </div>
          </div>
        </div>
        <n-divider />
        <div class="flex justify-between items-center p-10px text-14px">
          <div class="w-100px text-gray-400">ID</div>
          <div class="flex-grow-1 text-right">
            {{ profileInfo.friend_profile_user_profile.user_profile_identifier }}
          </div>
        </div>
        <div class="flex justify-between items-center p-10px text-14px">
          <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.nickname') }}</div>
          <n-ellipsis class="flex-grow-1 text-right">
            {{ profileInfo.friend_profile_user_profile.user_profile_nick_name }}
          </n-ellipsis>
        </div>
        <div class="flex justify-between items-center p-10px text-14px">
          <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.remark') }}</div>
          <n-ellipsis class="flex-grow-1 text-right">
            {{ profileInfo.friend_profile_remark }}
          </n-ellipsis>
        </div>
        <div class="flex justify-between items-center p-10px text-14px">
          <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.addTime') }}</div>
          <n-ellipsis class="flex-grow-1 text-right">
            {{ formatterTimestamp(profileInfo.friend_profile_add_time * 1000) }}
          </n-ellipsis>
        </div>
        <div class="flex justify-between items-center p-10px text-14px">
          <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.gender') }}</div>
          <div class="flex-grow-1 text-right">
            {{
              GenderMap[profileInfo.friend_profile_user_profile.user_profile_gender as GenderEnum]
                ? $t(GenderMap[profileInfo.friend_profile_user_profile.user_profile_gender as GenderEnum])
                : $t('gender.unknown')
            }}
          </div>
        </div>
        <div class="flex justify-between items-center p-10px text-14px">
          <div class="w-100px text-gray-400">{{ $t('page.chat.userInfo.signature') }}</div>
          <n-ellipsis class="flex-grow-1 text-right">
            {{ profileInfo.friend_profile_user_profile.user_profile_self_signature }}
          </n-ellipsis>
        </div>
      </div>
    </n-popover>
    <n-popover v-else placement="bottom-end" trigger="click" @update:show="handleUpdateShow">
      <template #trigger>
        <div class="flex flex-col items-center w-full overflow-hidden cursor-pointer">
          <template v-if="profileInfo">
            <custom-avatar :src="profileInfo.user_profile_face_url" :size="40" />
            <n-ellipsis class="mt-2px text-13px">
              {{
                profileInfo.user_profile_nick_name ||
                profileInfo.user_profile_identifier
              }}
            </n-ellipsis>
          </template>
        </div>
      </template>
      <div class="w-300px">
        <div class="flex items-center py-10px">
          <div class="flex-center w-40px">
            <custom-avatar :src="profileInfo.user_profile_face_url" :size="40" />
          </div>
          <div class="flex justify-between items-center flex-grow-1 pl-20px w-[calc(100%-40px)]">
            <div class="flex-grow-1 text-16px ellipsis-text">
              {{
                profileInfo.user_profile_nick_name ||
                profileInfo.user_profile_identifier
              }}
            </div>
          </div>
        </div>
        <n-divider />
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
        <div class="flex-center p-10px">
          <n-button type="primary" block @click="handleAddFriend">
            {{ $t('page.contacts.addFriend') }}
          </n-button>
        </div>
      </div>
    </n-popover>
    <EditProfile ref="editProfileRef" @refresh="getProfileInfo" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { FriendTypeEnum } from '@/constants/friendType'
import { GenderEnum, GenderMap } from '@/constants/gender'
import { $t } from '@/locales'
import { useChatStore } from '@/store'
import { formatterTimestamp } from '@/utils/common/datetime'
import EditProfile from '../edit-profile/index.vue'

enum FriendType {
  SINGLE,
  BOTH
}

interface Props {
  userId: string
}
const props = defineProps<Props>()

const chatStore = useChatStore()

const showProfilePanel = ref(false)

const isMyFriend = ref(true)
const profileInfo = ref<any>(null)

const editProfileRef = ref()

/**
 * 处理个人资料面板显示/隐藏
 * @param show 是否显示
 */
function handleUpdateShow(show: boolean) {
  showProfilePanel.value = show
}

/**
 * 获取用户资料信息
 * 1. 先检查好友关系类型
 * 2. 如果是好友则获取好友资料
 * 3. 如果不是好友则获取用户资料
 */
async function getProfileInfo() {
  // 检查好友关系类型
  const friendType = await chatStore.checkFriendType(props.userId)
  if (friendType) {
    // 判断是否为好友关系(单向好友或双向好友)
    const isFriend = [FriendTypeEnum.ONLY_MY_FRIEND, FriendTypeEnum.BOTH_FRIEND].includes(
      friendType.friendship_check_friendtype_result_relation
    )
    isMyFriend.value = isFriend
    if (isFriend) {
      // 获取好友资料
      const res = await chatStore.getFriendProfile(props.userId)
      if (res) {
        profileInfo.value = res.friendship_friend_info_get_result_field_info
      }
    } else {
      // 获取用户资料
      const res = await chatStore.getUserInfo(props.userId)
      console.log(res)
      if (res) {
        profileInfo.value = res
      }
    }
  }
}

// 初始化获取用户资料
getProfileInfo()

/**
 * 处理编辑好友资料
 * 打开编辑资料弹窗
 */
function handleEditProfile() {
  editProfileRef.value.showModal({
    identifier: profileInfo.value.friend_profile_user_profile.user_profile_identifier,
    remark: profileInfo.value.friend_profile_remark,
    group: profileInfo.value.friend_profile_group_name_array
  })
}

/**
 * 处理添加好友
 */
async function handleAddFriend() {
  const postData = {
    friendship_add_friend_param_identifier: props.userId, // 请求加好友对应的UserID
    friendship_add_friend_param_friend_type: FriendType.BOTH, // 请求添加好友的好友类型
    friendship_add_friend_param_remark: '', // 预备注
    friendship_add_friend_param_group_name: '', // 预分组名
    friendship_add_friend_param_add_source: '', // 加好友来源描述
    friendship_add_friend_param_add_wording: '' // 加好友附言
  }
  const res = await chatStore.addFriend(postData)
  if (res) {
    window.$message?.success($t('page.contacts.addFriendModal.applySuccess'))
  } else {
    window.$message?.error($t('page.contacts.addFriendModal.applyFailed'))
  }
}
</script>
