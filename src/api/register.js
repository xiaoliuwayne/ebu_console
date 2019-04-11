import request from '@/utils/request';

export function smsSend(params) {
  return request({
    url: '/smsSend?',
    method: 'get',
    params
  }).then(res => {
    return res;
  });
}

export function userReg(params) {
  return request({
    url: '/selfRegister?',
    method: 'get',
    params
  });
}

export function userMsg(params) {
  return request({
    url: '/auth.do?cmd=userMgr',
    method: 'get',
    params
  });
}

export function userInfo(params) {
  return request({
    url: '/auth.do?cmd=getUserDetail',
    method: 'get',
    params
  });
}

export function findPwd(params) {
  return request({
    url: '/findPwd?',
    method: 'get',
    params
  });
}

const option = {
  op: 7       //操作类型：7 修改用户信息
};

const smsParam = {      //操作类型：0 : 通用 ，1: 注册 ，2: 找回密码
  currency: 0,
  register: 1,
  back: 2
};

const findPwdType = {      //修改密码的方式： 0:账号密码 ,1:验证码
  password: 0,
  smsCode: 1
};

export {
    smsParam,
    option,
    findPwdType
};