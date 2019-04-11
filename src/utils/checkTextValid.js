/**
 * 检验文本或对象的值是否含有英文状态单双引号
 * 所要过滤的符号写入正则表达式中，注意，一些符号要用'\'转义.
 * params 可为字符串或者object
 * reg正则默认为验证单双引号，可传值重写
 * 试例：
 * if(checkAllTextValid('string',/reg/))
 * alert("表单中所有文本框通过校验！");
 */

export function checkAllTextValid(params, reg) {
  reg = reg || /(["'])/;
  let result = true;
  if (typeof params === 'string') {
    if (reg.test(params)) {
      result = false;
    }
  } else if (typeof params === 'object') {
    for (let k in params) {
      result = checkAllTextValid(params[k], reg);
      if (!result) {
        return result;
      }
    }
  }
  return result;
}
