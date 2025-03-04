import { useClipboard } from '@vueuse/core'

import { $t } from '@/locales'

const { copy, isSupported } = useClipboard()

export default function useCopy() {
  function copyText(text: string) {
    if (!text) {
      return
    }

    if (!isSupported) {
      window.$message?.warning($t('common.copy.browserNotSupportedCopy'))
      return
    }

    try {
      copy(text)
      window.$message?.success($t('common.copy.copySuccess'))
    } catch {
      window.$message?.error($t('common.copy.copyFail'))
    }
  }

  return {
    copyText
  }
}