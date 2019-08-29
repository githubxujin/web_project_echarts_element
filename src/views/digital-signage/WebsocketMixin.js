export default {
    data() {
        return {
            websocket: null,
            webSocketData: null,
            websocketParams: {}
        };
    },
    methods: {
        initWebSocket(uri = '/ws/digital-signage-ws/websocket') {
            //初始化weosocket
            const wsuri = `ws://${process.env.BASE_IP}${uri}`;
            const token = this.$store.getters.getTokenInfo;
            this.websocket =
                'MozWebSocket' in window
                    ? new MozWebSocket(wsuri)
                    : new WebSocket(wsuri);
            this.websocket.onopen = () => {
                this.websocket.send(this.websocketParams);
            };
            this.websocket.onmessage = res => {
                this.webSocketData = JSON.parse(res.data);
            };
            this.websocket.onerror = () => {
                //连接建立失败重连
                let _self = this;
                window.setTimeout(function() {
                    _self.websocket.readyState === 3 &&
                        _self.initWebSocket(uri);
                }, 1000);
            };
        }
    },
    beforeRouteLeave(to, from, next) {
        this.websocket.close();
        next();
    }
};
