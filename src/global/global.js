const orderStatus = [
  { t: '-1', n: '全部', s: 'ALL' },
  { t: '6', n: '待确认', s: 'UNCONFIRMED' },           // 用户银行转账，等待财务确认款项收到
  { t: '0', n: '待付款', s: 'ARREARAGE' },
  { t: '1', n: '待配货', s: 'ALLOCATION' },			// 用户已付款，等待管理员去跟进
  { t: '5', n: '待发货', s: 'HANDLED' },			    // 管理员跟进中。
  { t: '2', n: '已发货', s: 'DELIVERED' }, 			// 管理员已发货
  { t: '3', n: '已收货', s: 'RECEIVED' },  			// 用户已收货
  { t: '4', n: '已取消', s: 'CANCELED' }			// 本订单被取消（用户本人或管理员操作）
];
const customizationStatus = [     // 定制订单状态
  { t: '-1', n: '全部', s: 'ALL' },
  { t: '6', n: '待确认', s: '' },
  { t: '0', n: '预付款', s: '' },
  { t: '1', n: '生产中', s: '' },
  { t: '2', n: '确认中', s: '' },
  { t: '3', n: '已完成', s: '' },
  { t: '4', n: '已取消', s: '' },
];
const inquiryStatus = [     // 需求订单状态
  { t: '0', n: '全部',   s: 'ALL' },
  /* { t: '-1',n: '正在找', s: '' }, */
  { t: '1', n: '待审核', s: '' },
  { t: '2', n: '已发布', s: '' },
  /* { t: '3', n: '已过期', s: '' }, */
  { t: '4', n: '已关闭', s: '' },
  { t: '99',n: '委托跑腿', s: '' },
];
const userRoleType = [
  { t: '23', n: '贸易商', s: 'TRADER' },
  { t: '24', n: '贸易商品检员', s: 'AUDITOR' },
  { t: '25', n: '贸易商录入员', s: 'OPERATOR' },
  { t: '20', n: '原材料采购商', s: 'BUYER' },
  { t: '21', n: '原材料录入员', s: 'IMPORTER' },
  { t: '22', n: '原材料供应商', s: 'PROVIDER' },
  { t: '3',  n: '超级管理员', s: 'ADMIN' },
  { t: '17', n: '运营管理员', s: 'OPERATION' },
  { t: '18', n: '财务管理员', s: 'FINANCE' },
  { t: '19', n: '跟单管理员', s: 'DOCUMENTARY' },
  { t: '51', n: '采购管理人员', s: 'MANABUYER' },
  { t: '52', n: '客服人员', s: 'CUSTOMSERVICE' },
  { t: '61', n: '找布客服', s: 'LOOKINGCLOTH' }
];
const managerRoles = ['ADMIN', 'OPERATION', 'FINANCE', 'DOCUMENTARY', 'MANABUYER', 'CUSTOMSERVICE'];

const customizationConfirmType = [
  { t: '-1', n: '全部', s: 'ALL' },
  { t: '0', n: '供应商待确认', s: '' },
  { t: '0-3', n: '供应商已确认', s: '' }
]

const paymentStatus = [
  { t: '-1', n: '全部', s: 'ALL' },
  { t: '0', n: '未支付', s: '' },
  { t: '1', n: '已支付', s: '' }
]

const providerMajors = [
  { t: '31', n: '面料', s: 'CLOTH' },
  { t: '321', n: '纽扣', s: 'BUTTON' },
  { t: '322', n: '拉链', s: 'ZIPPER' }
];

const productStatus = [
  { t: '0', n: '待审核', s: 'COMFIRM' },
  { t: '3', n: '审核不通过', s: 'NOPASS' },
  { t: '1', n: '已上架', s: 'SALE' },
  { t: '2', n: '未上架', s: 'SOLD' },
  { t: '-1', n: '全部', s: 'ALL' }
];

const priceTypes = [
  { t: 1, n: '大货', s: 'LARGE' },
  { t: 2, n: '米样', s: 'SAMPLE' },
  { t: 3, n: '色卡', s: 'CARD' }
];

const priceUnit = [
  { t: 1, n: '米', s: '' },
  { t: 2, n: '公斤', s: '' },
  { t: 3, n: '码', s: '' },
  { t: 4, n: '包', s: '' },
  { t: 5, n: '条', s: '' }
];

const materialStock = [
  { t: '', n: '全部', s: 'ALL' },
  { t: '-2', n: '库存不足', s: 'STOCKLESS' }
];

