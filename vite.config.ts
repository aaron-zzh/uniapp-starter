import path from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { convertEnv } from './build/utils'

import { createViteProxy } from './build/config'
import { setupVitePlugins } from './build/plugins'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = convertEnv(loadEnv(mode, root))
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_USE_PROXY, VITE_PROXY_TYPE } = env
  return {
    base: VITE_PUBLIC_PATH,
    plugins: setupVitePlugins(),
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
      port: VITE_PORT,
      open: false,
      proxy: createViteProxy(VITE_USE_PROXY, VITE_PROXY_TYPE as ProxyType),
    },
  }
})
