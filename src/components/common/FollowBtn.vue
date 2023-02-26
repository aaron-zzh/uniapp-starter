<script setup lang="ts">
import useFavor from '@/hooks/favor'

const emit = defineEmits(['update:followed'])

const props = defineProps<{
  followed: boolean
  id: number
  type: string
}>()

const followed = toRef(props, 'followed')

const { toggle } = useFavor(props.type)
const toggleFavor = async () => {
  const res = await toggle(props.id)
  if (res != undefined) {
    followed.value = res
    emit('update:followed', res)
  }
}

const customStyle = computed(() => {
  return {
    width: '55px',
    padding: followed.value ? '0 10px' : '0 16px',
    color: followed.value ? '#999' : '#3c9cff',
    background: followed.value ? '#eee' : 'rgba(58, 155, 241, 0.2)',
    border: 'none',
  }
})

const toggleFollow = () => {
  if (followed.value) {
    uni.showModal({
      title: '提示',
      content: '确定取消关注?',
      success(res) {
        if (res.confirm) {
          toggleFavor()
        }
      },
    })
  } else {
    toggleFavor()
  }
}
</script>

<template>
  <view class="follow-btn">
    <u-button
      size="mini"
      :hair-line="false"
      shape="circle"
      :type="followed ? 'info' : 'primary'"
      :custom-style="customStyle"
      @click="toggleFollow"
    >
      {{ followed ? '已关注' : '关注' }}
    </u-button>
  </view>
</template>

<style lang="scss" scoped>
.follow-btn {
  margin: 6px;
}
</style>
