<template>
  <!-- 遮罩层 -->
  <u-popup v-model="show" mode="bottom" border-radius="30" height="260rpx" @close="close">
    <view class="share-title">
      <span>分享</span>
    </view>
    <view class="share-list">
      <!-- #ifdef MP-WEIXIN -->
      <view class="share-item">
        <button class="share-btn" open-type="share">
          <u-icon color="#04BE02" size="80" name="weixin-fill"></u-icon>微信好友
        </button>
      </view>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <view v-for="(item, index) in list" :key="index" class="share-item" @click="handleShare(item)">
        <u-icon :color="item.color" size="80" :name="item.icon"></u-icon>
        <view>{{ item.title }}</view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="share-item" @click="copyLink()">
        <u-icon color="#b4aee8" size="80" name="share-fill"></u-icon>
        <view>{{ '复制链接' }}</view>
      </view>
      <!-- #endif -->
    </view>
  </u-popup>
</template>
<script>
// #ifdef H5
import { h5Copy } from '@/utils/h5-copy.ts'
// #endif

export default {
  // 图片缩略图、 商品名称 、 type（goods,shop,pintuan) 拼团商品分享以及店铺分享
  name: 'SharePage',
  // eslint-disable-next-line vue/require-prop-types
  props: ['thumbnail', 'name', 'type', 'goodsId', 'link'],
  data() {
    return {
      configs: {
        shareLink: '',
      },
      show: true,
      list: [
        {
          color: '#04BE02',
          title: '微信好友',
          icon: 'weixin-fill',
          type: 0,
        },
        {
          color: '#04BE02',
          title: '朋友圈',
          icon: 'weixin-circle-fill',
          type: 1,
        },
      ],
    }
  },
  onLoad() {
    uni.hideShareMenu()
  },
  onShareAppMessage() {
    return {
      title: '信息',
      path: '',
      imageUrl: '../../static/logo.png',
      desc: '鲁校网',
    }
  },
  methods: {
    close() {
      // eslint-disable-next-line vue/require-explicit-emits
      this.$emit('close')
    },
    weChatShare() {
      // this.$u.mpShare = {
      //   title:  this.shareTitle(), // 默认为小程序名称，可自定义
      //   path: '', // 默认为当前页面路径，一般无需修改，QQ小程序不支持
      //   // 分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。
      //   // 支持PNG及JPG，默认为当前页面的截图
      //   imageUrl: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
      // }
    },

    // h5复制链接
    // #ifdef H5
    copyLink() {
      let content
      if (this.link) {
        content = this.configs.shareLink + this.link
      } else {
        content = this.configs.shareLink + getCurrentPages()[getCurrentPages().length - 1].route
      }
      console.log(content)
      if (content === null || content === undefined) {
        content = ''
      } else content = content + ''
      const result = h5Copy(content)
      if (result === false) {
        uni.showToast({
          title: '不支持',
        })
      } else {
        uni.showToast({
          title: '复制成功',
          icon: 'none',
        })
      }
    },
    // #endif

    shareTitle() {
      let shareTitle
      if (this.type == 'goods') {
        shareTitle = `[好友推荐]${this.name}快来跟我一起看看吧`
      } else if (this.type == 'shops') {
        shareTitle = `[好友发现]${this.name}快来跟我一起看看吧`
      } else if (this.type == 'pintuan') {
        shareTitle = `[好友邀请]${this.name}快来跟我一起抢购吧!`
      } else if (this.type == 'kanjia') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        shareTitle = `[好友邀请]请快来帮我砍一刀${this.name}`
      }
      return this.name
    },

    // #ifdef APP-PLUS
    handleShare(val) {
      if (val.type <= 1) {
        let scene //  "WXSenceTimeline 朋友圈   WXSceneSession 微信好友"
        val.type == 1 ? (scene = 'WXSenceTimeline') : (scene = 'WXSceneSession')
        uni.share({
          provider: 'weixin',
          scene: scene,
          href: configs.shareLink + this.link,
          imageUrl: this.thumbnail,
          type: 0,
          summary: this.name,
          title: this.shareTitle(),
          success: function () {
            uni.showToast({
              title: '分享成功!',
              duration: 2000,
              icon: 'none',
            })
            // eslint-disable-next-line vue/require-explicit-emits
            this.$emit('close')
          },
          fail: function () {
            uni.showToast({
              title: '分享失败!',
              duration: 2000,
              icon: 'none',
            })
            // eslint-disable-next-line vue/require-explicit-emits
            this.$emit('close')
          },
        })
      }
    },
    // #endif
  },
}
</script>
<style lang="scss" scoped>
.share-btn {
  background: none;
  font-size: 24rpx;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.share-title {
  position: relative;
  height: 90rpx;
  font-size: 32rpx;
  line-height: 90rpx;
  text-align: center;
  > .share-close {
    position: absolute;
    right: 0;
    right: 20rpx;
    top: 30rpx;
  }
}
button:after {
  border: none;
}

.share-list {
  padding: 0 32rpx;
  display: flex;
  text-align: center;
  align-items: center;
  > .share-item {
    width: 25%;
    font-size: 24rpx;
    color: #666;
    // > * {
    //   margin: 8rpx 0;
    // }
  }
}
</style>
