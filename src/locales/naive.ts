import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import type { NDateLocale, NLocale } from 'naive-ui'

export const naiveLocales: Record<I18nType.LangType, NLocale> = {
  'zh-CN': zhCN,
  en: enUS
}

export const naiveDateLocales: Record<I18nType.LangType, NDateLocale> = {
  'zh-CN': dateZhCN,
  en: dateEnUS
}
