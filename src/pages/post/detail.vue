<script lang="ts">
export default { name: 'PostDetailPage', components: { CommentDetail } }
</script>
<script setup lang="ts">
import type { Ref } from 'vue'
import type { PostInfo } from '@/api/post/model'
import PostApi from '@/api/post'
import useScrollColor from '@/hooks/scrollColor'
import useTabsSwiper from '@/hooks/tabsSwiper'
import ActionCard from './modules/ActionCard.vue'
import CommentDetail from '../comment/components/CommentDetail.vue'

const auiLoadingRef = ref(null)
const { tabsRef, tabCurrent, swiperCurrent, tabsChange, transition, animationfinish } = useTabsSwiper()

const config = inject('config') // 注入
const model: Ref<PostInfo> = ref({
  name: '标题',
  child_ids: [{ id: 1, content: '评论', vote_count: 100, create_uid: { name: 'Aaron', avatar_256: '' } }],
} as PostInfo)
const showDlg = ref(false)
const videoRef = ref()

const tabList = ref([
  {
    name: '标题',
  },
  {
    name: '标题',
  },
  {
    name: '标题',
  },
])

const videoContext = ref()
const danmuValue = ref('123')
const danmuList = ref([
  {
    text: '第 1s 出现的弹幕',
    color: '#ff0000',
    time: 1,
  },
  {
    text: '第 3s 出现的弹幕',
    color: '#ff00ff',
    time: 3,
  },
])
const videoErrorCallback = (e) => {
  uni.showModal({
    content: e.target.errMsg,
    showCancel: false,
  })
}
const getRandomColor = () => {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
const sendDanmu = () => {
  videoContext.value.sendDanmu({
    text: danmuValue.value,
    color: getRandomColor(),
  })
  danmuValue.value = ''
}

onReady(() => {
  // #ifndef MP-ALIPAY
  videoContext.value = uni.createVideoContext('myVideo')
  // #endif
})
onLoad((options) => {
  console.log('onLoad post', options)
  model.value.id = options.id
})
onMounted(() => {
  loadData()
})

const loadData = async () => {
  if (model.value.id) {
    auiLoadingRef.value.show()
    try {
      model.value = await PostApi.getBlogPostDetail(model.value.id)
    } catch (e) {
      console.log(e)
    } finally {
      auiLoadingRef.value.hide()
    }
  }
}

const y = ref(0)
const { scrollColor } = useScrollColor(y)
onPageScroll((e) => {
  if (e.scrollTop < 390) {
    y.value = e.scrollTop
  }
})
const canScroll = computed(() => {
  // #ifdef H5
  return y.value > 380
  // #endif
  // #ifndef H5
  // eslint-disable-next-line no-unreachable
  return y.value > 360
  // #endif
})

// 发布
const refPostForm = ref(null)
const onNewPost = () => refPostForm.value.showPopup('post', unref(model))

// 预览图片
const imgList = computed(() => {
  let imgs = model.value.pictures ? model.value.pictures.split(',') : []
  return imgs.map((v) => config.domain + v)
})
const viewImage = (index: number) => {
  uni.previewImage({
    urls: imgList.value,
    current: index,
  })
}

// webview
const onOpen = () => {
  uni.$u.route({
    url: 'pages/web/index',
    params: {
      url: 'https://uniapp.dcloud.net.cn/component/web-view.html#',
    },
  })
}
const btnStyle = {
  lineHeight: '20px',
  height: '20px',
  color: '#FFF',
  background: 'rgba(0, 0, 0, 0.8)',
  border: 'none',
}
const reloadComment = () => {
  console.log('reloadComment')
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <AuiLoading ref="auiLoadingRef" :type="4" direction="row" msg="加载中" :mask="false" />
    <u-navbar
      back-text=""
      :title="model.name"
      :title-color="scrollColor.color"
      :background="scrollColor"
      :border-bottom="false"
      back-icon-color="#eee"
      immersive
    ></u-navbar>
    <view v-if="!model.name">
      <u-empty icon-size="360" :src="config.emptyImg"></u-empty>
    </view>
    <view v-else class="post">
      <view class="cover">
        <u-image width="100%" height="240px" src="/static/images/common/3.jpg" />
        <view class="view-pic-btn">
          <u-button size="mini" :hair-line="false" shape="circle" :custom-style="btnStyle">
            <u-icon name="photo" class="mr-1"></u-icon>10
          </u-button>
        </view>
        <!--#ifdef H5 -->
        <view class="share-btn">
          <u-icon name="zhuanfa" color="#FFF" size="20px"></u-icon>
        </view>
        <!-- #endif -->
      </view>
      <view class="card">
        <view class="flex-box items-start mb-2">
          <view class="flex-1">
            <view class="title ellipsis-2 text-17px my-1">{{ model.name }}</view>
            <view class="o-left flex-box justify-start">
              <view v-for="(item, index) in 3" :key="index">
                <u-tag class="flex-box my-1 mr-3" :text="`标签${item}`" mode="light" size="mini" />
              </view>
            </view>
          </view>
          <view style="width: 70px; height: 70px">
            <u-image
              class="logo"
              width="70px"
              height="70px"
              border-radius="4px"
              src="/static/images/common/avatar.jpg"
            ></u-image>
          </view>
        </view>
        <view
          class="flex-box color-#243b82 text-13px py-2"
          style="border-top: 1px solid #eee; border-bottom: 1px solid #eee"
        >
          <view class="flex-box flex-1"> <u-icon class="mr-2" size="32" name="map-fill" /> 活动地址 </view>
          <u-icon class="mx-1" size="24" color="#888" name="arrow-right" />
        </view>
        <view class="sub-box">
          <ActionCard />
        </view>
      </view>
      <view class="card-bg"> </view>
      <view class="flex-box justify-between"> </view>
      <view class="o-body">
        <view class="u-tabs-box mx--4">
          <u-tabs-swiper
            ref="tabsRef"
            bg-color="#243b82"
            :list="tabList"
            :current="tabCurrent"
            :is-scroll="false"
            active-color="#FFF"
            inactive-color="#888"
            font-size="32"
            :active-item-style="{ fontWeight: 600 }"
            :bar-style="{ backgroundColor: '#FFF', height: '2px' }"
            swiper-width="750"
            @change="tabsChange"
          ></u-tabs-swiper>
        </view>
        <swiper
          class="flex-1 pt-1"
          duration="300"
          :current="swiperCurrent"
          @transition="transition"
          @animationfinish="animationfinish"
        >
          <swiper-item class="swiper-item">
            <scroll-view :scroll-y="canScroll" style="height: 100%; width: 100%">
              <view class="page-box">
                <view ref="imgsRef" class="post-pic-box bg-white margin-top">
                  <view class="py-2">
                    <u-section title="图片" :right="false" font-size="32"></u-section>
                  </view>
                  <scroll-view v-if="model.pictures" scroll-x style="width: 100%; height: 160rpx">
                    <view style="width: 100%; height: 100%" class="flex">
                      <view v-for="(item, index) in pics" :key="item" class="mr-1" @click="viewImage(index)">
                        <u-image width="100px" height="80px" :src="item"></u-image>
                      </view>
                    </view>
                  </scroll-view>
                </view>
                <view>
                  <view class="py-2">
                    <u-section title="特色" font-size="32" :right="false"></u-section>
                  </view>
                  <u-cell-group>
                    <u-cell-item
                      v-for="(item, index) in 5"
                      :key="index"
                      :title-style="{ color: '#243b82' }"
                      :icon-style="{ color: '#243b82' }"
                      icon-size="40"
                      icon="checkmark-circle-fill"
                      :title="`标题${item}`"
                    >
                    </u-cell-item>
                  </u-cell-group>
                </view>
                <view class="my-4">
                  <u-parse html="<h2 style='color:red'>富文本</h2>" :domain="config.domain"></u-parse>
                </view>
                <view v-if="model.child_ids && model.child_ids.length > 0" class="mx--4">
                  <CommentDetail v-model:show="showDlg" :comments="model.child_ids" @submitted="reloadComment" />
                </view>
                <view class="my-6 pb-10">
                  <u-divider half-width="100" font-size="24">没有更多了</u-divider>
                </view>
              </view>
            </scroll-view>
          </swiper-item>
          <swiper-item class="swiper-item">
            <scroll-view :scroll-y="canScroll" style="height: 100%; width: 100%">
              <view class="page-box">
                <view>
                  <video
                    id="myVideo"
                    ref="videoRef"
                    style="width: 100%"
                    src="/static/video/r.mp4"
                    :danmu-list="danmuList"
                    enable-danmu
                    danmu-btn
                    controls
                    @error="videoErrorCallback"
                  ></video>
                </view>
                <view class="my-6">
                  <u-divider half-width="100" font-size="24">没有更多了</u-divider>
                </view>
              </view>
            </scroll-view>
          </swiper-item>
          <swiper-item class="swiper-item">
            <scroll-view :scroll-y="canScroll" style="height: 100%; width: 100%">
              <view class="page-box">
                <view class="bg-white margin-top m-10">
                  <u-button type="primary" @click="onOpen">打开外部页面</u-button>
                </view>
                <view class="my-6">
                  <u-divider half-width="100" font-size="24">没有更多了</u-divider>
                </view>
              </view>
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view v-show="!showDlg" class="navigation">
      <view class="o-left">
        <FavorBtn :id="model.id" v-model:favor="model.user_favorite" type="blog.post" />
        <view class="item">
          <u-icon name="weixin-fill" :size="40" color="#666"></u-icon>
          <view class="text u-line-1">微信群</view>
        </view>
      </view>
      <view class="right">
        <view class="message btn u-line-1" @click="sendDanmu">咨询</view>
        <view class="contact btn u-line-1" @click="onNewPost">发布</view>
      </view>
      <PostForm ref="refPostForm" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background-color: white;
  min-height: calc(100vh + 64px);
  .cover {
    position: relative;
    .view-pic-btn {
      position: absolute;
      bottom: 46px;
      right: 16px;
    }
    .share-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 9999;
    }
  }
  .card {
    height: 230px;
    margin: 0 16px;
    padding: 10px;
    border-radius: 6px;
    background: #fff;
    margin-top: -36px;
    overflow: hidden;
    position: relative;
    z-index: 11;
    .sub-box {
      color: #fff;
      padding: 6px;
      height: 66px;
      border-radius: 4px;
      overflow: hidden;
      background-image: linear-gradient(to right, rgba(194, 121, 44, 0.9), rgba(194, 121, 44, 0.7));
      border-top: 1px solid #eee;
      margin-top: 10px;
    }

    ::v-deep .u-tag {
      margin-right: 2px;
      padding: 3px 6px;
      border: none;
      background-color: #ebded5;
      color: #a97930;
    }
  }
  .card-bg {
    height: 236px;
    margin-top: -230px;
    position: relative;
    z-index: 10;
    background-image: linear-gradient(to bottom, rgba(36, 59, 130, 0), rgba(36, 59, 130, 1) 10%);
  }
  .meta {
    display: flex;
    margin-bottom: 10px;
    line-height: 20px;
    word-wrap: break-word;
    width: 100%;
    align-items: center;
    justify-content: space-between;
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
    width: 100%;
    height: calc(100vh - 44px);
    .o-scroll-view {
      width: 100%;
      height: 100%;
    }

    .page-box {
      padding: 0 16px;
      margin-bottom: 30px;
    }
  }

  .navigation {
    display: flex;
    position: fixed;
    padding: 8px 10px;
    justify-content: space-between;
    width: 100%;
    z-index: 999;
    bottom: 0;
    border: solid 2rpx #f2f2f2;
    background-color: #ffffff;
    .o-left {
      display: flex;
      font-size: 20rpx;
      .item {
        margin: 0 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
    .right {
      flex: 1;
      display: flex;
      font-size: 14px;
      align-items: center;
      justify-content: space-around;
      .btn {
        flex: 1;
        text-align: center;
        line-height: 30px;
        padding: 6px 16px;
        border-radius: 100px;
        color: #fff;
      }
      .message {
        background-color: transparent;
        color: #243b82;
        margin-right: 16px;
        border: 1px solid #243b82;
      }
      .contact {
        background-color: #243b82;
        padding: 6px 20px;
      }
    }
  }
}
</style>
