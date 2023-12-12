export interface WxPaymentInfo {
  order_info: { id: string; name: string }
  time_stamp: string
  nonce_str: string
  package: string
  sign_type: string
  pay_sign: string
}

export interface OrderInfo {
  id: number
  name: string
  is_success: boolean
  price: number
  order_date: string
  pay_info?: WxPaymentInfo
  message?: string
}
