import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import storage from '@/assets/js/storage'

import Login from '@/pages/layout/Login'

import Index from './router-index'
import Place from './router-place'
import Chain from './router-chain'
import Notify from './router-notify'
import System from './router-system'
import Activity from './router-activity'
import Commany from './router-company'
import Course from './router-course'
import ActivitySalesMan from './router-activity-sales-man'


import Fans from './router-fans'

function getPermissionCodes() {
    const user = storage.get('PE_USER_INFO')
    const menuList = user && user.menuList
    if (Array.isArray(menuList)) return menuList
    if (typeof menuList === 'string') return menuList.split('|')
    return []
}

function isAuthorized(to) {
    const code = to.meta && to.meta.code
    if (!code || code === 'index') return true
    return getPermissionCodes().indexOf(code) !== -1
}

export var appRouter = [
    // {
    //     path: '/demo',
    //     component: () => import('@/pages/Demo'),
    // },
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: Login,
    },
    ...Index,
    ...Place,
    ...Commany,
    ...Chain,
    ...Fans,
    ...Activity,
    ...ActivitySalesMan,
    ...Course,
    // ...Notify,
    ...System,

    // {
    //     path: '*',
    //     component: NotFound
    // }

    
]

const router = new Router({
    mode: 'history',
    base: '/',
    routes: appRouter,
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) document.title = '药企营销管理系统 - ' + to.meta.title

    const user = storage.get('PE_USER_INFO')
    if (!user) {
        if (to.name === 'Login') {
            next()
        } else {
            next({ name: 'Login' })
        }
        return
    }
    if (to.name === 'Login') {
        next({ name: 'Index' })
        return
    }
    if (!isAuthorized(to)) {
        next({ name: 'Index' })
        return
    }
    next()
})

let reloadAttempts = 0
router.onError(() => {
    if (reloadAttempts >= 1) return
    reloadAttempts += 1
    window.location.reload()
})
export default router
