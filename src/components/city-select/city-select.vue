<template>
  <u-popup
    v-model="show"
    mode="bottom"
    :popup="false"
    :mask="true"
    :closeable="false"
    :safe-area-inset-bottom="true"
    close-icon-color="#ffffff"
    :z-index="uZIndex"
    :mask-close-able="maskCloseAble"
    @close="close"
  >
    <view class="flex flex-row">
      <view class="flex-1">
        <u-tabs
          v-if="modelValue"
          ref="tabs"
          :list="genTabsList"
          :is-scroll="true"
          :current="tabsIndex"
          @change="tabsChange"
        ></u-tabs>
      </view>
      <view v-if="!onlyCity" class="m-2">
        <u-button type="primary" @click="onSelect">确定</u-button>
      </view>
    </view>
    <view class="area-box">
      <view class="u-flex" :class="{ change: isChange }">
        <view class="area-item">
          <view class="u-padding-10 u-bg-gray" style="height: 100%">
            <scroll-view :scroll-y="true" style="height: 100%">
              <u-cell-group>
                <u-cell-item
                  v-for="(item, index) in provinces"
                  :key="index"
                  :title="item.name"
                  :arrow="false"
                  :index="index"
                  @click="provinceChange"
                >
                  <template #right-icon>
                    <u-icon v-if="isChooseP && province === index" size="34" name="checkbox-mark"></u-icon>
                  </template>
                </u-cell-item>
              </u-cell-group>
            </scroll-view>
          </view>
        </view>
        <view class="area-item">
          <view class="u-padding-10 u-bg-gray" style="height: 100%">
            <scroll-view :scroll-y="true" style="height: 100%">
              <u-cell-group v-if="isChooseP">
                <u-cell-item
                  v-for="(item, index) in citys"
                  :key="index"
                  :title="item.name"
                  :arrow="false"
                  :index="index"
                  @click="cityChange"
                >
                  <template #right-icon>
                    <u-icon v-if="isChooseC && city === index" size="34" name="checkbox-mark"></u-icon>
                  </template>
                </u-cell-item>
              </u-cell-group>
            </scroll-view>
          </view>
        </view>

        <view v-if="!onlyCity" class="area-item">
          <view class="u-padding-10 u-bg-gray" style="height: 100%">
            <scroll-view :scroll-y="true" style="height: 100%">
              <u-cell-group v-if="isChooseC">
                <u-cell-item
                  v-for="(item, index) in areas"
                  :key="index"
                  :title="item.name"
                  :arrow="false"
                  :index="index"
                  @click="areaChange"
                >
                  <template #right-icon>
                    <u-icon v-if="isChooseA && area === index" size="34" name="checkbox-mark"></u-icon>
                  </template>
                </u-cell-item>
              </u-cell-group>
            </scroll-view>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import provinces from '@/utils/address/provinces.json'
import citys from '@/utils/address/citys.json'
import areas from '@/utils/address/areas.json'
/**
 * city-select 省市区级联选择器
 * @property {String Number} z-index 弹出时的z-index值（默认1075）
 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker（默认true）
 * @property {String} default-region 默认选中的地区，中文形式
 * @property {String} default-code 默认选中的地区，编号形式
 */
