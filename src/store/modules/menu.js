import $storage from '@/assets/js/storage'
import { appRouter } from '@/router/router'

const state = {
    menu: [],
}

const getters = {
    menuList: state => state.menu,
}

const mutations = {
    setMenu(state) {
        state.menu = []
        const user = $storage.get('PE_USER_INFO')
        const menuList = user && user.menuList
        let permissionsArr = []
        if (Array.isArray(menuList)) {
            permissionsArr = menuList
        } else if (typeof menuList === 'string') {
            permissionsArr = menuList.split('|')
        }
        const temp = []
        appRouter.forEach(el => {
            if (el.meta && el.meta.code && permissionsArr.indexOf(el.meta.code) !== -1) {
                const temp1 = JSON.parse(JSON.stringify(el))
                temp1.children = []
                if (el.children && el.children.length) {
                    el.children.forEach(item => {
                        if (item.meta && item.meta.code && permissionsArr.indexOf(item.meta.code) !== -1) {
                            temp1.children.push(item)
                        }
                    })
                }
                temp.push(temp1)
            }
        })
        state.menu = temp
    },
    clearMenu(state) {
        state.menu = []
    },
}

const actions = {
    setMenuList({ commit }) {
        commit('setMenu')
    },
    clearMenuList({ commit }) {
        commit('clearMenu')
    },
}

export default {
    state,
    getters,
    mutations,
    actions,
}
