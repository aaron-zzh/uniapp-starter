# Uniapp Starter

<h1 align="center">
  基于 Uniapp + Vue3 + Ts 的移动端跨平台快速开发脚手架
</h1>

## 技术选型

- [Vue3](https://cn.vuejs.org/) Web 前端框架，组合式 API `<script setup lang="ts">`
- [Typescript](https://www.typescriptlang.org/) 在 JavaScript 的基础上添加静态类型。
- [Vite4](https://cn.vitejs.dev/) 前端工具链
- [vk-uview-ui](https://vkuviewdoc.fsq.pub/) 支持 Vue3 的 uview 组件库
- [Pinia](https://pinia.vuejs.org/) 状态管理
- [VueUse](https://vueuse.org/) 基于 Composition API的实用函数集合、hooks。
- [UnoCSS](https://github.com/antfu/unocss) 即时按需原子CSS引擎
- [ucharts](https://www.ucharts.cn/) 跨平台图表
- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) 自动本地导入组件
- [Auto import](https://github.com/antfu/unplugin-auto-import) 自动导入常用 API，无需显式 `import { computed, ref } from 'vue'`
- [ESLint](https://eslint.org/) 支持保存自动代码格式化
- [husky](https://typicode.github.io/husky/#/) Git 提交 hooks, 自动执行脚本
  - [lint-staged](https://github.com/okonet/lint-staged) 提交时仅检查暂存区代码，代码检查通过才能提交
  - [commitlint](https://commitlint.js.org/#/) 提交规范检查，Commit message 需要符合规范才能提交
- [vuepress-theme-hope](https://theme-hope.vuejs.press/zh) vuepress 主题，生成静态文档网站
- 使用 px 作为尺寸单位, rpx 不支持动态横竖屏切换计算
- 封装分页(userPager)、加载(useLoading) 、scrollColor 等 hooks，提高复用
- 添加组件库：tmui、nutui、firstui 示例
- 集成芋道商城手机端【TODO】

## 目录结构

```
├── .vscode          — VSCode 编辑器、代码片段、推荐扩展等
├── .husky           — 代码格式、提交规范自动检查
├── mock-api/        — 基于 Fastify 的极简 api mock
├── src/             — 前端源码
│   ├── api/         — api 接口
│   ├── components/  — 自定义组件
│   ├── hooks/       — 自定义 hooks
│   ├── pages/       — uniapp 页面
│   ├── plugins/     — 自定义 Vue3 插件
│   ├── static/      — 图片、公共样式
│   ├── store/       — 基于 Pinia 的状态管理
│   ├── uni_modules/ — 组件库
│   ├── utils/       — 常用工具函数
│   ├── config.ts    — 应用配置
│   ├── pages.json   — 页面路由
│   ├── auto-imports.d.ts — unplugin-auto-import 自动生成
│   ├── manifest.json     — uniapp 配置，如，小程序id、web 路由模式等
│   ├── uni.scss          — uniapp 样式变量
│   ├── permission.ts     — uniapp 拦截器
│   └── ...         — 其他.
├── .env            — 环境变量 (development 开发、production 生产)
├── vite.config     — vite 设置
├── unocss.config   — unocss 设置
├── package.json    — 依赖
└── ...             — 其他.
```

## 依赖

- [Node.js](https://nodejs.org/) >= V18
- [VS Code](https://code.visualstudio.com/) 及 [推荐扩展](.vscode/extensions.json)
- [pnpm](https://pnpm.io/)

## 快速开始

准备：

1. nvm
2. 安装 nodejs
3. 安装 pnpm `npm install -g pnpm`
4. 设置别名:

```powershell
notepad $profile.AllUsersAllHosts
set-alias -name pn -value pnpm
```

### 启动开发

```bash
pn install                  # 安装依赖
pn run dev:h5               # H5 开发调试
```

支持 VSCode F5 一键启动 H5 开发模式

## 部署

打包前确认各项参数配置、环境变量

```bash
pnpm run build:h5               # H5 打包到 ./dist/build/h5
```

## 参考

- [Vue3 开发指南](https://cn.vuejs.org/guide/introduction.html)
- [UnoCSS 工具](https://uno.antfu.me/)
- [uview 组件库 v1](https://v1.uviewui.com/)
- [uniapp 官网](https://uniapp.dcloud.net.cn/)
- [Pinia 状态](http://pinia.cc/docs/introduction.html)

## 升级

```bash
$ npx @dcloudio/uvm@latest   # 升级 uniapp
$ pnpm update         # 升级所有依赖的版本
```
