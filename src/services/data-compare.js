import request from '../axios/request';
import url from '../axios/url';
export function getShopCompareList(params) {
    return request.post(url.dataCompare.getShopCompareList, params);
}
export function getTimeCompareList(params) {
    return request.post(url.dataCompare.getTimeCompareList, params);
}

export function exportShopCompareList(params) {
    let openurl = url.dataCompare.exportShopCompareList + params;
    console.log(openurl)
    window.open(openurl);
}
export function exportTimeCompareList(params) {
    let openurl = url.dataCompare.exportTimeCompareList + params;
    console.log(openurl)
    window.open(openurl);
}

export function getShopCompareListReverse(params) {
    return request.post(url.dataCompare.getShopCompareListReverse, params);
}

export function getTimeCompareListReverse(params) {
    return request.post(url.dataCompare.getTimeCompareListReverse, params);
}
