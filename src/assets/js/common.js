Date.prototype.Format = function(pattern) {
    pattern = pattern || 'yyyy-MM-dd HH:mm:ss'
    function replacer(patternPart, result) {
        pattern = pattern.replace(patternPart, result)
    }
    var _zeroPad = function(source, length) {
            var pre = '',
                negative = source < 0,
                string = String(Math.abs(source))
            if (string.length < length) {
                pre = new Array(length - string.length + 1).join('0')
            }
            return (negative ? '-' : '') + pre + string
        },
        year = this.getFullYear(),
        month = this.getMonth() + 1,
        date2 = this.getDate(),
        hours = this.getHours(),
        minutes = this.getMinutes(),
        seconds = this.getSeconds()
    replacer(/yyyy/g, _zeroPad(year, 4))
    replacer(/yy/g, _zeroPad(parseInt(year.toString().slice(2), 10), 2))
    replacer(/MM/g, _zeroPad(month, 2))
    replacer(/M/g, month)
    replacer(/dd/g, _zeroPad(date2, 2))
    replacer(/d/g, date2)
    replacer(/HH/g, _zeroPad(hours, 2))
    replacer(/H/g, hours)
    replacer(/hh/g, _zeroPad(hours % 12, 2))
    replacer(/h/g, hours % 12)
    replacer(/mm/g, _zeroPad(minutes, 2))
    replacer(/m/g, minutes)
    replacer(/ss/g, _zeroPad(seconds, 2))
    replacer(/s/g, seconds)
    return pattern
}
