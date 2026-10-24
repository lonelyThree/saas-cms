import axios from 'axios'
import qs from 'qs'
import $router from '@/router/router'
import $storage from '@/assets/js/storage'
import $store from '@/store'

axios.defaults.timeout = 12e5

axios.interceptors.request.use(
    config => {
        // console.log("PE_USER_INFO===", $storage.get('PE_USER_INFO'), config)
        if ($storage.get('PE_USER_INFO')) {
            config.headers['token'] = $storage.get('PE_USER_INFO').info.token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.resolve(error.response)
    }
)

function processResponse(res) {
    if (res && res.status && res.status == 200) {
        if (res.data.code == 1001) {
            if ($storage.get('PE_USER_INFO')) {
                $storage.clear()
                $store.dispatch('clearMenuList')
                $router.push({ name: 'Login' })
                return { msg: '登录已过期，请重新登录' }
            }
        } else {
            return res.data
        }
    } else {
        // console.log(res)
        return { msg: '服务器错误，请重试' }
    }
}

var post = (url, data) => {
    return axios({
        method: 'post',
        url: url,
        data: data,
    }).then(res => {
        return processResponse(res)
    })
}

var get = (url, params) => {
    return axios({
        method: 'get',
        url: url,
        params: params,
    }).then(res => {
        // console.log("get-get-get-url", res)
        return processResponse(res)
    })
}

var postForm = (url, data) => {
  return axios({
      method: 'post',
      url: url,
      data: qs.stringify(data),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
  }).then(res => {
      return processResponse(res)
  })
}

var download = (url, params) => {
    return axios({
        method: 'get',
        url: url,
        params: params,
        responseType: "blob", //定义为blob
    }).then(res => {
        return res
    })
}

export default {
    post,
    get,
    postForm,
    download
}
