import Home from '@/pages/layout/Home'

var obj = [
    {
        path: '/course',
        component: Home,
        icon: 'el-icon-office-building',
        leaf: false,
        meta: {
            title: '课程管理',
            code: 'courseList',
        },
        redirect: 'noRedirect',
        children: [
            {
                path: 'categorList',
                component: () => import('@/pages/course/CategoryList'),
                meta: {
                    title: '分类列表',
                    code: 'placeCode',
                },
            },{
                path: 'courseList',
                component: () => import('@/pages/course/CourseList'),
                meta: {
                    title: '课程列表',
                    code: 'courseList',
                },
            },{
                path: 'teacherList',
                component: () => import('@/pages/course/TeacherList'),
                meta: {
                    title: '讲师列表',
                    code: 'placeCode',
                },
            },
        ],
    },
]

export default obj
