<template>
  <view>
    <view
      v-if="mode === 2 && state.liveList.length"
      class="goods-md-wrap ss-flex ss-flex-wrap ss-col-top"
      :style="[{ margin: '-' + data.space + 'rpx' }]"
    >
      <view
        v-for="item in state.liveList"
        :key="item.id"
        :style="[
          {
            padding: data.space + 'rpx',
          },
        ]"
        class="goods-list-box"
      >
        <s-live-card
          class="goods-md-box"
          size="md"
          :goods-fields="goodsFields"
          :data="item"
          :title-color="goodsFields.name?.color"
          :sub-title-color="goodsFields.anchor_name?.color"
          :top-radius="data.borderRadiusTop"
          :bottom-radius="data.borderRadiusBottom"
          @click="goRoom(item.roomid)"
        >
        </s-live-card>
      </view>
    </view>
    <view v-if="mode === 1 && state.liveList.length" class="goods-lg-box">
      <view
        v-for="item in state.liveList"
        :key="item.id"
        class="goods-box"
        :style="[{ marginBottom: data.space + 'px' }]"
      >
        <s-live-card
          class="goods-card"
          size="sl"
          :goods-fields="goodsFields"
          :data="item"
          :title-color="goodsFields.name?.color"
          :sub-title-color="goodsFields.anchor_name.color"
          :top-radius="data.borderRadiusTop"
          :bottom-radius="data.borderRadiusBottom"
          @tap="goRoom(item.roomid)"
        >
        </s-live-card>
      </view>
    </view>
  </view>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import sheep from '@/sheep'

const state = reactive({
  liveList: [],
  mpLink: '',
})
const props = defineProps({
  data: {
    type: Object,
    default() {},
  },
  styles: {
    type: Object,
    default() {},
  },
})
const { mode, goodsFields, mpliveIds } = props.data ?? {}
const { marginLeft, marginRight } = props.styles ?? {}

async function getLiveListByIds(ids) {
  const { data } = await sheep.$api.app.mplive.getRoomList(ids)
  return data
}
function goRoom(id) {
  // #ifdef MP-WEIXIN
  uni.navigateTo({
    url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${id}`,
  })
  // #endif

  // #ifndef MP-WEIXIN
  uni.showModal({
    title: '提示',
    confirmText: '允许',
    content: '将打开小程序访问',
    success: async function (res) {
      if (res.confirm) {
        getMpLink()
      }
    },
  })
  // #endif
}

function goMpLink() {
  // #ifdef H5
  window.location = state.mpLink
  // #endif
  // #ifdef APP-PLUS
  plus.runtime.openURL(state.mpLink)
  // #endif
}

async function getMpLink() {
  // #ifndef MP-WEIXIN
  if (state.mpLink === '') {
    const { error, data } = await sheep.$api.app.mplive.getMpLink()
    if (error === 0) {
      state.mpLink = data
    }
  }
  goMpLink()
  // #endif
}

onMounted(async () => {
  state.liveList = await getLiveListByIds(mpliveIds)
})
</script>
<style lang="scss" scoped>
.goods-list-box {
  width: 50%;
  flex-shrink: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.goods-box {
  &:nth-last-of-type(1) {
    margin-bottom: 0 !important;
  }
}

.goods-md-box,
.goods-sl-box {
  position: relative;
}
</style>
