/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'
import storage from '@/utils/storage'

/**
 * 货币格式化
 * @param price
 * @returns {string}
 */
export function formatPrice(price) {
  if (typeof price !== 'number') return price
  return String(Number(price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
/**
 * 金钱单位置换  2999 --> 2,999.00
 * @param val
 * @param unit
 * @param location
 * @returns {*}
 */
export function unitPrice(val, unit, location) {
  if (!val) val = 0
  const price = Foundation.formatPrice(val)
  if (location === 'before') {
    return price.substr(0, price.length - 3)
  }
  if (location === 'after') {
    return price.substr(-2)
  }
  return (unit || '') + price
}

/**
 * 脱敏姓名
 */

export function noPassByName(str) {
  if (null != str && str != undefined) {
    if (str.length <= 3) {
      return '*' + str.substring(1, str.length)
    } else if (str.length > 3 && str.length <= 6) {
      return '**' + str.substring(2, str.length)
    } else if (str.length > 6) {
      return str.substring(0, 2) + '****' + str.substring(6, str.length)
    }
  } else {
    return ''
  }
}

/**
 * 清除逗号
 *
 */
export function clearStrComma(str) {
  str = str.replace(/,/g, '') //取消字符串中出现的所有逗号
  return str
}

export function isLogin() {
  const login = storage.getHasLogin()
  return login ? true : false
}
export function getUser() {
  const login = storage.getHasLogin()
  return login ? storage.getUserInfo() : false
}

/**
 * 验证是否登录如果没登录则去登录
 * @param {*} val
 * @returns
 */

export function toLogin() {
  // #ifdef MP-WEIXIN
  uni.navigateTo({
    url: '/pages/login/weappLogin',
  })
  // #endif
  // #ifdef MP-TOUTIAO
  uni.navigateTo({
    url: '/pages/login/toutiaoLogin',
  })
  //  #endif
  // #ifdef H5
  uni.navigateTo({
    url: '/pages/login/index',
  })
  //  #endif
}

/**
 * 获取当前加载的页面对象
 * @param val
 */
export function getPages(val) {
  const pages = getCurrentPages() //获取加载的页面
  const currentPage = pages[pages.length - 1] //获取当前页面的对象
  const url = currentPage.route //当前页面url

  return val ? currentPage : url
}

export function isWeiXin() {
  //#ifdef H5
  //判断是否微信浏览器
  const ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true // 微信中打开
  }
  // #endif
  return false // 普通浏览器中打开
}

export function checkBankno(bankno) {
  const lastNum = bankno.substr(bankno.length - 1, 1) //取出最后一位（与luhm进行比较）
  const first15Num = bankno.substr(0, bankno.length - 1) //前15或18位
  const newArr = []

  for (let i = first15Num.length - 1; i > -1; i--) {
    //前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1))
  }

  const arrJiShu = [] //奇数位*2的积 <9
  const arrJiShu2 = [] //奇数位*2的积 >9
  const arrOuShu = [] //偶数位数组
  for (let j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) {
      //奇数位
      if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2)
      else arrJiShu2.push(parseInt(newArr[j]) * 2)
    } //偶数位
    else arrOuShu.push(newArr[j])
  }

  const jishu_child1 = [] //奇数位*2 >9 的分割之后的数组个位数
  const jishu_child2 = [] //奇数位*2 >9 的分割之后的数组十位数
  for (let h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
  }

  let sumJiShu = 0 //奇数位*2 < 9 的数组之和
  let sumOuShu = 0 //偶数位数组之和
  let sumJiShuChild1 = 0 //奇数位*2 >9 的分割之后的数组个位数之和
  let sumJiShuChild2 = 0 //奇数位*2 >9 的分割之后的数组十位数之和
  let sumTotal = 0
  for (let m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m])
  }
  for (let n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n])
  }
  for (let p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
  }
  //计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)
  //计算Luhm值
  const k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10
  const luhm = 10 - k
  if (lastNum == luhm) {
    return true
  } else {
    return false
  }
}

function backToHome() {
  uni.switchTab({
    url: `/pages/tabbar/home/index`,
  })
}
/**
 * 登录后跳转判断
 * 计算出当前router路径
 * 1.如果跳转的链接为登录页面或跳转的链接为空页面。则会重新跳转到首页
 * 2.都不满足返回跳转页面
 * @param type  'default' || 'wx'  //返回地址会做判断默认为default
 */
export function whetherNavigate(type = 'default') {
  if (getCurrentPages().length > 1) {
    const navigation = getCurrentPages()[getCurrentPages().length - 2]
    console.log(navigation.route, getCurrentPages().length)
    if (navigation.route == 'pages/login/index' || !navigation.route || navigation.route == undefined) {
      navigationToBack(type)
    } else {
      if (navigation.route.includes('tabbar')) {
        uni.switchTab({
          url: `/pages/tabbar/home/index`,
        })
      } else {
        uni.navigateBack()
      }
    }
  } else {
    backToHome()
  }
}

