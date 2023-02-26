import { createSSRApp } from 'vue'
import uView from './uni_modules/vk-uview-ui'
import i18nPlugin from './plugins/i18n'
import config from './config'
import App from './App.vue'
import store from './store'
import 'uno.css'
// import VConsole from 'vconsole'

export function createApp() {
  const app = createSSRApp(App)
  // if (process.env.NODE_ENV === 'development') {
  //   // const vConsole = new VConsole()
  // } else {
  //   const vConsole = new VConsole()
  //   console.log('生产环境')
  // }

  app.use(config)
  app.use(i18nPlugin, {
    greetings: {
      hello: '你好!',
    },
    public: '公共',
  })

  app.use(uView)
  app.use(store)
  return {
    app,
  }
}
