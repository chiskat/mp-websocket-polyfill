# `mp-websocket-polyfill`

> 这是一个 monorepo 仓库，包含了 `mp-websocket-polyfill` 和与它相关的包。

# 起步

```bash
# 安装依赖。注意必须使用 pnpm
pnpm i

# 启动示例小程序
# 执行后，打开小程序开发工具 > 导入项目，目录 /packages/sample-mp-taro/dist
pnpm run mp

# 编译构建 mp-websocket-polyfill
pnpm run build
```

# Stomp 服务端示例

建议从 [https://spring.io/guides/gs/messaging-stomp-websocket/](https://spring.io/guides/gs/messaging-stomp-websocket/) 获取 Stomp 服务端。

它可以至少兼容到 Java 8，且可以直接在 VSCode 中编译运行。

VSCode 需提前安装 [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) 插件；运行时请从 `complete` 包中运行，不要从 `initial` 包运行，项目启动后访问 [http://localhost:8080](http://localhost:8080) 可以看到 Stomp 服务端提供的测试网页。

# `mp-websocket-polyfill` [![npm](https://img.shields.io/npm/v/mp-websocket-polyfill)](https://www.npmjs.com/package/mp-websocket-polyfill)

适用于微信小程序的 Polyfill，使小程序的 [`SocketTask`](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html) 兼容浏览器端的 [`WebSocket`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)，这样便可以使用 [`Stomp.js`](https://github.com/stomp-js/stompjs) 等库。

[查看文档](./packages/mp-websocket-polyfill/README.md)

# `sample-mp-taro`

基于 Taro 的小程序示例项目，用于测试 `mp-websocket-polyfill` 是否能正常工作。

相关代码位于 [/packages/sample-mp-taro/src/pages/index/index.tsx](./packages/sample-mp-taro/src/pages/index/index.tsx)。
