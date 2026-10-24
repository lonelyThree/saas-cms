var STORAGE_OBJ = localStorage

var storage = {
    enCode(i) {
        return JSON.stringify(i)
    },
    deCode(i) {
        return JSON.parse(i)
    },
    get(k) {
        return JSON.parse(STORAGE_OBJ.getItem(k)) // null
    },
    set(k, v) {
        if (typeof v == 'undefined' || !v) {
            return console.warn('设置storage格式不正确，请重试！')
        }
        STORAGE_OBJ.setItem(k, JSON.stringify(v))
    },
    concat(k, p = {}) {
        this.set(k, Object.assign({}, this.get(k), p))
    },
    remove(k) {
        STORAGE_OBJ.removeItem(k)
    },
    clear() {
        STORAGE_OBJ.clear()
    },
}

export default storage
