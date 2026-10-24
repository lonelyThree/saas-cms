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
    console.info('router---router' , to, from)
    // PE: pharmacy enterprise
    if (storage.get('PE_USER_INFO')) {
        if (to.name == 'Login') {
            
            console.info('has login')
            next({ name: 'Index' })
        } else {
            next()
        }
    } else {
        if (to.name == 'Login') {
            next()
        } else {
            next({ name: 'Login' })
        }
    }
    if (to.meta.title) document.title = '药企营销管理系统 - ' + to.meta.title
})
router.onError(() => {
  location.reload()
})
export default router
