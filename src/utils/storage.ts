const isDev = process.env.NODE_ENV === 'development'

const HAS_LOGIN = isDev ? 'has_login_key_dev' : 'has_login_key'
const HAS_LOGOUT = isDev ? 'has_logout_key_dev' : 'has_logout_key'
const ACCESS_TOKEN = isDev ? 'access_token_key_dev' : 'access_token_key'
const REFRESH_TOKEN = isDev ? 'refresh_token_key_dev' : 'refresh_token_key'
const USER_INFO = isDev ? 'user_info_obj_dev' : 'user_info_obj'
const FACE_LOGIN = isDev ? 'face_login_dev' : 'face_login'
const FINGER_LOGIN = isDev ? 'finger_login_dev' : 'finger_login'

export default {
  // 获取face id登录
  getFaceLogin() {
    return uni.getStorageSync(FACE_LOGIN)
  },
  // 写入face id
  setFaceLogin(val: string) {
    uni.setStorageSync(FACE_LOGIN, val)
  },
  // 获取指纹登录
  getFingerLogin() {
    return uni.getStorageSync(FINGER_LOGIN)
  },
  // 写入指纹登录
  setFingerLogin(val: string) {
    uni.setStorageSync(FINGER_LOGIN, val)
  },
  // 写入用户信息
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUserInfo(val: any) {
    uni.setStorageSync(USER_INFO, val)
  },
  // 获取用户信息
  getUserInfo() {
    return uni.getStorageSync(USER_INFO)
  },
  removeUserInfo() {
    uni.removeStorageSync(USER_INFO)
  },
  // 写入登录
  setHasLogin(val: boolean) {
    uni.setStorageSync(HAS_LOGIN, val)
  },
  // 获取是否登录
  getHasLogin() {
    return uni.getStorageSync(HAS_LOGIN)
  },
  setHasLogout(val: boolean) {
    uni.setStorageSync(HAS_LOGOUT, val)
  },
  getHasLogout() {
    return uni.getStorageSync(HAS_LOGOUT)
  },
  // 写入accessToken
  setAccessToken(val: string) {
    uni.setStorageSync(ACCESS_TOKEN, val)
  },
  // 获取accessToken
  getAccessToken() {
    return uni.getStorageSync(ACCESS_TOKEN)
  },
  // 删除token
  removeAccessToken() {
    uni.removeStorageSync(ACCESS_TOKEN)
  },
  // 写入刷新token
  setRefreshToken(val: string) {
    uni.setStorageSync(REFRESH_TOKEN, val)
  },
  // 获取刷新token
  getRefreshToken() {
    return uni.getStorageSync(REFRESH_TOKEN)
  },
  // 删除token
  removeRefreshToken() {
    uni.removeStorageSync(REFRESH_TOKEN)
  },
}
