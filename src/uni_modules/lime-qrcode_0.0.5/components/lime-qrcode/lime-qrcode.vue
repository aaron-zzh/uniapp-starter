<template>
	<demo-block title="QRCode" type="ultra">
		<demo-block title="基础">
			<l-qrcode value="https://limeui.qcoon.cn" size="300rpx"></l-qrcode>
		</demo-block>
		<demo-block title="icon">
			<view style="display: flex; gap: 10px">
				<image v-if="image" :src="image" style="width: 300rpx;" mode="widthFix"></image>
				<l-qrcode ref="qrcodeRef" value="https://limeui.qcoon.cn" size="300rpx" icon="https://img10.360buyimg.com/img/jfs/t1/182127/16/37474/11761/64659c31F0cd84976/21f25b952f03a49a.jpg" iconSize="70rpx"></l-qrcode>
				<l-qrcode useCanvasToTempFilePath @success="success" value="https://limeui.qcoon.cn" size="300rpx" icon="https://img10.360buyimg.com/img/jfs/t1/182127/16/37474/11761/64659c31F0cd84976/21f25b952f03a49a.jpg" iconSize="70rpx"></l-qrcode>
			</view>
			<button @click="onClick">生成图片</button>
		</demo-block>
		<demo-block title="颜色">
			<view style="display: flex; gap: 10px">
				<l-qrcode value="https://limeui.qcoon.cn" size="300rpx" color="rgb(82,196,26)"></l-qrcode>
				<l-qrcode value="https://limeui.qcoon.cn" size="300rpx" color="rgb(22,119,255)" bgColor="rgb(245,245,245)"></l-qrcode>
			</view>	
		</demo-block>
		<demo-block title="纠错比例">
			<l-qrcode value="img10.360buyimg.com/img/jfs/t1/182127/16/37474/11761/64659c31F0cd84976/21f25b952f03a49a.jpg" size="300rpx" :errorLevel="levels[index]"></l-qrcode>
			<button @click="onToggle">切换纠错等级：{{levels[index]}}</button>
		</demo-block>
		<demo-block title="动态">
			<l-qrcode :value="text" size="300rpx" marginSize="5rpx" bgColor="white"></l-qrcode>
			<button @click="update">更新</button>
		</demo-block>
	</demo-block>
</template>
<script>
	import {ref, defineComponent} from '../l-qrcode/vue'
	export default defineComponent({
		setup() {
			const qrcodeRef = ref(null)
			const image = ref(null)
			const text = ref('qcoon.com.cn')
			const levels = ['L', 'M', 'Q', 'H']
			let index = ref(0)
			const onToggle = () => {
				index.value++
				index.value = index.value % levels.length
			}
			const onClick = () => {
				if(qrcodeRef.value) {
					qrcodeRef.value.canvasToTempFilePath({
						success(res) {
							image.value = res.tempFilePath
							console.log('success:::', res)
						},
						fail(err) {
							console.log('err:::', err)
						}
					})
				}
			}
			const success = (res) => {
				console.log('res', res)
			}
			
			const update = () =>{
				text.value =  `qcoon.cn?v=${Math.random()}`
			}
			
			return {
				levels,
				index,
				image,
				text,
				qrcodeRef,
				onClick,
				update,
				success,
				onToggle,
			}
		}
	})
</script>
<style>
</style>
