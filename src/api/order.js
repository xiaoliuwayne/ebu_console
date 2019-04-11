import request from '@/utils/request';
import global_ from '@/global/global';
import { parseTime, cloneObj, byTypeGetObj } from '@/utils';

const orderStatus = global_.orderStatus;

/**
 * 发票类型
 * @type {*[]}
 */
const invoiceTypes = [
  { t: '0', n: '否', s: '' },
  { t: '1', n: '是', s: '' }
];

const logisticsTypes = [
  { t: '1', n: '自提', s: '' },
  { t: '2', n: '物流', s: '' }
];

// const payWays = [
//   { t: '0', n: '自提', s: '' },
//   { t: '1', n: '物流', s: '' }
// ];
// const payWays = {
//   0: '现金',
//   1: '月结'
// }

export function getList(params) {           //按条件查询订单列表
  return request({
    url: '/auth.do?cmd=queryOrderList',
    method: 'get',
    params
  }).then(res => {
    let list = cloneObj(res.list || []);
    let orderList = [];

    // 订单号 注册手机号 收货类型 收货人 联系电话 支付金额 是否开票 定单状态 付款类型 付款进度 下单时间  receivedAmount/payAmount

    for (let i = 0; i < list.length; i++) {
      try {
        let seed = '';
        if (list[i].receivedAmount === 0 || list[i].payAmount === 0) {
          seed = 0 + '%';
        } else {
          seed = (list[i].receivedAmount / list[i].payAmount) * 100.00 + "%"
        }
        // 订单id
        orderList.push({
          orderId: list[i].orderId,
          regTel: list[i].tel || list[i].regTel,
          productTypeName: byTypeGetObj(list[i].logisticsType, logisticsTypes).n,
          cneeName: list[i].cneeName,
          cneePhone: list[i].cneePhone,
          payAmount: list[i].payAmount,
          invoiceType: byTypeGetObj(list[i].invoiceType, invoiceTypes).n,
          orderStatusName: byTypeGetObj(list[i].status, orderStatus).n,
          payWayName: global_.payWays[list[i].payWay],
          paySpeedValue: seed,
          createTime: parseTime(list[i].createTime),
          orderStatus: list[i].status,
          productType: list[i].logisticsType,
          payWay: list[i].payWay,
          payStrategyName: byTypeGetObj(list[i].payStrategyId, global_.contractPayway).n || '',
          isSubmitAmmountDiff: list[i].isSubmitAmmountDiff == 1 ? '是' : '否'
        });
      } catch (e) {
        console.log(`第${i}条数据有问题`);
      }
    }
    res.formatList = orderList;
    return res;
  });
}


/**
 * 新增订单
 * @param params
 */
export function addNewOrder(params) {
  return request({
    url: '/auth.do?cmd=addOrder',
    method: 'get',
    params
  });
}

/**
 * 修改订单状态接口
 * @param params (appName&orderId&status)
 */
export function modifyOrderStatus(params) {
  return request({
    url: '/auth.do?cmd=updateOrderStatus',
    method: 'get',
    params
  });
}

/**
 * 更改定制订单付款方式
 * @param params
 */
export function changeOrderPayStrategy(params) {
  return request({
    url: '/auth.do?cmd=updateOrderPayStrategyId',
    method: 'get',
    params
  });
}
/**
 * 修改订单物流信息接口
 * @param {object} params
 */
export function setOrderLogistInfo(params) {
  return request({
    url: '/auth.do?cmd=setOrderLogistInfo',
    method: 'get',
    params
  });
}
/**
 * 获取订单详情
 * @param {object} params
 */
