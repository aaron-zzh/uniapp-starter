/**
 * 各种正则表达式
 * mobile   手机号
 * email    电子邮箱
 * password 密码【6-20位】
 * integer  正整数【不包含0】
 * money    金钱
 * TINumber 纳税识别号
 * IDCard   身份证
 * userName 账户名称【汉字、字母、数字、“-”、“_”的组合】
 * URL      URL
 * TEL      固定电话
 */

// 手机号
export const mobile = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
// 电子邮箱
export const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

// 密码【6-20位】
export const password = /^[@A-Za-z0-9!#$%^&*.~,]{6,20}$/

// 正整数【不包含0】
export const integer = /^[1-9]\d*$/

// 正整数【包含0】
export const Integer = /^[0-9]\d*$/

// 金钱
export const money = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

// 纳税识别号
export const TINumber = /^((\d{6}[0-9A-Z]{9})|([0-9A-Za-z]{2}\d{6}[0-9A-Za-z]{10,12}))$/

// 身份证
export const IDCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

// 账户名称【汉字、字母、数字、“-”、“_”的组合】
export const userName = /[A-Za-z0-9_\-\u4e00-\u9fa5]$/

// URL
export const URL =
  /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/

// 固话
export const TEL = /0\d{2,3}-\d{7,8}/
