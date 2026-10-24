import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/fans',
        component: Home,
        icon: 'el-icon-user',
        leaf: false,
        meta: {
            title: '用户管理',
            code: 'fansList',
        },
        redirect: 'noRedirect',
        children: [
            {
                path: 'list',
                component: () => import('@/pages/fans/List'),
                meta: {
                    title: '用户管理',
                    code: 'fansList',
                },
            },{
                path: 'salesManList',
                component: () => import('@/pages/fans/SalesManList'),
                meta: {
                    title: '业务员管理',
                    code: 'fansList',
                },
            },
            {
                path: 'inviteActivity',
                component: () => import('@/pages/fans/InviteActivity'),
                meta: {
                    title: '邀请活动',
                    code: 'fansList',
                },
            },
            {
                path: 'regImport',
                component: () => import('@/pages/fans/RegImport'),
                meta: {
                    title: '用户导入',
                    code: 'fansList',
                },
            },{
                path: 'businessList',
                component: () => import('@/pages/fans/BusinessList'),
                meta: {
                    title: '商业公司管理',
                    code: 'fansList',
                },
            },{
                path: 'companyList',
                component: () => import('@/pages/fans/CompanyList'),
                meta: {
                    title: '业务员公司管理',
                    code: 'fansList',
                },
            },{
                path: 'salesManRegImport',
                component: () => import('@/pages/fans/SalesManRegImport'),
                meta: {
                    title: '业务员导入',
                    code: 'fansList',
                },
            },


            
        ],
    },
]

export default obj
