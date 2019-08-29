import Storages from '../../utils/storages'
/** 用户相关 */
const state = {
    userInfo: null, //用户信息
    requestHeaderToken: '', //请求头token信息
    shopAddressInfo: null //门店IP地址列表
}

const mutations = {
    setRequestHeader(state, tokenString) {
        if (tokenString) {
            state.requestHeaderToken = tokenString
            // debugger;
            localStorage.setItem('$token_info', tokenString)
        }
        console.log('tokenString', tokenString)
    },
    setUserInfo(state, user) {
        if (user) {
            state.userInfo = user
            Storages.setLocalStorage('$user_info', user)
        }
        console.log('userInfo', state.userInfo)
    },
    setShopAddressInfo(state, data) {
        if (data) {
            state.shopAddressInfo = data
            Storages.setLocalStorage('$shopAddressInfo', data)
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
