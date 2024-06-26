<script lang="ts">
export default { name: 'PageTMUI' }
</script>
<template>
  <tm-app ref="app">
    <tm-sticky>
      <template #sticky>
        <tm-sheet
          :text="false"
          :linear="store.tmStore.dark ? '' : 'bottom'"
          :linear-color="headerBgColor"
          :margin="[0, 0]"
          :follow-theme="true"
        >
          <view :style="{ height: sysinfo.statusBarHeight + 'px' }"></view>
          <view class="flex-row flex-row-center-start pb-5px">
            <tm-image :width="108" :height="67.5" :src="logoimg"></tm-image>
            <view class="pl-16px flex-1" style="width: 0px">
              <tm-text :folow-theme="false" _class="text-weight-b" :font-size="36" :label="tmuiVer"></tm-text>
              <tm-text :folow-theme="false" _class="opacity-80" :label="language('index.search.subtext')"></tm-text>
            </view>
          </view>

          <view class="px-0 pt-6px">
            <tm-input
              v-model="str"
              focus-color="white"
              :text="false"
              color="white"
              :round="16"
              :transprent="store.tmStore.dark"
              :placeholder="language('index.search.tips')"
              show-clear
              prefix="tmicon-search"
              @confirm="search"
            ></tm-input>
          </view>
        </tm-sheet>
      </template>
      <tm-sheet :shadow="6" :margin="[24]" :padding="[24]" :round="6">
        <view class="flex flex-row flex-around">
          <tm-button
            :round="8"
            :width="100"
            color="yellow"
            size="small"
            :label="language('index.com.themeGreen')"
            @click="setTheme('yellow')"
          ></tm-button>
          <tm-button
            :round="8"
            :width="100"
            color="blue"
            size="small"
            :label="language('index.com.themeBlue')"
            @click="setTheme('blue')"
          ></tm-button>
          <tm-button
            :round="8"
            :width="100"
            color="red"
            size="small"
            :label="language('index.com.themeRed')"
            @click="setTheme('red')"
          ></tm-button>
          <tm-button
            :round="8"
            color="brown"
            :width="100"
            size="small"
            :label="language('index.com.themeCustText')"
            @click="showCustom = true"
          >
          </tm-button>
          <tm-button
            :round="8"
            :width="160"
            size="small"
            :label="language('index.com.themeDefault')"
            @click="setTheme('')"
          >
          </tm-button>
        </view>
      </tm-sheet>

      <view class="mx-16px">
        <tm-row :width="'100%'" :column="3" :round="6" :transprent="false">
          <tm-col
            v-for="(item, index) in category"
            :key="index"
            :transprent="true"
            :height="190"
            @click="toLinks(item.url)"
          >
            <tm-icon :color="item.color" _class="pb-4px" :font-size="52" :name="item.icon"></tm-icon>
            <tm-text :font-size="28" _class="text-weight-b" :label="language(item.title)"></tm-text>
            <tm-text color="grey" :font-size="22" :label="language(item.label)"></tm-text>
          </tm-col>
        </tm-row>
      </view>

      <view class="py-24px">
        <!-- #ifdef MP-WEIXIN -->
        <tm-cell
          url="../wxaccount/user"
          :margin="[24, 0, 24, 16]"
          show-avatar
          :round="4"
          :title-font-size="30"
          :title="language('index.com.love')"
          label="可登录模板市场"
          :right-text="language('index.com.loveSub')"
        >
          <template #avatar>
            <tm-icon color="orange" :font-size="38" name="tmicon-heart-fill"></tm-icon>
          </template>
        </tm-cell>
        <!-- #endif -->
        <tm-cell
          :margin="[24, 0, 24, 16]"
          show-avatar
          :round="4"
          :title-font-size="30"
          :title="language('index.com.setLocal')"
          :right-text="language('language')"
          @click="seLocal"
        >
          <template #avatar>
            <tm-icon color="primary" :font-size="38" name="tmicon-resource"></tm-icon>
          </template>
        </tm-cell>
        <tm-cell :margin="[24, 0]" show-avatar :round="4" :title-font-size="30" :title="language('index.com.autoDark')">
          <template #avatar>
            <tm-icon color="pink" :font-size="38" name="tmicon-ios-color-palette"></tm-icon>
          </template>
          <template #right>
            <tm-checkbox v-model="autoDark" :round="24" @change="autoDarkChange"></tm-checkbox>
          </template>
        </tm-cell>
      </view>

      <!-- #ifdef MP-WEIXIN -->
      <view class="px-24px">
        <ad unit-id="adunit-8077b1c992ae8c8b"></ad>
      </view>
      <!-- #endif -->

      <view class="py-22px flex flex-row flex-row-center-center">
        <view style="width: 300rpx">
          <tm-divider color="grey-2" :label="language('index.com.bottom')"></tm-divider>
        </view>
      </view>
    </tm-sticky>

    <tm-float-button :btn="{ icon: 'tmicon-ios-sunny' }" @click="onChangeDark"> </tm-float-button>
    <tm-message ref="msg"></tm-message>
    <tm-drawer v-model:show="showCustom" placement="center" hide-header :height="450" :width="600">
      <view class="pa-10px flex flex-col">
        <view class="text-align-center py-16px">
          <tm-text _class="text-weight-b" :font-size="32" label="自定义主题"></tm-text>
        </view>
        <tm-input
          v-model="showCustomColor"
          :round="16"
          prefix-label="颜色值"
          placeholder="请输入颜色值,比如:#FF00FF"
          :border="1"
          show-clear
        ></tm-input>
        <tm-input
          v-model="showCustomName"
          :round="16"
          prefix-label="颜色名称"
          :margin="[0, 24]"
          placeholder="字母,如:darkGreen"
          :border="1"
          show-clear
        ></tm-input>
        <tm-button :round="16" block label="确认切换" @click="changeCustomColor"></tm-button>
      </view>
    </tm-drawer>
  </tm-app>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref, getCurrentInstance, computed, inject } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { onShow, onLoad, onInit } from '@dcloudio/uni-app'
