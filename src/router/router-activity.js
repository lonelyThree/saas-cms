import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/activity',
        component: Home,
        icon: 'el-icon-trophy',
        leaf: false,
        redirect: 'noRedirect',
        meta: {
            title: '活动管理',
            code: 'activity',
        },
        children: [
            {
                path: 'quickList',
                component: () => import('@/pages/activity/QuickList'),
                meta: {
                    title: '快问快答',
                    code: 'quickList',
                },
            },
            {
                path: 'speakList',
                component: () => import('@/pages/activity/SpeakList'),
                meta: {
                    title: '开口说',
                    code: 'speakList',
                },
            },
            {
                path: 'receiptList',
                component: () => import('@/pages/activity/ReceiptList'),
                meta: {
                    title: '拍小票',
                    code: 'receiptList',
                },
            },
            {
                path: 'videoList',
                component: () => import('@/pages/activity/VideoList'),
                meta: {
                    title: '看视频',
                    code: 'videoList',
                },
            },
            {
                path: 'articleList',
                component: () => import('@/pages/activity/ArticleList'),
                meta: {
                    title: '有奖分享',
                    code: 'articleList',
                },
            },
            {
                path: 'voteList',
                component: () => import('@/pages/activity/VoteList'),
                meta: {
                    title: '投票活动',
                    code: 'articleList',
                },
            },
            {
                path: 'activityIndex',
                component: () => import('@/pages/activity/ActivityIndex'),
                meta: {
                    title: '活动首页',
                    code: 'placeCode',
                },
            },
        ],
        
    },
]

export default obj
