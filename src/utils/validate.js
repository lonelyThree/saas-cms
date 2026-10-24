export const isValidUsername = (str) => [ 'admin', 'editor' ].indexOf(str.trim()) >= 0

export const isExternal = (path) => /^(https?:|mailto:|tel:)/.test(path)

export const isArray = (arg) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
/**
 * 电话号码
 * @param {*} s
 */
export function isValidPhone(s) {
  return /^1[3|4|5|7|8][0-9]\d{8}$/.test(s)
}

/**
 * 密码  8-30位字母、数字、特殊符号组成
 * @param {*} s
 */
export function isValidPassword(s) {
  return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()])[\da-zA-Z~!@#$%^&*()]{8,30}$/.test(s)
}

/**
 * 邮箱
 * @param {*} s
 */
export function isValidEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

export const validPhone = (rule, value, callback) => {
  if (!value) {
    callback()
  } else if (!isValidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
/**
 *必输手机号
 */
export const validRequiedPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!isValidPhone(value)) {
    callback(new Error('请输入正确的11位手机号'))
  } else {
    callback()
  }
}
export const validEmail = (rule, value, callback) => {
  console.log(rule, value, "validEmail")
  if (!value) {
    callback(new Error('请输入邮箱'))
  } else if (!isValidEmail(value)) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}

/*
* 参数说明:
* args: {
*   required: boolean  // 是否必填
*   nullMsg: string  // 值为空时的提示信息
*   errorMsg: string  // 输入值有误时的提示信息
*   validateFn: Function  // 校验方法*
* }
* */
export const validatorFn = (args) => {
  let { required, nullMsg, errorMsg, validateFn } = args
  return (rule, value, callback) => {
    if (required && !value) {
      callback(new Error(nullMsg))
    } else if (!required && !value) {
      callback()
    } else if (!validateFn(value)) {
      callback(new Error(errorMsg))
    } else {
      callback()
    }
  }
}
