<template>
  <div class="cloth-edit">
    <el-card class="provider-wrap">
      <div class="clearfix">
        <div><span>供应商：{{providerName}}</span></div>
      </div>
    </el-card>
    <actions-wrap :sku-types="skuTypes" :saveProduct="saveProduct"></actions-wrap>
    <div class="product-info-wrap">
      <cloth-prop :detail.sync="detail" :ingredientData="ingredientData" :units="units"></cloth-prop>
      <product-label :list.sync="propertieList"></product-label>
    </div>
    <product-image :image-list.sync="imageList"></product-image>
    <sku-list :skuList.sync="skuList"></sku-list>
    <actions-wrap :sku-types="skuTypes" :saveProduct="saveProduct"></actions-wrap>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getProductDetail, getAttribute, addProduct, modifyProduct, modifyProductSku } from '@/api/product';
  import { getInfo } from '@/api/user';
  import ActionsWrap from './components/ActionsWrap';
  import ClothProp from './components/ClothProp';
  import ProductLabel from './components/Label';
  import ProductImage from './components/Image';
  import SkuList from './components/SkuList';
  import { checkAllTextValid } from '@/utils/checkTextValid';
  import { getPicUrl } from '@/utils/getPicUrl';

  export default {
    name: 'cloth-edit',
    data() {
      return {
        uid: this.$route.query.uid || this.$store.getters.userId,
        spuId: this.$route.query.pid,
        productType: 6,
        providerName: '',
        detail: {
          aliasName: '',
          brand: '',
          weight: '',
          maxWeight: '',
          width: '',
          maxWidth: '',
          popType: '',
          productCode: '',
          productName: '',
          saleUnit: '1',
          saleStatus: '1',
          ingredientList: [
            { name: '', value: 0 }
          ],
          supplyPrice: 0,
          bulkPrice: 0,
          samplePrice: 0
        },
        imageList: [],
        skuList: [],
        ingredientData: [],
        units: [],
        propertieList: [
          { key: 'aliasName', name: '常用名称', value: '', type: 'input' },
          { id: 67,  name: '织物', data: [], value: '', type: 'dialog', radio: '', visible: false, multiple: true, required: true },
          { id: 23,  name: '工艺', data: [], value: '', type: 'dialog', checked: [], visible: false, multiple: true, required: true },
          { id: 134, name: '图案', data: [], value: '', type: 'dialog', radio: '', visible: false, required: true },
          { id: 1,   name: '纱支', data: [], value: '', type: 'dialog', radio: '', visible: false },
          { id: 48,  name: '结构', data: [], value: '', type: 'dialog', checked: [], visible: false },
          { id: 77,  name: '功能', data: [], value: '', type: 'dialog', checked: [], visible: false, multiple: true },
          { id: 95,  name: '用途', data: [], value: '', type: 'dialog', checked: [], visible: false, multiple: true },
          { id: 127, name: '季节', data: [], value: '', type: 'radio' },
          { id: 90,  name: '人群', data: [], value: '', type: 'radio' }
        ],
        skuTypes: [{ key: 'small', name: '小布' }, { key: 'cut', name: '剪版' }, { key: 'big', name: '套版' }]
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        getAttribute(31).then(list => {
          this.propertieList.forEach(prop => {
            let pid = prop.id;
            list.forEach(item => {
              let li_id = item.id;
              if (pid === li_id) {
                prop.data = item.attributeList;
                if (prop.type === 'radio') {
                  prop.value = item.attributeList[0].name;
                }
              } else if (li_id === 170) {
                this.ingredientData = item.attributeList;
              } else if (li_id === 161) {
                this.units = item.attributeList;
              }
            });
          });
        }).then(() => {
          if (this.spuId) {
            getProductDetail({ productId: this.spuId, productType: this.productType }).then(res => {
              this.providerName = res.providerName;
              this.uid = res.providerId;
              this.detail = res;
              this.detail.saleStatus = this.detail.saleStatus.toString();
              this.detail.saleUnit = this.detail.saleUnit.toString();
              this.detail.priceList.forEach(v => {
                let type = v.priceType;
                if (type === 35) {
                  this.detail.supplyPrice = v.salePrice;
                } else if (type === 1) {
                  this.detail.bukPrice = v.salePrice;
                } else if (type === 2) {
                  this.detail.samplePrice = v.salePrice;
                }
              });
              let propertieList = this.detail.propertieList || {};
              this.propertieList.forEach(v => {
                if (v.key === 'aliasName') {
                  v.value = this.detail.aliasName;
                } else {
                  let liId = v.id;
                  if (propertieList[liId]) {
                    if (Array.isArray(propertieList[liId].value)) {
                      v.value = propertieList[liId].value.join('，');
                    } else {
                      v.value = propertieList[liId].value;
                    }
                  }
                }
              });
              this.imageList = this.detail.imageList;
              this.imageList.forEach(v => {
                this.$set(v, 'url', getPicUrl(v.image, 1, v.imgType));
              });
              this.skuList = this.detail.skuList;
              this.skuList.forEach(sku => {
                sku.images.forEach(v => {
                  this.$set(v, 'url', getPicUrl(v.image, 1, v.imgType));
                });
              });
            });
          } else {
            getInfo(this.uid).then(res => {
              this.providerName = res.name;
            });
          }
        });
      },
      getProduct() {
        let propertieList = {};
        this.propertieList.forEach(v => {
          if (v.key === 'aliasName') {
            this.detail.aliasName = v.value;
          } else {
            if (v.required && v.value === '') {
              this.$message({
                type: 'error',
                message: `${v.name}不能为空，请至少选择一个`
              });
              return false;
            } else {
              let laValue = v.value.length > 0 ? v.value.split('，') : [];
              propertieList[v.id] = {
                name: v.name,
                value: laValue
              };
            }
          }
        });
        this.detail.propertieList = propertieList;
        this.detail.providerId = this.detail.providerId || this.uid;
        if (!this.checkValueIsInvalid(this.detail) || this.checkIngredientIsInValid(this.detail.ingredientList) || this.checkSkuCodeIsInvalid(this.skuList)) {
          return false;
        }
        this.detail.skuList = this.skuList.map(sku => {
          return {
            skuCode: sku.skuCode,
            stock: sku.stock,
            skuId: sku.skuId,
            images: sku.images.map((image, index) => {
              return {
                image: image.image,
                imageId: image.imageId,
                imgType: image.imgType,
                sn: index
              };
            })
          };
        });
        this.detail.imageList = this.imageList.map(value => {
          return {
            imgType: value.imgType,
            image: value.image,
            imageId: value.imageId
          };
        });
        this.detail.priceList = [
          { salePrice: this.detail.supplyPrice, priceType: 35 },
          { salePrice: this.detail.bukPrice, priceType: 1 },
          { salePrice: this.detail.samplePrice, priceType: 2 },
          { salePrice: 0, priceType: 3 }
        ];
        // this.detail.status = 0;
        return this.detail;
      },
      saveProduct(ab) {
        let data = this.getProduct();
        if (!data || data) { return false; }
        if (this.spuId) {
          modifyProduct({ productType: this.productType, product: JSON.stringify(data) }).then(res => {
            let editSkus = [];
            let addSkus = [];
            let delSkuIds = this.skuEdit.delSkuIds;
            data.skuList.forEach(sku => {
              if (sku.skuId) {
                if (this.skuEdit.editSkuIds[sku.skuId]) {
                  editSkus.push(sku);
                }
              } else {
                addSkus.push(sku);
              }
            });
            let count = 0;
            if (delSkuIds.length > 0) {
              count++;
              modifyProductSku({ productId: this.spuId, op: 4, skuIds: delSkuIds.join(',') }).then(res => {
                count--;
              });
            }
            if (addSkus.length > 0) {
              count++;
              modifyProductSku({ productId: this.spuId, op: 1, skus: JSON.stringify(addSkus) }).then(res => {
                count--;
              });
            }
            if (editSkus.length > 0) {
              count++;
              modifyProductSku({ productId: this.spuId, op: 2, skus: JSON.stringify(editSkus) }).then(res => {
                count--;
              });
            }
            let timer = null;
            timer = setInterval(() => {
              if (count === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                clearInterval(timer);
                setTimeout(() => {
                  if (ab) {
                    this.$router.push({ query: { uid: this.uid }});
                    location.reload();
                  } else {
                    this.$router.push({ path: 'clothDetail', query: { pid: this.spuId }});
                  }
                }, 500);
              }
            }, 500);
          });
        } else {
          addProduct({ productType: this.productType, product: JSON.stringify(data) }).then(res => {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            setTimeout(() => {
              if (ab) {
                location.reload();
              } else {
                this.$router.push({ path: 'clothDetail', query: { pid: res.productId }});
              }
            }, 500);
          });
        }
      },
      checkIngredientIsInValid(arr) {
        arr = arr || [];
        let newArr = [];
        let liTotal = 0;
        let liVal = 0;
        if (!arr.length) {
          this.$message({
            type: 'info',
            message: '成分不能为空，请添加成分！'
          });
          return true;
        }
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].name) {
            this.$message({
              type: 'info',
              message: '添加的成分名不能为空，请重新选择！'
            });
            return true;
          }
          if (newArr.indexOf(arr[i].name) > -1) {
            this.$message({
              type: 'info',
              message: '不能有重复的成分名，请重新选择！'
            });
            return true;
          } else {
            newArr.push(arr[i].name);
          }
          liVal = parseFloat(arr[i].value);
          if (liVal >= 0) {
            liTotal += liVal;
          } else {
            this.$message({
              type: 'info',
              message: '成分百分比不能小于0，请重新填写！'
            });
            return true;
          }
        }
        if (liTotal > 100) {
          this.$message({
            type: 'info',
            message: '成分百分比不能大于100，请重新填写！'
          });
          return true;
        }
        return false;
      },
      checkValueIsInvalid(params) {
        params = params || {};
        if (params.productCode.trim() === '') {
          this.$message({
            type: 'error',
            message: '款号不能为空，请重新填写'
          });
          return false;
        }
        if (params.width === '' || params.width <= 0) {
          this.$message({
            type: 'error',
            message: '最小布封不能为空或者0，请重新填写'
          });
          return false;
        }
        if (params.maxWidth > 0 && params.width >= params.maxWidth) {
          this.$message({
            type: 'error',
            message: '最大布封要大于最小布封，请重新填写'
          });
          return false;
        }
        if (params.weight > 0 && params.maxWeight > 0 && params.weight >= params.maxWeight) {
          this.$message({
            type: 'error',
            message: '最大克重要大于最小克重，请重新填写'
          });
          return false;
        }
        if (this.supplyPrice === '' || this.supplyPrice === 0) {
          this.$message({
            type: 'error',
            message: '供货价不能为空或者0，请重新填写'
          });
          return false;
        }
        if (!checkAllTextValid(params)) {
          this.$message({
            type: 'error',
            message: '录入的数据不能含有\'\"，请检查数据'
          });
          return false;
        }
        return true;
      },
      checkSkuCodeIsInvalid(arr) {
        if (!arr.length) {
          this.$message({
            type: 'error',
            message: '请先添加色片再保存！'
          });
          return true;
        }
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].images.length) {
            this.$message({
              type: 'error',
              message: '有色片未上传有色片图，请先上传色片图！'
            });
            return true;
          }
        }
        let obj = {};
        let isInvalid = false;
        arr.forEach((value, index) => {
          if (value.skuCode === '') {
            value.isEmpty = true;
            isInvalid = true;
            return false;
          } else {
            value.isEmpty = false;
            if (obj[value.skuCode] === undefined) {
              obj[value.skuCode] = index;
              value.isRepeat = false;
            } else {
              value.isRepeat = true;
              arr[obj[value.skuCode]].isRepeat = true;
              isInvalid = true;
            }
          }
        });
        if (isInvalid) {
          this.$message({
            type: 'info',
            message: '色卡编号填写有误，请重新填写'
          });
        }
        return isInvalid;
      }
    },
    components: {
      ActionsWrap,
      ClothProp,
      ProductLabel,
      ProductImage,
      SkuList
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .cloth-edit{
    .product-info-wrap {
      display: flex;
      .product-prop, .product-label {
        flex: 1;
      }
      .product-prop{
        margin-right:5px;
      }
      .product-label{
        margin-left:5px;
      }
    }
  }
</style>