export function getDetail(params) {
  return request({
    url: '/auth.do?cmd=queryOrder',
    method: 'get',
    params
  });
}
/**
 *  订单详情
 * @param params
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export function orderDetail(params) {
  return request({
    url: '/auth.do?cmd=queryOrder',
    method: 'get',
    params
  }).then(res => {
    let orderDetail = cloneObj(res);
    let orderDetailList = [];
    for (let i = 0; i < orderDetail.items.length; i++) {
      let item = orderDetail.items[i];

      for (let j = 0; j < item.subItems.length; j++) {
        let subItem = item.subItems[j];
        // 每个列里的总金额
        let subPrice = '';
        if (subItem.number === 0 || subItem.price === 0) {
          subPrice = 0;
        } else {
          subPrice = subItem.price * subItem.number;
        }

        orderDetailList[j] = {
          providerName: item.product.providerName,
          productName: subItem.productName,
          productCode: subItem.productCode,
          colorCode: subItem.skuId,
          productType: subItem.productType,
          productNumbers: subItem.number,
          price: subItem.price,
          totalPrice: subPrice,
          chanelPrice: ''
        };
      }
    }

    let isNeedInvoice = '';
    if (res.invoiceType === 1) {
      isNeedInvoice = '是';
    } else {
      isNeedInvoice = '否';
    }

    let id = '(ID:' + res.orderId + ')';
    let otherDetail = {
      orderId: res.orderId,
      createTime: parseTime(res.createTime),
      cneeName: res.cneeName,
      cneePhone: res.cneePhone,
      cneeAddr: res.cneeAddr,
      invoiceType: isNeedInvoice,
      invoiceTitle: res.invoiceTitle,
      invoiceContent: res.invoiceContent,
      orderStatusName: byTypeGetObj(res.status, orderStatus).n,
      phone: res.cneePhone + id,
      contractId: res.contractId,
      orderStatusValue: res.status,
      logisticsType: res.logisticsType
    };

    res.otherDetail = otherDetail;
    res.formatList = orderDetailList;
    return res;
  });
}

export function getOrderDetail(orderId) {
  return request({
    url: '/auth.do?cmd=queryOrder',
    method: 'get',
    params: { orderId }
  }).then(res => {
    let orderDetailLists = [];
    for (let i = 0; i < res.items.length; i++) {
      let item = res.items[i];
      let ingredients = item.product.ingredientList;
      let properties = item.product.propertieList;
      let ingredient = '', standard, count, structure;    //成分,工艺,纱支,结构
      let clothWidth = item.product.width ? '布封:' + item.product.width + '; ' : "";
      let weight = item.product.weight ? '克重:' + item.product.weight + '; ' : "";
      for (let value in properties) {
        if (properties[value].name === '工艺') {
          standard = properties[value].name + ':' + properties[value].value + '; ';
        }
        if (properties[value].name === '纱支') {
          count = properties[value].name + ':' + properties[value].value + '; ';
        }
        if (properties[value].name === '结构') {
          structure = properties[value].name + ':' + properties[value].value + '; ';
        }
      }
      let propertiesList = clothWidth + weight + (standard || '') + (count || '') + (structure || '');
      for (let i = 0; i < ingredients.length; i++) {
        let itemName = ingredients[i].name;
        let itemValue = ingredients[i].value;
        ingredient += itemValue + '% ' + itemName + ';';
      }
      for (let j = 0; j < item.subItems.length; j++) {
        let subItem = item.subItems[j];
        let orderPrice = subItem.number * subItem.price;
        let orderDetailList = {
          productCode: subItem.productCode,
          productName: subItem.productName,
          skuCode: subItem.skuCode,
          number: subItem.number,
          price: String(subItem.price).indexOf(".") > -1 ? subItem.price : subItem.price + '.00',
          orderPrice: String(orderPrice).indexOf(".") > -1 ? orderPrice : orderPrice + '.00',
          saleUnit: global_.unitName[subItem.saleUnit],
          note: res.note,
          ingredientList: ingredient,
          propertiesList: propertiesList
        }
        orderDetailLists.push(orderDetailList);
      }
    }
    res.orderDetailLists = orderDetailLists;
    return res;
  });
}

export function getDeliveryCompany(params) {
  return request({
    url: '/auth.do?cmd=queryDeliveryCompany',
    method: 'get',
    params
  });
}

export function getDeliveryInfo(params) {
  return request({
    url: '/auth.do?cmd=queryDeliveryInfo',
    method: 'get',
    params
  });
}

export function updateOrderNote(params) {
  return request({
    url: '/auth.do?cmd=updateServiceNote',
    method: 'post',
    params
  });
}

export function updateAmount(params) {
  return request({
    url: '/auth.do?cmd=updateOrderAmount',
    method: 'post',
    data: params
  });
}
/**
 * 定制订单列表api
 * @param {Object} params
 */
export function getCustomizationList(params) {
  return request({
    url: '/auth.do?cmd=queryOrderList',
    method: 'get',
    params
  });
}
/**
 * 定制订单详情api
 * @param {Object} params
 */
export function getCustomizationDetail(params) {
  return request({
    url: '/auth.do?cmd=queryOrder',
    method: 'get',
    params
  });
}
/**
 * 客户需求定制订单详情api
 * @param {object} params
 */
export function getdemandCustomizationDetail(params) {
  return request({
    url: '/auth.do?cmd=queryOrder',
    method: 'get',
    params
  });
}
