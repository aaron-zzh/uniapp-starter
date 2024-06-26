<template>
  <view>
    <view v-if="lineData" class="flex a-center content">
      <view>
        <slot name="content"></slot>
      </view>
    </view>
    <view class="flex a-center" style="padding-right: 10rpx">
      <view id="container" ref="progressContainer" class="progress-container" :style="{ background: inBgColor }">
        <view
          v-if="isAnimate"
          id="content"
          ref="progressContent"
          class="progress-content flex j-end"
          :style="{
            height: strokeWidth + 'px',
            background: bgColor,
            width: contentWidth,
            transition: `width ${duration / 1000}s ease`,
          }"
        >
          <view v-if="textInside && !noData" class="textInside flex a-center j-center">
            <view class="text">{{ percentage }}%</view>
          </view>
        </view>
        <view
          v-if="!isAnimate"
          class="progress-content flex j-end"
          :style="{ width: percentage + '%', height: strokeWidth + 'px', background: bgColor }"
        >
          <view v-if="textInside && !noData" class="textInside flex a-center j-center">
            <view class="text">{{ percentage }}%</view>
          </view>
        </view>
      </view>
      <view>
        <view v-if="!textInside && !lineData && !noData && !isAnimate" class="percentage">{{ percentage }}% </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AiProgress',
  components: {},
  filters: {},
  directives: {},
  props: {
    // 进度条的值
    percentage: {
      type: [Number, String],
      required: true,
    },
    // 是否内联显示数据
    textInside: {
      type: Boolean,
      default: false,
    },
    // 进度条高度
    strokeWidth: {
      type: [Number, String],
      default: 6,
    },
    // 默认动画时长
    duration: {
      type: [Number, String],
      default: 2000,
    },
    // 是否有动画
    isAnimate: {
      type: Boolean,
      default: false,
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: 'linear-gradient(90deg, var(--ui-BG-Main) 0%, var(--ui-BG-Main-gradient) 100%)',
    },
    // 是否不显示数据
    noData: {
      type: Boolean,
      default: false,
    },
    // 是否自定义显示内容
    lineData: {
      type: Boolean,
      default: false,
    },
    // 自定义底色
    inBgColor: {
      type: String,
      default: '#ebeef5',
    },
  },
  data() {
    return {
      width: 0,
      timer: null,
      containerWidth: 0,
      contentWidth: 0,
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.start()
    })
  },
  created() {},
  methods: {
    start() {
      if (this.isAnimate) {
        // #ifdef H5
        this.$nextTick(() => {
          let progressContainer = this.$refs.progressContainer.$el
          let progressContent = this.$refs.progressContent.$el
          let style = window.getComputedStyle(progressContainer, null)
          let width = style.width.replace('px', '') * ((this.percentage * 1) / 100)
          progressContent.style.width = width.toFixed(2) + 'px'
          progressContent.style.transition = `width ${this.duration / 1000}s ease`
        })
        // #endif
        const container = uni.createSelectorQuery().in(this).selectAll('#container')
        const content = uni.createSelectorQuery().in(this).selectAll('#content')
        container.boundingClientRect().exec((res1) => {
          this.contentWidth = res1[0][0].width * 1 * ((this.percentage * 1) / 100).toFixed(2) + 'px'
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  margin-bottom: 10px;

  .c-per {
    font-size: 26px;
  }
}

.progress-container {
  width: 100%;
  border-radius: 100px;

  .progress-content {
    border-radius: 100px;
    width: 0;
  }

  .textInside {
    color: #fff;
    margin-right: 10rpx;
    position: relative;
  }
}

.text {
  margin-left: 10rpx;
  font-size: 16rpx;
  width: 100rpx;
  color: #ffb9b9;
}

.percentage {
  margin-left: 6px;
  font-size: 12px;
  width: 30px;
}

.flex {
  display: flex;
}

.a-center {
  align-items: center;
}

.j-center {
  justify-content: center;
}

.j-between {
  justify-content: space-between;
}

.content {
  margin-bottom: 10px;
  color: #666;
  font-size: 32rpx;
}
</style>
