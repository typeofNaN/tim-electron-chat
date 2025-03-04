export enum FriendApplyFromEnum {
  ADD_SOURCE_TYPE_CONTACT = 'AddSource_Type_Contact',
  ADD_SOURCE_TYPE_SEARCH = 'AddSource_Type_Search',
  ADD_SOURCE_TYPE_SCAN = 'AddSource_Type_Scan'
}

export const FriendApplyFromMap: Record<FriendApplyFromEnum, I18nType.I18nKey> = {
  [FriendApplyFromEnum.ADD_SOURCE_TYPE_CONTACT]: 'page.contacts.friendApplySource.contact',
  [FriendApplyFromEnum.ADD_SOURCE_TYPE_SEARCH]: 'page.contacts.friendApplySource.search',
  [FriendApplyFromEnum.ADD_SOURCE_TYPE_SCAN]: 'page.contacts.friendApplySource.scan'
}