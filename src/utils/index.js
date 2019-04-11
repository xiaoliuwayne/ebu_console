/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return ''
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {

  time = +time * 1000

  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}


/**
 * 计算两个时间之间相差的年月日
 * @param {date} startTime 开始的时间
 * @param {date} endTime 结束的时间
 */

export function calculatedTime(startTime,endTime) {

  const star = new Date(startTime).getTime()
  const end  = new Date(endTime).getTime()
  const diff = Math.abs(star - end)
  const result = Math.floor(diff / (24 * 3600 * 1000))
  return result

}

/**
 * @param {String,Number} type 传进来状态
 * @param {Array} arr 校验的数组
 * @param {String} replace 可选,校验的字段
 */
export function byTypeGetObj(type, arr, replace) {
  arr = arr || [];
  replace = replace || 't';
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][replace] == type) {
      obj = arr[i];
      obj.index = i;
      break;
    }
  }
  return obj;
}

/**
 * 复制一个对象
 * @param {object} obj
 */
export function cloneObj(obj) {
  if (typeof obj !== 'object') {
    return {};
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 设置分页数
 */
export function setTotalSize(total, page, key) {
  key = key || '';
  if (page == 0) {
    sessionStorage.setItem('totalSize' + key, total);
    return total;
  } else {
    return parseInt(sessionStorage.getItem('totalSize' + key) || 0);
  }
}
/**
 * @param {Number} ai 传进来的价格
 */
export function formatMoney(ai) {
  if (!ai) { return 0.00; }
  let number = ai,
    negative = number < 0 ? '-' : '',
    i = parseInt(number = Math.abs(+number || 0).toFixed(2), 10) + '';
  return negative + i + '.' + Math.abs(number - i).toFixed(2).slice(2);
}

export function dataLeftCompleting(bits, identifier, value) {
  value = Array(bits + 1).join(identifier) + value;
  return value.slice(-bits);
}

/**
 * @param {str}  要编码或解码的字符串
 */
export const base64 = {
  btoa(str) {
    return btoa(encodeURI(str || ''));
  },
  atob(str) {
    return decodeURI(atob(str || ''));
  }
};
