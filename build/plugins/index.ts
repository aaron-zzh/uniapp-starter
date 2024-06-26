import path from 'node:path'
import type { PluginOption } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import UniComponents from '@uni-helper/vite-plugin-uni-components'
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import uniReadPagesV3Plugin from '../../src/utils/router/utils/uni-read-pages-v3.js'
import { NutResolver } from 'nutui-uniapp'
import { getRootPath } from '../utils'

export function setupVitePlugins(): PluginOption[] {
  const plugins = [
    // 自动导入本地组件
    Components({
      // 指定组件位置，默认是src/components
      dirs: ['src/components'],
      deep: true, //search for subdirectories
      // ui库解析器
      // resolvers: [ElementPlusResolver()],
      extensions: ['vue'],
      // 配置文件生成位置
      dts: 'src/components.d.ts',
    }),
    UniComponents({
      resolvers: [NutResolver()], // 导入nutui
    }),
    uni.default(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'uni-app',
        {
          'nutui-uniapp/composables': [
            // 在这里添加需要自动导入的API
            'useToast',
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
    UnoCSS(),
    viteCompression({
      threshold: 10240, // 10K
    }),
    uniReadPagesV3Plugin({
      pagesJsonDir: path.resolve(getRootPath(), './src/pages.json'),
      includes: ['path', 'aliasPath', 'name', 'meta'],
    }),
  ]
  return plugins
}
