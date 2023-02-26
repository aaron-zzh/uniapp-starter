const name = '应用名称'
const schemeName = '应用名称' //唤醒app需要的schemeName

export const config = {
  name: name,
  domain: import.meta.env.VITE_API_BASE_URL,
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
}

export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  install: (app: any) => {
    app.provide('config', config)
  },
}
