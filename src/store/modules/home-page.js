/** 首页模块 */
const state = {
    chatrs: {
        chartsList: 4
    },
    sidebarItem: {
        items: '',
        meta: '',
        metas: '首页'
    },
    indexEchartsData: {},
    liveData: null, // 首页报表动态更新
    layoutEditing: null // 首页布局开关 null, edit, saving, cancel
}

const mutations = {
    setIndexEchartsData(state, data) {
        data.name && data.data && (state.indexEchartsData[data.name] = data.data)
    },
    add(state) {
        state.chatrs.chartsList++
    },
    liveDataUpdate(state, action) {
        state.liveData = action
    },
    layoutEditSwitcher(state, action) {
        state.layoutEditing = action
    }
}

const actions = {
    liveUpdateAction({ commit }, data) {
        commit('liveDataUpdate', data)
    },
    layoutEditAction({ commit }, data) {
        commit('layoutEditSwitcher', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

