import { $t } from '@/locales'

/**
 * 好友添加权限枚举
 * - UNKNOWN - 未知状态
 * - ALLOW_ANYBODY_ADD_FRIEND - 允许任何人添加好友
 * - ADD_FRIEND_NEED_CONFIRM - 需要确认才能添加好友
 * - DENY_ANYBODY_ADD_FRIEND - 拒绝任何人添加好友
 */
export enum AddFriendPermissionEnum {
  UNKNOWN,
  ALLOW_ANYBODY_ADD_FRIEND,
  ADD_FRIEND_NEED_CONFIRM,
  DENY_ANYBODY_ADD_FRIEND
}

/**
 * 好友添加权限对应的国际化key映射
 */
export const AddFriendPermissionMap: Record<AddFriendPermissionEnum, I18nType.I18nKey> = {
  [AddFriendPermissionEnum.UNKNOWN]: 'page.chat.userInfo.friendAddPermissionOptions.unknown',
  [AddFriendPermissionEnum.ALLOW_ANYBODY_ADD_FRIEND]: 'page.chat.userInfo.friendAddPermissionOptions.allowAnybodyAddFriend',
  [AddFriendPermissionEnum.ADD_FRIEND_NEED_CONFIRM]: 'page.chat.userInfo.friendAddPermissionOptions.addFriendNeedConfirm',
  [AddFriendPermissionEnum.DENY_ANYBODY_ADD_FRIEND]: 'page.chat.userInfo.friendAddPermissionOptions.denyAnybodyAddFriend'
}

/**
 * 好友添加权限选项列表
 * 用于下拉选择等UI组件
 */
export const AddFriendPermissionOptions = Object.values(AddFriendPermissionEnum)
  .filter(value => typeof value === 'number')
  .map(value => ({
    label: () => $t(AddFriendPermissionMap[value as AddFriendPermissionEnum]),
    value: value as AddFriendPermissionEnum
  }))