function navigationToBack(type: string) {
  if (type == 'wx') {
    uni.navigateBack({
      delta: getCurrentPages().length,
    })
  } else {
    backToHome()
  }
}

/**
 * 将unix时间戳转换为指定格式
 * @param unix   时间戳【秒】
 * @param format 转换格式
 * @returns {*|string}
 */
export function unixToDate(unix, format) {
  if (!unix) return unix
  let _format = format || 'yyyy-MM-dd hh:mm:ss'
  const d = new Date(unix)
  const o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds(),
  }
  if (/(y+)/.test(_format)) _format = _format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o)
    if (new RegExp('(' + k + ')').test(_format))
      _format = _format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
  return _format
}

/**
 * 将时间转unix时间戳
 * @param date
 * @returns {number} 【秒】
 */
export function dateToUnix(date) {
  let newStr = date.replace(/:/g, '-')
  newStr = newStr.replace(/ /g, '-')
  const arr = newStr.split('-')
  const datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8 || -8, arr[4] || 0, arr[5] || 0))
  return parseInt(datum.getTime() / 1000)
}

/**
 * 手机号隐私保护
 * 隐藏中间四位数字
 * @param mobile
 * @returns {*}
 */
export function secrecyMobile(mobile) {
  mobile = String(mobile)
  if (!/\d{11}/.test(mobile)) {
    return mobile
  }
  return mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
}

/**
 * 随机生成指定长度的字符串
 * @param length
 * @returns {string}
 */
export function randomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const maxPos = chars.length
  let _string = ''
  for (let i = 0; i < length; i++) {
    _string += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return _string
}

/**
 * 计算传秒数的倒计时【天、时、分、秒】
 * @param seconds
 * @returns {{day : *, hours : *, minutes : *, seconds : *}}
 */

export function countTimeDown(seconds) {
  const leftTime = (time) => {
    if (time < 10) time = '0' + time
    return time + ''
  }
  return {
    day: leftTime(parseInt(seconds / 60 / 60 / 24, 10)),
    hours: leftTime(parseInt((seconds / 60 / 60) % 24, 10)),
    minutes: leftTime(parseInt((seconds / 60) % 60, 10)),
    seconds: leftTime(parseInt(seconds % 60, 10)),
  }
}

/**
 * 计算当前时间到第二天0点的倒计时[秒]
 * @returns {number}
 */
export function theNextDayTime() {
  const nowDate = new Date()
  const time =
    new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1, 0, 0, 0).getTime() - nowDate.getTime()
  return parseInt(time / 1000)
}

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
function urlParse(url) {
  const obj = {}
  const reg = /[?&][^?&]+=[^?&]+/g
  const arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      const tempArr = item.substring(1).split('=')
      const key = decodeURIComponent(tempArr[0])
      const val = decodeURIComponent(tempArr.splice(1).join('='))
      obj[key] = val
    })
  }
  return obj
}

export const getNetworkType = () => {
  uni.getNetworkType({
    success: (res) => {
      if (res.networkType === 'none') {
        uni.showToast({
          title: '网络好像有点问题,请检查后重试！',
          duration: 2000,
          icon: 'none',
        })
        const pages = getCurrentPages()
        if (pages.length) {
          const route = pages[pages.length - 1].route
          if (route !== 'pages/empty/empty') {
            uni.navigateTo({
              url: `/pages/empty/empty?type=wifi`,
            })
          }
        } else {
          uni.navigateTo({
            url: `/pages/empty/empty?type=wifi`,
          })
        }
      }
    },
  })
}

export const throttle = (fn, that, gapTime) => {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1800
  }
  const _lastTime = that.lastTime
  const _nowTime = +new Date()
  if (_nowTime - _lastTime > gapTime || !_lastTime) {
    fn.apply(that, arguments) //将this和参数传给原函数
    that.lastTime = _nowTime
  }
}

/**
 * opt  object | string
 * to_url object | string
 * 例:
 * this.toPage('/pages/test/test'); 跳转不提示
 * this.toPage({title:'提示'},'/pages/test/test'); 提示并跳转
 * this.toPage({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
 * tab=1 一定时间后跳转至 table上
 * tab=2 一定时间后跳转至非 table上
 * tab=3 一定时间后返回上页面
 * tab=4 关闭所有页面跳转至非table上
 * tab=5 关闭当前页面跳转至table上
 */
