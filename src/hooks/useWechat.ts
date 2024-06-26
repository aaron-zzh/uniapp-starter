/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WxConfig } from '@/api/common/model'
import type { WxPaymentInfo } from '@/api/order/model'
import CommonApi from '@/api/common'
import { isWeiXin } from '@/utils/public'
import { config } from '../config'

import jWeixin from 'weixin-js-sdk' // 微信开放接口

export default function useWechat() {
  const url = window.location.href.split('#')[0]

  const checkJsApi = (name: string) => {
    return new Promise((resolve, reject) => {
      jWeixin.checkJsApi({
        jsApiList: [name], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function (res: any) {
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          console.log(res)
          if (res.checkResult[name] === true) {
            resolve(true) // 允许授权
          } else {
            resolve(false)
          }
        },
        fail: () => {
          resolve(false)
        },
      })
    })
  }

  const onWxReady = (callback: any) => {
    CommonApi.getWxConfig({ url })
      .then((res: WxConfig) => {
        jWeixin.config({
          debug: false,
          appId: res.appId,
          nonceStr: res.nonceStr,
          timestamp: res.timestamp,
          signature: res.signature,
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'scanQRCode'],
        })
        jWeixin.error(function (res: any) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，
          // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看
          console.log('失败', res)
        })
        if (callback) {
          jWeixin.ready(() => {
            callback(res)
          })
        }
      })
      .catch((e) => {
        console.log('网络请求错误捕捉', e)
      })
  }

  const share = (data: any) => {
    if (!isWeiXin()) return
    return new Promise((resolve, reject) => {
      onWxReady(() => {
        const shareData = {
          title: data.title,
          desc: data.desc,
          link: config.domain + data.path,
          imgUrl: data.imageUrl || config.shareImg,
          success: function () {
            console.log('分享设置成功')
          },
          fail: function (err: any) {
            console.log('fail:' + JSON.stringify(err))
          },
        }
        //需在用户可能点击分享按钮前就先调用
        //分享给朋友
        jWeixin.updateAppMessageShareData(shareData)
        //分享到朋友圈
        jWeixin.updateTimelineShareData(shareData)
      })
    })
  }

  const getLocation = () => {
    if (!isWeiXin()) return
    return new Promise((resolve, reject) => {
      onWxReady(() => {
        jWeixin.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res: any) {
            resolve(res)
          },
          fail: (err: any) => {
            console.log('失败', err)
            resolve('')
          },
        })
      })
    })
  }

  const scanQRCode = () => {
    if (!isWeiXin()) return

    return new Promise((resolve, reject) => {
      onWxReady(() => {
        jWeixin.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res: any) {
            let domain = ''
            res.resultStr.replace(/https:\/\/([^/]+)\//i, (e: any) => {
              domain = e
            })
            console.log('扫码', res, domain)
            //判断是否扫码后获取的链接，为后台的链接
            // if (domain != '') {
            //   alert('该码有误，无法识别！')
            //   resolve('')
            // }
            resolve(res)
          },
          fail: (err: any) => {
            console.log('失败', err)
            resolve('')
          },
        })
      })
    })
  }

  const wxPay = (data: WxPaymentInfo): Promise<string> => {
    if (!isWeiXin()) return Promise.resolve('请在微信中打开')

    return new Promise((resolve, reject) => {
      onWxReady(() => {
        jWeixin.chooseWXPay({
          timestamp: data.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonce_str, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: data.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.pay_sign, // 支付签名
          success: function (res: any) {
            uni.showToast({ title: '支付成功', icon: 'success' })
            resolve('支付成功')
          },
          cancel: function (res: any) {
            uni.showToast({ title: '取消支付', icon: 'none' })
            resolve('取消支付')
          },
          fail: (err: any) => {
            uni.showToast({ title: '支付失败', icon: 'error' })
            console.error('chooseWXPay:fail', err)
            resolve('支付失败')
          },
        })
      })
    })
  }

  return {
    onWxReady,
    checkJsApi,
    share,
    getLocation,
    scanQRCode,
    wxPay,
  }
}
