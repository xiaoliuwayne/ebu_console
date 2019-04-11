import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  // { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/login', component: () => import('@/views/login/admin_login'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/refresh', component: () => import('@/views/refresh'), hidden: true },
  { path: '/register', component: () => import('@/views/login/register'), name: 'Register', hidden: true },
  { path: '/companyMsg', component: () => import('@/views/login/companyMsg'), hidden: true },
  { path: '/welcome', component: () => import('@/views/login/welcome'), hidden: true },
  { path: '/forgetPass', name: 'ForgetPass', component: () => import('@/views/login/forgetPass'), hidden: true },
  { path: '/resetPass', name: 'resetPass', component: () => import('@/views/login/resetPass'), hidden: true },
  {
    path: '/user',
    component: Layout,
    redirct: 'noredirect',
    hidden: true,
    name: 'user',
    meta: { title: '用户管理' },
    children: [
      {
        path: 'changePwd',
        name: 'changePwd',
        hidden: true,
        component: () => import('@/views/user/changePwd'),
        meta: { title: '密码修改' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { // 需求订单管理
    path: '',
    component: Layout,
    redirct: 'noredirect',
    name: 'inquiry',
    meta: { title: '需求订单管理', icon: 'order', role: ['ADMIN', 'LOOKINGCLOTH'] },
    children: [
      {
        path: 'inquiryList',
        name: 'inquiryList',
        component: () => import('@/views/manager/inquiry/inquiryList'),
        meta: { title: '需求订单列表', icon: '', role: ['ADMIN', 'LOOKINGCLOTH'] }
      },
      {
        path: 'inquiryDetail',
        name: 'inquiryDetail',
        hidden: true,
        component: () => import('@/views/manager/inquiry/inquiryDetail'),
        meta: { title: '需求订单详情', icon: '', role: ['ADMIN', 'LOOKINGCLOTH'] }
      },
      {
        path: 'inquiryReceipt',
        name: 'inquiryReceipt',
        hidden: true,
        component: () => import('@/views/manager/inquiry/inquiryReceipt'),
        meta: { title: '新增需求回单', icon: '', role: ['ADMIN', 'LOOKINGCLOTH'] }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'userManagement',
    alwaysShow: true,
    meta: { title: '用户管理', icon: 'manager', role: ['ADMIN', 'LOOKINGCLOTH'] },
    children: [
      {
        path: 'providerList',
        name: 'providerList',
        component: () => import('@/views/manager/userManagement/providerList'),
        meta: { title: '供应商管理', icon: '', role: ['ADMIN', 'LOOKINGCLOTH'] }
      },
      {
        path: 'buyerList',
        name: 'buyerList',
        component: () => import('@/views/manager/userManagement/buyerList'),
        meta: { title: '采购商管理', icon: '', role: ['ADMIN'] }
      },
      {
        path: 'managerList',
        name: 'managerList',
        component: () => import('@/views/manager/userManagement/managerList'),
        meta: { title: '管理员管理', icon: '', role: ['ADMIN'] }
      },
      {
        path: 'providerDetail',
        name: 'providerDetail',
        hidden: true,
        component: () => import('@/views/manager/userManagement/providerDetail'),
        meta: { title: '供应商详情', icon: '', role: ['ADMIN', 'LOOKINGCLOTH'] }
      },
      {
        path: 'buyerDetail',
        name: 'buyerDetail',
        hidden: true,
        component: () => import('@/views/manager/userManagement/buyerDetail'),
        meta: { title: '采购商详情', icon: '', role: ['ADMIN'] }
      },
      {
        path: 'managerEdit',
        name: 'managerEdit',
        hidden: true,
        component: () => import('@/views/manager/userManagement/managerEdit'),
        meta: { title: '新建编辑', icon: '', role: ['ADMIN'] }
      },
      {
        path: 'providerCreated',
        name: 'providerCreated',
        hidden: true,
        component: () => import('@/views/manager/userManagement/providerCreated'),
        meta: { title: '新建供应商', icon: '', role: ['ADMIN', 'LOOKINGCLOTH'] }
      },
      {
        path: 'providerCreatedBatch',
        name: 'providerCreatedBatch',
        hidden: true,
        component: () => import('@/views/manager/userManagement/providerCreatedBatch'),
        meta: { title: '批量新建供应商', icon: '', role: ['ADMIN', 'LOOKINGCLOTH'] }
      },
      {
        path: 'managerCreated',
        name: 'managerCreated',
        hidden: true,
        component: () => import('@/views/manager/userManagement/managerCreated'),
        meta: { title: '新建账号', icon: '', role: ['ADMIN'] }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'clothProduct',
    meta: { title: '面料商品管理', icon: 'shop', role: ['ADMIN', 'PROVIDER', 'CUSTOMSERVICE', 'MANABUYER'] },
    children: [
      {
        path: 'providerClothManage',
        name: 'providerClothManage',
        component: () => import('@/views/manager/product/providerClothManage'),
        meta: { title: '按供应商面料管理', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'clothList',
        name: 'clothList',
        component: () => import('@/views/manager/product/clothList'),
        meta: { title: '面料列表', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'clothList',
        name: 'clothList',
        component: () => import('@/views/manager/product/myClothList'),
        meta: { title: '面料列表', icon: '', role: ['PROVIDER'] }
      },
      // {
      //   path: 'auditList',
      //   name: 'auditList',
      //   component: () => import('@/views/manager/product/auditList'),
      //   meta: { title: '待审核列表', icon: '', role: ['ADMIN'] }
      // },
      // {
      //   path: 'auditedList',
      //   name: 'auditedList',
      //   component: () => import('@/views/manager/product/auditedList'),
      //   meta: { title: '已审核列表', icon: '', role: ['ADMIN'] }
      // },
      {
        path: 'providerClothList',
        name: 'providerClothList',
        hidden: true,
        component: () => import('@/views/manager/product/providerClothList'),
        meta: { title: '供应商面料列表', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'clothAdd',
        name: 'clothAdd',
        hidden: true,
        component: () => import('@/views/manager/product/clothEdit'),
        meta: { title: '新增面料', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'clothAdd',
        name: 'clothAdd',
        component: () => import('@/views/manager/product/clothAdd'),
        meta: { title: '新增面料', icon: '', role: ['PROVIDER'] }
      },
      {
        path: 'clothEdit',
        name: 'clothEdit',
        hidden: true,
        component: () => import('@/views/manager/product/clothEdit'),
        meta: { title: '编辑面料', icon: '', role: ['ADMIN', 'PROVIDER', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'clothDetail',
        name: 'clothDetail',
        hidden: true,
        component: () => import('@/views/manager/product/clothDetail'),
        meta: { title: '商品详情', icon: '', role: ['ADMIN', 'PROVIDER', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      // {
      //   path: 'clothEditNew',
      //   name: 'clothEditNew',
      //   hidden: true,
      //   component: () => import('@/views/product/clothEdit'),
      //   meta: { title: '面料详情', icon: '', role: ['ADMIN'] }
      // }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'colorCard',
    alwaysShow: true,
    meta: { title: '色卡标签管理', icon: 'shop', role: ['ADMIN'] },
    children: [
      {
        path: 'colorCardList',
        name: 'colorCardList',
        component: () => import('@/views/manager/product/colorCardList'),
        meta: { title: '标签列表', icon: '', role: ['ADMIN'] }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'material',
    alwaysShow: true,
    meta: { title: '面料库存管理', icon: 'stock', role: ['ADMIN', 'PROVIDER', 'CUSTOMSERVICE', 'MANABUYER'] },
    children: [
      {
        path: 'materialList',
        name: 'materialList',
        component: () => import('@/views/manager/materialStock/materialList'),
        meta: { title: '面料库存列表', icon: '', role: ['ADMIN', 'PROVIDER', 'CUSTOMSERVICE', 'MANABUYER'] }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'order',
    meta: { title: '现货订单管理', icon: 'order', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] },
    children: [
      {
        path: 'orderList',
        name: 'orderList',
        component: () => import('@/views/manager/order/orderList'),
        meta: { title: '订单列表', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        hidden: true,
        component: () => import('@/views/manager/order/orderDetail'),
        meta: { title: '订单详情', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'orderContract',
        name: 'orderContract',
        hidden: true,
        component: () => import('@/views/contract/orderContract'),
        meta: { title: '订单合同', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'oldOrder',
        name: 'oldOrder',
        component: () => import('@/views/manager/order/oldOrder'),
        meta: { title: '旧订单数据', icon: '', role: ['ADMIN'] }
      }
    ]
  },
  { // 定制订单管理菜单
    path: '',
    component: Layout,
    redirct: 'noredirect',
    name: 'customization',
    meta: { title: '定制订单管理', icon: 'order', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] },
    children: [
      {
        path: 'customizationList',
        name: 'customizationList',
        component: () => import('@/views/manager/customization/customizationList'),
        meta: { title: '定制订单列表', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'customizationDetail',
        name: 'customizationDetail',
        hidden: true,
        component: () => import('@/views/manager/customization/customizationDetail'),
        meta: { title: '新品定制订单详情', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      },
      {
        path: 'demandCustomizationDetail',
        name: 'demandCustomizationDetail',
        hidden: true,
        component: () => import('@/views/manager/customization/demandCustomizationDetail'),
        meta: { title: '需求定制订单详情', icon: '', role: ['ADMIN', 'CUSTOMSERVICE', 'MANABUYER'] }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'purchase',
    meta: { title: '采购单管理', icon: 'order', role: ['ADMIN', 'PROVIDER', 'MANABUYER'] },
    children: [
      {
        path: 'turnToPurchase',
        name: 'turnToPurchase',
        component: () => import('@/views/manager/purchase/turnToPurchase'),
        meta: { title: '待转采购单', icon: '', role: ['ADMIN', 'MANABUYER'] }
      },
      {
        path: 'stockPurchase',
        name: 'stockPurchase',
        component: () => import('@/views/manager/purchase/stockPurchase'),
        meta: { title: '现货采购单', icon: '', role: ['ADMIN', 'PROVIDER', 'MANABUYER'] }
      },
      {
        path: 'customizationPurchase',
        name: 'customizationPurchase',
        component: () => import('@/views/manager/purchase/customizationPurchase'),
        meta: { title: '新品定制采购单', icon: '', role: ['ADMIN', 'MANABUYER'] }
      },
      {
        path: 'customizationPurchaseDetail',
        name: 'customizationPurchaseDetail',
        hidden: true,
        component: () => import('@/views/manager/purchase/customizationPurchaseDetail'),
        meta: { title: '定制采购单详情', icon: '', role: ['ADMIN', 'MANABUYER'] }
      },
      {
        path: 'purchaseContract',
        name: 'purchaseContract',
        hidden: true,
        component: () => import('@/views/contract/purchaseContract'),
        meta: { title: '采购合同', icon: '', role: ['ADMIN', 'PROVIDER', 'MANABUYER'] }
      },
      {
        path: 'purchaseDetail',
        name: 'purchaseDetail',
        hidden: true,
        component: () => import('@/views/manager/purchase/purchaseDetail'),
        meta: { title: '采购详情', icon: '', role: ['ADMIN', 'PROVIDER', 'MANABUYER'] }
      },
      {
        path: 'customMadeList', // 供应商的定制采购单
        name: 'customMadeList',
        component: () => import('@/views/manager/purchase/customMadeList'),
        meta: { title: '定制采购单', icon: '', role: ['PROVIDER'] }
      },
      {
        path: 'customMadeDetail',
        name: 'customMadeDetail',
        hidden: true,
        component: () => import('@/views/manager/purchase/customMadeDetail'),
        meta: { title: '定制采购单详情', icon: '', role: ['PROVIDER'] }
      }
    ]
  },
  
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'financial',
    meta: { title: '财务管理', icon: 'finance', role: ['ADMIN'] },
    children: [
      {
        path: 'bankTransferList',
        name: 'bankTransferList',
        component: () => import('@/views/manager/financial/bankTransferList'),
        meta: { title: '转账确认列表', icon: '', role: ['ADMIN'] }
      },
      {
        path: 'bankTransferDetail',
        name: 'bankTransferDetail',
        hidden: true,
        component: () => import('@/views/manager/financial/bankTransferDetail'),
        meta: { title: '转账详情', icon: '', role: ['ADMIN'] }
      },
      {
        path: 'settleAccounts',
        name: 'settleAccounts',
        component: () => import('@/views/manager/financial/settleAccounts'),
        meta: { title: '采购商结算', icon: '', role: ['BUYER', 'ADMIN'] } // 采购商结算
      },
      {
        path: 'settleAccountDetail',
        name: 'settleAccountDetail',
        hidden: true,
        component: () => import('@/views/manager/financial/settleAccountDetail'),
        meta: { title: '结算详情', icon: '', role: ['BUYER', 'ADMIN'] }  // 采购商结算详情
      },
      {
        path: 'supplierSettleAccountList',
        name: 'supplierSettleAccountList',
        component: () => import('@/views/manager/financial/supplierSettleAccountList'),
        meta: { title: '供应商结算', icon: '', role: ['PROVIDER', 'ADMIN'] } // 供应商结算
      },
      {
        path: 'supplierSettleAccountDetail',
        name: 'supplierSettleAccountDetail',
        hidden: true,
        component: () => import('@/views/manager/financial/supplierSettleAccountDetail'),
        meta: { title: '结算详情', icon: '', role: ['PROVIDER', 'ADMIN'] } // 供应商结算详情
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'noredirect',
    name: 'account',
    meta: { title: '账户管理', icon: 'user', role: ['PROVIDER'] },
    children: [
      {
        path: 'accountInfo',
        name: 'accountInfo',
        component: () => import('@/views/provider/account/accountInfo'),
        meta: { title: '账号信息', icon: '', role: ['PROVIDER'] }
      },
      {
        path: 'setNewPass',
        name: 'setNewPass',
        hidden: true,
        component: () => import('@/views/provider/account/resetPass'),
        meta: { title: '重置密码', icon: '', role: ['PROVIDER'] }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirct: 'noredirect',
    name: 'supplierFinance',
    meta: { title: '财务管理', icon: 'finance', role: ['PROVIDER'] },
    children: [
      {
        path: 'supplierAccountList',
        name: 'supplierAccountList',
        component: () => import('@/views/manager/financial/supplierAccountList'),
        meta: { title: '结算', icon: '', role: ['PROVIDER'] }
      },
      {
        path: 'supplierAccountDetail',
        name: 'supplierAccountDetail',
        hidden: true,
        component: () => import('@/views/manager/financial/supplierAccountDetail'),
        meta: { title: '结算详情', icon: '', role: ['PROVIDER'] }
      }
    ]
  },
  // {
  //   path: '',
  //   component: Layout,
  //   redirct: 'noredirect',
  //   name: 'notice',
  //   meta: { title: '运营管理', icon: 'finance', role: ['ADMIN'] },
  //   children: [
  //     {
  //       path: 'noticeList',
  //       name: 'noticeList',
  //       component: () => import('@/views/notice/list'),
  //       meta: { title: '公告列表', icon: '', role: ['ADMIN'] }
  //     },
  //     {
  //       path: 'noticeAdd',
  //       name: 'noticeAdd',
  //       hidden: true,
  //       component: () => import('@/views/notice/add'),
  //       meta: { title: '新增公告', icon: '', role: ['ADMIN'] }
  //     },
  //     {
  //       path: 'noticeEdit',
  //       name: 'noticeEdit',
  //       hidden: true,
  //       component: () => import('@/views/notice/edit'),
  //       meta: { title: '编辑公告', icon: '', role: ['ADMIN'] }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    redirct: 'noredirect',
    hidden: true,
    name: 'userAdmin',
    meta: { title: '用户管理' },
    children: [
      {
        path: 'changeUserPwd',
        name: 'changeUserPwd',
        hidden: true,
        component: () => import('@/views/user/changeUserPwd'),
        meta: { title: '密码修改', role: ['ADMIN'] }
      }
    ]
  },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'testtest',
  //   alwaysShow: true,
  //   meta: { title: '测试测试', icon: 'shop', role: ['ADMIN'] },
  //   children: [
  //     {
  //       path: 'test',
  //       name: 'test',
  //       component: () => import('@/views/test'),
  //       meta: { title: '测试页面', icon: '', role: ['ADMIN'] }
  //     }
  //   ]
  // }
];
