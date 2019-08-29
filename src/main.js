// 样式引入
import './assets/scss/index.scss';
import Vue from 'vue';
import 'es6-promise/auto';
import router from './router';
import Vuex from 'vuex';
import store from './store';

import ElementUI from 'element-ui';
import App from './App';
import echarts from 'echarts';
import 'babel-polyfill'; // ie9和一些低版本的高级浏览器对es6新语法的支持
if (Number.parseInt === undefined) Number.parseInt = window.parseInt;
if (Number.parseFloat === undefined) Number.parseFloat = window.parseFloat;
import VueWechatTitle from 'vue-wechat-title';

//图片预览:https://github.com/mirari/v-viewer
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999,
        toolbar: false
    }
});
import './filter/filters';
import './directive/index';

import './directive/echart-resize';

import BaseConfig from './base-config';
Vue.prototype.$baseConfig = BaseConfig;

require('./mock/mock.js');
Vue.use(Vuex);
Vue.use(VueWechatTitle);
Vue.use(ElementUI, {
    size: 'small'
});

import common from './utils/common.js';
Vue.prototype.$common = common;
Vue.prototype.$messageTip = common.message; //防止重复提示的

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

// import axios from './axios/axios.js';
// import url from './axios/url.js';
// Vue.prototype.$axios = axios;
// Vue.prototype.$url = url;

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
