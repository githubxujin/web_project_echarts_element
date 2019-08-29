/** 能耗模块 */
const state = {
    leftTabTree: {},
}

const mutations = {
    setLeftTabTree (state, data) {
        state.leftTabTree = data
        console.log(data)
    }
}

const actions = {
    // setUpdateLeftTabTree ({ commit }, data) {
    //     commit('setLeftTabTree', data)
    // }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

