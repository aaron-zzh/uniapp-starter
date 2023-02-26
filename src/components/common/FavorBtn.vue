<script setup lang="ts">
import useFavor from '@/hooks/favor'
const emit = defineEmits(['update:favor'])

const props = defineProps<{
  favor: boolean
  id: number
  type: string
}>()

const favor = toRef(props, 'favor')
const toastRef = ref(null)

const { toggle } = useFavor(props.type)
const toggleFavor = async () => {
  const res = await toggle(props.id)
  if (res != undefined) {
    favor.value = res
    console.log('toggleFavor', res)
    emit('update:favor', res)
    toastRef.value.show({
      title: res ? '已收藏' : '已取消',
      icon: 'none',
      position: 'top',
    })
  }
}
</script>

<template>
  <view class="favor-btn" @click="toggleFavor">
    <u-icon v-if="favor" name="star-fill" :size="40" color="#ff9900"></u-icon>
    <u-icon v-else name="star" :size="40" color="#666"></u-icon>
    <view>{{ favor ? '已收藏' : '收藏' }}</view>
    <u-toast ref="toastRef" />
  </view>
</template>

<style lang="scss" scoped>
.favor-btn {
  margin: 0 12px;
  display: flex;
  width: 36px;
  flex-direction: column;
  align-items: center;
}
</style>
