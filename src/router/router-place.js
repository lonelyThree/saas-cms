import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/',
        component: Home,
        icon: 'el-icon-connection',
        leaf: true,
        meta: {
            code: 'placeList',
        },
        children: [
            {
                path: 'place/list',
                component: () => import('@/pages/place/List'),
                meta: {
                    title: '渠道管理',
                    code: 'placeList',
                },
            },
        ],
    },
]

export default obj