import { language } from '@/tmui/tool/lib/language'
import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia'
import tmApp from '@/tmui/components/tm-app/tm-app.vue'
import tmSheet from '@/tmui/components/tm-sheet/tm-sheet.vue'
import tmButton from '@/tmui/components/tm-button/tm-button.vue'
import tmFloatButton from '@/tmui/components/tm-float-button/tm-float-button.vue'
import tmMessage from '@/tmui/components/tm-message/tm-message.vue'
import tmInput from '@/tmui/components/tm-input/tm-input.vue'
import tmDivider from '@/tmui/components/tm-divider/tm-divider.vue'
import tmIcon from '@/tmui/components/tm-icon/tm-icon.vue'
import tmDrawer from '@/tmui/components/tm-drawer/tm-drawer.vue'
import tmCheckbox from '@/tmui/components/tm-checkbox/tm-checkbox.vue'
import tmSticky from '@/tmui/components/tm-sticky/tm-sticky.vue'
import tmRow from '@/tmui/components/tm-row/tm-row.vue'
import tmCol from '@/tmui/components/tm-col/tm-col.vue'
import tmImage from '@/tmui/components/tm-image/tm-image.vue'
import tmText from '@/tmui/components/tm-text/tm-text.vue'
import tmCell from '@/tmui/components/tm-cell/tm-cell.vue'
import logoimg from '@/static/logo.png'

// const proxy = getCurrentInstance()?.proxy ?? null
// const proxyw = getCurrentInstance()

const store = useTmpiniaStore()
const app = ref<InstanceType<typeof tmApp> | null>(null)
const msg = ref<InstanceType<typeof tmMessage> | null>(null)
// const showf = ref(false)
const sysinfo = uni.$tm.u.getWindow()
const str = ref('')
const showCustomColor = ref('#60ab41')
const showCustomName = ref('darkGreen')
const showCustom = ref(false)
const autoDark = ref(store.tmuiConfig.autoDark)
const headerBgColor = computed(() => {
  if (store.tmStore.dark) {
    return []
  }
  return store.tmStore.color ? [] : ['#f5f5f5', '#f5f5f5']
})
const tmuiVer = 'TMUI 3.1.09'

