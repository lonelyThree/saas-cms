export function wrapBlank(val) {
    return val.replace(/[ ]/g, '<br />')
}

export function filter2date(val) {
    let temp = ''
    try {
        if (val) temp = new Date(val).Format()
    } catch (e) {}
    return temp
}

export function dataFormat(data, value) {
    return !data ? (value ? value : '--') : data
}


export function filter2dateHi(val) {
    let temp = ''
    try {
        if (val) temp = new Date(val).Format('yyyy-MM-dd HH:mm')
    } catch (e) {}
    return temp
}
/*获取时间格式数据*/
export function date2Format() {
    
    let data = arguments[0]+""
    return data.substr(0, 4)+ '年' + data.substr(4, 2) + '月' + data.substr(6, 8) + '日'
}

export function dateFormatFilter() {
    var tm = arguments[0] || 0
    if (tm == null || tm === '' || tm === 0 || Number.isNaN(tm)) {
        return '--'
    }
    return dateFormat(tm, arguments[0] || 3)
}
    
/*获取时间格式数据*/
export function dateFormat() {
    var date = null
    if (arguments[0] == '' || arguments[0] == null) {
        date = new Date()
    } else {
        date = new Date(arguments[0] || 0)
    }
    var year = date.getFullYear()
    var month =
        date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    var hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
    var min =
        date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes() || 0
    var scd =
        date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
    if (arguments[1] == 1) {
        return year + '-' + month + '-' + day
    } else if (arguments[1] == 2) {
        return year + '年' + month + '月' + day + '日 '
    } else if (arguments[1] == 3) {
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min
    } else if (arguments[1] == 4) {
        return year + '/' + month + '/' + day + ' ' + hour + ':' + min
    } else if (arguments[1] == 5) {
        return hour + ':' + min + ':' + scd
    } else if (arguments[1] == 6) {
        return hour + ':' + min
    } else if (arguments[1] == 8) {
        return [hour, min, scd]
    }
    let dateData =
        year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + scd
    if (arguments[0] == '' || arguments[0] == null) {
        return '--'
    } else {
        return dateData
    }
}
export function filterDocTitle(val){
    let res = ''
    switch (val){
        case 0:
            res = '未设置'
        break;
        case 1:
            res = '医师'
        break;
        case 4:
            res = '主治医师'
        break;
        case 5:
            res = '副主任医师'
        break;
        case 6:
            res = '主任医师'
        break;
    }
    return res;
}

export function filterDocStatus(val){
    let res = ''
    switch (val){
        case 1:
            res = '待完善'
        break;
        case 2:
            res = '待审核'
        break;
        case 3:
            res = '审核不通过'
        break;
        case 4:
            res = '待备案'
        break;
        case 5:
            res = '备案申请中'
        break;
        case 6:
            res = '备案不通过'
        break;
        case 7:
            res = '已备案'
        break;
    }
    return res
}

export function filterDrugType(val){
  let res = ''
  switch (val){
    case 1:
      res = '处方药'
      break;
    case 2:
      res = '非处方药'
      break;
    case 3:
      res = '中药饮片'
      break;
    case 4:
      res = '其他'
      break;
  }
  return res
}
