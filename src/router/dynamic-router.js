
/* 用户中心 */
const Goods = () => import('pages/goods-manage')
const GoodsList = () => import('pages/goods-manage/goods-list')
const GoodsClassify = () => import('pages/goods-manage/goods-classify')

const dynamicRoutes = [
    {
        path: '/goods',
        component: Goods,
        name: 'goods',
        meta: {
            name: '用户中心',
            icon: 'icon-order-manage'
        },
        children: [
            {
                path: 'list',
                name: 'goods-list',
                component: GoodsList,
                meta: {
                    name: '个人资料',
                    icon: 'icon-home'
                }
            },
            {
                path: 'classify',
                name: 'goods-classify',
                component: GoodsClassify,
                meta: {
                    name: '站内通知',
                    icon: 'icon-product-manage'
                }
            }
        ]
    }
]

export default dynamicRoutes
