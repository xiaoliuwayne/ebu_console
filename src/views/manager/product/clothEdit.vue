<template>
  <div class="cloth-edit">
    <el-card class="product-status-wrap" v-if="isManager || (!isManager && spuId)">
      <ul class="product-status-wrap-box">
        <li class="product-status-item" v-if="isManager">
          <span>供应商：{{providerName}}</span>
        </li>
        <template v-show="spuId">
          <li class="product-status-item">
            SPUID：<span>{{spuId}}</span>
          </li>
          <li class="product-status-item">
            色卡编号：<span>{{detail.colorCardCode || ''}}</span>
          </li>
          <li class="product-status-item">
            最后编辑时间：<span>{{detail.updateTime}}</span>
          </li>
          <li class="product-status-item status-item">
            状态：<span>{{productStatus.n}}</span>
          </li>
        </template>
      </ul>
    </el-card>
    <el-card class="actions-wrap">
      <ul class="clearfix">
        <li v-if="detail.status ==3">
          供应商修改说明：{{detail.reason}}
        </li>
        <li>
          <el-button size="mini" type="primary" :disabled="btnDisabled" @click="saveProduct(false)" plain>保存</el-button>
          <el-button size="mini" type="primary" :disabled="btnDisabled" @click="saveProduct(true)" plain>保存并新建一条
          </el-button>
        </li>
      </ul>
    </el-card>
    <el-card class="product-prop-wrap">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div>
        <table class="table table-bordered table-responsive">
          <tbody>
          <tr>
            <td>款号 <span class="red-font">*</span></td>
            <td>
              <el-input type="text" size="mini" v-model="detail.productCode"></el-input>
            </td>
            <td>分类 <span class="red-font">*</span></td>
            <td>
              <el-cascader
                expand-trigger="hover"
                size="mini"
                :disabled="spuId ? true : false"
                :options="options"
                v-model="selectedOptions"
                @change="handleChange">
              </el-cascader>
            </td>
          </tr>
          <tr>
            <td>品名</td>
            <td>
              <select-dialog :data="pName" @dialogConfirm="handleProductName"></select-dialog>
            </td>
            <td>别名</td>
            <td>
              <el-input type="text" size="mini" v-model="detail.aliasName"></el-input>
            </td>
          </tr>
          <tr class="width-weight">
            <td>布封（边到边） <span class="red-font">*</span></td>
            <td>
              <el-input type="number" size="mini" min="0" v-model="detail.width"></el-input>
              <el-radio-group v-model="detail.widthUnit">
                <el-radio :label="1">厘米</el-radio>
                <el-radio :label="2">英寸</el-radio>
              </el-radio-group>
            </td>
            <td>克重</td>
            <td>
              <el-input type="number" size="mini" min="0" v-model="detail.weight"></el-input>
              <el-radio-group v-model="detail.weightUnit">
                <el-radio :label="1" title="克/平方米">g/m²</el-radio>
                <el-radio :label="2" title="盎司">OZ</el-radio>
                <el-radio :label="3" title="姆米">m/m</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>成分 <span class="red-font">*</span></td>
            <td>
              <ul class="ingredient-list">
                <template v-for="(ingredient,index) in detail.ingredientList">
                  <li class="ingredient-list-item" :key="index">
                    <el-select v-model="ingredient.name" size="mini" placeholder="请选择">
                      <el-option
                        v-for="item in ingredientData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                    <el-input type="number" size="mini" min="0" v-model="ingredient.value">
                      <template slot="append">%</template>
                    </el-input>
                    <el-button type="danger" plain size="mini" :disabled="!(detail.ingredientList.length>1)"
                               @click="deleteIngredientItem(index)">删除
                    </el-button>
                  </li>
                </template>
              </ul>
              <el-button type="primary" size="mini" @click="addIngredientItem" plain>增加</el-button>
            </td>
            <td>质检证明</td>
            <td>
              <eb-upload class="product-image"
                         list-type="picture-card"
                         :multiple="true"
                         :imgType="7"
                         :file-list="imageList.filter(function(value){return value.imgType === 7})"
                         :on-preview="handlePictureCardPreview"
                         :on-success="handleImgUploadSuccess"
                         :on-remove="handleImgRemove">
              </eb-upload>
            </td>
          </tr>
          <tr>
            <td>供货类型 <span class="red-font">*</span></td>
            <td>
              <el-radio-group v-model="detail.saleStatus">
                <el-radio :label="1">现货</el-radio>
                <el-radio :label="2">定制</el-radio>
              </el-radio-group>
            </td>
            <td>计量单位 <span class="red-font">*</span></td>
            <td>
              <el-radio-group v-model="detail.saleUnit">
                <template v-for="item in units">
                  <el-radio :label="item.t">{{item.n}}</el-radio>
                </template>
              </el-radio-group>
            </td>
          </tr>
          <template v-if="detail.saleStatus == 1">
            <tr>
              <td>
                大货供货价
                <span v-show="isEnough">（足米）</span>
              </td>
              <td>
                <el-input type="number" size="mini" v-model="_price">
                  <template slot="prepend">&yen;</template>
                  <template slot="append">元</template>
                </el-input>
              </td>
              <td>散剪供货价</td>
              <td>
                <el-input type="number" size="mini" v-model="_samplePrice">
                  <template slot="prepend">&yen;</template>
                  <template slot="append">元</template>
                </el-input>
              </td>
            </tr>
            <tr>
              <td>终端大货价</td>
              <td>
                <el-input type="number" size="mini" v-model="prices[1]">
                  <template slot="prepend">&yen;</template>
                  <template slot="append">元</template>
                </el-input>
              </td>
              <td>终端散剪价</td>
              <td>
                <el-input type="number" size="mini" v-model="prices[2]">
                  <template slot="prepend">&yen;</template>
                  <template slot="append">元</template>
                </el-input>
              </td>
            </tr>
            <tr>
              <td>纸筒</td>
              <td>
                <el-input type="text" size="mini" v-model="detail.paper"></el-input>
              </td>
              <td>空差</td>
              <td>
                <el-input type="text" size="mini" v-model="detail.gross"></el-input>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td>定制供货价</td>
              <td>
                <el-input type="number" size="mini" v-model="prices[21]">
                  <template slot="prepend">&yen;</template>
                  <template slot="append">元</template>
                </el-input>
              </td>
              <td>货期</td>
              <td>
                <el-input placeholder="请输入货期" size="mini" v-model="detail.leadTime">
                  <template slot="append">天</template>
                </el-input>
              </td>
            </tr>
            <tr>
              <td>结算方式</td>
              <td>
                <el-radio-group v-model="detail.payStrategyId">
                  <el-radio v-if="payStrategy" v-for="(item,index) in payStrategy" :key="index" :label="item.t">{{item.s}}
                  </el-radio>
                </el-radio-group>
              </td>
              <td></td>
              <td></td>
            </tr>
          </template>
          <tr>
            <td>每卷规格</td>
            <td>
              <el-input type="text" size="mini" v-model="detail.batchNumber">
                <template slot="append">{{unitName}}</template>
              </el-input>
            </td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    </el-card>
    <el-card class="product-label-wrap">
      <div slot="header" class="clearfix">
        <span>属性信息</span>
      </div>
      <div>
        <table class="table table-bordered table-responsive">
          <tbody>
          <template v-for="property in _properties">
            <tr>
              <template v-for="item in property">
                <td>{{item.label}}</td>
                <td>
                  <select-dialog v-if="item!==''" :data="item" @dialogConfirm="(value)=>handelDialogConfirm(value,item)"></select-dialog>
                </td>
              </template>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </el-card>
    <el-card class="product-img-wrap">
      <div slot="header" class="clearfix">
        <span>展示主图</span>
      </div>
      <table class="table table-bordered table-responsive">
        <tbody>
        <tr>
          <td>面料色彩类型</td>
          <td>
            <el-radio-group v-model="detail.colorType">
              <el-radio :label="1">单色染色</el-radio>
              <el-radio :label="2">多色印花</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr v-show="detail.colorType==1">
          <td>主图</td>
          <td>
            <eb-upload class="product-image"
                       list-type="picture-card"
                       :multiple="true"
                       :imgType="5"
                       :file-list="imageList.filter(function(value){return value.imgType === 5})"
                       :on-preview="handlePictureCardPreview"
                       :on-success="handleImgUploadSuccess"
                       :on-remove="handleImgRemove">
            </eb-upload>
          </td>
        </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="product-sku-wrap">
      <div slot="header" class="clearfix">
        <span>颜色图</span>
      </div>
      <div class="sku-edit-wrap clearfix">
        <span class="sku-count">
          颜色数量：<span>{{skuList.length}}</span>
        </span>
        <ul class="sku-edit-box">
          <li class="sku-edit-item">
            <el-input size="mini" type="number" v-model="skuEdit.count">
              <template slot="prepend">添加数量</template>
            </el-input>
          </li>
          <li class="sku-edit-item">
            <el-input size="mini" type="number" v-model="skuEdit.startCode">
              <template slot="prepend">起始编码</template>
            </el-input>
          </li>
          <li class="sku-edit-item">
            <el-button size="mini" @click="handleSkusAdd">确认添加</el-button>
          </li>
        </ul>
      </div>
      <table class="table table-bordered table-responsive sku-list-wrap">
        <thead>
        <tr>
          <th>色号</th>
          <th>色片图</th>
          <th>颜色值（16位色-#00FFEE）</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr class="sku-list-item" v-for="(sku, index) in skuList" :key="index">
          <td>
            <el-input :class="sku.isEmpty ? 'empty-background':sku.isRepeat ? 'repeat-background' : ''" size="mini"
                      v-model="sku.skuCode" @change="handleSkuChange(index)"></el-input>
          </td>
          <td>
            <eb-upload
              list-type="picture-card"
              :uploadIndex="index"
              :multiple="true"
              :file-list="sku.images"
              :show-file-list="true"
              :imgType="6"
              :limit="detail.colorType==2?4:1"
              :on-preview="handlePictureCardPreview"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
              :on-exceed="handleExceed">
            </eb-upload>
          </td>
          <td :style="{background: sku.colorCode}">
            <el-input :class="sku.colorCodeIsInvalid ? 'empty-background' : ''" size="mini" type="text" v-model="sku.colorCode" clearable maxlength="7"
                      @change="handleSkuChange(index)"></el-input>
          </td>
          <td>
            <el-button size="mini" @click="handleSkuRemove(index)">删除色片</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="product-sku-wrap">
      <div slot="header" class="clearfix">
        <span>商品详情（非必填）</span>
      </div>
      <div class="clearfix">
        <tinymce :height="300" v-model="tinymceContent"/>
      </div>
    </el-card>
    <el-card class="actions-wrap">
      <ul class="clearfix">
        <li>
          <el-button size="mini" type="primary" :disabled="btnDisabled" @click="saveProduct(false)" plain>保存</el-button>
          <el-button size="mini" type="primary" :disabled="btnDisabled" @click="saveProduct(true)" plain>保存并新建一条
          </el-button>
        </li>
      </ul>
    </el-card>
    <el-dialog :visible.sync="preview.dialogVisible" width="540px" :before-close="beforePreviewClose">
      <el-carousel indicator-position="outside" :autoplay="false" :initial-index="preview.initialIndex" height="500px">
        <el-carousel-item v-for="item in preview.list" :key="item.uid">
          <img :src="item.url" alt="" width="100%" height="100%">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getProductDetail, addProduct, modifyProduct, modifyProductSku, queryCateMenu, queryFabricCatAttr, getAttribute } from '@/api/product';
  import { getInfo } from '@/api/user';
  import EbUpload from '@/components/EbUpload';
  import { getPicUrl } from '@/utils/getPicUrl';
  import { byTypeGetObj, parseTime } from '@/utils';
  import SelectDialog from './components/selectDialog';
  import { checkAllTextValid } from '@/utils/checkTextValid';
  import tinymce from '@/components/tinymce';
  import { base64 } from '@/utils';

  const UNITS = [
    { t: 1, n: '米' },
    { t: 2, n: '公斤' },
    { t: 3, n: '码' }
  ];

  export default {
    name: 'cloth-edit',
    data() {
      return {
        uid: this.$route.query.uid || this.$store.getters.userId,
        spuId: this.$route.query.pid || undefined,
        isManager: this.$store.getters.isManager,
        roleName: this.$store.getters.roleName === '原材料供应商',
        productType: 6,
        providerName: '',
        units: UNITS,
        detail: {
          aliasName: '',
          brand: '',
          weight: '',
          maxWeight: '',
          width: '',
          maxWidth: '',
          widthUnit: 1,
          weightUnit: 1,
          paper: '',
          gross: '',
          popType: 0,
          productCode: '',
          productName: '',
          saleUnit: 0,
          saleStatus: 1,
          payStrategyId: 1,
          leadTime: 0,
          colorType: 1,
          ingredientList: [
            { name: '', value: '' }
          ],
          imageList: [],
          skuList: [],
          priceList: [],
          detailInfoObj: {}
        },
        prices: {
          1: 0,       // 终端大货价
          2: 0,       // 终端散剪价
          3: 0,       // 色卡价
          15: 0,      // 定制销售价
          19: 0,      // 大货供货价
          20: 0,      // 米样供货价
          21: 0       // 定制供货价
        },
        price: 0,
        samplePrice: 0,
        attribute: {
          alias: [],
          propList: [],
          radio: {},
          unit: [],
          saleStatus: this.GLOBAL.saleStatus
        },
        ingredientData: [],
        source: '',
        propMust: ['23', '67', '134'],
        imageList: [],
        skuList: [],
        limit: 4,
        skuEdit: {
          count: undefined,
          startCode: undefined,
          editSkuIds: {}
        },
        preview: {
          list: [],
          initialIndex: 0,
          dialogVisible: false
        },
        weightUnits: {
          3101: '平方米',
          3107: '姆米',
          310207: '盎司'
        },
        btnDisabled: false,
        productStatus: {},
        payStrategy: this.GLOBAL.payStrategy,
        pName: {},
        optionsData: [],
        selectedOptions: [],
        catList: [],
        properties: [],
        propertiesList: [],
        tinymceContent: ''
      };
    },
    created() {
      this.detail.saleUnit = this.selectedOptions[0] === 'KN' ? 2 : 1;
      this.getData();
    },
    computed: {
      isEnough() {
        return this.selectedOptions[0] == 3101;
      },
      options() {
        return this.optionsData.map(v => {
          let obj = {
            value: v.value,
            label: v.label
          };
          v.children.length > 1 && (obj.children = v.children);
          return obj;
        });
      },
      weightUnit() {
        let key = this.selectedOptions[0];
        let key2 = this.selectedOptions[1];
        if (key == 3102 && key2 == 310207) {
          key = key2;
        }
        return this.weightUnits[key] || '平方米';
      },
      _supplyPrice: {
        set(value) {
          value = parseFloat(value || 0);
          this.supplyPrice = value;
          this.bukPrice = (value * 1.1).toFixed(2);
          if (this.detail.saleUnit == 2) {
            this.samplePrice = (value * 2).toFixed(2);
          } else {
            this.samplePrice = (value + (value > 0 ? 20 : 0)).toFixed(2);
          }
        },
        get() {
          return this.supplyPrice;
        }
      },
      _price: {
        set(val) {
          val = parseFloat(val || 0);
          this.prices[19] = val;
          this.prices[1] = val * 110 / 100;
        },
        get() {
          return this.prices[19];
        }
      },
      _samplePrice: {
        set(val) {
          val = parseFloat(val || 0);
          this.prices[20] = val;
          this.prices[2] = val * 110 / 100;
        },
        get() {
          return this.prices[20];
        }
      },
      _properties() {
        let list = this.propertiesList;
        let row = 3;
        let num = list.length % row;
        num > 0 && (list = list.concat(new Array(row - num).fill('')));
        let properties = [];
        for (let i = 0; i < list.length; i += row) {
          properties.push(list.slice(i, i + row));
        }
        return properties;
      },
      unitName() {
        let unit = this.detail.saleUnit;
        return byTypeGetObj(unit, this.units, 't').n;
      }
    },
    methods: {
      handleChange(opt) {
        let id = opt[0];
        if (id == '3101') {
          this.detail.saleUnit = 2;
        } else {
          this.detail.saleUnit = 1;
        }
        if (opt.length === 1) {
          this.optionsData.forEach(v => {
            if (v.value === id) {
              opt.push(v.children[0].value);
            }
          });
        }
        this.catList = opt;
        opt[1] && this.getFabricCatAttr(opt[1]);
      },
      getFabricCatAttr(catId, callBack) {
        queryFabricCatAttr(catId).then(res => {
          let arr = JSON.parse(JSON.stringify(res.list));
          let list = [];
          let index = 0;
          arr.forEach((v, i) => {
            list.push({
              value: v.code,
              label: v.name,
              id: v.id,
              checkList: [],
              children: v.val
            });
            if (v.name === '品名') {
              index = i;
              this.pName = list.splice(index, 1)[0];
            }
          });
          this.pName.radio = true;
          this.propertiesList = list;
          callBack && callBack(list);
        });
      },
      handleProductName(value) {
        this.detail.productName = value[0] || '';
      },
      handelDialogConfirm(value, item) {
        for (let i = 0; i < this.propertiesList.length; i++) {
          if (this.propertiesList[i].id === item.id) {
            this.propertiesList[i].checkList = value;
            break;
          }
        }
      },
      getData() {
        getAttribute(31).then(res => {
          let list = res;
          for (let i = 0; i < list.length; i++) {
            if (list[i].id === 170) {
              this.ingredientData = list[i].attributeList;
              break;
            }
          }
        });
        queryCateMenu(6).then(res => {
          let list = [];
          for (let i = 0; i < res.list.length; i++) {
            if (res.list[i].catId === 31) {
              list = res.list[i].list;
              break;
            }
          }
          let options = [];
          list.forEach(v => {
            let option = {
              value: v.catId,
              label: v.catName,
              children: []
            };
            v.list && v.list.forEach(child => {
              option.children.push({
                value: child.catId,
                label: child.catName
              });
            });
            options.push(option);
          });
          this.optionsData = options;
        }).then(() => {
          if (this.spuId) {
            getProductDetail({ productId: this.spuId, productType: this.productType }).then(res => {
              this.detail = res;
              this.detail.updateTime = parseTime(this.detail.updateTime);
              this.detail.createTime = parseTime(this.detail.createTime);
              this.detail.gross = this.detail.gross || '';
              this.detail.paper = this.detail.paper || '';
              this.detail.weight = this.detail.weight || '';
              this.productStatus = byTypeGetObj(res.status, this.GLOBAL.productStatus);
              this.catList = this.detail.catList.map(v => {
                return v.catId;
              });
              if (this.catList[1]) {
                this.getFabricCatAttr(this.catList[1], () => {
                  this.pName.checkList = [this.detail.productName];
                  let properties = this.detail.propertieList;
                  for (let i = 0; i < this.propertiesList.length; i++) {
                    if (this.propertiesList[i]) {
                      this.propertiesList[i].checkList = properties[this.propertiesList[i].id] ? properties[this.propertiesList[i].id].value : [];
                    }
                  }
                  this.optionsData.forEach(v => {
                    if (v.value === this.catList[0]) {
                      if (v.children.length !== 1) {
                        this.selectedOptions = this.catList.map(v => { return v; });
                      } else {
                        this.selectedOptions = [this.catList[0]];
                      }
                      return false;
                    }
                  });
                });
              }
              this.detail.priceList.forEach(v => {
                this.prices[v.priceType] = v.salePrice;
              });
              for (let i = 0; i < this.detail.imageList.length; i++) {
                let item = this.detail.imageList[i];
                item.url = getPicUrl(item.image, 1, item.imgType);
                this.imageList.push(item);
              }
              for (let i = 0; i < this.detail.skuList.length; i++) {
                let item = this.detail.skuList[i];
                item.isRepeat = false;
                item.isEmpty = false;
                for (let j = 0; j < item.images.length; j++) {
                  item.images[j].url = getPicUrl(item.images[j].image, 1, item.images[j].imgType);
                }
                this.skuList.push(item);
              }
              this.tinymceContent = base64.atob(this.detail.detailInfo);
              this.providerName = this.detail.providerName;
              this.uid = this.detail.providerId;
              this.source = this.detail.labels || '';
              this.isEdit = false;
            });
          } else {
            // this.getFabricCatAttr(this.selectedOptions[1]);
            getInfo(this.uid).then(res => {
              this.providerName = res.name;
            });
          }
        });
      },
      getProduct() {
        this.detail.catList = [];
        this.selectedOptions.forEach(v => {
          this.detail.catList.push({
            catId: v
          });
        });
        let priceList = [];
        for (let k in this.prices) {
          priceList.push({
            salePrice: this.prices[k],
            priceType: k
          });
        }
        this.detail.priceList = priceList;
        let propertieList = {};
        this.propertiesList.forEach(v => {
          if (v.checkList && v.checkList.length > 0) {
            propertieList[v.id] = {
              name: v.label,
              value: v.checkList
            };
          }
        });
        this.detail.propertieList = propertieList;
        // for (let i = 0; i < this.propertieList.length; i++) {
        //   let item = this.propertieList[i];
        //   if (this.attribute.radio[item.id]) {
        //     propertieList[item.id] = {
        //       name: item.name,
        //       value: [this.attribute.radio[item.id].radio]
        //     };
        //   } else {
        //     propertieList[item.id] = {
        //       name: item.name,
        //       value: item.value
        //     };
        //   }
        //   if (this.propMust.indexOf(item.id) > -1 && item.value.length === 0) {
        //     this.$message({
        //       type: 'error',
        //       message: `${item.name}不能为空，请至少选择一个`
        //     });
        //     return false;
        //   }
        // }
        // this.detail.propertieList = propertieList;
        this.detail.providerId = this.detail.providerId || this.uid;
        this.detail.detailInfo = base64.btoa(this.tinymceContent);
        if (!this.checkValueIsInvalid(this.detail) || this.checkIngredientIsInValid(this.detail.ingredientList) || this.checkSkuCodeIsInvalid()) {
          return false;
        }
        if (!this.skuList.length) {
          this.$message({
            type: 'error',
            message: '请先添加色片再保存！'
          });
          return false;
        }
        // for (let i = 0; i < this.skuList.length; i++) {
        //   if (!this.skuList[i].images.length) {
        //     this.$message({
        //       type: 'error',
        //       message: '有色片未上传有色片图，请先上传色片图！'
        //     });
        //     return false;
        //   }
        // }
        // this.detail.skuList = this.skuList;
        this.detail.skuList = this.skuList.map(sku => {     //过滤掉不必要的字段
          return {
            skuCode: sku.skuCode,
            stock: sku.stock,
            skuId: sku.skuId,
            colorCode: sku.colorCode || '',
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
        // this.detail.imageList = this.imageList;
        this.detail.imageList = this.imageList.map(value => {           //过滤掉不必要的字段
          return {
            imgType: value.imgType,
            image: value.image,
            imageId: value.imageId
          };
        });
        if (this.detail.colorType == 2) {
          this.detail.imageList = this.detail.imageList.filter(v => {
            return v.imgType === 7;
          });
        }
        // this.detail.labels = this.source || '';
        return this.detail;
        // return {
        //   productType: this.productType,
        //   product: JSON.stringify(this.detail)
        // };
      },
      saveProduct(ab) {
        function refresh(_this) {
          _this.$router.replace({
            path: '/refresh',
            query: _this.$route.query
          });
        }

        this.btnDisabled = true;
        setTimeout(() => {
          this.btnDisabled = false;
        }, 1000);
        let data = this.getProduct();
        if (!data) {
          return false;
        }
        if (this.spuId) {
          let skuList = data.skuList;
          delete data.skuList;
          delete data.auditList;
          modifyProduct({ productType: this.productType, product: JSON.stringify(data) }).then(res => {
            let editSkus = [];
            let addSkus = [];
            skuList.forEach(sku => {
              if (sku.skuId) {
                if (this.skuEdit.editSkuIds[sku.skuId]) {
                  editSkus.push(sku);
                }
              } else {
                addSkus.push(sku);
              }
            });
            if (editSkus.length > 0) {
              modifyProductSku({ productId: this.spuId, op: 2, skus: JSON.stringify(editSkus) }).then(res => {
                if (addSkus.length > 0) {
                  modifyProductSku({ productId: this.spuId, op: 1, skus: JSON.stringify(addSkus) }).then(res => {
                    handleSuccess(this, this.spuId);
                  });
                }
              });
            } else if (addSkus.length > 0) {
              modifyProductSku({ productId: this.spuId, op: 1, skus: JSON.stringify(addSkus) }).then(res => {
                handleSuccess(this, this.spuId);
              });
            } else {
              handleSuccess(this, this.spuId);
            }
          });
        } else {
          addProduct({ productType: this.productType, product: JSON.stringify(data) }).then(res => {
            handleSuccess(this, res.productId);
          });
        }
        function handleSuccess(_this, id) {
          _this.$message({
            type: 'success',
            message: '保存成功'
          });
          setTimeout(() => {
            if (ab) {
              _this.$router.push({ query: { uid: _this.uid }});
              refresh(_this);
            } else {
              _this.$router.push({ path: 'clothDetail', query: { pid: id }});
            }
          }, 500);
        }
      },
      addIngredientItem() {
        this.detail.ingredientList.push(
          { name: '', value: '' }
        );
      },
      deleteIngredientItem(index) {
        this.detail.ingredientList.splice(index, 1);
      },
      handlePictureCardPreview(data, fileList) {
        for (let i = 0; i < fileList.length; i++) {
          fileList[i].url = fileList[i].image;
          if (data.uid === fileList[i].uid) {
            this.preview.initialIndex = i;
          }
        }
        this.preview.list = fileList;
        this.preview.dialogVisible = true;
      },
      beforePreviewClose(done) {
        this.preview.list = []; // 暂时解决图片预览initialIndex改变，activeIndex不变的问题
        done();
      },
      handleImgRemove(data, fileList) {
        for (let i = 0; i < this.imageList.length; i++) {
          if (data.uid === this.imageList[i].uid) {
            this.imageList.splice(i, 1);
            break;
          }
        }
      },
      handleRemove(data, fileList, index) {
        for (let i = 0; i < this.skuList[index].images.length; i++) {
          if (data.uid === this.skuList[index].images[i].uid) {
            this.skuList[index].images.splice(i, 1);
            break;
          }
        }
        this.handleSkuChange(index);
      },
      handleExceed(files, fileList) {
        this.$message({
          type: 'warning',
          message: '选择的文件数量超出限制数量，请减少选择的文件数量再上传'
        });
      },
      handleImgUploadSuccess(res, file, fileList) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].status !== 'success') {
            return false;
          }
        }
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response) {
            let isHas = false;
            for (let j = 0; j < this.imageList.length; j++) {
              if (this.imageList[j].uid === fileList[i].uid) {
                isHas = true;
                break;
              }
            }
            let image = fileList[i].response.urls ? fileList[i].response.urls[0] : null;
            if (!isHas && image) {
              fileList[i].image = image.image;
              fileList[i].imageId = image.imageId;
              fileList[i].imgType = image.imageType;
              delete fileList[i].response;
              this.imageList.push(fileList[i]);
            }
          }
        }
      },
      handleUploadSuccess(res, file, fileList, index) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].status !== 'success') {
            return false;
          }
        }
        this.handleSkuChange(index);
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response) {
            let isHas = false;
            for (let j = 0; j < this.skuList[index].images.length; j++) {
              if (this.skuList[index].images[j].uid === fileList[i].uid) {
                isHas = true;
                break;
              }
            }
            let image = fileList[i].response.urls ? fileList[i].response.urls[0] : null;
            if (!isHas && image) {
              fileList[i].image = image.image;
              fileList[i].imageId = image.imageId;
              fileList[i].imgType = image.imageType;
              delete fileList[i].response;
              this.skuList[index].images.push(fileList[i]);
            }
          }
        }
      },
      handleSkusAdd() {
        let liStartCode = this.getSkuStartCode();
        if (!liStartCode) {
          return false;
        } else {
          this.skuEdit.startCode = '';
        }
        if (this.skuEdit.count > 0) {
          let arr = [];
          for (let i = 0; i < this.skuEdit.count; i++) {
            arr.push({
              images: [],
              skuCode: liStartCode++,
              stock: 0,
              isEmpty: false,
              isRepeat: false
            });
          }
          this.skuList = this.skuList.concat(arr);
          this.skuEdit.count = '';
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
        } else {
          this.$message({
            message: '添加数量要大于0！',
            type: 'warning'
          });
        }
      },
      handleSkuChange(index) {
        if (this.skuList[index].skuId) {
          this.skuEdit.editSkuIds[this.skuList[index].skuId] = true;
        }
      },
      getSkuStartCode() {
        let liMax = 0;
        for (let i = 0; i < this.skuList.length; i++) {
          let liCode = parseInt(this.skuList[i].skuCode);
          if (liCode >= liMax) {
            liMax = liCode;
          }
        }
        let liStartCode = parseInt(this.skuEdit.startCode || 0);
        if (liStartCode) {
          if (liStartCode > liMax) {
            return liStartCode;
          } else {
            this.$message({
              message: `起始编码要大于${liMax}`,
              type: 'warning'
            });
            return false;
          }
        } else {
          return ++liMax;
        }
      },
      handleSkuRemove(index) {
        this.$confirm('确认删除该色片，删除后不可恢复?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let sku = this.skuList.splice(index, 1)[0];
          if (sku.skuId) {
            modifyProductSku({ productId: this.spuId, op: 4, skuIds: sku.skuId }).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            });
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      checkSkuCodeIsInvalid() {
        let list = this.skuList || [];
        let obj = {};
        let reg = /^#[0-9a-fA-F]{6}$/;
        let isInvalid = false;
        let codeIsInvalid = false;
        list.forEach((value, index) => {
          if (value.skuCode === '') {        // 校验code是否为空
            value.isEmpty = true;
            isInvalid = true;
            return false;
          } else {
            value.isEmpty = false;
            if (obj[value.skuCode] === undefined) {   // 校验code是否重复
              obj[value.skuCode] = index;
              value.isRepeat = false;
            } else {
              value.isRepeat = true;
              list[obj[value.skuCode]].isRepeat = true;
              isInvalid = true;
            }
          }
          if (value.colorCode) {       //校验colorCode
            value.colorCodeIsInvalid = !reg.test(value.colorCode);
            !codeIsInvalid && value.colorCodeIsInvalid && (codeIsInvalid = true);
          }
        });
        if (isInvalid) {
          this.$message({
            type: 'error',
            message: '色卡编号填写有误，请重新填写'
          });
        } else if (codeIsInvalid) {
          this.$message({
            type: 'error',
            message: '颜色值填写有误，请重新填写'
          });
        }
        return (isInvalid || codeIsInvalid);
      },
      checkIngredientIsInValid(arr) {
        arr = arr || [];
        let newArr = [];
        let liTotal = 0;
        let liVal = 0;
        if (!arr.length) {
          this.$message({
            type: 'error',
            message: '成分不能为空，请添加成分！'
          });
          return true;
        }
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].name) {
            this.$message({
              type: 'error',
              message: '添加的成分名不能为空，请重新选择！'
            });
            return true;
          }
          if (newArr.indexOf(arr[i].name) > -1) {
            this.$message({
              type: 'error',
              message: '不能有重复的成分名，请重新选择！'
            });
            return true;
          } else {
            newArr.push(arr[i].name);
          }
          liVal = (arr[i].value !== '' ? parseFloat(arr[i].value) : arr[i].value);
          if (liVal >= 0) {
            liTotal += liVal;
          } else if (liVal !== '') {
            this.$message({
              type: 'error',
              message: '成分百分比不能小于0，请重新填写！'
            });
            return true;
          }
        }
        if (liTotal > 100) {
          this.$message({
            type: 'error',
            message: '成分百分比不能大于100，请重新填写！'
          });
          return true;
        }
        return false;
      },
      checkValueIsInvalid(params) {
        params = params || {};
        if (!checkAllTextValid(params)) {
          this.$message({
            type: 'error',
            message: '录入的数据不能含有英文状态的单双引号（\'\"），请检查数据'
          });
          return false;
        }
        if (params.productCode.trim() === '') {
          this.$message({
            type: 'error',
            message: '款号不能为空，请重新填写'
          });
          return false;
        }
        if (params.catList.length === 0) {
          this.$message({
            type: 'error',
            message: '您还未选择分类，请先选择一个分类'
          });
          return false;
        }
        if (params.width === '' || params.width <= 0) {
          this.$message({
            type: 'error',
            message: '布封不能为空或者0，请重新填写'
          });
          return false;
        }
        // if (params.maxWidth > 0 && parseFloat(params.width) >= parseFloat(params.maxWidth)) {
        //   this.$message({
        //     type: 'error',
        //     message: '最大布封要大于最小布封，请重新填写'
        //   });
        //   return false;
        // }
        // if (params.weight > 0 && params.maxWeight > 0 && parseFloat(params.weight) >= parseFloat(params.maxWeight)) {
        //   this.$message({
        //     type: 'error',
        //     message: '最大克重要大于最小克重，请重新填写'
        //   });
        //   return false;
        // }
        // if (this.supplyPrice === '' || this.supplyPrice === 0) {
        //   this.$message({
        //     type: 'error',
        //     message: '供货价不能为空或者0，请重新填写'
        //   });
        //   return false;
        // }
        return true;
      }
    },
    components: {
      EbUpload,
      SelectDialog,
      tinymce
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .cloth-edit{
    .red-font{
      color: red;
      font-size: 16px;
    }
    .empty-background .el-input__inner{
      background:red;
    }
    .repeat-background .el-input__inner{
      background:yellow;
    }
    .actions-wrap{
      ul>li:first-child{
        float: left;
      }
      ul>li:last-child{
        float: right;
      }
    }
    .el-card__header{
      background: #f5f7fa;
    }
    .product-status-wrap{
      .product-status-wrap-box{
        display: flex;
        .product-status-item {
          flex: 1;
          &.status-item{
            text-align: right;
          }
        }
      }
    }
    .product-prop-wrap {
      .table {
        tbody {
          td:nth-child(2n+1) {
            width: 15%;
          }

          td:nth-child(2n) {
            width: 35%;
          }

          .el-input--mini {
            /*width: 45%;*/
          }
          .width-weight {
            .el-input--mini {
              margin-right: 10px;
              width: 35%;
            }
          }
          .ingredient-list {
            .ingredient-list-item {
              margin-bottom: 5px;

              .el-input {
                vertical-align: top;
              }

              .el-input--mini {
                width: 30%;
              }

              .el-select {
                vertical-align: top;

                .el-input--mini {
                  width: 100%;
                }
              }

              .el-button {
                visibility: hidden;
              }

              &:hover {
                .el-button {
                  visibility: visible;
                }
              }
            }
          }
        }

        &.custom-table {
          margin-top: 15px;
        }
      }
    }
    .product-label-wrap{
      .table{
        tbody{
          tr{
            td:nth-child(2n-1){
              width: 10%;
            }
            td:nth-child(2n){
              width: 23.33333%;
            }
          }
        }
      }
    }
    .product-img-wrap{
      .table{
        tbody
        {
          td{
            &:nth-child(2n-1) {
              width: 8%;
            }
            &:nth-child(2n) {
              width: 42%;
            }
          }
        }
      }
    }
    .product-sku-wrap{
      .sku-edit-wrap{
        margin-bottom: 10px;
        .sku-count{
          line-height: 28px;
        }
        .sku-edit-box{
          float: right;
          .sku-edit-item{
            float:left;
            &:not(:last-child){
              margin-right: 10px;
            }
          }
        }
      }
      .sku-list-wrap{
        .sku-list-item{}
          td:nth-child(2){
            width: 650px;
          }
      }
    }
  }
</style>
