<script setup lang="ts">
const props = defineProps<{
  url?: string
  emptyImg: string
  width?: string
  height?: string
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config = inject('config') // 注入

const imageUrl = computed(() => {
  if (props.url) {
    return config.domain + props.url
  } else {
    return config.oss + props.emptyImg
  }
})
</script>

<template>
  <u-image :width="width ? width : '100%'" :height="height ? height : '200px'" :src="imageUrl"></u-image>
</template>

<style lang="scss" scoped></style>
