import request from '@/request'

const OrderApi = {
  // 计算订单信息
  settlementOrder: (data) => {
    const data2 = {
      ...data,
    }
    // 移除多余字段
    if (!(data.couponId > 0)) {
      delete data2.couponId
    }
    if (!(data.addressId > 0)) {
      delete data2.addressId
    }
    if (!(data.combinationActivityId > 0)) {
      delete data2.combinationActivityId
    }
    if (!(data.combinationHeadId > 0)) {
      delete data2.combinationHeadId
    }
    if (!(data.seckillActivityId > 0)) {
      delete data2.seckillActivityId
    }
    // 解决 SpringMVC 接受 List<Item> 参数的问题
    delete data2.items
    for (let i = 0; i < data.items.length; i++) {
      data2[encodeURIComponent('items[' + i + '' + '].skuId')] = data.items[i].skuId + ''
      data2[encodeURIComponent('items[' + i + '' + '].count')] = data.items[i].count + ''
      if (data.items[i].cartId) {
        data2[encodeURIComponent('items[' + i + '' + '].cartId')] = data.items[i].cartId + ''
      }
    }
    const queryString = Object.keys(data2)
      .map((key) => key + '=' + data2[key])
      .join('&')
    return request({
      url: `/trade/order/settlement?${queryString}`,
      method: 'GET',
      custom: {
        showError: true,
        showLoading: true,
      },
    })
  },
  // 创建订单
  createOrder: (data) => {
    return request({
      url: `/trade/order/create`,
      method: 'POST',
      data,
    })
  },
  // 获得订单
  getOrder: (id) => {
    return request({
      url: `/trade/order/get-detail`,
      method: 'GET',
      params: {
        id,
      },
      custom: {
        showLoading: false,
      },
    })
  },
  // 订单列表
  getOrderPage: (params) => {
    return request({
      url: '/trade/order/page',
      method: 'GET',
      params,
      custom: {
        showLoading: false,
      },
    })
  },
  // 确认收货
  receiveOrder: (id) => {
    return request({
      url: `/trade/order/receive`,
      method: 'PUT',
      params: {
        id,
      },
    })
  },
  // 取消订单
  cancelOrder: (id) => {
    return request({
      url: `/trade/order/cancel`,
      method: 'DELETE',
      params: {
        id,
      },
    })
  },
  // 删除订单
  deleteOrder: (id) => {
    return request({
      url: `/trade/order/delete`,
      method: 'DELETE',
      params: {
        id,
      },
    })
  },
  // 获得交易订单的物流轨迹
  getOrderExpressTrackList: (id) => {
    return request({
      url: `/trade/order/get-express-track-list`,
      method: 'GET',
      params: {
        id,
      },
    })
  },
  // 获得交易订单数量
  getOrderCount: () => {
    return request({
      url: '/trade/order/get-count',
      method: 'GET',
      custom: {
        showLoading: false,
        auth: true,
      },
    })
  },
  // 创建单个评论
  createOrderItemComment: (data) => {
    return request({
      url: `/trade/order/item/create-comment`,
      method: 'POST',
      data,
    })
  },
}

export default OrderApi
