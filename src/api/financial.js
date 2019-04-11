import request from '@/utils/request';
import { parseTime } from '@/utils/index';
import { formatMoney } from '@/utils';

const STATUS = {
  0: '待确认',
  1: '已确认'
}

export function getBankTransferList(params) {           //按条件查询银行转账支付单列表
  return request({
    url: '/auth.do?cmd=queryBankTransferList',
    method: 'get',
    params
  }).then(res => {
    res.list.forEach(item => {
      item.statusName = STATUS[item.status];
      item.formatTime = parseTime(item.createTime);
      item.payTypeName = '转账';
    });
    return res;
  });
}

export function getBankTransferDetail(params) {
  return request({
    url: '/auth.do?cmd=queryBankTransferDetail',
    method: 'get',
    params
  }).then(res => {
    res.statusName = STATUS[res.status];
    res.formatTime = parseTime(res.createTime);
    res.orderList.forEach(item => {
      item.paymentProgress = item.receivedAmount / item.payAmount * 100;
    });
    return res;
  });
}

/**
 * 管理员后台采购商结算列表
 */
export function getSettleAccounts(params) {
  return request({
    url: '/auth.do?cmd=queryCashNoteList',
    method: 'get',
    params
  })
}

/**
 * 管理员后台采购商结算详情
 * @param {Object} params 
 */
export function getSettleAccountDetail(params) {
  return request({
    url: '/auth.do?cmd=queryCashNote',
    method: 'get',
    params
  })
}

export function modifyBankTransferStatus(params) {
  return request({
    url: '/auth.do?cmd=updateBankTransferStatus',
    method: 'get',
    params
  });
}


/**
 * 获取供应商结算列表
 * @param {Object} params 
 */
export function getSupplierSettleAccountList(params) {
  return request({
    url: '/auth.do?cmd=queryCashDisbursementList',
    method: 'get',
    params
  })
}

/**
 * 管理员后台供应商商结算详情
 * @param {object} params 
 */
export function getSupplierSettleAccountDetail(params) {
  return request({
    url: '/auth.do?cmd=queryFabricPurchaseOrderDetail',
    method: 'get',
    params
  })
}
/**
 * 供应商结算详情订单信息保存
 * @param {object} params 
 */
export function modification(params) {
  return request({
    url: '/auth.do?cmd=updateFabricPurchaseOrderInvoiceInfo',
    method: 'get',
    params
  })
}

/**
 * 供应商结算详情支付信息保存
 * @param {object} params 
 */
export function payDetailModification(params) {
  return request({
    url: '/auth.do?cmd=confirmPayCashDisbursement',
    method: 'get',
    params
  })
}
