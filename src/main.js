import Vue from 'vue'
import App from './App'
import router from './router/router'
import config from '@/config/api'
import store from './store'
import valid from '@/assets/js/valid'
import xhr from '@/assets/js/xhr'
import storage from './assets/js/storage'


import * as filters from '@/assets/js/filters'
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import FilterDate from '@/components/FilterDate'
Vue.component('FilterDate', FilterDate)

import '@/assets/fonts/iconfont.css'
import '@/assets/css/main.scss'
import '@/assets/js/common'

Vue.prototype.$valid = valid
Vue.prototype.$http = xhr
Vue.prototype.$storage = storage
// Vue.prototype.$config = config
window.API = config.API

Vue.config.productionTip = false

Vue.directive('defaultSelect', async function(el, bindings) {
    const [values, options, prop, defaultProp, defaultValue] = bindings.value
    // 需要隐藏的标签索引
    const indexs = []
    const tempData = values.map(a => options.find(op => op[prop] === a))
    tempData.forEach((a, index) => {
        if (a[defaultProp]) {
            if (a[defaultProp] === defaultValue) indexs.push(index)
        }
    })
    const dealStyle = function(tags) {
        tags.forEach((el, index) => {
            if (
                indexs.includes(index) &&
                ![...el.classList].includes('select-tag-close-none')
            ) {
                el.classList.add('nonesss')
            }
        })
    }
    // 设置样式 隐藏close icon
    const tags = el.querySelectorAll('.el-tag__close')
    if (tags.length === 0) {
        // 初始化tags为空处理
        setTimeout(() => {
            const tagTemp = el.querySelectorAll('.el-tag__close')
            dealStyle(tagTemp)
        }, 10)
    } else {
        dealStyle(tags)
    }
})

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
    created() {
        if (this.$storage.get('PE_USER_INFO')) {
            this.$store.dispatch('setMenuList')
        }
    },
})
