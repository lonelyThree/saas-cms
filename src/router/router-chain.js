import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/',
        component: Home,
        icon: 'el-icon-s-shop',
        leaf: true,
        meta: {
            title: '连锁管理',
            code: 'chainList',
        },
        children: [
            {
                path: 'chain/list',
                component: () => import('@/pages/chain/List'),
                meta: {
                    title: '连锁管理',
                    code: 'chainList',
                },
            },
        ],
    },
]

export default obj
