/**
 * Created by liangjiazhang on 17/04/2018.
 */



import request from '@/utils/request';
import global_ from '@/global/global';
import { parseTime, cloneObj, byTypeGetObj, formatMoney } from '@/utils/index';
import { getPicUrl } from '@/utils/getPicUrl';

const pruchaseStatusList = global_.purchaseOrderStatus;


const propertiesList = {
  1: '纱支',
  23: '工艺',
  48: '结构',
  67: '织物',
  90: '人群',
  95: '用途',
  127: '季节',
  128: '产地',
  134: '图案',
  999: '触感'
};


/**
 * 添加采购单
 * @param params
 */
export function addNewPruchase(params) {
  return request({
    url: '/auth.do?cmd=addFabricPurchaseOrder',
    method: 'post',
    data: params
  })
}


/**
 * 修改采购单状态
 * @param params
 */
export function updateStatus(params) {
  return request({
    url: '/auth.do?cmd=updateFabricPurchaseOrderStatus',
    method: 'get',
    params
  });
}





/**
 * 待转采购单查询
 * @param params
 */
export function beTransferredOrder(params) {
  return request({
    url: '/auth.do?cmd=querySubItemList',
    method: 'get',
    params
  }).then(res => {
    let list = cloneObj(res.list || []);
    let orderList = [];
    for (let i = 0; i < list.length; i++) {
      try {
        orderList[i] = {
          purchaseOrderId: list[i].purchaseOrderId,
          purchaseOrderStatusName: list[i].purchaseOrderId === 0 ? '待转' : '已转',
          payTime: parseTime(list[i].payTime),
          orderId: list[i].orderId,
          providerName: list[i].providerName,
          img: getPicUrl(list[i].image, 1, 5),
          productName: list[i].productName,
          productCode: list[i].productCode,
          colorCode: list[i].skuCode,
          number: list[i].number + ' (' + (byTypeGetObj(list[i].saleUnit, global_.priceUnit).n || ' ') + ')',
          price: formatMoney(list[i].price),
          skuId: list[i].skuId,
          onlyId: list[i].orderId + '/' + list[i].skuId
        };
      } catch (err) {
      }
    }
    res.formatList = orderList;
    return res;
  });
}


/**
 * 查询采购单列表
 * @param params
 */
export function fabricPruchaseOrderList(params) {
  return request({
    url: '/auth.do?cmd=queryFabricPurchaseOrderList',
    method: 'get',
    params
  }).then(res => {
    let list = cloneObj(res.list || []);
    let orderList = [];
    for (let i = 0; i < list.length; i++) {

      let seed = '';
      if (list[i].payMoney === 0 || list[i].orderPrice === 0) {
        seed = 0 + "%";
      } else {
        seed = parseInt((list[i].payMoney / list[i].orderPrice)) * 100.00 + "%"
      }
      try {
        orderList[i] = {
          purchaseOrderId: list[i].purchaseOrderId,
          contractId: list[i].contractId,
          providerName: list[i].providerName,
          productName: list[i].productName,
          productCode: list[i].productCode,
          colorCode: list[i].skuCode,
          number: list[i].saleUnit > 0 ? list[i].number + global_.unitName[list[i].saleUnit] : list[i].number,
          price: formatMoney(list[i].price),
          priceTax: formatMoney(list[i].orderPrice),
          payType: global_.settlementLevel[list[i].payStrategyId].n,
          purchaseStatusName: byTypeGetObj(list[i].purchaseStatus, pruchaseStatusList).n,
          paySpeedValue: seed,
          createTime: parseTime(list[i].createTime),
          delivery: parseTime(list[i].deliveryTime)
        };
      } catch (err) {
      }
    }
    res.formatList = orderList;
    return res;
  });
}

/**
 * 供应商的定制采购单列表
 * @param {object} params 
 */
export function getCustomMadeList(params) {
  return request({
    url: '/auth.do?cmd=queryFabricPurchaseOrderList',
    method: 'get',
    params
  })
}


/**
 * 采购单详情
 * @param params
 */
export function purchaseDetail(params) {
  return request({
    url: '/auth.do?cmd=queryFabricPurchaseOrderDetail',
    method: 'get',
    params
  })
}

/**
 * 新建合同
 * @param params
 */
export function addContract(params) {
  return request({
    url: '/auth.do?cmd=addContract',
    method: 'post',
    data: params
  })
}

/**
 * 查询合同
 * @param params
 */
export function queryContract(params) {
  return request({
    url: '/auth.do?cmd=queryContractById',
    method: 'get',
    params
  })
}

/**
 * 修改合同
 * @param params
 */
export function updateContract(params) {
  return request({
    url: '/auth.do?cmd=updateContract',
    method: 'post',
    data: params
  })
}

/**
 * 查询采购单合同详情
 * @param params
 */
export function querypurchaseDetail(params) {
  return request({
    url: '/auth.do?cmd=queryFabricPurchaseOrderDetail',
    method: 'get',
    params
  })
}

/**
 * 定制采购单详情
 * @param {object} params 
 */
export function getCustomizationPurchase(params) {
  return request({
    url: '/auth.do?cmd=queryFabricPurchaseOrderDetail',
    method: 'get',
    params
  })
}

/**
 * 新品定制采购单列表
 */
export function customOrderList(params) {
  return request({
    url: '/auth.do?cmd=queryFabricPurchaseOrderList',
    method: 'get',
    params
  })
}
/**
 * 供应商采购详情
 * @param {Object} params 
 */
export function getCustomMadeDetail(params) {
  return request({
    url: '/auth.do?cmd=queryFabricPurchaseOrderDetail',
    method: 'get',
    params
  })
}