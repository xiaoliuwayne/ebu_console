/**
 * @Project: trunk
 * @FileName: utils
 * @Author: wayne
 * @Date: 2019/5/20
 */

// inquiryReceipt 和 updateReceipt的公共方法

function dealKeyWords(keywords) { // 处理供应商的主营
  let zz = ''; // 1 针织
  let sz = ''; // 2 梭织
  keywords.forEach(item => {
    if (item.groupId === 1) {
      zz = zz + item.keyword + ' ';
    } else {
      sz = sz + item.keyword + ' ';
    }
  });
  return [{ 'groupId': 1, 'value': zz }, { 'groupId': 2, 'value': sz }];
}

function setProviderInfo(data, providerInfo) { // 设置供应商的信息
  let keyWords = [];
  if (data.busiKeywords && data.busiKeywords.length > 0) {
    keyWords = dealKeyWords(data.busiKeywords);
  }
  providerInfo.push({ 'label': '供应商名称', 'value': data.name }); // 公司名
  providerInfo.push({ 'label': '联系人', 'value': data.linkman });
  providerInfo.push({ 'label': '移动电话', 'value': data.regTel });
  providerInfo.push({ 'label': '地址', 'value': data.address });
  providerInfo.push({ 'label': '主营业务', 'value': keyWords }); // 关键字
}

function uniqArray(array) { // 数组去重
  let temp = [];
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) === -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}

var checkNum = (rule, value, callback) => { // 验证输入值
  setTimeout(() => {
    // if (!Number.isInteger(value)) {
    if (isNaN(value)) {
      callback(new Error('请输入数字值'));
    } else {
      if (value < 0) {
        callback(new Error('必须大于0'));
      } else {
        callback();
      }
    }
  }, 500);
};

var checkPrice = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('价格不能为空'));
  }
  setTimeout(() => {
    // if (!Number.isInteger(value)) {
    if (isNaN(value)) {
      callback(new Error('请输入数字值'));
    } else {
      if (value < 0) {
        callback(new Error('必须大于0'));
      } else {
        callback();
      }
    }
  }, 500);
};
export { checkNum, uniqArray, setProviderInfo, dealKeyWords, checkPrice};
