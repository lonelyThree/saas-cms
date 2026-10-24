import Home from '@/pages/layout/Home'
import Index from '@/pages/Index'

var obj = [
    {
        path: '/',
        component: Home,
        icon: 'el-icon-house',
        leaf: true,
        meta: {
            code: 'index',
        },
        children: [
            {
                path: 'index',
                name: 'Index',
                component: Index,
                meta: {
                    title: '首页',
                    code: 'index',
                },
            },
        ],
    },
]

export default obj
