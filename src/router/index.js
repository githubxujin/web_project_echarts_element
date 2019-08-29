import Vue from 'vue';
import Router from 'vue-router';
import BaseConfig from '../base-config';
Vue.use(Router);

const modulesFiles = require.context('./modules', false, /\.js$/);
// console.log('modulesFiles', modulesFiles.keys());

var otherRouters = []; //其它子模块路由
modulesFiles.keys().forEach(modulePath => {
    const value = modulesFiles(modulePath);
    otherRouters.push(value.default);
    return otherRouters;
}, {});
// console.log('modules', otherRouters);
//基础路由
let baseRouters = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/plat-index',
        component: resolve =>
            require(['../views/dashboard/platform/index.vue'], resolve),
        meta: {
            title: BaseConfig.P_TITLE + '-平台首页'
        }
    },
    {
        path: '/shop-index',
        component: resolve =>
            require(['../views/dashboard/shop/index.vue'], resolve),
        meta: {
            title: '门店首页'
        }
    },
    {
        path: '/test',
        component: resolve => require(['@/views/test/test.vue'], resolve)
    },
    {
        path: '/echarts',
        component: resolve => require(['@/views/test/echarts.vue'], resolve)
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true,
        meta: {
            title: BaseConfig.P_TITLE, // 标题
            keepAlive: true // 需要被缓存
        }
    },
    {
        path: '/auto-login',
        component: () => import('@/views/login/AutoLogin.vue'),
        hidden: true,
        meta: {
            title: '页面跳转中...', // 标题
            keepAlive: true // 需要被缓存
        }
    },
    {
        path: '/digital-signage',
        component: resolve =>
            require(['@/views/digital-signage/DigitalSignage.vue'], resolve),
        name: 'digital-signage',
        meta: { title: '电子看板' }
    },
    {
        path: '/404',
        component: resolve => require(['@/views/error/404.vue'], resolve)
    }
];
export default new Router({
    fallback: false,
    mode: 'history',
    // linkActiveClass: 'is-active',
    routes: baseRouters.concat(otherRouters)
});
