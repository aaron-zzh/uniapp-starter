<script lang="ts">
export default { name: 'OrgDetailPage' }
</script>
<script setup lang="ts">
import type { Ref } from 'vue'
import type { OrgInfo } from '@/api/user/model'
import useLoading from '@/hooks/loading'
import UserApi from '@/api/user'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { uploadFile, uploadBlobFile } from '@/utils/public'

import { isPhone } from '@/utils/is'
import useUserStore from '@/store/user'

const userStore = useUserStore()
const userInfo = computed(() => {
  return userStore.getUserInfo
})
const instance = getCurrentInstance()

const config = inject('config') // 注入
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { loading, setLoading } = useLoading()

const is_add_mode = ref(false)

const model: Ref<OrgInfo> = ref({
  name: '',
  size: 0,
  responsible: '',
  free_url: '',
  responsible_phone: '',
  contact: '',
  phone: '',
  is_partner: false,
  cultural_course: false,
  state_id: { name: '' },
  city_id: { name: '' },
  county_id: { name: '' },
  user_id: { name: '' },
} as OrgInfo)

const majorName = computed(() => {
  const major = categoryOptions.value.find((item) => item.value == model.value.major)
  return major ? major.label : ''
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileList1 = ref([] as any)
const uFormRef = ref(null)
const uUploadRef = ref(null)
const showType = ref(false)
const comment = ref('')
const categoryOptions = ref([
  {
    label: '美术',
    value: 'ms',
  },
  {
    label: '舞蹈',
    value: 'wd',
  },
  {
    label: '书法',
    value: 'sf',
  },
  {
    label: '航空',
    value: 'hk',
  },
  {
    label: '表演',
    value: 'by',
  },
  {
    label: '音乐',
    value: 'yy',
  },
])
const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入机构名称',
      trigger: ['blur', 'change'],
    },
  ],
  'city_id.name': [
    {
      required: true,
      message: '请选择城市',
      trigger: ['blur', 'change'],
    },
  ],
  street: [
    {
      required: true,
      message: '请输入机构详细地址',
      trigger: ['blur', 'change'],
    },
  ],
  phone: [
    {
      validator: (rule, value, callback) => {
        return !value || isPhone(value)
      },
      message: '手机号码不正确',
      trigger: ['change', 'blur'],
    },
  ],
  responsible_phone: [
    {
      validator: (rule, value, callback) => {
        return !value || isPhone(value)
      },
      message: '手机号码不正确',
      trigger: ['change', 'blur'],
    },
  ],
})

onLoad((options) => {
  if (options.id) {
    model.value.id = parseInt(options.id || 0)
    loadData()
  }
  is_add_mode.value = !options.id
})
onMounted(() => {
  if (is_add_mode.value) {
    uni.setNavigationBarTitle({
      title: '新增机构',
    })
  }
  if (userInfo.value.is_org_admin) {
    uni.setNavigationBarTitle({
      title: '详情',
    })
  }
})
onReady(() => {
  console.log('onReady')
  uFormRef.value.setRules(rules)
})

const loadData = async () => {
  if (!userInfo.value.is_admin && !userInfo.value.is_salesman && !userInfo.value.is_org_admin) {
    uni.$u.toast('无权限')
    return
  }

  model.value = await UserApi.getOrgDetail(model.value.id)
  city.value = [model.value.state_id.name, model.value.city_id.name, model.value.county_id.name]
  // if (model.value.image_url) {
  //   fileList.value = [
  //     {
  //       url: config.domain + model.value.image_url,
  //     },
  //   ]
  // }
  if (model.value.qrcode_image_url) {
    fileList1.value = [
      {
        url: config.domain + model.value.qrcode_image_url,
      },
    ]
  }
}

