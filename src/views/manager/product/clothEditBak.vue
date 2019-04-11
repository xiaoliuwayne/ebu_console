<template>
  <div class="cloth-edit">
    <el-card class="product-status-wrap" v-if="isManager || (!isManager && spuId)">
      <ul class="product-status-wrap-box">
        <li class="product-status-item" v-if="isManager">
          <span>供应商：{{providerName}}</span>
        </li>
        <li class="product-status-item" v-show="spuId">
          SPUID：<span>{{spuId}}</span>
        </li>
        <li class="product-status-item" v-show="spuId">
          录入时间：<span>{{detail.createTime}}</span>
        </li>
        <li class="product-status-item" v-show="spuId">
          状态：<span>{{productStatus.n}}</span>
        </li>
        <!--<li class="product-status-item action-button">-->
          <!--<el-button type="primary" size="mini">下架</el-button>-->
        <!--</li>-->
      </ul>
    </el-card>
    <el-card class="actions-wrap">
      <ul class="clearfix">
        <li v-show="spuId > 0">
          <el-button size="mini" type="button" @click="qrCodeEdit.dialogVisible = true" plain>打印批量图片二维码</el-button>
          <el-button size="mini" type="button" @click="printSpuLabel" v-if="isManager" plain>打印色卡标签</el-button>
        </li>
        <li>
          <el-button size="mini" type="primary" :disabled="btnDisabled" @click="saveProduct(false)" plain>保存</el-button>
          <el-button size="mini" type="primary" :disabled="btnDisabled" @click="saveProduct(true)" plain>保存并新建一条</el-button>
        </li>
      </ul>
    </el-card>
    <div class="product-info-wrap">
    <el-card class="product-prop">
      <div slot="header" class="clearfix">
        <span>商品属性</span>
      </div>
      <div>
        <table class="table table-bordered table-responsive">
          <tbody>
          <tr>
            <td>品名</td>
            <td>
              <el-input type="text" size="mini" v-model="detail.productName"></el-input>
            </td>
          </tr>
          <tr>
            <td>款号 <span class="red-font">*</span></td>
            <td>
              <el-input type="text" size="mini" v-model="detail.productCode"></el-input>
            </td>
          </tr>
          <tr>
            <td>布封 <span class="red-font">*</span></td>
            <td>
              <el-input placeholder="请输入内容" size="mini" v-model="detail.width">
                <template slot="prepend">最小</template>
                <template slot="append">cm</template>
              </el-input>
              <el-input placeholder="请输入内容" size="mini" v-model="detail.maxWidth">
                <template slot="prepend">最大</template>
                <template slot="append">cm</template>
              </el-input>
            </td>
          </tr>
          <tr>
            <td>克重</td>
            <td>
              <el-input placeholder="请输入内容" size="mini" v-model="detail.weight">
                <template slot="prepend">最小</template>
                <template slot="append">cm</template>
              </el-input>
              <el-input placeholder="请输入内容" size="mini" v-model="detail.maxWeight">
                <template slot="prepend">最大</template>
                <template slot="append">cm</template>
              </el-input>
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
                    <el-button type="danger" plain size="mini" :disabled="!(detail.ingredientList.length>1)" @click="deleteIngredientItem(index)">删除</el-button>
                  </li>
                </template>
              </ul>
              <el-button type="primary" size="mini" @click="addIngredientItem" plain>增加</el-button>
            </td>
          </tr>
          <tr>
            <td>新品</td>
            <td>
              <el-checkbox v-model="_popType">是</el-checkbox>
            </td>
          </tr>
          <tr>
            <td>类型</td>
            <td>
              <el-radio v-for="(status, index) in attribute.saleStatus" v-model="detail.saleStatus" :key="index" :label="index">{{status}}</el-radio>
            </td>
          </tr>
          <tr>
            <td>
              <span v-show="detail.saleStatus==1">供货价</span>
              <span v-show="detail.saleStatus==2">定制价</span>
              <span>(含税) </span>
              <span class="red-font">*</span>
            </td>
            <td>
              <el-input placeholder="请输入价格" size="mini" v-model="_supplyPrice">
                <template slot="prepend">&yen;</template>
              </el-input>
              <el-radio v-for="unit in attribute.unit" v-model="detail.saleUnit" :key="unit.key" :label="unit.key">{{unit.name}}</el-radio>
            </td>
          </tr>
          <template v-if="isManager">
            <tr>
              <td>大货价</td>
              <td>
                <el-input placeholder="请输入价格" size="mini" v-model="bukPrice">
                  <template slot="prepend">&yen;</template>
                  <template slot="append">/{{unitName}}</template>
                </el-input>
              </td>
            </tr>
            <tr v-show="detail.saleStatus==1">
              <td>米样价</td>
              <td>
                <el-input placeholder="请输入价格" size="mini" v-model="samplePrice">
                  <template slot="prepend">&yen;</template>
                  <template slot="append">/{{unitName}}</template>
                </el-input>
              </td>
            </tr>
          </template>
          <template v-if="detail.saleStatus == 2">
            <tr>
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
                <el-radio v-if="payStrategy" v-for="(item,key) in payStrategy" v-model="detail.payStrategyId" :key="key" :label="key">{{item}}</el-radio>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
        <table class="table table-bordered table-responsive custom-table" v-show="detail.saleStatus == 2">
          <tbody>

          </tbody>
        </table>
      </div>
    </el-card>
    <el-card class="product-label">
      <div slot="header" class="clearfix">
        <span>商品标签</span>
      </div>
      <div>
        <table class="table table-bordered table-responsive">
          <tbody>
          <tr>
            <td>常用名称</td>
            <td>
              <el-input type="text" size="mini" v-model="detail.aliasName"></el-input>
            </td>
          </tr>
          <tr v-for="(item,index) in propertieList" :key="index">
            <td>{{item.name}}<span v-if="propMust.indexOf(item.id) > -1" class="red-font"> *</span></td>
            <td>
              <template v-if="(item.type === 'dialog')">
                <span>{{Array.isArray(item.value)?item.value.join('，'):item.value}}</span>
                <el-button type="primary" size="mini" @click="attribute.propList[item.id].visible = true" plain>选择{{item.name}}</el-button>
              </template>
              <template v-if="(item.type === 'radio') && attribute.radio[item.id] && attribute.radio[item.id].attributeList">
                <el-radio v-for="radio in attribute.radio[item.id].attributeList" :key="radio.id" v-model="attribute.radio[item.id].radio" :label="radio.name">{{radio.name}}</el-radio>
              </template>
            </td>
          </tr>
          <tr>
            <td>来源</td>
            <td>
              <el-input type="text" size="mini" v-model="source"></el-input>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
    <el-card class="product-img-wrap">
      <div slot="header" class="clearfix">
        <span>商品图片</span>
      </div>
      <table class="table table-bordered table-responsive">
        <tbody>
        <tr>
          <td>展示图</td>
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
          <td>质检图</td>
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
        </tbody>
      </table>
    </el-card>
    <el-card class="product-sku-wrap">
      <div slot="header" class="clearfix">
        <span>色片信息</span>
      </div>
      <div class="sku-edit-wrap clearfix">
        <span class="sku-count">
          色片数量：<span>{{skuList.length}}</span>
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
            <th>色片编号</th>
            <th>色片图</th>
            <th>库存</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr class="sku-list-item" v-for="(sku, index) in skuList" :key="index">
            <td>
              <el-input :class="sku.isEmpty ? 'empty-background':sku.isRepeat ? 'repeat-background' : ''" size="mini" v-model="sku.skuCode"  @change="handleSkuChange(index)"></el-input>
            </td>
            <td>
              <eb-upload
                list-type="picture-card"
                :uploadIndex="index"
                :multiple="true"
                :file-list="sku.images"
                :show-file-list="true"
                :imgType="6"
                :limit="4"
                :on-preview="handlePictureCardPreview"
                :on-success="handleUploadSuccess"
                :on-remove="handleRemove"
                :on-exceed="handleExceed">
              </eb-upload>
            </td>
            <td>
              <el-input :disabled="!roleName" size="mini" type="number" v-model="sku.stock" @change="handleSkuChange(index)"></el-input>
            </td>
            <td>
              <el-button size="mini" @click="handleSkuRemove(index)">删除色片</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="actions-wrap">
      <ul class="clearfix">
        <li v-show="spuId > 0">
          <el-button size="mini" type="button" @click="qrCodeEdit.dialogVisible = true" plain>打印批量图片二维码</el-button>
          <el-button size="mini" type="button" @click="printSpuLabel" v-if="isManager" plain>打印色卡标签</el-button>
        </li>
        <li>
          <el-button size="mini" type="primary" :disabled="btnDisabled" @click="saveProduct(false)" plain>保存</el-button>
          <el-button size="mini" type="primary" :disabled="btnDisabled" @click="saveProduct(true)" plain>保存并新建一条</el-button>
        </li>
      </ul>
    </el-card>
    <el-dialog v-for="(attr,index) in attribute.propList" :key="index" :title="attr.name" :visible.sync="attr.visible">
      <template v-if="attr.attributeList.length>0" v-for="item in attr.attributeList">
        <el-checkbox v-if="attr.isMult" :key="item.id" v-model="item.checked">{{item.name}}</el-checkbox>
        <el-radio v-else v-model="attr.radio" :label="item.name" :key="item.id">{{item.name}}</el-radio>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="attr.visible = false" size="mini" plain>取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm(attr)" size="mini" plain>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="preview.dialogVisible" width="540px" :before-close="beforePreviewClose">
      <el-carousel indicator-position="outside" :autoplay="false" :initial-index="preview.initialIndex" height="500px">
        <el-carousel-item v-for="item in preview.list" :key="item.uid">
          <img :src="item.url" alt="" width="100%" height="100%">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <el-dialog title="二维码打印类型" :visible.sync="qrCodeEdit.dialogVisible" width="540px">
      <template v-for="(type,index) in qrCodeEdit.spuTypes">
        <el-radio v-model="qrCodeEdit.type" :label="type.key" :key="index">{{type.name}}</el-radio>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qrCodeEdit.dialogVisible = false" size="mini" plain>取 消</el-button>
        <el-button type="primary" @click="printSpuQrCode(qrCodeEdit.type, $event)" size="mini" plain>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getProductDetail, getAttribute, addProduct, modifyProduct, modifyProductSku } from '@/api/product';
  import { getInfo } from '@/api/user';
  import EbUpload from '@/components/EbUpload';
  import { getPicUrl } from '@/utils/getPicUrl';
  import { byTypeGetObj, parseTime } from '@/utils';
  import clipboard from '@/utils/clipboard';
  import { checkAllTextValid } from '@/utils/checkTextValid';

  const spuTypes = [{ key: 'small', name: '小布' }, { key: 'cut', name: '剪版' }, { key: 'big', name: '套版' }];

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
        detail: {
          aliasName: '',
          brand: '',
          weight: '',
          maxWeight: '',
          width: '',
          maxWidth: '',
          popType: 0,
          productCode: '',
          productName: '',
          saleUnit: '1',
          saleStatus: '1',
          payStrategyId: '1',
          leadTime: 0,
          ingredientList: [
            { name: '', value: 0 }
          ],
          imageList: [],
          skuList: [],
          priceList: []
        },
        supplyPrice: 0,
        bukPrice: 0,
        samplePrice: 0,
        attribute: {
          alias: [],
          propList: [],
          radio: {},
          unit: [],
          saleStatus: this.GLOBAL.saleStatus
        },
        ingredientData: [],
        propertieList: [
          { id: '67',  name: '织物', data: [], value: [], type: 'dialog' },
          { id: '23',  name: '工艺', data: [], value: [], type: 'dialog' },
          { id: '134', name: '图案', data: [], value: [], type: 'dialog' },
          { id: '1',   name: '纱支', data: [], value: [], type: 'dialog' },
          { id: '48',  name: '结构', data: [], value: [], type: 'dialog' },
          { id: '77',  name: '功能', data: [], value: [], type: 'dialog' },
          { id: '95',  name: '用途', data: [], value: [], type: 'dialog' },
          { id: '127', name: '季节', data: [], value: [], type: 'radio' },
          { id: '90',  name: '人群', data: [], value: [], type: 'radio' }
        ],
        source: '',
        propMust: ['23', '67', '134'],
        imageList: [],
        skuList: [],
        limit: 4,
        skuEdit: {
          count: undefined,
          startCode: undefined,
          delSkuIds: [],
          editSkuIds: {}
        },
        preview: {
          list: [],
          initialIndex: 0,
          dialogVisible: false
        },
        btnDisabled: false,
        qrCodeEdit: {
          dialogVisible: false,
          spuTypes: spuTypes,
          type: 'small'
        },
        productStatus: {},
        payStrategy: this.GLOBAL.payStrategy
      };
    },
    created() {
      this.getData();
    },
    computed: {
      unitName() {
        for (let i = 0; i < this.attribute.unit.length; i++) {
          if (this.detail.saleUnit == this.attribute.unit[i].key) {
            return this.attribute.unit[i].name;
          }
        }
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
      _popType: {
        set(value) {
          this.detail.popType = value ? 1 : 0;
        },
        get() {
          return this.detail.popType === 1;
        }
      }
    },
    methods: {
      getData() {
        getAttribute(31).then(res => {
          let list = res;
          let lxRadio = {}, lxLabel = {};
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let liId = item.id;
            if (liId == 67 || liId == 23 || liId == 134) {
              item.isMust = true;
            }
            if (liId == 95 /* 用途 2 */ || liId == 23 /* 工艺 2 */ || liId == 77 /* 功能 2 */) {
              item.isMult = true;
              item.visible = false;
              lxLabel[item.id] = item;
            } else if (liId == 1 /* 纱支 1 */ || liId == 48 /* 结构 1 */ || liId == 67 /* 织物 1 */ || liId == 134 /* 图案 1 */) {
              item.isMult = false;
              item.radio = '';
              item.visible = false;
              lxLabel[item.id] = item;
            } else if (liId == 90 && (item.attributeList = item.attributeList.reverse()) /* 人群 */ || liId == 127 /* 季节 */) {
              item.radio = item.attributeList[0].name;
              lxRadio[item.id] = item;
            } else if (liId == 170) {
              this.ingredientData = item.attributeList;
            } else if (liId == 161) {
              this.attribute.unit = item.attributeList;
            }
          }
          this.attribute.propList = lxLabel;
          this.attribute.radio = lxRadio;
        }).then(() => {
          if (this.spuId) {
            getProductDetail({ productId: this.spuId, productType: this.productType }).then(res => {
              this.detail = res;
              const propertieList = res.propertieList;
              for (let i = 0; i < this.propertieList.length; i++) {
                this.propertieList[i].value = propertieList[this.propertieList[i].id] ? propertieList[this.propertieList[i].id].value || [] : [];
              }
              for (let k in this.attribute.radio) {
                this.attribute.radio[k].radio = propertieList[k].value.toString();
              }
              this.detail.createTime = parseTime(this.detail.createTime);
              this.productStatus = byTypeGetObj(res.status, this.GLOBAL.productStatus);
              this.detail.priceList.forEach(v => {
                let price = v.salePrice;
                switch (v.priceType) {
                  case 35: this.supplyPrice = price; break;
                  case 1: this.bukPrice = price; break;
                  case 2: this.samplePrice = price; break;
                }
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
              this.detail.saleUnit = this.detail.saleUnit.toString();
              this.detail.saleStatus = this.detail.saleStatus.toString();
              this.detail.payStrategyId = this.detail.payStrategyId.toString();
              this.providerName = this.detail.providerName;
              this.uid = this.detail.providerId;
              this.source = this.detail.labels || '';
            });
          } else {
            getInfo(this.uid).then(res => {
              this.providerName = res.name;
            });
          }
        });
      },
      getProduct() {
        this.detail.priceList = [
          { salePrice: this.supplyPrice, priceType: 35 },
          { salePrice: this.bukPrice, priceType: 1 },
          { salePrice: this.samplePrice, priceType: 2 },
          { salePrice: 0, priceType: 3 }
        ];
        let propertieList = {};
        for (let i = 0; i < this.propertieList.length; i++) {
          let item = this.propertieList[i];
          if (this.attribute.radio[item.id]) {
            propertieList[item.id] = {
              name: item.name,
              value: [this.attribute.radio[item.id].radio]
            };
          } else {
            propertieList[item.id] = {
              name: item.name,
              value: item.value
            };
          }
          if (this.propMust.indexOf(item.id) > -1 && item.value.length === 0) {
            this.$message({
              type: 'error',
              message: `${item.name}不能为空，请至少选择一个`
            });
            return false;
          }
        }
        this.detail.propertieList = propertieList;
        this.detail.providerId = this.detail.providerId || this.uid;
        if (!this.checkValueIsInvalid(this.detail) || this.checkIngredientIsInValid(this.detail.ingredientList) || this.checkSkuCodeIsInvalid(this.skuList)) {
          return false;
        }
        if (!this.skuList.length) {
          this.$message({
            type: 'error',
            message: '请先添加色片再保存！'
          });
          return false;
        }
        for (let i = 0; i < this.skuList.length; i++) {
          if (!this.skuList[i].images.length) {
            this.$message({
              type: 'error',
              message: '有色片未上传有色片图，请先上传色片图！'
            });
            return false;
          }
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
        this.detail.labels = this.source || '';
        return this.detail;
        // return {
        //   productType: this.productType,
        //   product: JSON.stringify(this.detail)
        // };
      },
      saveProduct(ab) {
        this.btnDisabled = true;
        setTimeout(() => {
          this.btnDisabled = false;
        }, 1000);
        let data = this.getProduct();
        if (!data) { return false; }
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
      handleDialogConfirm(params) {
        params.visible = false;
        let pList = [];
        if (params.isMult) {
          let aList = params.attributeList;
          for (let i = 0; i < aList.length; i++) {
            let item = aList[i];
            if (item.checked) {
              pList.push(item.name);
            }
          }
        } else if (params.radio !== '') {
          pList = [params.radio];
        }
        for (let i = 0; i < this.propertieList.length; i++) {
          if (this.propertieList[i].id == params.id) {
            this.propertieList[i].value = pList;
            break;
          }
        }
      },
      addIngredientItem() {
        this.detail.ingredientList.push(
          { name: '', value: '0' }
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
        this.$confirm('确认删除该色片?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let sku = this.skuList.splice(index, 1)[0];
          sku.skuId && this.skuEdit.delSkuIds.push(sku.skuId);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      checkSkuCodeIsInvalid(arr) {
        let obj = {};
        let isInvalid = false;
        arr.map((value, index) => {
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
        if (params.maxWidth > 0 && parseFloat(params.width) >= parseFloat(params.maxWidth)) {
          this.$message({
            type: 'error',
            message: '最大布封要大于最小布封，请重新填写'
          });
          return false;
        }
        if (params.weight > 0 && params.maxWeight > 0 && parseFloat(params.weight) >= parseFloat(params.maxWeight)) {
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
            message: '录入的数据不能含有英文状态的单双引号（\'\"），请检查数据'
          });
          return false;
        }
        return true;
      },
      printSpuQrCode(type, event) {
        let lo_detail = this.detail;
        let data = {
          Business: lo_detail.providerName,
          ColorId: lo_detail.productCode,
          Ebu: 'Ebu',
          RandomStr: Math.random(),
          ebuSpuInfo: {
            SkuType: type,
            Yid: lo_detail.productId
          }
        };
        clipboard(JSON.stringify(data), event, () => {
          this.qrCodeEdit.dialogVisible = false;
          this.$message({
            type: 'success',
            message: '打印成功'
          });
        }, () => {
          this.$message({
            type: 'error',
            message: '打印失败'
          });
        });
      },
      printSpuLabel() {
        let lo_detail = this.detail;
        let arr = lo_detail.ingredientList || [];
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
          newArr.push({ Name: arr[i].name.split('/')[0], Percent: arr[i].value });
        }
        let data = {
          Ebu: 'Ebu',
          RandomStr: Math.random(),
          SpuId: lo_detail.productId,
          Component: newArr, // 成分
          Width: lo_detail.width + 'cm',
          Weight: lo_detail.weight + 'g/m²',
          Supplier: lo_detail.providerId,
          ProductType: lo_detail.productType,
          CodeType: 0 // 二维码类型
        };
        clipboard(JSON.stringify(data), event, () => {
          this.$message({
            type: 'success',
            message: '打印成功'
          });
        }, () => {
          this.$message({
            type: 'error',
            message: '打印失败'
          });
        });
      }
    },
    components: {
      EbUpload
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
    .product-status-wrap{
      .product-status-wrap-box{
        display: flex;
        .product-status-item {
          flex: 1;
          &:not(.action-button) {
            line-height: 28px;
          }
          &.action-button{
            text-align: right;
          }
        }
      }
    }
    .product-info-wrap{
      display: flex;
      .product-prop,.product-label{
        flex: 1;
        .table{
          tbody{
            td:first-child{
              width: 120px;
            }
            .el-input--mini{
              width: 45%;
            }
            .ingredient-list{
              .ingredient-list-item{
                margin-bottom:5px;
                .el-input{
                  vertical-align: top;
                }
                .el-input--mini{
                  width: 30%;
                }
                .el-select{
                  vertical-align: top;
                  .el-input--mini{
                    width: 100%;
                  }
                }
                .el-button{
                  visibility: hidden;
                }
                &:hover{
                  .el-button{
                    visibility: visible;
                  }
                }
              }
            }
          }
          &.custom-table{
            margin-top: 15px;
          }
        }
      }
      .product-prop{
        margin-right:5px;
      }
      .product-label{
        margin-left:5px;
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