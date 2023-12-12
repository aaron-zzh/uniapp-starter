<template>
	<view class="l-qrcode" :style="[styles]">
		<!-- #ifndef APP-NVUE -->
		<canvas :style="styles" type="2d" :canvas-id="canvasId" :id="canvasId"></canvas>
		<!-- #endif  -->
		<!-- #ifdef APP-NVUE  -->
		<web-view 
		ref="qrcodeRef"
		@pagefinish="onFinished" 
		@error="onError" 
		@onPostMessage="onMessage"
		:style="styles" src="/uni_modules/lime-qrcode/hybrid/html/index.html?v=1"></web-view>
		<!-- #endif  -->
		<!-- <view class="l-qrcode-mask" v-if="['loading', 'expired'].includes(props.status)">
			<l-loading v-if="props.status == 'loading'"></l-loading>
			<view class="l-qrcode-expired" v-if="props.status == 'expired'">
				<slot></slot>
			</view>
		</view> -->
	</view>
</template>
<script lang="ts">
	// @ts-nocheck
	import { computed, defineComponent, getCurrentInstance, watch, onUnmounted, onMounted } from './vue';
	import QRCodeProps from './props'
	// #ifndef APP-NVUE
	import { getCanvas, isCanvas2d } from './useCanvas'
	import { QRCodeCanvas } from './qrcode';
	// #endif
	import { addUnit } from '@/uni_modules/lime-shared/addUnit'
	import { createImage } from '@/uni_modules/lime-shared/createImage'
	import { unitConvert } from '@/uni_modules/lime-shared/unitConvert'
	import { isBase64 } from '@/uni_modules/lime-shared/isBase64'
	import { pathToBase64 } from '@/uni_modules/lime-shared/pathToBase64'
	import { debounce } from '@/uni_modules/lime-shared/debounce'
	const name = 'l-qrcode'
	export default defineComponent({
		name,
		props: QRCodeProps,
		emits: ['success'],
		setup(props, {emit}) {
			const context = getCurrentInstance();
			const canvasId = `l-qrcode${context.uid}` 
			const styles = computed(() => `width: ${addUnit(props.size)}; height: ${addUnit(props.size)};`)
			let qrcode = null
			let canvas = null
			const qrCodeProps = computed(() => {
				const { value, icon, size, color, bgColor, bordered, iconSize, errorLevel, marginSize } = props
				const imageSettings = {
					src: icon,
					x: undefined,
					y: undefined,
					height: unitConvert(iconSize),
					width: unitConvert(iconSize),
					excavate: true,
				}
				return {
					value: value,
					size: unitConvert(size),
					level: errorLevel,
					bgColor,
					fgColor: color,
					imageSettings: icon ? imageSettings : undefined,
					includeMargin: bordered,
					marginSize: unitConvert(marginSize)
				}

			})
			
			// #ifdef APP-NVUE
			const stacks = new Map()
			// #endif
			const canvasToTempFilePath = debounce((args: UniNamespace.CanvasToTempFilePathRes) => {
				if(!canvas) return
				// #ifndef APP-NVUE
				const copyArgs = Object.assign({
					canvasId,
					canvas: null
				}, args)
				
				if (isCanvas2d) {
					copyArgs.canvas = canvas
				}
				if ('toTempFilePath' in canvas) {
					canvas.toTempFilePath(copyArgs)
				} else {
					uni.canvasToTempFilePath(copyArgs, context);
				}
				// #endif
				// #ifdef APP-NVUE
				if(!stacks.size) {
					const flie = 'file-' + Math.random();
					const stack = {args, time: +new Date()}
					stacks.set(`${flie}`, stack)
					canvas.toDataURL(flie)
					setTimeout(() => {
						const stack = stacks.get(flie)
						if(stack && 'fail' in stack.args) {
							stack.args.fail({
								error: '超时'
							})
							stacks.delete(flie)
						}
					},5000)
				} 
				// #endif
			})
			const useCanvasToTempFilePath = () => {
				if(props.useCanvasToTempFilePath) {
					canvasToTempFilePath({
						success(res: UniNamespace.CanvasToTempFilePathRes) {
							emit('success', res.tempFilePath)
						}
					})
				}
			}
			// #ifdef APP-NVUE
			const onFinished = () => {
				const { pixelRatio } = uni.getSystemInfoSync()
				canvas = {
					toDataURL(flie: string) {
						const ref: any = context.refs['qrcodeRef'];
						if(ref) {
							ref?.evalJS(`toDataURL('${flie}')`)
						}
					}
				};
				qrcode = {
					async render(props: any) {
						const ref: any = context.refs['qrcodeRef'];
						const { src } = props.imageSettings || { };
						if(!ref) return
						if(src && !isBase64(src) && !/^http/.test(src) && /^\/static/.test(src)) {
							props.imageSettings.src = await pathToBase64(src)
						}
						const _props = JSON.stringify(Object.assign({}, props, {pixelRatio}));
						ref?.evalJS(`render(${_props})`);
					}
				}
				qrcode.render(qrCodeProps.value)
				useCanvasToTempFilePath()
			}
			const onError = () => {
				console.warn('lime-qrcode 加载失败')
			}
			const onMessage = (e: any) => {
				const {detail:{data: [res]}} = e
				if(res.event == 'toDataURL') {
					const {file, image, msg} = res.data;
					const stack = stacks.get(file)
					if(stack && image && 'success' in stack.args) {
						stack.args.success({tempFilePath: image})
						stacks.delete(file)
					} else if(stack && 'fails' in stack.args) {
						stack.args.fail({error: msg})
						stacks.delete(file)
					}
				} 
			}
			// #endif
			const propsWatch = watch(props, () => {
				if (qrcode) {
					qrcode.render(qrCodeProps.value)
					useCanvasToTempFilePath()
				}
			})
			onMounted(() => {
				// #ifndef APP-NVUE
				getCanvas(canvasId, { context }).then(res => {
					canvas = res
					qrcode = new QRCodeCanvas(res, {
						// #ifdef H5
						path2D: false,
						// #endif
						pixelRatio: isCanvas2d ? uni.getSystemInfoSync().pixelRatio : 1,
						createImage
					})
					qrcode.render(qrCodeProps.value)
					useCanvasToTempFilePath()
				})
				// #endif
			})
			onUnmounted(() => {
				propsWatch && propsWatch()
			})
			return {
				canvasId,
				styles,
				props,
				canvasToTempFilePath,
				
				// #ifdef APP-NVUE
				onFinished,
				onError,
				onMessage
				// #endif
			}
		}
	})
</script>
<style lang="scss">
	.l-qrcode {
		position: relative;

		&-mask {
			position: absolute;
			inset: 0;
			// inset-block-start: 0;
			// inset-inline-start: 0;
			z-index: 10;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// width: 100%;
			// height: 100%;
			color: rgba(0, 0, 0, 0.88);
			line-height: 1.5714285714285714;
			background: rgba(255, 255, 255, 0.96);
			text-align: center;
		}
	}
</style>