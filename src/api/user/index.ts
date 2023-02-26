import type { LoginParams, LoginResult, UserInfoResult, UserData, Message } from './model'
import request from '@/utils/request'

enum Path {
  Login = '/user/login',
  Logout = '/user/logout',
  SenCode = '/sendCode',
  UserInfo = '/user/info',
  UserData = '/user/data',
  UserMessage = '/user/message',
  wxCodeLogin = '/user/wxCodeLogin',
}

export default class UserApi {
  // 发送验证码
  static sendCode(phone: string) {
    return request.get(`${Path.SenCode}/${phone}`)
  }

  // 登录
  static login(form: LoginParams) {
    return request.post<LoginResult>(Path.Login, form)
  }
  static wxCodeLogin(code: string) {
    return request.post<LoginResult>(Path.wxCodeLogin, { code })
  }

  // 获取用户信息
  static getUserInfo() {
    return request.get<UserInfoResult>(Path.UserInfo)
  }

  static getUserData() {
    return request.get<UserData>(Path.UserData)
  }

  static getUserMessage() {
    return request.get<Message[]>(Path.UserMessage)
  }

  // 退出登录
  static logout() {
    return request.get(Path.Logout)
  }
}
