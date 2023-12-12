import presetWeapp from 'unocss-preset-weapp'
import { transformerAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss'
import { transformerDirectives } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import presetChinese from 'unocss-preset-chinese'

export default defineConfig({
  presets: [
    // docs: https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      whRpx: true,
    }),
    presetChinese(),
    presetIcons({}),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'custom-cover': 'relative flex',
      'cover-image': 'flex-1 h-300',
      'cover-text': 'absolute bottom-0 text-16px h-30px lh-30px bg-black bg-op-20 w-100%',
    },
  ],
  transformers: [
    // https://github.com/unocss/unocss/tree/main/packages/transformer-directives
    transformerDirectives(),
    // docs: https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify({
      nonValuedAttribute: true, // 以支持在小程序中使用 attributify mode, 例如 <button bg="blue-400"></button>
    }),

    // docs: https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
})
