import $store from '@/store'
import $platform from '@/platform'
import $router from '@/utils/router'
import $url from '@/utils/url'
import BrokerageApi from '@/api/trade/brokerage'
// #ifdef H5
import $wxsdk from '@/utils/libs/sdk-h5-weixin'
// #endif

// 设置分享的平台渠道: 1=H5,2=微信公众号网页,3=微信小程序,4=App,...按需扩展
const platformMap = ['H5', 'WechatOfficialAccount', 'WechatMiniProgram', 'App']

// 设置分享方式: 1=直接转发,2=海报,3=复制链接,...按需扩展
const fromMap = ['forward', 'poster', 'link']

// TODO 芋艿：分享的接入
// 设置分享信息参数
const getShareInfo = (
  scene = {
    title: '', // 自定义分享标题
    desc: '', // 自定义描述
    image: '', // 自定义分享图片
    params: {}, // 自定义分享参数
  },
  poster = {
    // 自定义海报数据
    type: 'user',
  }
) => {
  const shareInfo = {
    title: '', // 分享标题
    desc: '', // 描述
    image: '', // 分享图片
    path: '', // 分享页面+参数
    link: '', // 分享Url+参数
    query: '', // 分享参数
    poster, // 海报所需数据
  }

  const app = $store('app')
  const shareConfig = app.platform.share

  // 自动拼接分享用户参数
  const query = buildSpmQuery(scene.params)
  shareInfo.query = query

  // 配置分享链接地址
  shareInfo.link = buildSpmLink(query, shareConfig.linkAddress)
  // 配置页面地址带参数
  shareInfo.path = buildSpmPath(query)

  // 配置转发参数
  if (shareConfig.methods.includes('forward')) {
    // TODO puhui999: forward 这块有点问题
    if (shareConfig.forwardInfo.title === '' || shareConfig.forwardInfo.image === '') {
      console.log('请在平台设置中配置转发信息')
    }
    // 设置自定义分享信息
    shareInfo.title = scene.title || shareConfig.forwardInfo.title
    shareInfo.image = $url.cdn(scene.image || shareConfig.forwardInfo.image)
    shareInfo.desc = scene.desc || shareConfig.forwardInfo.subtitle
    shareInfo.path = buildSpmPath(scene.path, query)
  }

  return shareInfo
}

// 构造spm分享参数
const buildSpmQuery = (params) => {
  const user = $store('user')
  let shareId = '0' // 设置分享者用户ID
  if (typeof params.shareId === 'undefined') {
    if (user.isLogin) {
      shareId = user.userInfo.id
    }
  }
  let page = '1' // 页面类型: 1=首页(默认),2=商品,3=拼团商品,4=秒杀商品,5=邀请参团,6=分销邀请...按需扩展
  if (typeof params.page !== 'undefined') {
    page = params.page
  }
  let query = '0' // 设置页面ID: 如商品ID、拼团ID等
  if (typeof params.query !== 'undefined') {
    query = params.query
  }
  const platform = platformMap.indexOf($platform.name) + 1
  let from = '1'
  if (typeof params.from !== 'undefined') {
    from = platformMap.indexOf(params.from) + 1
  }
  //spmParams = ...  可按需扩展
  return `spm=${shareId}.${page}.${query}.${platform}.${from}`
}

// 构造页面分享参数: 所有的分享都先到首页进行 spm 参数解析
const buildSpmPath = (query) => {
  // 默认是主页，页面 page，例如 pages/index/index，根路径前不要填加 /，
  // 不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面。scancode_time为系统保留参数，不允许配置
  return `pages/index/index`
}

// 构造分享链接
const buildSpmLink = (query, linkAddress = '') => {
  return `${linkAddress}?${query}`
}

// 解析Spm
const decryptSpm = (spm) => {
  const user = $store('user')
  const shareParamsArray = spm.split('.')
  const shareParams = {
    spm,
    shareId: 0,
    page: '',
    query: {},
    platform: '',
    from: '',
  }
  let query
  shareParams.shareId = shareParamsArray[0]
  switch (shareParamsArray[1]) {
    case '1':
      // 默认首页不跳转
      shareParams.page = '/pages/index/index'
      break
    case '2':
      // 普通商品
      shareParams.page = '/pages/goods/index'
      shareParams.query = {
        id: shareParamsArray[2],
      }
      break
    case '3':
      // 拼团商品
      shareParams.page = '/pages/goods/groupon'
      query = shareParamsArray[2].split(',')
      shareParams.query = {
        id: query[0],
        activity_id: query[1], // TODO 芋艿：接入分享后，应该统一成 id 参数
      }
      break
    case '4':
      // 秒杀商品
      shareParams.page = '/pages/goods/seckill'
      query = shareParamsArray[2].split(',')
      shareParams.query = {
        id: query[1],
      }
      break
    case '5':
      // 参与拼团
      shareParams.page = '/pages/activity/groupon/detail'
      shareParams.query = {
        id: shareParamsArray[2],
      }
      break
  }
  shareParams.platform = platformMap[shareParamsArray[3] - 1]
  shareParams.from = fromMap[shareParamsArray[4] - 1]
  if (shareParams.shareId !== 0) {
    // 已登录 绑定推广员
    if (user.isLogin) {
      bindBrokerageUser(shareParams.shareId)
    } else {
      // 记录分享者编号
      uni.setStorageSync('shareId', shareParams.shareId)
    }
  }

  if (shareParams.page !== '/pages/index/index') {
    $router.go(shareParams.page, shareParams.query)
  }
  return shareParams
}

// 绑定推广员
const bindBrokerageUser = async (val = undefined) => {
  try {
    const shareId = val || uni.getStorageSync('shareId')
    if (!shareId) {
      return
    }
    await BrokerageApi.bindBrokerageUser({ bindUserId: shareId })
    uni.removeStorageSync('shareId')
  } catch {
    console.log('bindBrokerageUser error')
  }
}

// 更新公众号分享sdk
const updateShareInfo = (shareInfo) => {
  // #ifdef H5
  if ($platform.name === 'WechatOfficialAccount') {
    $wxsdk.updateShareInfo(shareInfo)
  }
  // #endif
}

export default {
  getShareInfo,
  updateShareInfo,
  decryptSpm,
  bindBrokerageUser,
}
