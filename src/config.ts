const name = '应用名称'
const schemeName = '应用名称' //唤醒app需要的schemeName
const version = import.meta.env.VITE_APP_VERSION

console.log(`[${name} ${version}]`)

export const baseUrl = import.meta.env.VITE_API_BASE_URL
export const apiPath = import.meta.env.VITE_API_PATH
export const config = {
  name: name,
  domain: import.meta.env.VITE_API_BASE_URL,
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  apiPath: import.meta.env.VITE_API_PATH,
  staticUrl: import.meta.env.VITE_APP_STATIC_URL,
  oss: import.meta.env.VITE_APP_OSS,
  schemeLink: `${schemeName}://`, //唤起app地址
  downloadLink: '', //下载地址，下载app的地址
  emptyImg: '/static/images/common/listEmpty.png',
  shareImg: import.meta.env.VITE_APP_OSS + '/common/share.png',
  dicts: {
    gender_type: [
      { label: '男', value: 'm' },
      { label: '女', value: 'f' },
      { label: '其他', value: 'o' },
    ],
  },
  zIndex: {
    toast: 10090,
    noNetwork: 10080,
    popup: 10075, // popup包含popup，actionsheet，keyboard，picker的值
    mask: 10070,
    navbar: 980,
    topTips: 975,
    sticky: 970,
    indexListSticky: 965,
    popover: 960,
  },
}

export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  install: (app: any) => {
    app.provide('config', config)
  },
}
