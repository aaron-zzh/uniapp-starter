export interface LoginParams {
  phone: string
  code: string
}

export interface LoginResult {
  userId: string
  token: string
}

export interface UserInfoResult {
  phone: string
  realName: string
  avatarUrl: string
  nickName: string
  sex: string
  area: string // 所在地区
  cur_grade: string // 在读年级
}

export interface FavorItem {
  id: number
  name: string
  img_url: string
  avatar: string
  type: string
}

export interface UserData {
  id: number
  phone: string
  name: string
  avatar_256: string
  favor_count: number
  follow_count: number
  order_count: number
  test_count: number
  is_vip: boolean
}

interface Message {
  id: number
  type: string
  from: string
  icon: string
  title: string
  date: string
}