const city = ref(['山东省', '', '']) //城市
const showCitySelect = ref(false)
const cityName = computed(() => {
  if (!city.value[1]) return ''
  return city.value[1] + (city.value[2] ? '/' + city.value[2] : '')
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onCityChange = (result: any) => {
  model.value.state_id.name = result.province.name
  model.value.city_id.name = result.city.name
  model.value.county_id.name = result.area.name
  city.value = [result.province.name, result.city.name, result.area.name]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSelType = (res: any) => {
  model.value.major = res[0].value
}

const reloadData = () => {
  comment.value = ''
  if (is_add_mode.value) {
    uni.$u.toast('新增成功')
    setTimeout(() => uni.$u.route({ url: '/pages/org/list', type: 'redirect' }), 600)
  } else {
    uni.$u.toast('已保存')
    loadData()
  }
}

const onGetOrg = () => {
  UserApi.getOrg(model.value.id, userInfo.value.id).then((res) => {
    if (res) {
      uni.$u.toast('认领成功')
      loadData()
    }
  })
}

const onUnbindOrg = () => {
  uni.showModal({
    title: '提示',
    content: '确定解绑?',
    success(res) {
      if (res.confirm) {
        UserApi.unbindOrg(model.value.id).then((res) => {
          if (res) {
            uni.$u.toast('解绑成功')
            setTimeout(() => uni.$u.route({ url: '/pages/org/list', type: 'redirect' }), 600)
          }
        })
      }
    },
  })
}

const onDelete = () => {
  if (!userInfo.value.is_admin) {
    uni.$u.toast('请联系管理员删除')
    return
  }

  uni.showModal({
    title: '提示',
    content: '确定删除?',
    success(res) {
      if (res.confirm) {
        UserApi.deleteOrg(model.value.id).then((res) => {
          if (res) {
            uni.$u.toast('删除成功')
            setTimeout(() => uni.$u.route({ url: '/pages/org/list', type: 'redirect' }), 600)
          }
        })
      }
    },
  })
}

const onConfirm = () => {
  if (loading.value) return

  uFormRef.value.setRules(rules)
  uFormRef.value.validate((valid: boolean) => {
    if (valid) {
      let data = unref(model)
      let org = {
        name: data.name,
        size: data.size,
        responsible: data.responsible,
        responsible_phone: data.responsible_phone,
        contact: data.contact,
        phone: data.phone,
        is_partner: data.is_partner,
        cultural_course: data.cultural_course,
        state: city.value[0],
        city: city.value[1],
        county: city.value[2],
        street: data.street,
      }
      if (data.major) org.major = data.major
      if (comment.value) {
        org.comment = (data.comment || '') + `<br/><br/>${new Date().toLocaleString()}<br/>` + comment.value
      }
      if (is_add_mode.value) {
        org.user_id = userInfo.value.id
      }

      console.log('验证通过', org)
      UserApi.createOrWriteOrg(org, data.id || 0).then((res) => {
        if (is_add_mode.value) {
          model.value = res
        }
        reloadData()
        // 上传图片
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const pic = uUploadRef.value.lists.filter((item: any) => item.progress == 0)
        // if (pic && pic.length > 0) {
        //   uploadFile(model.value.id, 'ydt.org', 'image_1920', pic[0].url, false).finally(() => {
        //     reloadData()
        //   })
        // } else {
        //   reloadData()
        // }
      })
    } else {
      console.log('验证失败')
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onListChange = (lists: [], name: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pic = uUploadRef.value.lists.filter((item: any) => item.progress == 0)
  console.log(pic)
}

const onCopy = () => {
  uni.setClipboardData({
    data: model.value.code,
    success: function () {
      uni.showToast({
        title: '已复制',
        icon: 'success',
      })
    },
  })
}
const qrcodeRef = ref(null)
const qrcodeAdminRef = ref(null)
const image = ref('')
const bgRef = ref(null)

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

const onClick = async () => {
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
  const ctx1 = canvas.getContext('2d')
  const bg = document.querySelector('.qrcode-bg img')
  ctx1.drawImage(bg, 0, 0, 300, 300)
  ctx1.font = '16px Microsoft YaHei'
  ctx1.fillStyle = '#FFF'
  ctx1.fillText(model.value.code, 160, 96)
  ctx1.drawImage(qrcode, 86, 142, 136, 136)
  canvas1.toBlob((blob) => {
    if (!blob) return
    show.value = false
    image.value = URL.createObjectURL(blob)
    uploadFile(model.value.id, 'ydt.org', 'qrcode_image_1024', image.value, false).then(() => {
      loadData()
    })
  })
  // #endif
}

const preview = async () => {
  qrcodeAdminRef.value.canvasToTempFilePath({
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

const toStudent = () => {
  uni.$u.route({
    url: 'pages/org/student',
    params: {
      id: model.value.id,
    },
  })
}
const toOrder = () => {
  uni.$u.route({
    url: 'pages/org/order',
    params: {
      org_id: model.value.id,
    },
  })
}
</script>
<template>
  <view class="container static">
    <view class="article">
      <u-form ref="uFormRef" :model="model" label-width="180" :label-style="{ fontSize: '16px' }">
        <!-- <u-form-item label="机构图片" prop="image_url">
            <u-upload
              ref="uUploadRef"
              index="org"
              :file-list="fileList"
              max-count="1"
              :multiple="false"
              :auto-upload="false"
              @on-list-change="onListChange"
            ></u-upload>
          </u-form-item> -->
        <u-form-item label="机构名称" required prop="name">
          <u-input v-model="model.name" placeholder="输入机构名称" :border="false" cursor-spacing="20" />
        </u-form-item>
        <u-form-item v-if="userInfo.is_org_admin" label="所在城市" required prop="city_id.name">
          <view>{{ cityName }}</view>
        </u-form-item>
        <u-form-item v-if="!is_add_mode" label="机构编码" prop="code">
          <view @click="onCopy">{{ model.code }}</view>
        </u-form-item>
        <u-form-item v-if="model.id" label="登录学员">
          <view class="flex-box justify-between w-100%">
            <view>{{ model.student_count }}</view>
            <view class="c-blue" @click="toStudent">查看详情</view>
          </view>
        </u-form-item>
        <u-form-item v-if="!is_add_mode" label="缴费学员">
          <view class="flex-box justify-between w-100%">
            <view>{{ model.card_count }}</view>
            <view class="c-blue" @click="toOrder">查看详情</view>
          </view>
        </u-form-item>
        <template v-if="!userInfo.is_org_admin">
          <u-form-item label="所在城市" required prop="city_id.name">
            <u-input
              v-model="cityName"
              type="select"
              placeholder="请选择城市"
              :border="false"
              @click="showCitySelect = true"
            />
            <CitySelect v-model="showCitySelect" :default-region="city" @city-change="onCityChange" />
          </u-form-item>
          <u-form-item label="机构类型" prop="major">
            <u-input
              v-model="majorName"
              type="select"
              placeholder="请选择机构类型"
              :border="false"
              @click="showType = true"
            />
            <u-select v-model="showType" :list="categoryOptions" @confirm="onSelType"></u-select>
          </u-form-item>

          <u-form-item label="详细地址" required prop="street">
            <u-input v-model="model.street" placeholder="输入详细地址" :border="false" />
          </u-form-item>
          <u-form-item label="机构规模" label-position="left" prop="size">
            <u-input v-model="model.size" type="number" placeholder="请输入机构规模" :border="false" />
          </u-form-item>
          <u-form-item label="负责人" label-position="left" prop="responsible">
            <u-input v-model="model.responsible" placeholder="请输入负责人" :border="false" />
          </u-form-item>
          <u-form-item label="联系方式" label-position="left" prop="responsible_phone">
            <u-input
              v-model="model.responsible_phone"
              type="number"
              placeholder="请输入负责人联系方式"
              :border="false"
            />
          </u-form-item>
          <u-form-item label="对接人" label-position="left" prop="contact">
            <u-input v-model="model.contact" placeholder="请输入对接人" :border="false" />
          </u-form-item>
          <u-form-item label="联系方式" label-position="left" prop="phone">
            <u-input v-model="model.phone" type="number" placeholder="请输入对接人联系方式" :border="false" />
          </u-form-item>
          <u-form-item label="是否合作" label-position="left" prop="is_partner">
            <u-switch v-model="model.is_partner"></u-switch>
          </u-form-item>
          <u-form-item label="自有文化课" label-position="left" prop="cultural_course">
            <u-switch v-model="model.cultural_course"></u-switch>
          </u-form-item>
          <u-form-item label="所属销售员">
            <view class="flex-box justify-between w-100%">
              <view class="font-bold">{{ model.user_id.name ? model.user_id.name : '待认领' }}</view>
              <view v-if="model.user_id.name && (userInfo.id == model.user_id.id || userInfo.is_admin)">
                <u-button type="primary" size="mini" @click="onUnbindOrg">解绑</u-button>
              </view>
            </view>
          </u-form-item>
          <u-form-item label="机构说明" label-position="left">
            <u-input v-model="comment" placeholder="增加机构说明" :border="false" />
          </u-form-item>
          <view class="mt-8px mb-20px">
            <rich-text class="text-14px mt-4" :nodes="model.comment"></rich-text>
          </view>
        </template>
      </u-form>
      <template v-if="!userInfo.is_org_admin">
        <view class="p-20px fixed bottom-10px right-10px z-9">
          <u-button type="primary" @click="onConfirm">保存</u-button>
        </view>
        <view v-if="model.id && (userInfo.is_admin || userInfo.is_salesman)" class="p-20px flex-box justify-between">
          <view>
            <u-button type="error" @click="onDelete">删除机构</u-button>
          </view>
          <view>
            <u-button v-if="!model.user_id.name" type="primary" @click="onGetOrg">领取机构</u-button>
          </view>
        </view>
      </template>
    </view>
    <view class="pt-30px">
      <u-divider half-width="150" font-size="24">二维码</u-divider>
    </view>
    <view v-if="model.id && model.free_url" class="flex flex-col items-center justify-center m-10px pb-30px">
      <!-- <image v-if="image" :src="image" style="width: 180px" mode="widthFix"></image> -->
      <view v-if="model.qrcode_image_url">
        <u-upload
          width="180px"
          height="180px"
          index="org"
          :file-list="fileList1"
          max-count="1"
          :deletable="false"
          :multiple="false"
          :auto-upload="false"
        ></u-upload>
      </view>
      <view class="flex-box mt-4px justify-center">
        <view class="text-center color-#888 text-14px pr-10px">领课二维码</view>
        <u-button v-if="!model.qrcode_image_url && !userInfo.is_org_admin" type="primary" @click="onClick">
          生成
        </u-button>
      </view>
    </view>

    <view
      v-if="model.bind_url && !userInfo.is_org_admin && (userInfo.is_admin || userInfo.is_salesman)"
      class="flex flex-col items-center py-60px"
    >
      <view class="my-10px">
        <u-divider half-width="150" font-size="24">绑定管理员二维码</u-divider>
      </view>
      <view @click="preview">
        <l-qrcode
          ref="qrcodeAdminRef"
          :value="model.bind_url"
          color="rgb(5, 67, 133)"
          bg-color="#FFF"
          size="180px"
        ></l-qrcode>
      </view>
    </view>

    <view v-if="!model.qrcode_image_url && !userInfo.is_org_admin" class="flex flex-col items-center pt-100px">
      <l-qrcode
        ref="qrcodeRef"
        :value="model.free_url"
        color="rgb(5, 67, 133)"
        size="180px"
        icon="/static/logo.png"
        icon-size="40px"
      ></l-qrcode>
      <canvas
        id="codeCanvas"
        canvas-id="codeCanvas"
        type="2d"
        style="display: block; width: 300px; height: 300px; letter-spacing: 1px"
      ></canvas>
      <u-image
        ref="bgRef"
        class="qrcode-bg"
        width="300px"
        height="300px"
        src="/static/images/qrcode-bg1.jpg"
        border-radius="4px"
      ></u-image>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background-color: white;
  padding: 8px 20px;
  padding-bottom: 20px;
  min-height: calc(100vh - 64px);

  .meta {
    display: flex;
    margin-bottom: 10px;
    line-height: 20px;
    word-wrap: break-word;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    .author {
      font-size: 15px;
      margin-right: 10px;
      color: #576b95;
    }
  }

  :v-deep ._div {
    text-indent: unset !important;

    img {
      width: 100% !important;
    }
  }

  .o-body {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    width: 100%;

    .swiper-item {
      height: 100%;
    }

    .page-box {
      margin-bottom: 100px;
    }
  }
}
</style>
