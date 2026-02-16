import { Client } from '@stomp/stompjs'
import { Button } from '@tarojs/components'
// ↓ 下面这行引入 mp-websocket-polyfill。
import Ws from 'mp-websocket-polyfill'
// ↓ 下面这行引入 polyfill，解决真机运行时 TextEncoder、TextDecoder 的问题，推荐写在项目入口处
import 'mp-websocket-polyfill/text-codec-polyfill'
import { useRef } from 'react'

export default function StompPage() {
  const clientRef = useRef<Client>()

  const connect = () => {
    const client = new Client({
      heartbeatOutgoing: 1000,

      onConnect() {
        wx.showToast({ title: '连接成功', icon: 'none' })

        // 接收订阅特定 path 的消息
        client.subscribe('/topic/greetings', message => {
          console.log(`★ 收到消息:\n${message.body}`)
        })

        // 发送特定 path 的消息
        client.publish({
          destination: '/app/hello',
          body: JSON.stringify({ name: 'Test' }),
        })
      },

      onDisconnect() {
        wx.showToast({ title: '已断开', icon: 'none' })
      },

      // 开启调试
      debug: console.log,

      webSocketFactory() {
        // 注意 ↓ 此处使用 mp-websocket-polyfill
        return new Ws({
          url: 'ws://localhost:8080/gs-guide-websocket', // ← 真机调试时，可能无法使用 localhost
          timeout: 30000,
          protocols: ['v12.stomp', 'v11.stomp', 'v10.stomp'], // ← 这是 stomp 协议的默认写法，可供参考
        })
      },
    })

    client.activate()

    clientRef.current = client
  }

  const disconnect = () => {
    clientRef.current?.deactivate()
  }

  return (
    <view>
      <Button onClick={connect}>点我连接</Button>
      <Button onClick={disconnect}>点我关闭</Button>
    </view>
  )
}
