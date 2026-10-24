import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/commany',
        component: Home,
        icon: 'el-icon-office-building',
        leaf: false,
        meta: {
            title: '药企管理',
            code: 'fansList',
        },
        redirect: 'noRedirect',
        children: [
            {
                path: 'list',
                component: () => import('@/pages/company/CompanyList'),
                meta: {
                    title: '药企列表',
                    code: 'fansList',
                },
            },{
                path: 'activityList',
                component: () => import('@/pages/company/ComanyActivityList'),
                meta: {
                    title: '活动列表',
                    code: 'fansList',
                },
            },
        ],
    },
]

export default obj
