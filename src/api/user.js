import request from '@/utils/request';
import { parseTime, cloneObj, byTypeGetObj } from '@/utils';
import global_ from '@/global/global';
import md5 from 'js-md5';

const roleType = global_.userRoleType;

const providerMajorsType = global_.providerMajors;

const settlementLevel = global_.settlementLevel;
const setLevel = global_.setLevel;

const option = {
  changeUserInfo: 7, //操作类型：修改用户信息,
  resetPass: 6,      //         重置密码,
  changeUserPass: 5, //         管理员修改用户密码,
  changeUserLevel: 16, //       修改用户角色结算等级,
  changeRegTel: 15,  //         管理员修改用户注册手机,
  changeUserName: 10,  //       管理员修改用户用户名,
  userReg: 1         //         新用户注册
}

export function login(params) {
  return request({
    url: '/Login',
    method: 'post',
    data: {
      type: params.type || 3,
      user: params.username,
      pwd: md5(params.password).toUpperCase(),
      imgCode: params.imgCode,
      roleType: params.roleType || undefined
    }
  });
}

export function getInfo(userId) {
  return request({
    url: '/auth.do?cmd=getUserDetail',
    method: 'get',
    params: { userId }
  });
}

export function getInfo2(params) {
	return request({
	  url: '/auth.do?cmd=getUserDetail',
	  method: 'get',
	  params
	});
  }

export function changeUserMgr(params) {
  return request({
    url: '/auth.do?cmd=userMgr',
    method: 'post',
    data: params
  });
}

export function changeUserMgrBatch(params) {
  return request({
    url: '/auth.do?cmd=importProvider',
    method: 'post',
    data: params
  });
}

export function selfMdfProvider(params) {
  return request({
    url: '/show.do?cmd=selfMdfProvider',
    method: 'post',
    data: params
  });
}

export function resetUserPass(params) {
  return request({
    url: '/findPwd?',
    method: 'post',
    params
  });
}

export function modifyToUserPass(params) {
  return request({
    url: '/auth.do?cmd=userMgr',
    method: 'post',
    data: {
      op: params.op || 5,
      toUserId: params.toUserId,
      newPwd: md5(params.newPass).toUpperCase()
    }
  });
}

export function modifyUserPass(params) {
  return request({
    url: '/findPwd?',
    method: 'post',
    data: {
      userName: params.userName,
      oldPwd: md5(params.oldPass).toUpperCase(),
      newPwd: md5(params.newPass).toUpperCase(),
      updatePwdType: params.updatePwdType || 0
    }
  });
}

export function getList(params) {
  return request({
    url: '/auth.do?cmd=userListQuery',
    method: 'get',
    params
  }).then(res => {
    let list = cloneObj(res.list);
    let userList = [];
    for (let i = 0; i < list.length; i++) {
      const majorListData = list[i].majorList || [];
      const majorList = [];
      try {
        for (let j = 0; j < majorListData.length; j++) {
          majorList.push(majorListData[j].major);
        }
        userList[i] = {
          formatRegisterTime: parseTime(list[i].registerTime),
          roleName: byTypeGetObj(list[i].roleType, roleType).n,
          majorBusiness: majorList.join('，'),
          roleId: list[i].roleType
        };
      } catch (err) {
      }
    }
    res.formatList = userList;
    return res;
  });
}

export function modifyUser(params) {
  return request({
    url: '/auth.do?cmd=userMgr',
    method: 'post',
    data: params
  });
}

/**
 * 供应商管理列表
 * @param params
 */
export function getProviderList(params) {
  return request({
    url: '/auth.do?cmd=materialProviderList',
    method: 'get',
    params
  }).then(res => {
    
    let list = cloneObj(res.list);
    let providerList = [];
	let marketRange = global_.marketRange

    for (let i = 0; i < list.length; i++) {
      /* let majorListNames = []; */
      let busiKeywords   = [];
      try {

        /* for (let y = 0; y < list[i].majorList.length; y++) {
          majorListNames.push(list[i].majorList[y].major);
        } */

        for(let value of list[i].busiKeywords){
          	busiKeywords.push(value.keyword)
        }

        providerList[i] = {
			providerId      : list[i].userId,
			userName        : list[i].userName,
			registerPhone	: list[i].regTel,
			providerName 	: list[i].name,
			cneeName		: list[i].linkman,
			cneePhone		: list[i].tel,
			address		 	: list[i].address,
			marketId		: byTypeGetObj(list[i].marketId, marketRange).n,
			/* majorName: majorListNames.join(','), */
			busiKeywords	: busiKeywords.join('、'),
			incomeLevel	  	: byTypeGetObj(list[i].incomeLevel, settlementLevel).n,
			createTime	  	: parseTime(list[i].registerTime),
			spuNum		  	: list[i].spuNum
        };
      } catch (err) {
      }
    }
    
    res.formatList = providerList;
    return res;
  });
}


/**
 * 查询采购商列表
 * @param params
 */
const pricePrivilege = {
  0: '销售价',
  1: '成本价',
  2: '折扣价'
}
export function getmaterialBuyerList(params) {
  return request({
    url: '/auth.do?cmd=materialBuyerList',
    method: 'get',
    params
  }).then(res => {
    let list = cloneObj(res.list);
    let userList = [];
    for (var i = 0; i < list.length; i++) {
      try {
        userList[i] = {
          userId: list[i].userId,
          regTel: list[i].regTel,
          tel: list[i].tel,
          incomeLevel: byTypeGetObj(list[i].incomeLevel, setLevel).n,
          name: list[i].name,
          linkman: list[i].linkman,
          createTime: parseTime(list[i].registerTime),
          pricePrivilege: pricePrivilege[list[i].pricePrivilege]
        };
      } catch (err) {
      }
    }
    res.formatList = userList;
    return res;
  });
}

/**
 * 查询管理员列表
 * @param params
 */
export function getmgrUserList(params) {
  return request({
    url: '/auth.do?cmd=mgrUserList',
    method: 'get',
    params
  }).then(res => {
    let list = cloneObj(res.list);
    let userList = [];
    for (let i = 0; i < list.length; i++) {
      try {
        userList[i] = {
          userId: list[i].userId,
          userName: list[i].userName,
          role: list[i].roleType,
          roleName: byTypeGetObj(list[i].roleType, global_.userRoleType).n,
          name: list[i].name,
          tel: list[i].tel,
          createTime: parseTime(list[i].registerTime)
        };
      } catch (err){
      }
    }
    res.formatList = userList;
    return res;
  });
}



export { option };
