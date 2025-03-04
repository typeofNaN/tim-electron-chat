import { $t } from '@/locales'

/**
 * 性别枚举
 * - UNKNOWN - 未知性别
 * - GENDER_FEMALE - 女性
 * - GENDER_MALE - 男性
 */
export enum GenderEnum {
  UNKNOWN,
  GENDER_FEMALE,
  GENDER_MALE
}

/**
 * 性别枚举对应的国际化key映射
 */
export const GenderMap: Record<GenderEnum, I18nType.I18nKey> = {
  [GenderEnum.UNKNOWN]: 'gender.unknown',
  [GenderEnum.GENDER_FEMALE]: 'gender.female',
  [GenderEnum.GENDER_MALE]: 'gender.male'
}

/**
 * 性别选项列表
 * 用于下拉选择等UI组件
 */
export const GenderOptions = Object.values(GenderEnum)
  .filter(value => typeof value === 'number')
  .map(value => ({
    label: () => $t(GenderMap[value as GenderEnum]),
    value: value as GenderEnum
  }))
