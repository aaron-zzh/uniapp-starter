<script lang="ts">
export default { name: 'PageDemo' }
</script>
<script setup lang="ts">
import type { AuthorInfo } from '@/api/common/model'

const model: AuthorInfo = reactive({
  url: 'http://aaronzzh.cn',
} as AuthorInfo)
const auiLoadingRef = ref(null)
const qrcodeRef = ref(null)
const image = ref('')
const bgRef = ref(null)

onLoad((options) => {
  console.log('onLoad options', options)
  model.id = options.id
})
onShow(() => {
  console.log('onShow')
})
onReady(() => {
  console.log('onReady')
})
onMounted(() => {
  console.log('onMounted')
  loadData()
})

const loadData = async () => {
  if (!auiLoadingRef.value) return
  auiLoadingRef.value.show()
  setTimeout(() => {
    auiLoadingRef.value.hide()
  }, 1000)
}

// #ifdef MP-WEIXIN
const initCanvas = (canvasId) => {
  return new Promise((resolve, reject) => {
    const device = wx.getSystemInfoSync()
    const query = wx.createSelectorQuery()
    query
      .select(canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = device.pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        console.log('画布初始化完毕，画布宽：', canvas.width, '画布高：', canvas.height, '设备像素比：', dpr)
        resolve({ ctx, canvas })
      })
  })
}

const drawText = (ctx, text: string, color: string, x: number, y: number) => {
  if (!text) return 0
  let textWidth = 0
  ctx.save()
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.font = '16px Microsoft YaHei'
  const metrics = ctx.measureText(text)
  console.log('文字[' + text + ']宽度：', metrics.width)
  ctx.fillText(text, x, y)
  textWidth = metrics.width
  ctx.restore()
  return textWidth
}

// 绘制图图像
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const drawWebImage = (canvas, ctx, imageUrl: string, x: number, y: number, width: number, height: number) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: imageUrl, //服务器返回的图片地址
      success: function (res) {
        const imgObj = canvas.createImage()
        imgObj.src = res.path
        imgObj.onload = (e) => {
          ctx.save()
          ctx.drawImage(imgObj, x, y, width, height)
          ctx.restore()
          console.log('图片加载完毕：', e)
          resolve(res)
        }
      },
      fail: function (res) {
        console.log(res)
        reject(res)
      },
    })
  })
}

// 将画布内容保存为图片
const saveImage = (canvas, x = 0, y = 0, quality = 1, fileType = 'png') => {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath(
      {
        x,
        y,
        quality,
        fileType,
        canvas,
        success(res) {
          console.log('file=', res.tempFilePath)
          uploadFile(model.value.id, 'ydt.org', 'qrcode_image_1024', res.tempFilePath, false)
            .then(() => {
              nextTick(() => loadData())
              resolve(res.tempFilePath)
            })
            .catch((res) => {
              reject(res)
            })
        },
        fail(res) {
          console.error('保存失败：', JSON.stringify(res))
          reject(res)
        },
      },
      instance
    )
  })
}

const drawImage = (canvas, ctx, path: string, x: number, y: number, width: number, height: number) => {
  return new Promise((resolve, reject) => {
    const imgObj = canvas.createImage()
    imgObj.src = path
    imgObj.onload = (e) => {
      ctx.save()
      ctx.drawImage(imgObj, x, y, width, height)
      ctx.restore()
      resolve(true)
    }
  })
}

const drawQrCode = (ctx, canvasId: string, x: number, y: number, width: number, height: number) => {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery().in(instance?.refs.qrcodeRef)
    query
      .select(canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log(res)
        ctx.drawImage(res[0].node, x, y, width, height)
        resolve(res)
      })
  })
}
// #endif

const onClick = () => {
  if (!bgRef.value || !qrcodeRef.value || !qrcodeRef.value.canvasId) return
  // #ifdef MP-WEIXIN
  uni.showLoading({
    title: '生成中',
  })
  const { ctx, canvas } = await initCanvas('#codeCanvas')
  try {
    await drawImage(canvas, ctx, '/static/images/qrcode-bg1.jpg', 0, 0, 300, 300)
    await drawQrCode(ctx, `#${qrcodeRef.value.canvasId}`, 86, 142, 136, 136)
    await drawText(ctx, model.value.code, '#FFF', 160, 96)
    await saveImage(canvas)
  } catch {
    uni.showToast({ title: `生成失败`, icon: 'error' })
  }
  uni.hideLoading()
  // #endif
  // #ifdef H5
  const qrcode = document.querySelector(`#${qrcodeRef.value.canvasId} canvas`)
  const canvas1 = document.querySelector('#codeCanvas canvas')
  const ctx1 = canvas1.getContext('2d')

  const bg = document.querySelector('.qrcode-bg img')
  ctx1.drawImage(bg, 0, 0, 300, 300)
  ctx1.font = '16px Microsoft YaHei'
  ctx1.fillStyle = '#FFF'
  ctx1.fillText('你好', 150, 100)
  ctx1.drawImage(qrcode, 60, 200, 60, 60)
  canvas1.toBlob((blob) => {
    if (!blob) return
    image.value = URL.createObjectURL(blob)
  })
  // #endif
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const preview = async () => {
  qrcodeRef.value.canvasToTempFilePath({
    success(res) {
      console.log('success:::', res)
      uni.previewImage({
        urls: [res.tempFilePath],
        longPressActions: {
          itemList: ['发送给朋友', '保存图片', '收藏'],
          success: function (data) {
            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片')
          },
          fail: function (err) {
            console.log(err.errMsg)
          },
        },
      })
    },
    fail(err) {
      console.log('err:::', err)
    },
  })
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <AuiLoading ref="auiLoadingRef" :type="4" direction="row" msg="加载中" :mask="false" />
    <image v-if="image" :src="image" style="width: 180px" mode="widthFix"></image>
    <view class="flex-box mt-4px">
      <u-button type="primary" @click="onClick"> 合成二维码 </u-button>
    </view>
    <view class="flex flex-col items-center pt-100px">
      <l-qrcode
        ref="qrcodeRef"
        :value="model.url"
        color="rgb(5, 67, 133)"
        size="180px"
        icon="/static/logo.png"
        icon-size="40px"
      ></l-qrcode>
      <canvas
        id="codeCanvas"
        canvas-id="codeCanvas"
        style="display: block; width: 300px; height: 300px; letter-spacing: 1px"
      ></canvas>
      <u-image
        ref="bgRef"
        class="qrcode-bg"
        width="300px"
        height="300px"
        src="/static/images/common/avatar.jpg"
        border-radius="4px"
      ></u-image>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background: #fff;
}
</style>
