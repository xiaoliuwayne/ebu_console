import request from '@/utils/request';
import { parseTime, cloneObj, byTypeGetObj, formatMoney } from '@/utils';
import { getPicUrl } from '@/utils/getPicUrl';
import global_ from '@/global/global';
const status = global_.productStatus;

const priceListTypes = global_.priceListTypes;


/**
 * 面料列表， SPU
 * @param params
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export function getClothList(params) {
  return request({
    url: '/auth.do?cmd=queryFabricList',
    method: 'get',
    params
  }).then(res => {
    let list = cloneObj(res.list);
    let productList = [];
    for (let i = 0; i < list.length; i++) {
      let saleOnePrice = '';
      let saleTwoPrice = '';
      let saleThrePrice = '';
      if (list[i].priceList.length > 0) {
        for (let y = 0; y < list[i].priceList.length; y++) {
          switch (list[i].priceList[y].priceType + '') {
            case byTypeGetObj('BIGPRICE', priceListTypes, 's').t:
              saleOnePrice = list[i].priceList[y].salePrice;
              break;
            case byTypeGetObj('SAMPLEPRICE', priceListTypes, 's').t:
              saleTwoPrice = list[i].priceList[y].salePrice;
              break;
            case byTypeGetObj('SUPPLYPRICE', priceListTypes, 's').t:
              saleThrePrice = list[i].priceList[y].salePrice;
              break;
          }
        }
      }
      let catStr = [];
      list[i].catList.forEach(v => {
        catStr.push(v.catName);
      });
      const status = global_.productStatus;
      list[i].catStr = catStr.join('--');
      list[i].saleStatus = global_.saleStatus[list[i].saleStatus];
      list[i].statusName = byTypeGetObj(list[i].status, status).n;
      list[i].createTime = parseTime(list[i].createTime);
      list[i].payStrategyName = global_.payStrategy[list[i].payStrategyId] || '-';
      list[i].unitName = global_.unitName[list[i].saleUnit];
      list[i].priceTax = saleThrePrice;
      list[i].bigPrice = saleOnePrice;
      list[i].samplePrice = saleTwoPrice;
    }
    res.formatList = list;
    return res;
  });
}

export function getProductDetail(params) {
  return request({
    url: '/show.do?cmd=queryProductDetail',
    method: 'get',
    params
  });
}
export function getProductDetailSync(params) {
  return request({
    url: '/show.do?cmd=queryProductDetail',
    method: 'get',
    params
  });
}

export function getAttribute(catId) {
  return request({
    url: '/show.do?cmd=queryAttribute',
    method: 'get',
    params: { catId }
  });
}

/**
 * 添加/修改产品
 * params = Object
 *  productType
 *  product
 * @param params
 */
export function addProduct(params) {
  return request({
    url: '/auth.do?cmd=addProduct',
    method: 'post',
    data: params
  });
}

export function modifyProduct(params) {
  return request({
    url: '/auth.do?cmd=modifyProduct',
    method: 'post',
    data: params
  });
}

/**
 * 修改产品SKU
 * productType
 * productId
 * op: 1-添加，2-修改,4-删除
 * skuIds
 * skus
 * @param params
 */
export function modifyProductSku(params) {
  return request({
    url: '/auth.do?cmd=productSKUMgr',
    method: 'post',
    data: params
  });
}

export function modifyProductStatus(params) {
  return request({
    url: '/auth.do?cmd=modifyProductStatus',
    method: 'post',
    data: params
  });
}

/**
 * 获取拉链列表、纽扣列表 的方法
 * 方法名一样，传参值不相同
 * @param params
 */
export function getzipperList(params) {
  return request({
    url: '/auth.do?cmd=queryAccessoriesList',
    method: 'get',
    params
  }).then(res => {
    console.log(res.list);

    let zipperList = cloneObj(res.list);
    for (let i = 0; i < zipperList.length; i++) {
      zipperList[i].imgUrl = getPicUrl(zipperList[i].image, 1, 0);
      zipperList[i].statusName = byTypeGetObj(zipperList[i].status, status).n || '';
      zipperList[i].creationTime = parseTime(zipperList[i].createTime);
      let priceList = zipperList[i].priceList;
      for (let j = 0, priceType = 0; j < priceList.length; j++) {
        priceType = priceList[j].priceType;
        if (priceType === 1) {
          zipperList[i].price = formatMoney(priceList[j].salePrice || 0);
        } else if (priceType === 2) {
          zipperList[i].samplePrice = formatMoney(priceList[j].salePrice || 0);
        }
      }
    }
    res.formatList = zipperList;
    return res;
  });

}


/**
 * 查询面料列表 sku
 * @param params
 */
export function queryProductList(params) {
  return request({
    url: '/auth.do?cmd=queryFabricSKUList',
    method: 'get',
    params
  }).then(res => {
    let list = cloneObj(res.list || []);
    let productList = [];
    for (let i = 0; i < list.length; i++) {
      productList[i] = {
        providerName: list[i].providerName,
        providerId: list[i].providerId,
        spuId: list[i].productId,
        skuId: list[i].skuId,
        productCode: list[i].productCode,
        colorCode: list[i].skuCode,
        stock: list[i].stock,
        productName: list[i].productName,
        productType: global_.saleStatus[list[i].saleStatus],
        unitName: global_.unitName[list[i].saleUnit],
        unit: list[i].saleUnit,
        statusName: byTypeGetObj(list[i].status, global_.productStatus).n,
        status: list[i].status,
        priceTax: formatMoney(list[i].supplyPrice),
        image: getPicUrl(list[i].image, 1, 5)
      };
    }
    res.formatList = productList;
    return res;
  });
}

/**
  *http://ts.ebdaowei.com/ebuapi/show.do?cmd=queryCateMenu&productType=6
  * 查询面料分类和属性
  * */
export function queryCateMenu(productType) {
  return request({
    url: '/show.do?cmd=queryCateMenu',
    method: 'get',
    params: { productType }
  });
}

/**
 *http://ts.ebdaowei.com/ebuapi/show.do?cmd=queryFabricCatAttr&catCode=KN02
 * 查询面料分类和属性
 * */
export function queryFabricCatAttr(catId) {
  return request({
    url: '/show.do?cmd=queryFabricCatAttr',
    method: 'get',
    params: { catId }
  });
}

/**
 *http://ts.ebdaowei.com/ebuapi/show.do?cmd=fabricKeywords&groupId=0
 @param groupId 商品id，只有0、1
 * 查询面料分类和属性
 * */
export function fabricKeywords(groupId) {
  return request({
    url: '/show.do?cmd=fabricKeywords',
    method: 'get',
    params: { groupId }
  });
}
