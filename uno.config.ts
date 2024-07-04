import presetWeapp from 'unocss-preset-weapp'
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
const { presetWeappAttributify, transformerAttributify } = extractorAttributify()
import { defineConfig } from 'unocss'
import { transformerDirectives } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import presetChinese from 'unocss-preset-chinese'
import { unoPresets } from './uno-presets'

export default defineConfig({
  presets: [
    // docs: https://github.com/MellowCo/unocss-preset-weapp
    unoPresets,
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(),
    // attributify autocomplete
    presetWeappAttributify(),
    presetChinese(),
    presetIcons({}),
  ],
  transformers: [
    // https://github.com/unocss/unocss/tree/main/packages/transformer-directives
    transformerDirectives(),
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
})
