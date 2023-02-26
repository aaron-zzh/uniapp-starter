/* eslint-disable @typescript-eslint/no-explicit-any */
export default {
  install: (app: any, options: any) => {
    // 注入一个全局可用的 $translate() 方法
    app.config.globalProperties.$translate = (key: string) => {
      if (!key) return '无'
      // 获取 `options` 对象的深层属性
      // 使用 `key` 作为索引
      return key.split('.').reduce((o: { [x: string]: any }, i: string | number) => {
        if (o) return o[i]
      }, options)
    }

    app.provide('i18n', options)
  },
}
