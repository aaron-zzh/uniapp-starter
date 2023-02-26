<template>
  <!-- 1、常用loading加载弹窗 -->
  <view
    v-if="SHOW && type == 1"
    class="aui-loading aui-loading-ring"
    :class="{ 'aui-loading-ring-row': direction == 'row' }"
  >
    <view v-if="mask" class="aui-mask" @touchmove.stop.prevent></view>
    <view class="aui-loading-main">
      <view class="aui-loading-animate">
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
        <view class="span"></view>
      </view>
      <view v-if="msg" class="aui-loading-msg">{{ msg }}</view>
    </view>
  </view>
  <!-- 2、按钮内显示loading加载动画 -->
  <view v-else-if="SHOW && type == 2" class="aui-loading aui-loading-button">
    <view
      class="aui-loading-main"
      :style="{
        background: styles.background,
        borderRadius: styles.borderRadius,
        zIndex: styles.zIndex,
      }"
    >
      <view class="aui-loading-warp">
        <view class="aui-loading-animate">
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
          <view class="span" :style="{ borderColor: styles.color }"></view>
        </view>
        <view v-if="msg" class="aui-loading-msg" :style="{ color: styles.color }">{{ msg }}</view>
      </view>
    </view>
  </view>
  <!-- 3、特殊风格loading加载弹窗 -> 四方块旋转 -->
  <view
    v-else-if="SHOW && type == 3"
    class="aui-loading aui-loading-squarefour"
    :class="{
      'aui-loading-squarefour-style-1': theme == 1,
      'aui-loading-squarefour-style-2': theme == 2,
    }"
  >
    <view v-if="mask" class="aui-mask" @touchmove.stop.prevent></view>
    <view class="aui-loading-main" :style="{ background: styles.background, zIndex: styles.zIndex }">
      <view class="aui-loading-animate">
        <view class="span1"></view>
        <view class="span2"></view>
        <view class="span3"></view>
        <view class="span4"></view>
      </view>
      <view v-if="msg" class="aui-loading-msg" :style="{ color: styles.color }">{{ msg }}</view>
    </view>
  </view>
  <!-- 4、三平行四边形放大缩小(全屏首次加载过度动画) -->
  <view v-else-if="SHOW && type == 4" class="aui-loading aui-loading-dots">
    <view v-if="mask" class="aui-mask" @touchmove.stop.prevent></view>
    <view class="aui-loading-main">
      <view class="aui-loading-dot-items">
        <view class="aui-loading-dot-item dot_one"></view>
        <view class="aui-loading-dot-item dot_two"></view>
        <view class="aui-loading-dot-item dot_three"></view>
      </view>
    </view>
  </view>
  <!-- 5、三圆点背景过度(全屏首次加载过度动画) -->
  <view v-else-if="SHOW && type == 5" class="aui-loading aui-loading-dots-opacity">
    <view v-if="mask" class="aui-mask" @touchmove.stop.prevent></view>
    <view class="aui-loading-main">
      <view class="aui-loading-dot-items">
        <view class="aui-loading-dot-item dot_one"></view>
        <view class="aui-loading-dot-item dot_two"></view>
        <view class="aui-loading-dot-item dot_three"></view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'AuiLoading',
  props: {
    type: {
      //默认圆环风格(<1>、1:toast圆环风格，<2>、2:点击按钮后在按钮内显示加载动画) <3>、3:四方块水平方向旋转，
      type: Number,
      default: 1,
    },
    msg: {
      //描述内容
      type: String,
      default: '',
    },
    mask: {
      //是否显示遮罩，默认false
      type: Boolean,
      default: false,
    },
    direction: {
      //横向("row")或纵向("col")控制，默认纵向
      type: String,
      default: 'col',
    },
    theme: {
      //控制风格 type==3时生效
      type: Number,
      default: 1,
    },
    styles: {
      //样式
      type: Object,
      default() {
        return {
          color: '',
          borderRadius: '',
          background: '',
          zIndex: '',
        }
      },
    },
  },
  data() {
    return {
      SHOW: false, //是否显示
    }
  },
  created() {
    //console.log(this.styles);
  },
  methods: {
    //显示
    show() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var that = this
      return new Promise(function (resolve, reject) {
        that.SHOW = true
        resolve()
      })
    },
    //隐藏
    hide() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var that = this
      return new Promise(function (resolve, reject) {
        that.SHOW = false
        resolve()
      })
    },
  },
}
</script>