export const toPage = function (opt, to_url?) {
  if (typeof opt == 'string') {
    to_url = opt
    opt = {}
  }
  const title = opt.title || '',
    icon = opt.icon || 'none',
    endtime = opt.endtime || 2000,
    success = opt.success
  if (title)
    uni.showToast({
      title: title,
      icon: icon,
      duration: endtime,
      success,
    })
  if (to_url != undefined) {
    if (typeof to_url == 'object') {
      const tab = to_url.tab || 1,
        url = to_url.url || ''
      switch (tab) {
        case 1:
          // 一定时间后跳转至 table
          setTimeout(function () {
            uni.switchTab({
              url: url,
            })
          }, endtime)
          break
        case 2:
          // 跳转至非table页面
          setTimeout(function () {
            uni.navigateTo({
              url: url,
            })
          }, endtime)
          break
        case 3:
          // 返回上页面
          setTimeout(function () {
            // #ifndef H5
            uni.navigateBack({
              delta: parseInt(url),
            })
            // #endif
            // #ifdef H5
            history.back()
            // #endif
          }, endtime)
          break
        case 4:
          // 关闭当前所有页面跳转至非table页面
          setTimeout(function () {
            uni.reLaunch({
              url: url,
            })
          }, endtime)
          break
        case 5:
          // 关闭当前页面跳转至非table页面
          setTimeout(function () {
            uni.redirectTo({
              url: url,
            })
          }, endtime)
          break
      }
    } else if (typeof to_url == 'function') {
      setTimeout(function () {
        to_url && to_url()
      }, endtime)
    } else {
      // 没有提示时跳转不延迟
      setTimeout(
        function () {
          uni.navigateTo({
            url: to_url,
          })
        },
        title ? endtime : 0
      )
    }
  }
}

// 解析 path
export const parseUrl = (fullPath: string) => {
  const [path, queryStr] = fullPath.split('?')
  const name = path.slice(path.lastIndexOf('/') + 1)
  const query = {} as Record<string, string>
  queryStr
    ?.split('&')
    .map((i) => i.split('='))
    .forEach((i) => (query[i[0]] = i[1]))
  return {
    name,
    path,
    query,
  }
}

// 还原url
export const restoreUrl = (path: string, query: Record<string, string>) => {
  let count = 0
  for (const key in query) {
    path += `${count === 0 ? '?' : '&'}${key}=${query[key]}`
    count += 1
  }
  return path
}

//  compareVersion('1.11.0', '1.9.9') // => 1 // 1 表示 1.11.0 比 1.9.9 要新
//  compareVersion('1.11.0', '1.11.0') // => 0 // 0 表示 1.11.0 和 1.11.0 是同一个版本
//  compareVersion('1.11.0', '1.99.0') // => -1 // -1 表示 1.11.0 比 1.99.0 要老
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}

export const uploadFile = (id: number, model: string, field: string, src: string, toast = true) => {
  // uni.showLoading({
  // 	title: '请稍候...'
  // })
  return new Promise((resolve, reject) => {
    const token = storage.getAccessToken()
    uni.uploadFile({
      url: import.meta.env.VITE_API_BASE_URL + '/api/v1/lxw/upload',
      filePath: src,
      name: 'file',
      header: {
        Authorization: token,
      },
      formData: {
        id,
        model,
        field,
      },
      success: (res) => {
        console.log(res)
        const d = JSON.parse(res.data)
        if (d.code == 200) {
          toast && uni.showToast({ title: d.data, icon: 'none' })
          resolve(d.data)
        } else {
          toast && uni.showToast({ title: d.msg, icon: 'none' })
          reject(d.msg || '')
        }
      },
      fail: (res) => {
        console.log(res)
        reject(res)
      },
    })
  })
}

export const uploadBlobFile = (id: number, model: string, field: string, file: File, toast = true) => {
  return new Promise((resolve, reject) => {
    const token = storage.getAccessToken()
    uni.uploadFile({
      url: import.meta.env.VITE_API_BASE_URL + '/api/v1/lxw/upload',
      file,
      header: {
        Authorization: token,
      },
      formData: {
        id,
        model,
        field,
      },
      success: (res) => {
        console.log(res)
        const d = JSON.parse(res.data)
        if (d.code == 200) {
          toast && uni.showToast({ title: d.data, icon: 'none' })
          resolve(d.data)
        } else {
          toast && uni.showToast({ title: d.msg, icon: 'none' })
          reject(d.msg || '')
        }
      },
      fail: (res) => {
        console.log(res)
        reject(res)
      },
    })
  })
}

