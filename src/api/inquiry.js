import request from '@/utils/request';
import global_ from '@/global/global';
import { parseTime, cloneObj, byTypeGetObj, formatTime } from '@/utils';

const inquiryStatusD = global_.inquiryStatusD;

export function getList(params) {
  return request({
    url: '/auth.do?cmd=queryInquiryList',
    method: 'get',
    params
  }).then(res => {

	let list = res.list


  let formatList = list.map((item) => {

	let deliverPay = item.deliverPayTime ? `${parseTime(item.deliverPayTime, '{m}-{d} {h}:{i}')} ￥ ${item.deliverPayAmount}`:'未支付'

	let createTime = ((Date.now() - item.createTime) / 1000 / 60 / 60) > 24 ? parseTime(item.createTime, '{m}-{d} {h}:{i}') : parseTime(item.createTime, '{m}-{d} {h}:{i}') + formatTime(item.createTime / 1000)


		return {

			inquiryId		: item.inquiryId,
			image			: item.imageList[0],
			createTime		: createTime,
			saysPassed		: formatTime(item.createTime / 1000),
			expireTime		: parseTime(item.expireTime, '{m}-{d} {h}:{i}'),
			name			: item.name,
			companyName		: item.companyName,
			phone			: item.phone,
			status			: byTypeGetObj(item.status, inquiryStatusD).n,
			responseCount	: item.responseCount == 0 ? '—' : item.responseCount,
			confirmedCount	: item.confirmedCount,
			deliverPay 		: deliverPay,
			deputeCollect	: item.deputeCollect == 0 ? '否' : '是',
			detail			: item.detail

		}

	})

    res.formatList = formatList

    return res
  });
}

export function inquiryDetail(params) {
  return request({
    url: '/auth.do?cmd=queryInquiryDetail',
    method: 'get',
    params
  })
}

export function providerListByMemo(params) {
  return request({
    url: '/auth.do?cmd=providerListByMemo',
    method: 'get',
    params
  })
}



export function updateInquiry(params) {
  return request({
    url: '/auth.do?cmd=updateInquiry',
    method: 'post',
    data: params
  })
}

export function providerListByKeys(params) {
  return request({
    url: '/auth.do?cmd=providerListByKeys',
    method: 'get',
    params
  })
}

export function sendInquiry(params) {
  return request({
    url: '/auth.do?cmd=sendInquiry2Users',
    method: 'post',
    data: params
  })
}

export function getInquiryReceiptList(params) {
  return request({
    url: '/auth.do?cmd=getInquiryReceiptList',
    method: 'get',
    params
  });
}

export function updateInquiryDeliveryInfo(params) {
  return request({
    url: '/auth.do?cmd=updateInquiryDeliveryInfo',
    method: 'post',
    data: params
  });
}

export function updateInquiryStatus(params) {
  return request({
    url: '/auth.do?cmd=updateInquiryStatus',
    method: 'post',
    data: params
  });
}

export function querySendInquiryList(params) {
  return request({
    url: '/auth.do?cmd=querySendInquiryList',
    method: 'get',
    params
  });
}

export function getInquiryReceiptStatus(params) {
  return request({
    url: '/auth.do?cmd=getInquiryReceiptStatus',
    method: 'get',
    params
  });
}

export function providerListFilter(params) {
  return request({
    url: '/auth.do?cmd=providerListFilter',
    method: 'get',
    params
  });
}

// 新增需求回单
export function insertInquiryReceipt(params) {
  return request({
    url: '/auth.do?cmd=insertInquiryReceipt',
    method: 'post',
    // receipt: params
    data: params
  });
}

// 修改回单信息
export function updateInquiryReceiptInfo(params) {
  return request({
    url: '/auth.do?cmd=updateInquiryReceiptInfo',
    method: 'post',
    data: params
  });
}

// 回单详情
export function queryInquiryReceipt(params) {
  return request({
    url: '/auth.do?cmd=queryInquiryReceipt',
    // url: '/show.do?cmd=queryInquiryReceipt',
    method: 'get',
    params
  });
}

