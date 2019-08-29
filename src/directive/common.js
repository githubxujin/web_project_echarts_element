// common
import Vue from 'vue';

/**
 * 表单输入剔除空格
 */
Vue.directive('input-exclude-space', {
    bind () { },
    inserted (el, binding) {
        el.onkeyup = () => {
            el.value = el.value.replace(/ /g, '');
        };

        el.onblur = () => {
            el.value = el.value.replace(/ /g, '');
        };
    },
    update () { },
    componentUpdated () { },
    unbind () { }
});

/**
 * 图片加载错误使用默认图片
 */
Vue.directive('img-err', {
    inserted (el, binding) {
        console.log(el);
        el.onerror = function () {
            el.setAttribute('src', './static/img/img-err.png');
            console.log('图片加载错误');
        };
    }
});

import './echart-resize';
