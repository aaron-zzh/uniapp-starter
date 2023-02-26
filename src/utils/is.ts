/* eslint-disable @typescript-eslint/no-explicit-any */
const opt = Object.prototype.toString

export const isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
export const isNumber = (val: unknown): val is number => typeof val === 'number' && val == val
export const isRegExp = (val: unknown) => opt.call(val) === '[object RegExp]'
export const isFile = (val: unknown): val is File => opt.call(val) === '[object File]'
export const isBlob = (val: unknown): val is Blob => opt.call(val) === '[object Blob]'
export const isUndefined = (val: unknown): val is undefined => val === undefined
export const isNull = (val: unknown): val is null => val === null
export const isEmptyObject = (val: unknown) => isObject(val) && Object.keys(val).length === 0
export const isExist = (val: unknown) => val || val === 0
export const isWindow = (el: any): el is Window => el === window
export const isPhone = (el: any) =>
  el && new RegExp(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/).test(el)
export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]'
export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch)
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)
export const toRawType = (value: unknown): string => toTypeString(value).slice(8, -1)
export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]'
export const isIntegerKey = (key: unknown) =>
  isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key
