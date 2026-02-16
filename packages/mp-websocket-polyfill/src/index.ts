export interface WsConstructorOptions
  extends MpWebsocketPolyfillConstructorOptions, WechatMiniprogram.ConnectSocketOption {}

interface MpWebsocketPolyfillConstructorOptions {
  /**
   * 是否修复 iOS 微信接收到 Stomp 消息时可能因遗漏末尾 0x00 字符而导致解析失败的问题，默认 `true`
   *
   * @see https://developers.weixin.qq.com/community/develop/article/doc/00028457db8230ae22ebb525e56c13
   * @default true
   */
  fixIOSWechat0x00Issue?: boolean
}

const defaultWsConstructorOptions: MpWebsocketPolyfillConstructorOptions = {
  fixIOSWechat0x00Issue: true,
}

export default class Ws {
  public socketTask?: WechatMiniprogram.SocketTask

  public readyState: number = 3
  public url: string

  public onopen?: Function
  public onclose?: Function
  public onerror?: Function
  public onmessage?: Function

  protected _options: MpWebsocketPolyfillConstructorOptions

  constructor(options: WsConstructorOptions) {
    this._options = { ...defaultWsConstructorOptions, ...options }
    this.readyState = 0
    this.socketTask = wx.connectSocket(options)
    this.url = options.url

    this.socketTask.onOpen(() => {
      this.readyState = 1
      this.onopen?.()
    })

    this.socketTask.onClose(() => {
      this.readyState = 3
      this.onclose?.()
    })

    this.socketTask.onError(() => {
      this.readyState = 3
      this.onerror?.()
    })

    this.socketTask.onMessage((message: any) => {
      // iOS 小程序真机可能会丢失末尾 0x00 字符导致解析失败，此处修复
      // 参考：https://developers.weixin.qq.com/community/develop/article/doc/00028457db8230ae22ebb525e56c13
      if (this._options.fixIOSWechat0x00Issue && message && message.data) {
        const messageValue = message.data
        const lastChar = messageValue.charCodeAt(messageValue.length - 1)

        if (lastChar !== 0x00) {
          message.data = messageValue + String.fromCharCode(0x00)
        }
      }
      this.onmessage?.(message)
    })
  }

  send(data: any) {
    this.socketTask?.send({ data })
  }

  close(code?: number, reason?: string) {
    this.socketTask?.close({ code, reason })
  }
}
