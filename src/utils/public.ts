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

  // #ifndef MP-WEIXIN
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
  const navigation = getCurrentPages()[getCurrentPages().length - getCurrentPages().length]
  if (getCurrentPages().length > 1) {
    console.log(navigation.route, getCurrentPages().length)
    if (navigation.route == 'pages/login/index') {
      navigationToBack(type)
    } else {
      if (!navigation.route || navigation.route == 'undefined') {
        navigationToBack(type)
      } else {
        uni.navigateBack({
          delta: getCurrentPages().length,
        })
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
