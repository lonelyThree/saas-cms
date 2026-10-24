import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/system',
        component: Home,
        icon: 'el-icon-setting',
        leaf: false,
        meta: {
            title: '系统管理',
            code: 'system',
        },
        children: [
            {
                path: 'user',
                component: () => import('@/pages/system/user/list'),
                meta: {
                    title: '用户管理',
                    code: 'systemUser',
                },
            },
            // {
            //     path: 'role',
            //     component: () => import('@/pages/system/role/list'),
            //     meta: {
            //         title: '角色管理',
            //         code: 'systemRole',
            //     },
            // },
            // {
            //     path: 'system_set',
            //     component: () => import('@/pages/system/role/setting'),
            //     meta: {
            //         title: '系统设置',
            //         code: 'system_set',
            //     },
            // },
        ],
    },
]

export default obj
