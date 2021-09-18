export default [
    {
        path: '/order-manage',
        name: 'order-manage',
        meta: {
            EnCode: 'order-manage',
            name: '订单管理',
            icon: 'icon-dingdan'
        },
        component: () => import('@/pages/order-manage')
    },
    {
        path: '/vip-manage',
        name: 'vip-manage',
        meta: {
            EnCode: 'vip-manage',
            name: '用户管理',
            icon: 'icon-yonghu'
        },
        component: () => import('@/pages/vip-manage')
    }
]
// 2020/9/19 17:43:01