<style>
/* loading加载弹窗 */
/* loading-ring 样式设置 */
.aui-loading.aui-loading-ring {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.aui-loading.aui-loading-ring .aui-loading-main {
  width: auto;
  height: auto;
  min-width: 55px;
  min-height: 55px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 1px rgba(100, 100, 100, 0.5);
  padding: 15px;
  box-sizing: border-box;
  -ms-animation: aui-fade-in 0.1s ease-out forwards;
  -webkit-animation: aui-fade-in 0.1s ease-out forwards;
  animation: aui-fade-in 0.1s ease-out forwards;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 999;
  -ms-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.aui-loading.aui-loading-ring .aui-loading-animate {
  width: 25px;
  height: 25px;
  margin: 0 auto;
  border-radius: 50%;
  position: relative;
  z-index: 999;
}
.aui-loading.aui-loading-ring .aui-loading-msg {
  width: 100%;
  height: 17px;
  max-width: -webkit-calc(100vw - 40px);
  max-width: calc(100vw - 40px);
  line-height: 17px;
  position: relative;
  top: 5px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
  text-align: center;
  opacity: 0.8;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span {
  width: -webkit-calc(100% - 6px);
  width: calc(100% - 6px);
  height: 2px;
  display: inline-block;
  border-radius: 2px;
  position: absolute;
  box-sizing: initial !important;
  top: -webkit-calc(50% - 1px);
  top: calc(50% - 1px);
  left: 0;
  opacity: 0.3;
  -ms-animation: load-button 0.6s ease infinite;
  -webkit-animation: load-button 0.6s ease infinite;
  animation: load-button 0.6s ease infinite;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(1) {
  border-left: 6px solid #fff;
  -ms-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -ms-animation-delay: 0.05s;
  -webkit-animation-delay: 0.05s;
  animation-delay: 0.05s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(2) {
  border-left: 6px solid #fff;
  -ms-transform: rotate(30deg);
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -ms-animation-delay: 0.1s;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(3) {
  border-left: 6px solid #fff;
  -ms-transform: rotate(60deg);
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  -ms-animation-delay: 0.15s;
  -webkit-animation-delay: 0.15s;
  animation-delay: 0.15s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(4) {
  border-left: 6px solid #fff;
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -ms-animation-delay: 0.2s;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(5) {
  border-left: 6px solid #fff;
  -ms-transform: rotate(120deg);
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -ms-animation-delay: 0.25s;
  -webkit-animation-delay: 0.25s;
  animation-delay: 0.25s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(6) {
  border-left: 6px solid #fff;
  -ms-transform: rotate(150deg);
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  -ms-animation-delay: 0.3s;
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(7) {
  border-right: 6px solid #fff;
  -ms-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -ms-animation-delay: 0.35s;
  -webkit-animation-delay: 0.35s;
  animation-delay: 0.35s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(8) {
  border-right: 6px solid #fff;
  -ms-transform: rotate(30deg);
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -ms-animation-delay: 0.4s;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(9) {
  border-right: 6px solid #fff;
  -ms-transform: rotate(60deg);
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  -ms-animation-delay: 0.45s;
  -webkit-animation-delay: 0.45s;
  animation-delay: 0.45s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(10) {
  border-right: 6px solid #fff;
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -ms-animation-delay: 0.5s;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(11) {
  border-right: 6px solid #fff;
  -ms-transform: rotate(120deg);
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -ms-animation-delay: 0.55s;
  -webkit-animation-delay: 0.55s;
  animation-delay: 0.55s;
}
.aui-loading.aui-loading-ring .aui-loading-animate .span:nth-child(12) {
  border-right: 6px solid #fff;
  -ms-transform: rotate(150deg);
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  -ms-animation-delay: 0.6s;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.aui-loading.aui-loading-ring.aui-loading-ring-row .aui-loading-main {
  display: block;
  min-height: 40px;
  padding: 10px 15px;
  border-radius: 6px;
}
.aui-loading.aui-loading-ring.aui-loading-ring-row .aui-loading-animate {
  display: inline-block;
  vertical-align: top;
}
.aui-loading.aui-loading-ring.aui-loading-ring-row .aui-loading-msg {
  width: auto;
  height: 25px;
  line-height: 25px;
  top: 0;
  margin-left: 10px;
  display: inline-block;
  vertical-align: top;
}
/* loading-button 样式设置 */
.aui-loading.aui-loading-button {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.aui-loading.aui-loading-button .aui-loading-main {
  width: 100%;
  height: 100%;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 996;
  background: #fff;
  white-space: nowrap;
  -ms-animation: aui-fade-in 0.2s ease-out forwards;
  -webkit-animation: aui-fade-in 0.2s ease-out forwards;
  animation: aui-fade-in 0.2s ease-out forwards;
}
.aui-loading.aui-loading-button .aui-loading-warp {
  width: auto;
  height: auto;
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.aui-loading.aui-loading-button .aui-loading-animate {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: top;
  position: relative;
}
.aui-loading.aui-loading-button .aui-loading-msg {
  height: 20px;
  line-height: 20px;
  font-size: 13px;
  margin-left: 5px;
  display: inline-block;
  vertical-align: top;
  position: relative;
  top: 1px;
}
.aui-loading.aui-loading-button .aui-loading-animate .span {
  width: -webkit-calc(100% - 6px);
  width: calc(100% - 6px);
  height: 2px;
  display: inline-block;
  border-radius: 2px;
  box-sizing: initial !important;
  position: absolute;
  top: -webkit-calc(50% - 1px);
  top: calc(50% - 1px);
  left: 0;
  opacity: 0.3;
  -ms-animation: load-button 0.6s ease infinite;
  -webkit-animation: load-button 0.6s ease infinite;
  animation: load-button 0.6s ease infinite;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(1) {
  border-left: 5px solid #909090;
  -ms-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -ms-animation-delay: 0.05s;
  -webkit-animation-delay: 0.05s;
  animation-delay: 0.05s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(2) {
  border-left: 5px solid #909090;
  -ms-transform: rotate(30deg);
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -ms-animation-delay: 0.1s;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(3) {
  border-left: 5px solid #909090;
  -ms-transform: rotate(60deg);
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  -ms-animation-delay: 0.15s;
  -webkit-animation-delay: 0.15s;
  animation-delay: 0.15s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(4) {
  border-left: 5px solid #909090;
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -ms-animation-delay: 0.2s;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(5) {
  border-left: 5px solid #909090;
  -ms-transform: rotate(120deg);
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -ms-animation-delay: 0.25s;
  -webkit-animation-delay: 0.25s;
  animation-delay: 0.25s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(6) {
  border-left: 5px solid #909090;
  -ms-transform: rotate(150deg);
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  -ms-animation-delay: 0.3s;
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(7) {
  border-right: 5px solid #909090;
  -ms-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -ms-animation-delay: 0.35s;
  -webkit-animation-delay: 0.35s;
  animation-delay: 0.35s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(8) {
  border-right: 5px solid #909090;
  -ms-transform: rotate(30deg);
  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -ms-animation-delay: 0.4s;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(9) {
  border-right: 5px solid #909090;
  -ms-transform: rotate(60deg);
  -webkit-transform: rotate(60deg);
  transform: rotate(60deg);
  -ms-animation-delay: 0.45s;
  -webkit-animation-delay: 0.45s;
  animation-delay: 0.45s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(10) {
  border-right: 5px solid #909090;
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -ms-animation-delay: 0.5s;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(11) {
  border-right: 5px solid #909090;
  -ms-transform: rotate(120deg);
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -ms-animation-delay: 0.55s;
  -webkit-animation-delay: 0.55s;
  animation-delay: 0.55s;
}
.aui-loading.aui-loading-button .aui-loading-animate .span:nth-child(12) {
  border-right: 5px solid #909090;
  -ms-transform: rotate(150deg);
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  -ms-animation-delay: 0.6s;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
/* loading-squarefour 样式设置 */
.aui-loading.aui-loading-squarefour {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.aui-loading.aui-loading-squarefour .aui-loading-main {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 996;
  background: #fff;
  -ms-animation: aui-fade-in 0.2s ease-out forwards;
  -webkit-animation: aui-fade-in 0.2s ease-out forwards;
  animation: aui-fade-in 0.2s ease-out forwards;
}
.aui-loading.aui-loading-squarefour .aui-loading-animate {
  width: 30px;
  height: 30px;
  display: block;
  margin: auto;
  position: absolute;
  top: -webkit-calc(50% - 15px);
  top: calc(50% - 15px);
  left: -webkit-calc(50% - 15px);
  left: calc(50% - 15px);
  -ms-animation: aui-loading-squarefour-animate 1s infinite;
  -webkit-animation: aui-loading-squarefour-animate 1s infinite;
  animation: aui-loading-squarefour-animate 1s infinite;
}
.aui-loading.aui-loading-squarefour .aui-loading-animate view {
  width: 12px;
  height: 12px;
  display: block;
  border-radius: 2px;
  background: #2cb0b2;
  position: absolute;
}
.aui-loading.aui-loading-squarefour .aui-loading-animate .span1 {
  background: #8bc34a;
  left: 0px;
  -ms-animation: aui-loading-square-span1-animate 2s linear 0s infinite normal;
  -webkit-animation: aui-loading-square-span1-animate 2s linear 0s infinite normal;
  animation: aui-loading-square-span1-animate 2s linear 0s infinite normal;
}
.aui-loading.aui-loading-squarefour .aui-loading-animate .span2 {
  background: #f44336;
  right: 0;
  -ms-animation: aui-loading-square-span2-animate 2s linear 0s infinite normal;
  -webkit-animation: aui-loading-square-span2-animate 2s linear 0s infinite normal;
  animation: aui-loading-square-span2-animate 2s linear 0s infinite normal;
}
.aui-loading.aui-loading-squarefour .aui-loading-animate .span3 {
  background: #ffb74d;
  bottom: 0;
  -ms-animation: aui-loading-square-span3-animate 2s linear 0s infinite normal;
  -webkit-animation: aui-loading-square-span3-animate 2s linear 0s infinite normal;
  animation: aui-loading-square-span3-animate 2s linear 0s infinite normal;
}
.aui-loading.aui-loading-squarefour .aui-loading-animate .span4 {
  background: #82bcf9;
  right: 0;
  bottom: 0;
  -ms-animation: aui-loading-square-span4-animate 2s linear 0s infinite normal;
  -webkit-animation: aui-loading-square-span4-animate 2s linear 0s infinite normal;
  animation: aui-loading-square-span4-animate 2s linear 0s infinite normal;
}
.aui-loading.aui-loading-squarefour .aui-loading-msg {
  width: 100%;
  height: 50px;
  line-height: 60px;
  font-size: 13px;
  color: #909090;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 0;
}
.aui-loading.aui-loading-squarefour.aui-loading-squarefour-style-2 {
  z-index: 996;
}
.aui-loading.aui-loading-squarefour.aui-loading-squarefour-style-1 {
  z-index: 999;
}
.aui-loading.aui-loading-squarefour.aui-loading-squarefour-style-1 .aui-loading-main {
  width: auto;
  height: auto;
  min-width: 54px;
  min-height: 54px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 1px rgba(100, 100, 100, 0.3) inset;
  padding: 15px;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  z-index: 999;
  -ms-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.aui-loading.aui-loading-squarefour.aui-loading-squarefour-style-1 .aui-loading-main .aui-loading-animate {
  position: relative;
  top: 0;
  left: 0;
}
.aui-loading.aui-loading-squarefour.aui-loading-squarefour-style-1 .aui-loading-main .aui-loading-msg {
  height: 22px;
  line-height: 20px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #fff;
  opacity: 0.9;
  position: relative;
  top: 6px;
  left: 0;
}
/* 三平行四边形放大缩小动画放大缩小动画(全屏首次加载过度动画) */
.aui-loading.aui-loading-dots {
  background-color: #fff;
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 996;
  margin-top: 0px;
  top: 0px;
}
.aui-loading.aui-loading-dots .aui-loading-main {
  width: 100%;
  height: 100%;
  position: relative;
}
.aui-loading.aui-loading-dots .aui-loading-dot-items {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 60px;
  width: 120px;
  text-align: center;
  margin-top: -30px;
  margin-left: -60px;
}
.aui-loading.aui-loading-dots .aui-loading-dot-item {
  width: 10px;
  height: 10px;
  background-color: #ec2b45;
  display: inline-block;
  margin-right: 6px;
  margin-top: 20px;
  border-radius: 2px;
  -webkit-transform: scale(1) skewX(-30deg);
  transform: scale(1) skewX(-30deg);
}
.aui-loading.aui-loading-dots .dot_one {
  background: #197de0;
  -webkit-animation: dot_one 1.5s infinite;
  animation: dot_one 1.5s infinite;
}
.aui-loading.aui-loading-dots .dot_two {
  background: #2cb0b2;
  -webkit-animation: dot_two 1.5s infinite;
  animation: dot_two 1.5s infinite;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.aui-loading.aui-loading-dots .dot_three {
  background: #4cd964;
  margin-right: 0;
  -webkit-animation: dot_three 1.5s infinite;
  animation: dot_three 1.5s infinite;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
/* 圆点背景过度动画-微信小程序效果(全屏首次加载过度动画) */
.aui-loading.aui-loading-dots-opacity {
  background-color: #fff;
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 996;
  margin-top: 0px;
  top: 0px;
}
.aui-loading.aui-loading-dots-opacity .aui-loading-main {
  width: 100%;
  height: 100%;
  position: relative;
}
.aui-loading.aui-loading-dots-opacity .aui-loading-dot-items {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 60px;
  width: 80px;
  text-align: center;
  margin-top: -30px;
  margin-left: -40px;
}
.aui-loading.aui-loading-dots-opacity .aui-loading-dot-item {
  width: 9px;
  height: 9px;
  opacity: 1;
  background-color: #ec2b45;
  display: inline-block;
  margin-right: 8px;
  margin-top: 30px;
  -moz-border-radius: 50% 50% 50% 50%;
  -webkit-border-radius: 50% 50% 50% 50%;
  border-radius: 50% 50% 50% 50%;
}
.aui-loading.aui-loading-dots-opacity .dot_one {
  background: #197de0;
  -webkit-animation: dot-opacity 1.5s infinite;
  animation: dot-opacity 1.5s infinite;
}
.aui-loading.aui-loading-dots-opacity .dot_two {
  background: #2cb0b2;
  -webkit-animation: dot-opacity 1.5s infinite;
  animation: dot-opacity 1.5s infinite;
  -webkit-animation-delay: 0.25s;
  animation-delay: 0.25s;
}
.aui-loading.aui-loading-dots-opacity .dot_three {
  background: #4cd964;
  margin-right: 0;
  -webkit-animation: dot-opacity 1.5s infinite;
  animation: dot-opacity 1.5s infinite;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
@-webkit-keyframes dot-opacity {
  50% {
    opacity: 0.1;
  }
}
@keyframes dot-opacity {
  50% {
    opacity: 0.1;
  }
}
@-webkit-keyframes dot_one {
  75% {
    -webkit-transform: scale(0) skewX(-30deg);
  }
}
@keyframes dot_one {
  75% {
    transform: scale(0) skewX(-30deg);
    -webkit-transform: scale(0) skewX(-30deg);
  }
}
@-webkit-keyframes dot_two {
  75% {
    -webkit-transform: scale(0) skewX(-30deg);
  }
}
@keyframes dot_two {
  75% {
    transform: scale(0) skewX(-30deg);
    -webkit-transform: scale(0) skewX(-30deg);
  }
}
@-webkit-keyframes dot_three {
  75% {
    -webkit-transform: scale(0) skewX(-30deg);
  }
}
@keyframes dot_three {
  75% {
    transform: scale(0) skewX(-30deg);
    -webkit-transform: scale(0) skewX(-30deg);
  }
}
/* loading加载弹窗 load-button 动画 */
@-ms-keyframes load-button {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
@-webkit-keyframes load-button {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
@keyframes load-button {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

/* loading加载弹窗 aui-loading-squarefour 动画 */
@-ms-keyframes aui-loading-squarefour-animate {
  0% {
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes aui-loading-squarefour-animate {
  0% {
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes aui-loading-squarefour-animate {
  0% {
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-ms-keyframes aui-loading-square-span1-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(0, 18px);
    -webkit-transform: translate(0, 18px);
    transform: translate(0, 18px);
  }
  50% {
    -ms-transform: translate(18px, 18px);
    -webkit-transform: translate(18px, 18px);
    transform: translate(18px, 18px);
  }
  75% {
    -ms-transform: translate(18px, 0);
    -webkit-transform: translate(18px, 0);
    transform: translate(18px, 0);
  }
}
@-webkit-keyframes aui-loading-square-span1-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(0, 18px);
    -webkit-transform: translate(0, 18px);
    transform: translate(0, 18px);
  }
  50% {
    -ms-transform: translate(18px, 18px);
    -webkit-transform: translate(18px, 18px);
    transform: translate(18px, 18px);
  }
  75% {
    -ms-transform: translate(18px, 0);
    -webkit-transform: translate(18px, 0);
    transform: translate(18px, 0);
  }
}
@keyframes aui-loading-square-span1-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(0, 18px);
    -webkit-transform: translate(0, 18px);
    transform: translate(0, 18px);
  }
  50% {
    -ms-transform: translate(18px, 18px);
    -webkit-transform: translate(18px, 18px);
    transform: translate(18px, 18px);
  }
  75% {
    -ms-transform: translate(18px, 0);
    -webkit-transform: translate(18px, 0);
    transform: translate(18px, 0);
  }
}

@-ms-keyframes aui-loading-square-span2-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(-18px, 0);
    -webkit-transform: translate(-18px, 0);
    transform: translate(-18px, 0);
  }
  50% {
    -ms-transform: translate(-18px, 18px);
    -webkit-transform: translate(-18px, 18px);
    transform: translate(-18px, 18px);
  }
  75% {
    -ms-transform: translate(0, 18px);
    -webkit-transform: translate(0, 18px);
    transform: translate(0, 18px);
  }
}
@-webkit-keyframes aui-loading-square-span2-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(-18px, 0);
    -webkit-transform: translate(-18px, 0);
    transform: translate(-18px, 0);
  }
  50% {
    -ms-transform: translate(-18px, 18px);
    -webkit-transform: translate(-18px, 18px);
    transform: translate(-18px, 18px);
  }
  75% {
    -ms-transform: translate(0, 18px);
    -webkit-transform: translate(0, 18px);
    transform: translate(0, 18px);
  }
}
@keyframes aui-loading-square-span2-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(-18px, 0);
    -webkit-transform: translate(-18px, 0);
    transform: translate(-18px, 0);
  }
  50% {
    -ms-transform: translate(-18px, 18px);
    -webkit-transform: translate(-18px, 18px);
    transform: translate(-18px, 18px);
  }
  75% {
    -ms-transform: translate(0, 18px);
    -webkit-transform: translate(0, 18px);
    transform: translate(0, 18px);
  }
}
@-ms-keyframes aui-loading-square-span3-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(18px, 0);
    -webkit-transform: translate(18px, 0);
    transform: translate(18px, 0);
  }
  50% {
    -ms-transform: translate(18px, -18px);
    -webkit-transform: translate(18px, -18px);
    transform: translate(18px, -18px);
  }
  75% {
    -ms-transform: translate(0, -18px);
    -webkit-transform: translate(0, -18px);
    transform: translate(0, -18px);
  }
}
@-webkit-keyframes aui-loading-square-span3-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(18px, 0);
    -webkit-transform: translate(18px, 0);
    transform: translate(18px, 0);
  }
  50% {
    -ms-transform: translate(18px, -18px);
    -webkit-transform: translate(18px, -18px);
    transform: translate(18px, -18px);
  }
  75% {
    -ms-transform: translate(0, -18px);
    -webkit-transform: translate(0, -18px);
    transform: translate(0, -18px);
  }
}
@keyframes aui-loading-square-span3-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(18px, 0);
    -webkit-transform: translate(18px, 0);
    transform: translate(18px, 0);
  }
  50% {
    -ms-transform: translate(18px, -18px);
    -webkit-transform: translate(18px, -18px);
    transform: translate(18px, -18px);
  }
  75% {
    -ms-transform: translate(0, -18px);
    -webkit-transform: translate(0, -18px);
    transform: translate(0, -18px);
  }
}
@-ms-keyframes aui-loading-square-span4-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(0, -18px);
    -webkit-transform: translate(0, -18px);
    transform: translate(0, -18px);
  }
  50% {
    -ms-transform: translate(-18px, -18px);
    -webkit-transform: translate(-18px, -18px);
    transform: translate(-18px, -18px);
  }
  75% {
    -ms-transform: translate(-18px, 0);
    -webkit-transform: translate(-18px, 0);
    transform: translate(-18px, 0);
  }
}
@-webkit-keyframes aui-loading-square-span4-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(0, -18px);
    -webkit-transform: translate(0, -18px);
    transform: translate(0, -18px);
  }
  50% {
    -ms-transform: translate(-18px, -18px);
    -webkit-transform: translate(-18px, -18px);
    transform: translate(-18px, -18px);
  }
  75% {
    -ms-transform: translate(-18px, 0);
    -webkit-transform: translate(-18px, 0);
    transform: translate(-18px, 0);
  }
}
@keyframes aui-loading-square-span4-animate {
  0% {
    -ms-transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  25% {
    -ms-transform: translate(0, -18px);
    -webkit-transform: translate(0, -18px);
    transform: translate(0, -18px);
  }
  50% {
    -ms-transform: translate(-18px, -18px);
    -webkit-transform: translate(-18px, -18px);
    transform: translate(-18px, -18px);
  }
  75% {
    -ms-transform: translate(-18px, 0);
    -webkit-transform: translate(-18px, 0);
    transform: translate(-18px, 0);
  }
}
</style>
