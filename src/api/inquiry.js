import request from '@/utils/request';
import global_ from '@/global/global';
import { parseTime, cloneObj, byTypeGetObj , formatTime } from '@/utils';

const inquiryStatus = global_.inquiryStatus;

export function getList(params) {         
    return request({
      url: '/auth.do?cmd=queryInquiryList',
      method: 'get',
      params
    }).then(res => {

      let list = res.list

      let formatList = list.map((item)=>{

        return {

          inquiryId       : item.inquiryId,
          image           : item.imageList[0],
          createTime      : parseTime(item.createTime,'{m}-{d} {h}:{i}'),
          saysPassed      : formatTime(item.createTime / 1000),
          expireTime      : parseTime(item.expireTime,'{m}-{d} {h}:{i}'),
          name            : item.name,
          companyName     : item.companyName,
          phone           : item.phone,
          status          : byTypeGetObj(item.status,inquiryStatus).n,
          responseCount   : item.responseCount == 0 ? '—' : item.responseCount,
          confirmedCount  : item.confirmedCount,
          deputeCollect   : item.deputeCollect == 0 ? '否' : '是',
        }
      })

      res.formatList = formatList
      
      return res
    })
}

export function inquiryDetail(params) {         
  return request({
    url: '/auth.do?cmd=queryInquiryDetail',
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
  })
}

export function updateInquiryDeliveryInfo(params) {         
  return request({
    url: '/auth.do?cmd=updateInquiryDeliveryInfo',
    method: 'post',
    data: params
  })
}

export function updateInquiryStatus(params) {         
  return request({
    url: '/auth.do?cmd=updateInquiryStatus',
    method: 'post',
    data: params
  })
}

export function querySendInquiryList(params) {         
  return request({
    url: '/auth.do?cmd=querySendInquiryList',
    method: 'get',
    params
  })
}

export function getInquiryReceiptStatus(params) {         
  return request({
    url: '/auth.do?cmd=getInquiryReceiptStatus',
    method: 'get',
    params
  })
}


