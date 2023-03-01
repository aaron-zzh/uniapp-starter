/* eslint-disable @typescript-eslint/no-explicit-any */
import storage from '@/utils/storage'
import { isObject } from '@/utils/is'
import { toLogin } from '@/utils/public'

export interface Result<T = any> {
  code: number
  msg: string
  data: T
}

type MethodType = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'PATCH'

class Request {
  private isNavigateTo: boolean
  private apiBaseUrl: string
  defaultConfig: {
    header: { 'Content-Type': string }
    data: { platform: any }
    method: string
    dataType: string
    responseType: string
    showLoading: boolean
    timeout: number
  }
  constructor() {
    this.isNavigateTo = false
    this.apiBaseUrl =
      (import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_API_BASE_URL) + import.meta.env.VITE_API_PATH
    this.defaultConfig = {
      header: { 'Content-Type': 'application/json;charset=utf-8' },
      data: { platform: import.meta.env.VITE_APP_PLATFORM },
      method: 'GET',
      dataType: 'json', // 如设为json，会对返回的数据做一次 JSON.parse
      responseType: 'text',
      showLoading: false, // 显示loading提示
      timeout: 3000,
    }
  }

  public toLogin() {
    uni.showToast({
      title: '你的登录状态已过期，请重新登录',
      icon: 'none',
      duration: 1500,
    })
    console.log('清空token')
    storage.setHasLogin(false)
    storage.setAccessToken('')
    storage.setRefreshToken('')
    storage.setUserInfo({})

    if (!this.isNavigateTo) {
      this.isNavigateTo = true
      toLogin()
    }
  }

  public request(method: MethodType, url: string, data?: any, json?: boolean) {
    const token = storage.getAccessToken()
    return new Promise((resolve, reject) => {
      let result: any
      const config = {
        url: this.apiBaseUrl + url,
        method,
        header: {
          Authorization: token ? token : '',
          'content-type':
            method === 'GET' || method === 'PATCH' || json
              ? 'application/json;charset=utf-8'
              : 'application/x-www-form-urlencoded',
        },
        data: {
          // ...this.defaultConfig.data,
          ...data,
        },

        success: (res: any) => {
          result = res.data
          if (!result || (res.statusCode != 200 && res.statusCode != 201)) {
            reject(`Error:${res.statusCode}`)
          }
        },
        fail: (err: any) => {
          result = err
          reject(err)
        },
        complete: () => {
          this.isNavigateTo = false
          if (result.errMsg == 'request:fail') {
            uni.showToast({ title: '网络异常', icon: 'none' })
            return
          }
          let msg = result.msg
          const { code, data } = result || {}
          // 关闭loading
          if (this.defaultConfig.showLoading) {
            uni.hideLoading()
          }
          const hasSuccess = isObject(result) && Reflect.has(result, 'code') && (code === 200 || code === 201)
          if (hasSuccess) {
            resolve(data)
          } else {
            if (code === 401) {
              uni.showToast({ title: msg || '未知错误', icon: 'none' })
              setTimeout(() => {
                this.toLogin()
              }, 500)
            } else {
              if (msg == 'Access Denied') {
                msg = '登录失败'
              }
              if (!url.includes('wxCodeLogin')) {
                uni.showToast({ title: msg || '未知错误1', icon: 'none' })
              }
              reject(new Error(msg || 'Error'))
            }
          }
        },
      }

      // 打开loading
      if (this.defaultConfig.showLoading) {
        uni.showLoading({ title: '加载中...' })
      }
      uni.request(config)
    })
  }

  public get<T = any>(url: string, data?: any) {
    return this.request('GET', url, data) as T
  }

  public post<T = any>(url: string, data: any) {
    return this.request('POST', url, data) as T
  }

  public postJ<T = any>(url: string, data: any) {
    return this.request('POST', url, data, true) as T
  }

  public put<T = any>(url: string, data: any) {
    return this.request('PUT', url, data) as T
  }

  public delete<T = any>(url: string, data: any) {
    return this.request('DELETE', url, data) as T
  }

  public patch<T = any>(url: string, data: any) {
    return this.request('PATCH', url, data) as T
  }
}

export default new Request()
