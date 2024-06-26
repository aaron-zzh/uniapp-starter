import { createSSRApp } from 'vue'
import uView from './uni_modules/vk-uview-ui'
import tmui from './tmui'
import i18nPlugin from './plugins/i18n'
import config from './config'
import App from './App.vue'
import { setupPinia } from './store'

import 'virtual:uno.css'

// import VConsole from 'vconsole'
export function createApp() {
  const app = createSSRApp(App)
  // if (process.env.NODE_ENV === 'development') {
  //   // const vConsole = new VConsole()
  // } else {
  //   const vConsole = new VConsole()
  //   console.log('生产环境')
  // }
  console.log(ROUTES)
  app.use(config)
  app.use(i18nPlugin, {
    greetings: {
      hello: '你好!',
    },
    public: '公共',
  })

  app.use(uView)
  setupPinia(app)
  app.use(tmui, { shareDisable: false } as Tmui.tmuiConfig)
  return {
    app,
  }
}
