import type { OrderInfo } from './model'
import request from '@/utils/request'

enum Path {
  order = '/order',
}
export default class OrderApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createOrder(data: any) {
    return request.post<Promise<OrderInfo>>(Path.order, data)
  }

  static checkPromoCode(id: string | number, code: string) {
    return request.post(`/order/${id}/discount_price`, { code })
  }

  static payResult(order_id: string | number, result: string) {
    return request.post(`/order/pay/${order_id}`, { result })
  }

  static getMyOrder() {
    return request.get(`/order/my_order`)
  }
}
