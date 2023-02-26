import { isLogin } from '@/utils/public'
const whiteList = ['pages/demo/index']

function hasPermission(path: string) {
  return true // isLogin() || whiteList.includes(path)  //TODO
}

uni.addInterceptor('request', {
  invoke(args) {
    // request 触发前拼接 url
    console.log('interceptor-request', args)
    // args.url = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_PATH + args.url
  },
  success(args) {
    // 请求成功后，修改code值为1
    // args.data.code = 1
    console.log('interceptor-success', args)
  },
  fail(err) {
    console.log('interceptor-fail', err)
  },
  complete(res) {
    console.log('interceptor-complete', res)
  },
})

export function setupPermission() {
  const { path } = uni.getLaunchOptionsSync()

  if (!hasPermission(path)) {
    uni.reLaunch({
      url: '/pages/login/index',
    })
  }
}

// navigateTo intercept
uni.addInterceptor('navigateTo', {
  invoke(args) {
    if (!hasPermission(args.url)) {
      uni.reLaunch({
        url: '/pages/login/index',
      })
    }
  },
  fail(err) {
    console.error('navigateTo fail', err)
  },
})

// switchTab intercept
uni.addInterceptor('switchTab', {
  invoke(args) {
    if (!hasPermission(args.url)) {
      uni.reLaunch({
        url: '/pages/login/index',
      })
    }
  },
  fail(err) {
    console.error('redirectTo fail', err)
  },
})
