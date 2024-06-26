import { defineStore, acceptHMRUpdate } from 'pinia'
import type { LoginParams } from '@/api/user/model'
import UserApi from '@/api/user'
import storage from '@/utils/storage'
import { toLogin } from '@/utils/public'

interface UserState {
  id: number
  token: string
  name: string
  phone: string
  avatarUrl: string
  nickName: string
  city: string[]
  partner_id: number
}

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: 0,
    partner_id: 0,
    token: '',
    name: '',
    phone: '',
    avatarUrl: '',
    nickName: '',
    city: ['山东省', '潍坊市', ''],
  }),
  getters: {
    getUserInfo(state: UserState): UserState {
      console.log(state)
      if (state.id) return { ...state }
      else return storage.getUserInfo()
    },
    getToken(): string {
      return this.token || storage.getAccessToken()
    },
  },
  actions: {
    setUserInfo(partial: Partial<UserState>) {
      this.$patch(partial)
      storage.setUserInfo(partial)
      storage.setHasLogin(true)
    },
    setToken(token: string) {
      this.token = token || ''
      storage.setAccessToken(token)
    },
    resetUserInfo() {
      this.$reset()
      storage.setHasLogin(false)
      storage.removeUserInfo()
      storage.removeAccessToken()
    },
    // 登录
    async login(loginForm: LoginParams) {
      // 账号密码登录
      const data = await UserApi.login(loginForm)
      const { token } = data
      this.setToken(token)
      storage.setHasLogout(false)

      // 获取用户信息
      const info = await UserApi.getUserInfo()
      this.setUserInfo(info)
      return info
    },

    async logout() {
      if (this.token) {
        await UserApi.logout()
      }
      this.resetUserInfo()
      storage.setHasLogout(true)
      toLogin()
    },

    async wxCodeLogin(code: string) {
      // 微信登录
      const data = await UserApi.wxCodeLogin(code)
      const { token } = data
      this.setToken(token)
      storage.setHasLogout(false)

      // 获取用户信息
      const info = await UserApi.getUserInfo()
      this.setUserInfo(info)
      return info
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}

export default useUserStore