const category = [
  {
    url: '../changyong/index',
    color: 'primary',
    icon: 'tmicon-layergroup-fill',
    title: 'index.com.tongyong',
    label: 'index.com.tongyongSub',
  },

  {
    url: '../layout/index',
    color: 'yellow',
    icon: 'tmicon-map-fill',
    title: 'index.com.row',
    label: 'index.com.rowSub',
  },

  {
    url: '../showdata/index',
    color: 'pink',
    icon: 'tmicon-paperplane-fill',
    title: 'index.com.show',
    label: 'index.com.showSub',
  },

  {
    url: '../form/index',
    color: 'cyan',
    icon: 'tmicon-commentdots-fill',
    title: 'index.com.form',
    label: 'index.com.formSub',
  },

  {
    url: '../fankui/index',
    color: 'red',
    icon: 'tmicon-lightbulb-fill',
    title: 'index.com.fd',
    label: 'index.com.fdSub',
  },

  {
    url: '../daohang/index',
    color: 'orange',
    icon: 'tmicon-flag-fill',
    title: 'index.com.nav',
    label: 'index.com.navSub',
  },

  {
    url: '../yewu/index',
    color: 'purple',
    icon: 'tmicon-box-fill',
    title: 'index.com.yewu',
    label: 'index.com.yewuSub',
  },

  {
    url: '../other/index',
    color: 'blue-grey',
    icon: 'tmicon-smile-fill',
    title: 'index.com.other',
    label: 'index.com.otherSub',
  },

  {
    url: '../pag/index',
    color: 'indigo',
    icon: 'tmicon-ios-ice-cream',
    title: 'index.com.pag',
    label: 'index.com.pagSub',
  },

  {
    url: '../render/index',
    color: 'lime',
    icon: 'tmicon-ios-rose',
    title: 'index.com.render',
    label: 'index.com.renderSub',
  },

  {
    url: '../chart/index',
    color: 'brown',
    icon: 'tmicon-borderbottom-fill',
    title: 'index.com.tubiao',
    label: 'index.com.tubiaoSub',
  },
]
function toLinks(url: string) {
  uni.navigateTo({ url: url })
}
function onChangeDark() {
  app.value?.setDark()
}
function search() {
  if (str.value.trim() === '') {
    msg.value?.show({
      model: 'error',
      text: '不能为空',
      mask: true,
    })
    return
  }
  uni.navigateTo({
    url: 'search?key=' + str.value,
  })
}

function seLocal() {
  if (language('language') == 'English-US') {
    uni.setLocale('zh-Hans')
  } else {
    uni.setLocale('en')
  }
}

function setTheme(colorname: string) {
  app.value?.setTheme(colorname)
}

function changeCustomColor() {
  if (!showCustomColor.value || !showCustomName.value) {
    msg.value?.show({
      model: 'error',
      text: '必填内容',
      mask: true,
    })
    return
  }
  showCustom.value = false
  store.setTmVuetifyAddTheme(showCustomName.value, showCustomColor.value)
}

onLoad(() => {
  // #ifdef MP-WEIXIN

  // 在页面中定义插屏广告
  let interstitialAd = null

  // 在页面onLoad回调事件中创建插屏广告实例
  if (wx.createInterstitialAd) {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: 'adunit-197d1e1914ce88ec',
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    interstitialAd.onLoad(() => {})
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    interstitialAd.onError(() => {})
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    interstitialAd.onClose(() => {})
  }
  // 在适合的场景显示插屏广告
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      console.error(err)
    })
  }

  // #endif
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function test() {
  console.log(99)
}
function autoDarkChange(e: boolean) {
  store.setTmAutoDark(e)

  // store.setTmVuetifyDark(e)
  autoDark.value = e
}
</script>
