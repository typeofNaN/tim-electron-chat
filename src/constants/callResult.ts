export enum CallResultEnum {
  ACCEPT = 'accept',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  NO_RESPONSE = 'no_response',
  BUSY = 'busy'
}

export const CallResultMap: Record<CallResultEnum, I18nType.I18nKey> = {
  [CallResultEnum.ACCEPT]: 'page.chat.callResult.accept',
  [CallResultEnum.REJECTED]: 'page.chat.callResult.rejected',
  [CallResultEnum.CANCELLED]: 'page.chat.callResult.cancelled',
  [CallResultEnum.NO_RESPONSE]: 'page.chat.callResult.noResponse',
  [CallResultEnum.BUSY]: 'page.chat.callResult.busy'
}