export const registerFace = (src: string | undefined, file: File | undefined, coordinate: string, compare: boolean) => {
  return new Promise((resolve, reject) => {
    const token = storage.getAccessToken()
    uni.uploadFile({
      url: import.meta.env.VITE_API_BASE_URL + '/api/v1/ydt/student/register_face',
      filePath: src,
      name: src ? 'file' : undefined,
      file: file,
      header: {
        Authorization: token,
      },
      formData: {
        coordinate,
        compare: compare ? '1' : '0',
      },
      success: (res) => {
        console.log(res)
        const d = JSON.parse(res.data)
        if (d.code == 200) {
          resolve(d.data)
        } else {
          reject(d.msg || '')
        }
      },
      fail: (res) => {
        reject(res)
      },
    })
  })
}

/**
 * 日期格式化
 * @params {Date || Number} date 需要格式化的时间
 * timeFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
 */
export const timeFormat = (time: Date | number, fmt = 'yyyy-MM-dd hh:mm:ss', targetTimezone = 8) => {
  try {
    if (!time) {
      return ''
    }
    if (typeof time === 'string' && !isNaN(time)) time = Number(time)
    // 其他更多是格式化有如下:
    // yyyy-MM-dd hh:mm:ss|yyyy年MM月dd日 hh时MM分等,可自定义组合
    let date
    if (typeof time === 'number') {
      if (time.toString().length == 10) time *= 1000
      date = new Date(time)
    } else {
      date = time
    }

    const dif = date.getTimezoneOffset()
    const timeDif = dif * 60 * 1000 + targetTimezone * 60 * 60 * 1000
    const east8time = date.getTime() + timeDif

    date = new Date(east8time)
    const opt = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in opt) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? opt[k] : ('00' + opt[k]).substr(('' + opt[k]).length))
      }
    }
    return fmt
  } catch (err) {
    // 若格式错误,则原值显示
    return time
  }
}

const base64ToFile = (base64, fileName) => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.\*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}

/**
 * 将一个整数转换为分数保留两位小数
 * @param {number | string | undefined} num 整数
 * @return {number} 分数
 */
export const formatToFraction = (num) => {
  if (typeof num === 'undefined') return 0
  const parsedNumber = typeof num === 'string' ? parseFloat(num) : num
  return parseFloat((parsedNumber / 100).toFixed(2))
}

/**
 * 将一个数转换为 1.00 这样
 * 数据呈现的时候使用
 *
 * @param {number | string | undefined} num 整数
 * @return {string} 分数
 */
export const floatToFixed2 = (num) => {
  let str = '0.00'
  if (typeof num === 'undefined') {
    return str
  }
  const f = formatToFraction(num)
  const decimalPart = f.toString().split('.')[1]
  const len = decimalPart ? decimalPart.length : 0
  switch (len) {
    case 0:
      str = f.toString() + '.00'
      break
    case 1:
      str = f.toString() + '.0'
      break
    case 2:
      str = f.toString()
      break
  }
  return str
}

/**
 * 将一个分数转换为整数
 *
 * @param {number | string | undefined} num 分数
 * @return {number} 整数
 */
export const convertToInteger = (num) => {
  if (typeof num === 'undefined') return 0
  const parsedNumber = typeof num === 'string' ? parseFloat(num) : num
  // TODO 分转元后还有小数则四舍五入
  return Math.round(parsedNumber * 100)
}

/**
 * 时间日期转换
 * @param {dayjs.ConfigType} date 当前时间，new Date() 格式
 * @param {string} format 需要转换的时间格式字符串
 * @description format 字符串随意，如 `YYYY-mm、YYYY-mm-dd`
 * @description format 季度："YYYY-mm-dd HH:MM:SS QQQQ"
 * @description format 星期："YYYY-mm-dd HH:MM:SS WWW"
 * @description format 几周："YYYY-mm-dd HH:MM:SS ZZZ"
 * @description format 季度 + 星期 + 几周："YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ"
 * @returns {string} 返回拼接后的时间字符串
 */
export function formatDate(date, format) {
  // 日期不存在，则返回空
  if (!date) {
    return ''
  }
  // 日期存在，则进行格式化
  if (format === undefined) {
    format = 'YYYY-MM-DD HH:mm:ss'
  }
  return dayjs(date).format(format)
}

/**
 * 构造树型结构数据
 *
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id = 'id', parentId = 'parentId', children = 'children', rootId = 0) {
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter((father) => {
    const branchArr = cloneData.filter((child) => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? (father.children = branchArr) : ''
    //返回第一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}

/**
 * 重置分页对象
 *
 * TODO 芋艿：需要处理其它页面
 *
 * @param pagination 分页对象
 */
export function resetPagination(pagination: { list: never[]; total: number; pageNo: number }) {
  pagination.list = []
  pagination.total = 0
  pagination.pageNo = 1
}
