import path from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_API_BASE_URL } = env
  return {
    base: VITE_PUBLIC_PATH,
    plugins: [
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
      uni(),
      AutoImport({
        imports: ['vue', '@vueuse/core', 'uni-app'],
        dts: 'src/auto-imports.d.ts',
        vueTemplate: true,
      }),
      Unocss(),
      viteCompression({
        threshold: 10240, // 10K
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(root, './src'),
        },
      ],
    },
    server: {
      host: true,
      port: Number(VITE_PORT),
      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        '^/api/v1': {
          target: 'http://localhost:3000', // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: (path) => path.replace(/^\/api\/v1/, ''),
        },
      },
    },
  }
})
