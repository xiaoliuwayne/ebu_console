import request from '@/utils/request';

/**
 * 新增公告
 * @param params
 * {
    "image":"",
    "newsTitle":"测试新闻",
    "startTime":1546390803000,
    "detail":{},
    "endTime":1558139187000,
    "content":"内容",
    "newsType":1,
    "status":0
  }
 */
export function addNotice(params) {
  return request({
    url: '/auth.do?cmd=addNews',
    method: 'post',
    data: params
  });
}
/**
 * 跟新公告
 * @param params
 * {
 *
    "newsId":2,
    "image":"",
    "newsTitle":"测试新闻",
    "startTime":1546390803000,
    "detail":{},
    "endTime":1558139187000,
    "content":"内容",
    "newsType":1,
    "status":0
  }
 */
export function editNotice(params) {
  return request({
    url: '/auth.do?cmd=updateNews',
    method: 'post',
    data: params
  });
}
/**
* 公告列表
* @params params
* newsType	是	int	1-新闻；2-供应商公告；3-采购商公告
  status	是	int	状态：1-上线；2-下线
  queryType	是	String	查询方式“ALL”为查所有，其他为查当前生效
  page	是	int	页码
  pageSize	是	int	每页条数
*
*/
export function getNoticeList(params) {
  return request({
    url: '/show.do?cmd=queryNewsList',
    method: 'get',
    params
  });
}

/**
 * 公告详情
 * @params params
 * newsId	是	int	新闻ID
 */
export function queryNoticeDetail(params) {
  return request({
    url: '/show.do?cmd=queryNewsDetail',
    method: 'get',
    params
  });
}

/**
 * 修改状态
 * @params params
 * newsId	是	int	新闻ID
 * status	是	byte	状态：1-上线；2-下线
 */
export function changeNoticeStatus(params) {
  return request({
    url: '/show.do?cmd=removeNews',
    method: 'post',
    data: params
  });
}

/**
 * 删除公告
 * @params params
 * newsId	是	int	新闻ID
 */
export function removeNotice(params) {
  return request({
    url: '/show.do?cmd=removeNews',
    method: 'post',
    data: params
  });
}
