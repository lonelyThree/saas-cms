var configObj = {
    local: { 
        domain: 'http://localhost:8888/Admin/',
    },
    dev: {
        domain: 'http://localhost:8888/Admin/',
    },
    test: {
        domain: 'http://rmkapi.ai-xbys.com/Admin/',
    },
    prod: {
        domain: 'https://rmkapi.ai-xbys.com/Admin/',
    },
}

var ENV = process.env.MIAO_ENV

if (process.env.NODE_ENV === 'development') {
    ENV = 'local'
}

var URL = configObj[ENV]

var domain = URL.domain
var API = {
    domain: domain,
    login: domain + 'Login',
    getMenuList: domain + 'GetMenuList',
    logout: domain + 'Logout',
    updatepwd: domain + 'UpdatePwd',

    quickList: domain + 'QuickList',

    getAllPlace: domain + 'AllPlace',
    getChainList: domain + 'ChainList',
    getPolicyToken: domain + 'GetPolicyToken',


    fansList: domain + 'FansList',

    placeList: domain + 'PlaceList',
    placeSave: domain + 'PlaceSave',
    placeStatus: domain + 'PlaceStatus',
    userReset: domain + 'UserReset',

    userList: domain + 'UserList',
    userSave: domain + 'UserSave',
    userStatus: domain + 'UserStatus',
    userActivityList: domain + 'UserActivityList',
    userActivitySave: domain + 'UserActivitySave',
    userActivityStatus: domain + 'UserActivityStatus',
    userReviewManual: domain + 'UserReviewManual',
    fansUpdateInfo: domain + 'FansUpdateInfo',


    salesManList: domain + 'SalesManList',
    salesManReviewManual: domain + 'SalesManReviewManual',

    quickRankList: domain + 'QuickRankList',
    quickAwardList: domain + 'QuickAwardList',
    quickAddress: domain + 'QuickAddress',
    quickQuestionList: domain + 'QuickQuestionList',
    quickQuestionSave: domain + 'QuickQuestionSave',
    quickQuestionImport: domain + 'QuickQuestionImport',

    quickSave: domain + 'QuickSave',
    quickStatus: domain + 'QuickStatus',
    quickAwardSave: domain + 'QuickAwardSave',


    speakSave: domain + 'SpeakSave',
    speakArea: domain + 'SpeakArea',
    speakAreaSave: domain + 'SpeakAreaSave',
    speakList: domain + 'SpeakList',
    speakTopicSave: domain + 'SpeakTopicSave',
    speakTopicList: domain + 'SpeakTopicList',
    speakStatus: domain + 'SpeakStatus',
    speakJoins: domain + 'SpeakJoins',

    receiptSave: domain + 'ReceiptSave',
    receiptArea: domain + 'ReceiptArea',
    receiptAreaSave: domain + 'ReceiptAreaSave',
    receiptList: domain + 'ReceiptList',
    receiptStatus: domain + 'ReceiptStatus',

    receiptProList: domain + 'ReceiptProList',
    receiptProSave: domain + 'ReceiptProSave',
    receiptProStatus: domain + 'ReceiptProStatus',


    receiptProChainList: domain + 'ReceiptProChainList',
    receiptProChainSave: domain + 'ReceiptProChainSave',
    receiptProChainStatus: domain + 'ReceiptProChainStatus',
    receiptChainSearch: domain + 'ReceiptChainSearch',

    receiptChainList: domain + 'ReceiptChainList',
    receiptChainSave: domain + 'ReceiptChainSave',
    receiptChainStatus: domain + 'ReceiptChainStatus',
    receiptChainSortSave: domain + 'ReceiptChainSortSave',
    receiptUserPopInfoSave: domain + 'ReceiptUserPopInfoSave',

    receiptReceipt: domain + 'ReceiptReceipt',
    receiptManual: domain + 'ReceiptManual',
    receiptUser: domain + 'ReceiptUser',
    receiptUserExport: domain + 'ReceiptUserExport',
    receiptUserStatus: domain + 'ReceiptUserStatus',
    receiptAwardList: domain + 'ReceiptAwardList',
    receiptAwardSave: domain + 'ReceiptAwardSave',

    receiptUserDayNum: domain + 'ReceiptUserDayNum',
    receiptUserUpdateDayNum: domain + 'ReceiptUserUpdateDayNum',
    receiptUserDayLimit: domain + 'ReceiptUserDayLimit',

    receiptAddress: domain + 'ReceiptAddress',
    receiptWarehouse: domain + 'ReceiptWarehouse',
    receiptWarehouseIn: domain + 'ReceiptWarehouseIn',
    receiptWarehouseIn: domain + 'ReceiptWarehouseIn',
    receiptEditTime: domain + 'ReceiptEditTime',

    
    watchVideoList: domain + 'WatchVideoList',
    watchVideoSave: domain + 'WatchVideoSave',
    watchVideoArea: domain + 'WatchVideoArea',
    watchVideoAreaSave: domain + 'WatchVideoAreaSave',
    watchVideoStatus: domain + 'WatchVideoStatus',


    watchVideoTopicList: domain + 'WatchVideoTopicList',
    watchVideoTopicSave: domain + 'WatchVideoTopicSave',
    watchVideoTopicStatus: domain + 'WatchVideoTopicStatus',
    watchVideoJoins: domain + 'WatchVideoJoins',


    chainList: domain + 'CmsChainList',
    chainSave: domain + 'ChainSave',
    chainImport: domain + 'ChainImport',
    chainStatus: domain + 'ChainStatus',

    inviteActivityList: domain + 'InviteActivityList',
    inviteActivitySave: domain + 'InviteActivitySave',
    inviteActivityArea: domain + 'InviteActivityArea',
    inviteActivityAreaSave: domain + 'InviteActivitySave',
    inviteActivityStatus: domain + 'InviteActivityStatus',


    activityIndexList: domain + 'ActivityIndexList',
    activityIndexSave: domain + 'ActivityIndexSave',
    activityIndexStatus: domain + 'ActivityIndexStatus',

    userRegImportList: domain + 'UserRegImportList',
    userRegImportSave: domain + 'UserRegImportSave',
    userRegImportImport: domain + 'UserRegImportImport',

    companyList: domain + 'CompanyList',
    companySave: domain + 'CompanySave',
    companyStatus: domain + 'CompanyStatus',
    companySearch: domain + 'CompanySearch',

    companyActivityList: domain + 'CompanyActivityList',
    companyActivitySave: domain + 'CompanyActivitySave',
    companyActivityStatus: domain + 'CompanyActivityStatus',
    companyActivityIndexList: domain + 'CompanyActivityIndexList',
    companyActivityIndexSave: domain + 'CompanyActivityIndexSave',
    companyActivityIndexStatus: domain + 'CompanyActivityIndexStatus',
    companyActivityCourseList: domain + 'CompanyActivityCourseList',

    courseCategoryList: domain + 'CourseCategoryList',
    courseCategorySave: domain + 'CourseCategorySave',
    courseCategoryStatus: domain + 'CourseCategoryStatus',
    courseCategoryCourseList: domain + 'CourseCategoryCourseList',
    courseCategoryCourseSave: domain + 'CourseCategoryCourseSave',
    courseCategoryCourseStatus: domain + 'CourseCategoryCourseStatus',
    courseTeacherList: domain + 'CourseTeacherList',
    courseTeacherSave: domain + 'CourseTeacherSave',
    courseTeacherSearch: domain + 'CourseTeacherSearch',

    courseList: domain + 'CourseList',
    courseSearch: domain + 'CourseSearch',
    courseSave: domain + 'CourseSave',
    courseArea: domain + 'CourseArea',
    courseAreaSave: domain + 'CourseAreaSave',
    courseStatus: domain + 'CourseStatus',

    courseTopicList: domain + 'CourseTopicList',
    courseTopicSave: domain + 'CourseTopicSave',
    courseQuestionJoins: domain + 'CourseQuestionJoins',
    courseVideoList: domain + 'CourseVideoList',
    courseVideoSave: domain + 'CourseVideoSave',
    courseVideoStatus: domain + 'CourseVideoStatus',
    courseQuestionList: domain + 'CourseQuestionList',
    courseQuestionSave: domain + 'CourseQuestionSave',
    courseQuestionStatus: domain + 'CourseQuestionStatus',
    courseLimitChainList: domain + 'CourseLimitChainList',
    courseLimitChainSave: domain + 'CourseLimitChainSave',
    courseLimitChainStatus: domain + 'CourseLimitChainStatus',
    courseUserList: domain + 'CourseUserList',
    courseUserExport: domain + 'CourseUserExport',


    articleList: domain + 'ArticleList',
    articleSave: domain + 'ArticleSave',
    articleArea: domain + 'ArticleArea',
    articleAreaSave: domain + 'ArticleAreaSave',
    articleStatus: domain + 'ArticleStatus',
    articleUserList: domain + 'ArticleUserList',
    articleUserLog: domain + 'ArticleUserLog',
    articleUserExport: domain + 'ArticleUserExport',


    voteList: domain + 'VoteList',
    voteSave: domain + 'VoteSave',
    voteArea: domain + 'VoteArea',
    voteAreaSave: domain + 'VoteAreaSave',
    voteStatus: domain + 'VoteStatus',
    articleUserList: domain + 'ArticleUserList',
    articleUserLog: domain + 'ArticleUserLog',
    articleUserExport: domain + 'ArticleUserExport',

    voteTopicList: domain + 'VoteTopicList',
    voteTopicSave: domain + 'VoteTopicSave',
    voteTopicStatus: domain + 'VoteTopicStatus',


    userCompanyCmsList: domain + 'UserCompanyCmsList',
    userCompanySave: domain + 'UserCompanySave',
    userCompanyImport: domain + 'UserCompanyImport',
    userCompanyStatus: domain + 'UserCompanyStatus',

    userCompanyDepartmentCmsList: domain + 'UserCompanyDepartmentCmsList',
    userCompanyDepartmentSave: domain + 'UserCompanyDepartmentSave',
    userCompanyDepartmentImport: domain + 'UserCompanyDepartmentImport',
    userCompanyDepartmentStatus: domain + 'UserCompanyDepartmentStatus',

    userBusinessCmsList: domain + 'UserBusinessCmsList',
    userBusinessSave: domain + 'UserBusinessSave',
    userBusinessImport: domain + 'UserBusinessImport',
    userBusinessStatus: domain + 'UserBusinessStatus',

    userBusinessDepartmentCmsList: domain + 'UserBusinessDepartmentCmsList',
    userBusinessDepartmentSave: domain + 'UserBusinessDepartmentSave',
    userBusinessDepartmentImport: domain + 'UserBusinessDepartmentImport',
    userBusinessDepartmentStatus: domain + 'UserBusinessDepartmentStatus',


    counterList: domain + 'CounterList',
    counterSave: domain + 'CounterSave',
    counterArea: domain + 'CounterArea',
    counterAreaSave: domain + 'CounterAreaSave',
    counterStatus: domain + 'CounterStatus',

    // 绑定
    counterBindList: domain + 'CounterBindList',
    counterBindSave: domain + 'CounterBindSave',
    counterBindStatus: domain + 'CounterBindStatus',

    // updatepwd: domain + 'updatepwd',
    // // 首页
    // getIndexData: domain + 'getIndexData',
    // // 问诊记录
    // getEnrollLog: domain + 'getEnrollLog',
    // getPatName: domain + 'getPatName',
    // commentDetail: domain + 'commentDetail',
    // setCommentStatus: domain + 'setCommentStatus',
    // getLogAdminDetail: domain + 'getLogAdminDetail',
    // getChatLog: domain + 'getChatLog',
    // // 定制医生列表
    // getCustomDocList: domain + 'getCustomDocList',
    // setCustomStatus: domain + 'setCustomStatus',
    // delCustomDoc: domain + 'delCustomDoc',
    // getAllDoctorByPlace: domain + 'getAllDoctorByPlace',
    // addCustomDoc: domain + 'addCustomDoc',
    // // 控糖医生
    // getRecommendDocList: domain + 'getRecommendDocList',
    // getRecommendName: domain + 'getRecommendName',
    // addRecommendDoc: domain + 'addRecommendDoc',
    // getAllDoc: domain + 'getAllDoc',
    // delRecommentDoc: domain + 'delRecommentDoc',
    // // 系统管理
    // getUserList: domain + 'getUserList',
    // getUserEmail: domain + 'getUserEmail',
    // getAllStore: domain + 'getAllStore', //门店
    // editUser: domain + 'editUser', //编辑
    // register: domain + 'register', //新建用户
    // getRoleList: domain + 'getRoleList', //角色
    // addRole: domain + 'addRole', //add角色
    // editRole: domain + 'editRole', //edit角色
    // setPwd: domain + 'setPwd', // 修改密码
    // getPermissionList: domain + 'getPermissionList', // 修改权限
    // roleBindPermission: domain + 'roleBindPermission', // 保存权限

    // // =====
    
    // getOrderList: domain + 'getOrderList',
    // orderDetail: domain + 'orderDetail',
    // setOrderStatus: domain + 'setOrderStatus', //设置订单状态
    // getExpress: domain + 'getExpress', //获取快递方式
    // setRemark: domain + 'setRemark',
    // getChainExpress: domain + 'getChainExpress', //运费设置
    // getAllChain: domain + 'getAllChain', //连锁
    // addExpress: domain + 'addExpress',
    // getExpressTel: domain + 'getExpressTel',
    // sendOut: domain + 'sendOut',
    // // getPlaceList: domain + 'getPlaceList', //渠道管理
    // getPlaceSecret: domain + 'getPlaceSecret',
    // upload: domain + 'upload', //上传
    // addPlace: domain + 'addPlace', //添加渠道
    // delPlace: domain + 'delPlace',
    // getImuserList: domain + 'getImuserList', //患者
    // getImuserInfo: domain + 'getImuserInfo',
    // getList: domain + 'getList', //企业列表
    // addEnterprise: domain + 'addEnterprise', //编辑企业信息
    // delEnterprise: domain + 'delEnterprise',
    // getEntUserList: domain + 'getEntUserList',
    // getEntUserTel: domain + 'getEntUserTel',
    // addEntUser: domain + 'addEntUser',
    // delEntUser: domain + 'delEntUser',
    // createQrcode: domain + 'createQrcode',
    // getDoctorList: domain + 'getDoctorList',

    // getAssDoctorList: domain + 'getAssDoctorList',
    // addAssDoctor: domain + 'addAssDoctor', //增加医生助理
    // delAssDoctor: domain + 'delAssDoctor', //删除医生助理

    // editDoctor: domain + 'editDoctor',
    // setOnline: domain + 'setOnline', //设置医生在线状态
    // getDep: domain + 'getDep',
    // addDocInfo: domain + 'addDocInfo',
    // delDoctor: domain + 'delDoctor',
    // getOtherInfo: domain + 'getOtherInfo',
    // getCardInfo: domain + 'getCardInfo',
    // editCardInfo: domain + 'editCardInfo',

    // // 药品管理
    // getDrugList: domain + 'getDrugList',
    // addDrug: domain + 'addDrug',
    // delDrug: domain + 'delDrug',
    // getChainDrugList: domain + 'getChainDrugList',
    // setDrugStatus: domain + 'setDrugStatus',
    // setChainDrug: domain + 'setChainDrug',
    // importDrug: domain + 'importDrug',
    // getStoreDrugList: domain + 'getStoreDrugList',
    // addStoreDrug: domain + 'addStoreDrug',
    // setStoreDrugStatus: domain + 'setStoreDrugStatus',
    // setStoreDrugPrice: domain + 'setStoreDrugPrice',

    // importCirc: domain + 'importCirc',

    // // 患者端配置
    // getBasicList: domain + 'getBasicList',
    // setBasicStatus: domain + 'setBasicStatus',
    // getAllOto: domain + 'getAllOto',
    // addBasic: domain + 'addBasic',
    // getBannerList: domain + 'getBannerList',
    // setBannerStatus: domain + 'setBannerStatus',
    // addBanner: domain + 'addBanner',
    // delBanner: domain + 'delBanner',
    // getSpecialDeptList: domain + 'getSpecialDeptList',
    // delSpecialDept: domain + 'delSpecialDept',
    // addSpecialDept: domain + 'addSpecialDept',
    // setSpecialStatus: domain + 'setSpecialStatus',
    // syncTy: domain + 'syncTy',
    // auditDoctor: domain + 'auditDoctor',
    // syncDocInfo: domain + 'syncDocInfo',
    // getDoctorServiceList: domain + 'getDoctorServiceList',
    // editDocService: domain + 'editDocService',
    // addServiceByPlace: domain + 'addServiceByPlace',
    // getAuditList: domain + 'getAuditList',
    // auditRxDoctor: domain + 'auditRxDoctor',
    // getInviteList: domain + 'getInviteList',
    // getAllDoctor: domain + 'getAllDoctor',
    // getEntUser: domain + 'getEntUser',
    // addInviteLog: domain + 'addInviteLog',
    // delInviteLog: domain + 'delInviteLog',
    // getDoctorQrcode: domain + 'getDoctorQrcode',
    // getAllDrug: domain + 'getAllDrug',
    // addDoctorQrcode: domain + 'addDoctorQrcode',
    // delDoctorDrug: domain + 'delDoctorDrug',
    // getChainStoreList: domain + 'getChainStoreList',
    // addChainStore: domain + 'addChainStore',
    // delChainStore: domain + 'delChainStore',
    // getStoreList: domain + 'getStoreList',
    // addStore: domain + 'addStore',
    // delStore: domain + 'delStore',
    // getStoreTel: domain + 'getStoreTel',

    // addStoreHerb: domain + 'addStoreHerb',
    // delStoreHerb: domain + 'delStoreHerb',
    // getStoreHerb: domain + 'getStoreHerb',
    // setStoreHerb: domain + 'setStoreHerb',

    // getDocEditInfo: domain + 'getDocEditInfo',
    // getDepAll: domain + 'getDepAll',
    // getIndexDoctorList: domain + 'getIndexDoctorList',
    // addIndexDoc: domain + 'addIndexDoc',
    // delIndexDoc: domain + 'delIndexDoc',
    // getSqueezeContent: domain + 'getSqueezeContent',
    // getSqueezeList: domain + 'getSqueezeList',
    // addSqueeze: domain + 'addSqueeze',
    // delSqueeze: domain + 'delSqueeze',

    // // 统计报表、微信模板、下载中心
    // getTempList: domain + 'getTempList',
    // addTemp: domain + 'addTemp',
    // delTemp: domain + 'delTemp',
    // getDownList: domain + 'getDownList',
    // downStatement: domain + 'downStatement',
    // createStatement: domain + 'createStatement',
    // getPretDrugInfo: domain + 'getPretDrugInfo',
    // getDocTel: domain + 'getDocTel',
    // docMoenyLogList: domain + 'docMoenyLogList',
    // downMoneyLogExcel: domain + 'downMoneyLogExcel',
    // downDrugExcel: domain + 'downDrugExcel',
    // getMoneyDetail: domain + 'getMoneyDetail',
    // downMoneyDetail: domain + 'downMoneyDetail',

    // //互联网医院审核
    // getSetInfo:domain + 'getSetInfo',
    // setAuditInfo:domain + 'setAuditInfo'
}

export default {
    ENV,
    URL,
    API,

}
