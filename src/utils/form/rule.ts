import type { Ref } from 'vue'
import type { FormItemRule } from 'naive-ui'

import {
  REGEXP_CODE_SIX,
  REGEXP_EMAIL,
  REGEXP_PHONE,
  // REGEXP_PWD
} from '@/config'
import { $t } from '@/locales'

/** 创建自定义错误信息的必填表单规则 */
export const createRequiredFormRule = (message = $t('formValid.notEmpty')): FormItemRule => ({ required: true, message, trigger: 'blur' })

export const requiredFormRule = createRequiredFormRule()

/** 表单规则 */
interface CustomFormRules {
  /** 账户名 */
  account: FormItemRule[]
  /** 手机号码 */
  phone: FormItemRule[]
  /** 密码 */
  pwd: FormItemRule[]
  /** 验证码 */
  code: FormItemRule[]
  /** 邮箱 */
  email: FormItemRule[]
  /** userID */
  userID: FormItemRule[]
  /** userSig */
  userSig: FormItemRule[]
}

/** 表单规则 */
export const formRules: CustomFormRules = {
  account: [
    createRequiredFormRule($t('formValid.enterUserName'))
  ],
  phone: [
    createRequiredFormRule($t('formValid.enterPhoneNumber')),
    { pattern: REGEXP_PHONE, message: $t('formValid.phoneNumberFormatError'), trigger: 'input' }
  ],
  pwd: [
    createRequiredFormRule($t('formValid.enterPassword')),
    // { pattern: REGEXP_PWD, message: $t('formValid.passwordFormatError'), trigger: 'blur' }
  ],
  code: [
    createRequiredFormRule($t('formValid.enterValidCode')),
    { pattern: REGEXP_CODE_SIX, message: $t('formValid.validCodeFormatError'), trigger: 'input' }
  ],
  email: [{ pattern: REGEXP_EMAIL, message: $t('formValid.emailFormatError'), trigger: 'blur' }],
  userID: [
    createRequiredFormRule($t('page.login.signLogin.userIDPlaceholder'))
  ],
  userSig: [
    createRequiredFormRule($t('page.login.signLogin.userSigPlaceholder'))
  ]
}

/** 是否为空字符串 */
function isBlankString(str: string) {
  return str.trim() === ''
}

/** 获取确认密码的表单规则 */
export function getConfirmPwdRule(pwd: Ref<string>) {
  const confirmPwdRule: FormItemRule[] = [
    { required: true, message: $t('formValid.enterConfirmPassword') },
    {
      validator: (rule, value) => {
        if (!isBlankString(value) && value !== pwd.value) {
          return Promise.reject(rule.message)
        }
        return Promise.resolve()
      },
      message: $t('formValid.confirmPasswordError'),
      trigger: 'input'
    }
  ]
  return confirmPwdRule
}

/** 获取图片验证码的表单规则 */
export function getImgCodeRule(imgCode: Ref<string>) {
  const imgCodeRule: FormItemRule[] = [
    { required: true, message: $t('formValid.enterValidCode') },
    {
      validator: (rule, value) => {
        if (!isBlankString(value) && value !== imgCode.value) {
          return Promise.reject(rule.message)
        }
        return Promise.resolve()
      },
      message: $t('formValid.validCodeError'),
      trigger: 'blur'
    }
  ]
  return imgCodeRule
}
