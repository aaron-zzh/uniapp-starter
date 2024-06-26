// #ifdef H5
import service from './officialAccount'
// #endif

// #ifdef MP-WEIXIN
// eslint-disable-next-line no-redeclare
import service from './miniProgram'
// #endif

// #ifdef APP-PLUS
// eslint-disable-next-line no-redeclare
import service from './openPlatform'
// #endif

const wechat = service

export default wechat
