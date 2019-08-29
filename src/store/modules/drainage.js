import { log } from 'util';

/** 给排水模块 */
const state = {
    websocket: null, // websocket实例
    drainageSystem: null, // 给水系统数据
    supplySystem: null // 排水系统数据
};

const mutations = {
    updateWebsocket (state, data) {
        state.websocket = data;
    },
    updateDrainage (state, data) {
        state.drainageSystem = data;
        console.log('更新排水数据：', data);
    },
    updateSupply (state, data) {
        state.supplySystem = data;
        console.log('更新给水数据：', data);
    }
};
const getters = {
    getWebsocket: state => {
        return state.websocket;
    },
    getDrainageSystem: state => {
        return state.drainageSystem;
    },
    getSupplySystem: state => {
        return state.supplySystem;
    }
};
const actions = {
    initWebsocket (context, data) {
        context.state.websocket && context.state.websocket.close(); // 先关闭
        const uri = data.uri;
        const params = data.params;
        //初始化weosocket
        const wsuri = `ws://${process.env.BASE_IP}${uri}`;
        let websocket =
            'MozWebSocket' in window
                ? new MozWebSocket(wsuri)
                : new WebSocket(wsuri);
        let _self = this;
        websocket.onopen = () => {
            websocket.send(params.shopNumber);
        };
        websocket.onmessage = e => {
            let res = JSON.parse(e.data);
            if (res.code !== 200) {
                window.setTimeout(function () {
                    state.websocket.readyState === 3 &&
                        context.dispatch.apply(_self, [
                            'initWebsocket',
                            { uri, params }
                        ]);
                }, 5000);
                return;
            }
            let webSocketData = res.data || {};
            context.commit('updateDrainage', webSocketData.drainageSystem);
            context.commit('updateSupply', webSocketData.supplySystem);
        };
        websocket.onerror = () => {
            window.setTimeout(function () {
                state.websocket.readyState === 3 &&
                    context.dispatch.apply(_self, [
                        'initWebsocket',
                        { uri, params }
                    ]);
            }, 5000);
        };
        websocket.onclose = () => {
            console.log('关闭websocket接口');
        };
        context.commit('updateWebsocket', websocket);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
