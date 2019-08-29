import axios from './axios';
import qs from 'qs';
export default {
    // get请求
    get(url, param) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                params: param
            })
                .then((res = {}) => {
                    if (res.code !== 200) reject(res);
                    resolve(res);
                })
                .catch(_ => reject(_));
        });
    },
    // post请求- json
    post(url, param, headers) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                data: param
            })
                .then((res = {}) => {
                    if (res.code !== 200) reject(res);
                    resolve(res);
                })
                .catch(_ => reject(_));
        });
    },
    ajax(config) {
        if (config.method.toLowerCase() === 'get') {
            return this.get(config.url, config.data);
        } else {
            return this.post(config.url, config.data, config.headers);
        }
    },
    postFormData(url, param) {
        const formtData = new FormData();
        for (const k in param) {
            formtData.append(k, param[k]);
        }
        return this.ajax({
            url: url,
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formtData
        });
    },
    //post 导出excel
    postExcel(url, param, fileName) {
        axios({
            method: 'post',
            url,
            responseType: 'arraybuffer',
            data: param
        }).then(res => {
            let blob = new Blob([res.data], { type: 'application/x-xls' });
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        });
    },
    // post请求
    postForm(url, param, headers) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify(param)
            })
                .then((res = {}) => {
                    if (res.code !== 200) reject(res);
                    resolve(res);
                })
                .catch(_ => reject(_));
        });
    },
    // ajax
    ajaxForm(config) {
        if (config.method.toLowerCase() === 'get') {
            return this.get(config.url, config.data);
        } else {
            return this.postForm(config.url, config.data, config.headers);
        }
    }
};
