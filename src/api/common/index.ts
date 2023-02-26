/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SearchParams, PageInfo, HomeData } from '../common/model'
import request from '@/utils/request'

export default class CommonApi {
  // 测试
  static test() {
    return request.get<any>('/example')
  }
  // 获取全部数据列表
  static getAllList(model: string) {
    const url = `/${model}`
    return request.get<PageInfo<any>>(url)
  }

  // 分页查询数据列表
  static queryList(model: string, params: SearchParams) {
    const url = `/${model}/call/search_read_nested`
    return request.patch<Promise<PageInfo<any>>>(url, params)
  }

  // 获取首页数据
  static getHomeData(params: { city: string; user_id: string | number }) {
    const url = `/home_data`
    return request.post<HomeData>(url, params)
  }

  // 获取系统设置
  static getSettings() {
    return request.get<any>('/settings')
  }

  // 切换收藏
  static toggleFavor(model: string, id: string | number) {
    const method = 'toggle_favorite'
    return request.patch<{ favourite: boolean; favourite_count: number }>(`/${model}/${id}/call/${method}`, {})
  }
}
