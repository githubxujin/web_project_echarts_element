export default {
    data() {
        return {
            websocket: null,
            webSocketData: null,
            websocketParams: {},
            websocketTime: null
        }
    },
    methods: {
        initWebSocket(uri = '/ws/digital-signage-ws/websocket') {
            //初始化weosocket
            const wsuri = `ws://${process.env.BASE_IP}${uri}`
            const token = this.$store.getters.getTokenInfo
            this.websocket =
                'MozWebSocket' in window
                    ? new MozWebSocket(wsuri)
                    : new WebSocket(wsuri)
            this.websocket.onopen = () => {
                this.websocket.send(
                    JSON.stringify({
                        shopNumber: this.$store.getters.shopNumber
                    })
                )
                this.websocketTime = setInterval(_ => {
                    this.websocket.send(JSON.stringify(this.websocketParams))
                }, 20000)
            }
            this.websocket.onmessage = res => {
                this.refresh(JSON.parse(res.data))
                // this.webSocketData = JSON.parse(res.data)
            }
            this.websocket.onerror = () => {
                //连接建立失败重连
                let _self = this
                window.setTimeout(function() {
                    _self.websocket.readyState === 3 && _self.initWebSocket(uri)
                }, 1000)
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        this.websocket && this.websocket.close()
        this.websocketTime && clearInterval(websocketTime)
        next()
    }
}
