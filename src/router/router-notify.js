import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/',
        component: Home,
        icon: 'el-icon-chat-round',
        leaf: true,
        meta: {
            code: 'notifyList',
        },
        children: [
            {
                path: 'notify/list',
                component: () => import('@/pages/notify/List'),
                meta: {
                    title: '消息通知',
                    code: 'notifyList',
                },
            },
        ],
    },
]

export default obj