export default {
  name: 'CitySelect',
  props: {
    // 通过双向绑定控制组件的弹出与收起
    modelValue: {
      type: Boolean,
      default: false,
    },
    // 仅展示到市级
    onlyCity: {
      type: Boolean,
      default: false,
    },
    // 默认显示的地区，可传类似["河北省", "秦皇岛市", "北戴河区"]
    defaultRegion: {
      type: Array,
      default() {
        return []
      },
    },
    // 默认显示地区的编码，defaultRegion和areaCode同时存在，areaCode优先，可传类似["13", "1303", "130304"]
    areaCode: {
      type: Array,
      default() {
        return []
      },
    },
    // 是否允许通过点击遮罩关闭Picker
    maskCloseAble: {
      type: Boolean,
      default: true,
    },
    // 弹出的z-index值
    zIndex: {
      type: [String, Number],
      default: 0,
    },
  },
  emits: ['update:modelValue', 'close', 'city-change'],
  data() {
    return {
      cityValue: '',
      isChooseP: false, //是否已经选择了省
      province: 0, //省级下标
      provinces: provinces,
      isChooseC: false, //是否已经选择了市
      city: 0, //市级下标
      citys: citys[0],
      isChooseA: false, //是否已经选择了区
      area: 0, //区级下标
      areas: areas[0][0],
      tabsIndex: 0,
    }
  },

  computed: {
    show: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
    isChange() {
      return this.tabsIndex > 1
    },
    genTabsList() {
      let tabsList = [
        {
          name: '请选择',
        },
      ]
      if (this.isChooseP) {
        tabsList[0]['name'] = this.provinces[this.province]['name']
        tabsList[1] = {
          name: '请选择',
        }
      }
      if (this.isChooseC) {
        tabsList[1]['name'] = this.citys[this.city]['name']
        if (!this.onlyCity) {
          tabsList[2] = {
            name: '请选择',
          }
        }
      }
      if (this.isChooseA) {
        tabsList[2]['name'] = this.areas[this.area]['name']
      }
      return tabsList
    },
    uZIndex() {
      // 如果用户有传递z-index值，优先使用
      return this.zIndex ? this.zIndex : this.$u.zIndex.popup
    },
  },
  mounted() {
    this.init()
  },

  methods: {
    init() {
      if (this.areaCode.length == 3) {
        this.setProvince('', this.areaCode[0])
        this.setCity('', this.areaCode[1])
        this.setArea('', this.areaCode[2])
      } else if (this.defaultRegion.length == 3) {
        this.setProvince(this.defaultRegion[0], '')
        this.setCity(this.defaultRegion[1], '')
        this.setArea(this.defaultRegion[2], '')
      }
    },
    setProvince(label = '', value = '') {
      this.provinces.map((v, k) => {
        if (value ? v.code == value : v.name == label) {
          this.provinceChange(k)
        }
      })
    },
    setCity(label = '', value = '') {
      this.citys.map((v, k) => {
        if (value ? v.code == value : v.name == label) {
          this.cityChange(k)
        }
      })
    },
    setArea(label = '', value = '') {
      this.areas.map((v, k) => {
        if (value ? v.code == value : v.name == label) {
          this.isChooseA = true
          this.area = k
        }
      })
    },
    close() {
      this.$emit('update:modelValue', false)
      this.$emit('close')
    },
    tabsChange(index) {
      this.tabsIndex = index
    },
    provinceChange(index) {
      this.isChooseP = true
      this.isChooseC = false
      this.isChooseA = false
      this.province = index
      this.citys = citys[index]
      this.tabsIndex = 1
    },
    cityChange(index) {
      this.isChooseC = true
      this.isChooseA = false
      this.city = index
      if (this.onlyCity) {
        let result = {}
        result.province = this.provinces[this.province]
        result.city = this.citys[this.city]
        result.area = ''
        this.$emit('city-change', result)
        this.close()
      } else {
        this.areas = areas[this.province][index]
        this.tabsIndex = 2
      }
    },
    areaChange(index) {
      if (this.onlyCity) return
      this.isChooseA = true
      this.area = index
      let result = {}
      result.province = this.provinces[this.province]
      result.city = this.citys[this.city]
      result.area = this.areas[this.area]
      this.$emit('city-change', result)
      this.close()
    },
    onSelect() {
      let result = {
        province: { name: '' },
        city: { name: '' },
        area: { name: '' },
      }
      const tabsList = this.genTabsList
      for (let i = 0; i < tabsList.length; i++) {
        if (tabsList[i].name && tabsList[i].name != '请选择') {
          if (i == 0) result.province = { name: tabsList[i].name }
          else if (i == 1) result.city = { name: tabsList[i].name }
          else result.area = { name: tabsList[i].name }
        }
      }
      this.$emit('city-change', result)
      this.close()
    },
  },
}
</script>
<style lang="scss" scoped>
.area-box {
  width: 100%;
  overflow: hidden;
  height: 800rpx;
  > view {
    width: 150%;
    transition: transform 0.3s ease-in-out 0s;
    transform: translateX(0);
    &.change {
      transform: translateX(-33.3333333%);
    }
  }
  .area-item {
    width: 33.3333333%;
    height: 800rpx;
  }

  ::v-deep .uni-scroll-view {
    scrollbar-width: unset;
  }
}
</style>
