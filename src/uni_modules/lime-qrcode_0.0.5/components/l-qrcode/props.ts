// @ts-nocheck
// import type { PropType } from './vue'
export default {
	value: String,
	icon: String,
	size: {
		type: [Number, String],
		default: 160
	},
	iconSize: {
		type: [Number, String],
		default: 40
	},
	marginSize: [Number, String],
	color: {
		type: String,
		default: '#000'
	},
	bgColor: {
		type: String,
		default: 'transparent'
	},
	bordered: {
		type: Boolean,
		default: true
	},
	errorLevel: {
		type: String as PropType<'L'|'M'|'Q'|'H'>,
		default: 'M' // 'L' | 'M' | 'Q' | 'H'
	},
	useCanvasToTempFilePath: Boolean
	// status: {
	// 	type: String as PropType<'active'|'expired'|'loading'>,
	// 	default: 'active' // active | expired | loading
	// }
}