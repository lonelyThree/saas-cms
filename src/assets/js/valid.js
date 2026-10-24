let valid = {
    //2-50字，支持中英文数字
    _limit2or50_ZhorEnorNumber(i) {
        var validFormat = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9]){2,50}$/;
        return validFormat.test(i);
    },
    //2-20字，支持中英文
    _limit2or20_ZhorEn(i) {
        var validFormat = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){2,20}$/;
        return validFormat.test(i);
    },
    //11位手机号
    _limitPhone(i) {
        var validFormat = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        return validFormat.test(i);
    },
    //2-20字，支持中英文数字
    _limit2or20_ZhorEnorNumber(i) {
        var validFormat = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9]){2,20}$/;
        return validFormat.test(i);
    },
    //邮箱
    _limitemail(i) {
        var validFormat = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
        return validFormat.test(i);
    },
    //至少6位，需含有数字和字母，字母区分大小写
    _limitPwd(i) {
        var validFormat = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
        return validFormat.test(i);
    },
    //0-30字，支持中英文数字
    _limit0or30_ZhorEnorNumber(i) {
        var validFormat = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9]){1,30}$/;
        return validFormat.test(i);
    },

    //- 校验url
    checkUrl(textval) {
        const pathregex = /^(http:\/\/|https:\/\/)+([A-Za-z0-9]+[\s\S]*)$/
        return pathregex.test(textval)
    },
    //大写3数字3
    A3N3(i) {
        var validFormat = /^[A-z]{3}\d{3}$/;
        return validFormat.test(i);
    },

    //1-20字，支持中英文
    _limit1or20_ZhorEn(i) {
        var validFormat = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){1,20}$/;
        return validFormat.test(i);
    },
    //- 正数
    _number(v){
        var validFormat = /(^[0-9]\d*$)/
        return validFormat.test(v);
    }
}

export default valid;
