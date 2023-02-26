<script setup lang="ts">
import QiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'

const chartData = ref({
  categories: ['实际型', '传统型', '企业型', '社会型', '艺术型', '研究型'],
  series: [
    {
      name: '分值',
      data: [155, 146, 181, 163, 143, 150],
    },
  ],
})
</script>

<template>
  <view>
    <QiunDataCharts type="radar" :tooltip-show="false" :chart-data="chartData" :opacity="1" />
  </view>
</template>
