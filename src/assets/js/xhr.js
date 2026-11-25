import axios from 'axios'
import qs from 'qs'
import config from '@/config/api'
import $router from '@/router/router'
import $storage from '@/assets/js/storage'
import $store from '@/store'

const AUTH_KEY = 'PE_USER_INFO'
const http = axios.create({ timeout: 12e5 })

function getAuthInfo() {
    try {
        return $storage.get(AUTH_KEY) || null
    } catch (e) {
        $storage.remove(AUTH_KEY)
        return null
    }
}

function clearSession() {
    $storage.remove(AUTH_KEY)
    $store.dispatch('clearMenuList')
    if ($router.currentRoute && $router.currentRoute.name === 'Login') return
    const result = $router.push({ name: 'Login' })
    if (result && typeof result.catch === 'function') {
        result.catch(() => {})
    }
}

function normalizeError(error) {
    if (error && (error.code === 'ERR_CANCELED' || error.name === 'CanceledError')) {
        return error
    }
    const response = error && error.response
    const status = response && response.status
    if (status === 401) {
        clearSession()
    }
    const data = response && response.data
    const msg = (data && (data.msg || data.message)) || (error && error.message) || '网络异常，请稍后重试'
    return {
        code: (error && error.code) || status || -1,
        status,
        name: error && error.name,
        msg,
        data,
    }
}

function isApiRequest(requestConfig) {
    const url = requestConfig.url || ''
    try {
        const base = typeof window !== 'undefined' ? window.location.href : 'http://localhost/'
        const target = new URL(url, base)
        const localOrigin = new URL(base).origin
        if (target.origin === localOrigin) return true
        const apiDomain = config.URL && config.URL.domain
        if (!apiDomain) return false
        return target.origin === new URL(apiDomain).origin
    } catch (e) {
        return false
    }
}

http.interceptors.request.use(
    requestConfig => {
        const user = getAuthInfo()
        const token = user && user.info && user.info.token
        if (token && isApiRequest(requestConfig)) {
            requestConfig.headers = requestConfig.headers || {}
            requestConfig.headers.token = token
        }
        return requestConfig
    },
    error => Promise.reject(normalizeError(error))
)

http.interceptors.response.use(
    response => response,
    error => Promise.reject(normalizeError(error))
)

function processResponse(res) {
    if (!res) {
        return { code: -1, msg: '服务器错误，请重试' }
    }
    if (res.status !== 200) {
        return { code: res.status, msg: '服务器错误，请重试' }
    }
    const data = res.data
    if (data && data.code == 1001) {
        clearSession()
        return { code: 1001, msg: '登录已过期，请重新登录', data: null }
    }
    return data || { code: -1, msg: '服务器错误，请重试' }
}

function requireUrl(url) {
    if (!url) {
        return Promise.reject({ code: -1, msg: '接口未配置' })
    }
    return null
}

function parseBlobResponse(res) {
    const blob = res.data
    if (!blob || !blob.type || blob.type.indexOf('application/json') === -1) {
        return Promise.resolve(res)
    }
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = () => {
            try {
                const result = JSON.parse(reader.result)
                if (result && result.code == 1001) {
                    clearSession()
                }
            } catch (e) {
                // ignore invalid error payload
            }
            resolve(res)
        }
        reader.onerror = () => resolve(res)
        reader.readAsText(blob, 'utf-8')
    })
}

var post = (url, data, requestConfig) => {
    const invalid = requireUrl(url)
    if (invalid) return invalid
    return http(Object.assign({}, requestConfig || {}, {
        method: 'post',
        url: url,
        data: data,
    })).then(res => processResponse(res))
}

var get = (url, params, requestConfig) => {
    const invalid = requireUrl(url)
    if (invalid) return invalid
    return http(Object.assign({}, requestConfig || {}, {
        method: 'get',
        url: url,
        params: params,
    })).then(res => processResponse(res))
}

var postForm = (url, data, requestConfig) => {
    const invalid = requireUrl(url)
    if (invalid) return invalid
    const options = requestConfig || {}
    return http(Object.assign({}, options, {
        method: 'post',
        url: url,
        data: qs.stringify(data),
        headers: Object.assign(
            { 'content-type': 'application/x-www-form-urlencoded' },
            options.headers || {}
        ),
    })).then(res => processResponse(res))
}

var download = (url, params) => {
    const invalid = requireUrl(url)
    if (invalid) return invalid
    return http({
        method: 'get',
        url: url,
        params: params,
        responseType: 'blob',
    }).then(res => parseBlobResponse(res))
}

var uploadImage = file => {
    const extMap = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/bmp': 'bmp',
    }
    const ext = extMap[file.type]
    if (!ext) {
        return Promise.reject(new Error('不支持的图片格式'))
    }
    if (file.size > 5 * 1024 * 1024) {
        return Promise.reject(new Error('图片大小不能超过 5MB'))
    }
    return get(config.API.getPolicyToken).then(res => {
        if (res.code !== 200 || !res.data) {
            throw new Error(res.msg || res.message || '获取上传凭证失败')
        }
        const token = res.data
        const fileName = new Date().getTime() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext
        const key = token.dir + fileName
        const formData = new FormData()
        formData.append('x-oss-forbid-overwrite', true)
        formData.append('key', key)
        formData.append('OSSAccessKeyId', token.accessid)
        formData.append('policy', token.policy)
        formData.append('Signature', token.signature)
        formData.append('success_action_status', '200')
        formData.append('callback', token.callback)
        formData.append('file', file, fileName)
        return post(token.host, formData).then(callbackRes => {
            if (!callbackRes || callbackRes.code !== 200) {
                throw new Error(callbackRes && callbackRes.msg ? callbackRes.msg : '上传回调失败')
            }
            return token.url + '/' + key
        })
    })
}

export default {
    post,
    get,
    postForm,
    download,
    uploadImage
}