const turnPurchaseType = [
  { t: '0', n: '待转', s: 'STAY' },
  { t: '1', n: '已转', s: 'TURN' },
  { t: '-1', n: '全部', s: 'ALL' }
];

const confirmType = [
  { t: '-1', n: '全部', s: 'ALL' },
  { t: '0', n: '待确认', s: 'STAYCONF' },
  { t: '1', n: '已确认', s: 'ALREADYCONF' }
];


const settlementLevel = [  //  供应商结算等级
  { t: '0', n: '未设置', s: '' },
  { t: '1', n: '30天', s: '' },
  { t: '2', n: '现金结算', s: '' },
  { t: '3', n: '3-6-1', s: '' },
  { t: '4', n: '3-7', s: '' },
  { t: '5', n: '7天', s: '' },
  { t: '6', n: '15天', s: '' },
  { t: '7', n: '60天', s: '' }
];

const setLevel = [     // 采购商结算等级
  { t: '0', n: '未设置', s: '' },
  { t: '1', n: '30天', s: '' },
  { t: '2', n: '现金结算', s: '' },
  { t: '3', n: '3-6-1', s: '' },
  { t: '4', n: '3-7', s: '' },
  { t: '5', n: '7天', s: '' },
  { t: '6', n: '15天', s: '' },
  { t: '7', n: '60天', s: '' }
];

const contractPayway = [   // 合同付款类型
  { t: '0', n: '无', s: '' },
  { t: '1', n: '月结', s: '' },
  { t: '2', n: '现金', s: '' }
]

const settleAccountStatus = {
  0: '未支付',
  1: '已支付',
  2: '已发货',
  3: '已收货'
}

/**
 * 支付方式
 * @type {{'0': string, '1': string}}
 */
const payWays = {
  0: '不用支付（赠送）',
  1: '微信',
  2: '支付宝',
  3: '余额',
  4: '转账'
};

/**
 * 定制订单的支付方式
 */
const customizationPayWays = {
  0: '未支付',
  1: '微信',
  2: '支付宝',
  3: '余额',
  4: '转账'
}

const payStrategy = [
  { t: 1, s: '30天' },
  { t: 2, s: '现金' },
  { t: 3, s: '3-6-1' },
  { t: 4, s: '3-7' },
  { t: 5, s: '7天' },
  { t: 6, s: '15天' },
  { t: 7, s: '60天' }
]

const paySchedule = {
  5: '首款',
  6: '中款',
  7: '尾款'
}
// 现货采购单的状态
const purchaseOrderStatus = [
  { t: '-1', n: '全部', s: '' },
  { t: '0', n: '待确认', s: '' },
  { t: '1', n: '待付款', s: '' },
  { t: '2', n: '待发货', s: '' },
  { t: '3', n: '待收货', s: '' },
  { t: '4', n: '已收货', s: '' },
  { t: '5', n: '已取消', s: '' }
];

// 定制采购单的状态
const customizationOrderStatus = [
  { t: '0', n: '待确认', s: '' },
  { t: '1', n: '待付款', s: '' },
  { t: '2', n: '生产中', s: '' },
  { t: '3', n: '确认中', s: '' },
  { t: '4', n: '已完成', s: '' },
  { t: '5', n: '已取消', s: '' }
]

const saleStatus = {  // 商品
  1: '现货',
  2: '定制'
};

const customizeTypes = {
  0: '现货',
  1: '新品定制',
  2: '需求定制'
}

const unitName = {
  1: '米',
  2: '公斤',
  3: '码'
};

const priceListTypes = [
  { t: '1', n: '大货价', s: 'BIGPRICE' },
  { t: '2', n: '米样价', s: 'SAMPLEPRICE' },
  { t: '3', n: '色卡价', s: 'CARDPRICE' },
  { t: '35', n: '供货价', s: 'SUPPLYPRICE' }
];

export default {
  orderStatus,
  userRoleType,
  providerMajors,
  productStatus,
  priceTypes,
  priceUnit,
  materialStock,
  turnPurchaseType,
  confirmType,
  payWays,
  purchaseOrderStatus,
  priceListTypes,
  saleStatus,
  unitName,
  managerRoles,
  settlementLevel,
  setLevel,
  payStrategy,
  contractPayway,
  customizationStatus,
  inquiryStatus,
  paymentStatus,
  settleAccountStatus,
  paySchedule,
  customizeTypes,
  customizationPayWays,
  customizationConfirmType,
  customizationOrderStatus
};
