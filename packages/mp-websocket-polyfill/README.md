# `mp-websocket-polyfill`

[![npm](https://img.shields.io/npm/v/mp-websocket-polyfill)](https://www.npmjs.com/package/mp-websocket-polyfill) [![NPM Downloads](https://img.shields.io/npm/dm/mp-websocket-polyfill.svg?style=flat)](https://npmcharts.com/compare/mp-websocket-polyfill?minimal=true)

适用于微信小程序的 Polyfill，使小程序的 [`SocketTask`](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html) 兼容浏览器端的 [`WebSocket`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)，这样便可以使用 [`Stomp.js`](https://github.com/stomp-js/stompjs) 等库。

# 安装

```bash
npm add mp-websocket-polyfill
```

# 使用方式

原先的 WebSocket 用法：

```typescript
const socketTask = wx.connectSocket({
  url: 'localhost:8080/ws',
  // ...其他参数
})
```

改写为：

```typescript
import Ws from 'mp-websocket-polyfill'
import 'mp-websocket-polyfill/text-codec-polyfill'

const webSocket = new Ws({
  url: 'localhost:8080/ws',
  // ...其他参数，和 wx.connectSocket 保持一致
})
```

然后这个 `webSocket` 对象便可以在只支持浏览器端 `WebSocket` 的地方使用了。

## 为什么需要 `import 'mp-websocket-polyfill/text-codec-polyfill'`

在微信小程序开发工具中，代码能正常运行；但是，在手机端 “预览” 或 “真机调试” 时，会遇到以下报错：

```
MiniProgramError
Can't find variable: TextEncoder
```

因为微信手机端小程序没有 `TextEncoder` 和 `TextDecoder`，因此需要引入这个 Polyfill。

引入这个 Polyfill 会增加代码包的体积。如果你使用的开发框架或其他库解决了此问题，或是微信小程序后续的更新默认提供了这些 API，那么可以不用导入这个 Polyfill。

## 实际用例：配合 `Stomp.js` 使用

```typescript
import { Client } from '@stomp/stompjs'
import Ws from 'mp-websocket-polyfill'

const client = new Client({
  // ↓ 请使用 webSocketFactory 修改默认的 websocket 构造器
  webSocketFactory() {
    return new Ws({
      url: 'ws://localhost:8080/gs-guide-websocket',
      protocols: ['v12.stomp', 'v11.stomp', 'v10.stomp'], // ← 这是 stomp 协议的默认写法，可供参考
    })
  },
})

client.activate()
```

# 注意事项

注意事项：

- 使用此 Polyfill 构造的实例，原先小程序自带的 API 例如 `onOpen`、`onClose` 均被屏蔽无法使用，但是可以通过新实例 `.socketTask` 属性获取小程序原生的 `SocketTask` 对象；
- 如果使用 Stomp，建议参考上面的示例，有时 `protocols` 也要配置正确。

# API

- `new Ws(options)`：兼容微信小程序的 `wx.connectSocket()` 的参数，提供额外的配置字段：
  - `fixIOSWechat0x00Issue`：默认为 `true`（`boolean` 类型），是否修复 iOS 微信接收到 Stomp 消息时可能因遗漏末尾 0x00 字符而导致解析失败的问题；
- `ws.socketTask`：通过实例的这个属性，可以获取原生的小程序 `socketTask` 对象。
