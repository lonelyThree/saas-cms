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
        // var permissionsArr = $storage.get('PE_USER_INFO').permissions.split('|')
        var permissionsArr = $storage.get('PE_USER_INFO').menuList
        var temp = []
        appRouter.forEach(el => {
            if (el.meta && el.meta.code) {
                if (permissionsArr.includes(el.meta.code)) {
                    var temp1 = JSON.parse(JSON.stringify(el))
                    temp1.children = []
                    if (el.children && el.children.length) {
                        el.children.forEach(item => {
                            if (permissionsArr.includes(item.meta.code)) {
                                temp1.children.push(item)
                            }
                        })
                    }
                    temp.push(temp1)
                }
            }
        })
        state.menu = temp


        // console.log(permissionsArr, "===permissionsArr===", temp)
    },
    clearMenu(state) {
        console.log('clear store ...')
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
