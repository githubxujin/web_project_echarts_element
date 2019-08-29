import store from '../store/index';
import config from '../base-config';
let ws = null;
function initWebSocket(params, callback, url) {
    let token = store.getters.getTokenInfo;
    let webSocketUrl =
        url.indexOf('ws:') != -1 ? url : config.webSocketPrefix + url;
    ws =
        'MozWebSocket' in window
            ? new MozWebSocket(webSocketUrl)
            : new WebSocket(webSocketUrl);
    ws.onmessage = function(e) {
        //连接成功信息不存name属性
        console.log('onmessage', e);
        if (
            !e.data ||
            e.data == '{} from server' ||
            e.data == '{"shopNumbers":""} from server' ||
            e.data.indexOf('from server') != -1
        )
            return;
        try {
            let res = JSON.parse(e.data); //在这里解析，门店报警信息报警时间被解析之后赋值为空
            if (res) {
                if (res.name != '综合报警信息') {
                    callback && callback(res);
                } else {
                    callback && callback(JSON.stringify(JSON.parse(e.data)));
                }
            }
        } catch (error) {
            console.log('error :', error);
        }
    };
    ws.onclose = function(e) {
        console.log('close');
    };
    ws.onopen = function() {
        console.log('连接成功');
        if (params) {
            ws.send(JSON.stringify(params));
            console.log('webSocket发送参数为', params);
        }
    };
    ws.onerror = function(event) {
        console.log('WebSocket连接发生错误', event);
        //连接建立失败重连
        let _self = this;
        window.setTimeout(function() {
            _self.readyState === 3 && _self.onopen();
        }, 1000);
    };
    return ws; //返回这个对象便于后续发送参数
}
/**
 * 发送消息
 * @param {} ws
 * @param {*} data
 */
function sendWsData(ws, data) {
    if (ws.readyState === ws.OPEN) {
        wsSend(data);
    } else if (ws.readyState === ws.CONNECTING) {
        setTimeout(function() {
            sendWsData(data);
        }, 1000);
    } else {
        setTimeout(function() {
            sendWsData(data);
        }, 1000);
    }
}
function wsSend(data) {
    console.log('webSocket1发送参数为', data);
    ws.send(JSON.stringify(data));
}
export { initWebSocket, sendWsData };
