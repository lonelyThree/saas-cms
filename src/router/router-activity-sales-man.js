import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/sale-activity',
        component: Home,
        icon: 'el-icon-box',
        leaf: false,
        redirect: 'noRedirect',
        meta: {
            title: '业务员活动',
            code: 'activitySales',
        },
        children: [
            {
                path: 'counterList',
                component: () => import('@/pages/activity-sales/CounterList'),
                meta: {
                    title: '贴柜培训',
                    code: 'counterList',
                },
            },
        ],
        
    },
]

export default obj
