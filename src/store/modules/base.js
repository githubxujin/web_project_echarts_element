/** 基础相关 */
import Storages from '../../utils/storages';
const state = {
    isLoading: false, //是否加载中
    topNavState: '', //顶部导航选中index
    leftNavState: '', //左侧导航选中index
    leftNavRefresh: false, //左侧导航是否刷新
    uploadUrl: '/api/system-setting/upload',
    openPageLoading: false, //如果页面使用了loading就禁用默认的路由加载之后自动关闭
    curShop: null, //当前选中的门店
    checkedShopNumbers: [], //当前选中的门店编号数组
    curShopName: '', //当前门店名称
    refreshShopTreeFlag: false //是否刷新门店树
};

const mutations = {
    updateLoadingStatus(state, payload) {
        state.isLoading = payload.isLoading;
    },
    updatePageLoadingStatus(state, status) {
        state.openPageLoading = status;
    },
    updateTopNavStatus(state, status) {
        state.topNavState = status;
        Storages.setLocalStorage('$topNavState', status);
    },
    updateLeftNavStatus(state, status) {
        state.leftNavState = status;
        Storages.setLocalStorage('$leftNavState', status);
    },
    updateLeftNavRefresh(state, status) {
        state.leftNavRefresh = status;
        Storages.setLocalStorage('$leftNavRefresh', status);
    },
    updateCurShop(state, data) {
        console.log(data, '门店信息');
        state.curShop = data;
        Storages.setLocalStorage('$curShop', data);
    },
    updateCheckedShopNumbers(state, data) {
        state.checkedShopNumbers = data;
        Storages.setLocalStorage('$checkedShopNumbers', data);
    },
    updateCurShopName(state, data) {
        state.curShopName = data;
        Storages.setLocalStorage('$curShopName', data);
    },
    updateFefreshShopTreeFlag(state, data) {
        state.refreshShopTreeFlag = data;
    }
};

const actions = {};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
