<template>
  <div class="cloth-detail">
    <el-card class="product-status-wrap">
      <ul class="product-status-wrap-box">
        <li class="product-status-item" v-if="isManager">
          <span>供应商：{{providerName}}</span>
        </li>
        <li class="product-status-item">
          SPUID：<span>{{spuId}}</span>
        </li>
        <li class="product-status-item">
          录入时间：<span>{{detail.createTime}}</span>
        </li>
        <li class="product-status-item">
          状态：<span>{{productStatus.n}}</span>
        </li>
        <li class="product-status-item action-button" v-if="productStatus.s==='SALE'">
          <el-button type="primary" size="mini" @click="modifyProductStatus(2)">下架</el-button>
        </li>
        <li class="product-status-item action-button" v-if="productStatus.s==='SOLD'">
          <el-button type="primary" size="mini" @click="modifyProductStatus(1)">上架</el-button>
        </li>
      </ul>
    </el-card>
    <el-card class="actions-wrap">
      <ul class="actions-list-wrap clearfix">
        <!--<li class="list-item">-->
          <!--<el-button size="mini" type="button" @click="qrCodeEdit.dialogVisible = true" plain>打印批量图片二维码</el-button>-->
          <!--<el-button size="mini" type="button" @click="printSpuLabel" v-if="isManager" plain>打印色卡标签</el-button>-->
        <!--</li>-->
        <li class="list-item reason-text"  v-if="productStatus.s === 'NOPASS'">
          <span>供应商修改说明：</span>
          <span>{{detail.reason}}</span>
        </li>
        <li class="list-item edit-item">
          <el-button size="mini" type="button" @click="editProduct(spuId)" plain>编辑</el-button>
        </li>
      </ul>
      <!--<el-dialog title="二维码打印类型" :visible.sync="qrCodeEdit.dialogVisible" width="540px">
        <template v-for="(type,index) in qrCodeEdit.spuTypes">
          <el-radio v-model="qrCodeEdit.type" :label="type.key" :key="index">{{type.name}}</el-radio>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click="qrCodeEdit.dialogVisible = false" size="mini" plain>取 消</el-button>
          <el-button type="primary" @click="printSpuQrCode(qrCodeEdit.type, $event)" size="mini" plain>确 定</el-button>
        </div>
      </el-dialog>-->
    </el-card>
    <div class="product-info-wrap">
      <el-card class="product-base-wrap">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <div>
          <table class="table table-bordered table-responsive">
            <tbody>
            <tr>
              <td>款号</td>
              <td>
                <span>{{detail.productCode}}</span>
              </td>
              <td>分类</td>
              <td>
                <span>{{catStr}}</span>
              </td>
            </tr>
            <tr>
              <td>品名</td>
              <td>
                <span>{{detail.productName}}</span>
              </td>
              <td>别名</td>
              <td>
                <span>{{detail.aliasName}}</span>
              </td>
            </tr>
            <tr class="width-weight">
              <td>布封</td>
              <td>
                <span>{{detail.width}}{{detail.width>0?widthUnit:''}}</span>
              </td>
              <td>克重</td>
              <td>
                <span>{{detail.weight}}{{detail.weight>0?weightUnit:''}}</span>
              </td>
            </tr>
            <tr>
              <td>成分</td>
              <td>
                <ul class="ingredient-list">
                  <template v-for="(item,index) in detail.ingredientList">
                    <li class="ingredient-list-item" :key="index">
                      <span>{{item.name}}</span>&nbsp;<span>{{item.value}}%</span>
                    </li>
                  </template>
                </ul>
              </td>
              <td>质检证明</td>
              <td>
                <ul class="image-list">
                  <li class="image-item" v-for="(image,index) in qcImage" :key="index">
                    <img :src="image.url" alt="">
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>供货类型</td>
              <td>
                <span>{{detail.saleStatusName}}</span>
              </td>
              <td>计量单位</td>
              <td>
                <span>{{detail.saleUnitName}}</span>
              </td>
            </tr>
            <template v-if="detail.saleStatus == 1">
              <tr>
                <td>
                  大货供货价
                  <span v-if="isEnough">（足米）</span>
                </td>
                <td>
                  <span>{{priceList[19] || 0}}</span>
                </td>
                <td>散剪供货价</td>
                <td>
                  <span>{{priceList[20] || 0}}</span>
                </td>
              </tr>
              <tr>
                <td>终端大货价</td>
                <td>
                  <span>{{priceList[1] || 0}}</span>
                </td>
                <td>终端散剪价</td>
                <td>
                  <span>{{priceList[2] || 0}}</span>
                </td>
              </tr>
              <tr>
                <td>纸筒</td>
                <td>
                  <span>{{detail.paper}}</span>
                </td>
                <td>空差</td>
                <td>
                  <span>{{detail.gross}}</span>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td>定制供货价</td>
                <td>
                  <span>{{priceList[21] || 0}}</span></td>
                <td>货期</td>
                <td>
                  <span>{{detail.leadTime}}天</span>
                </td>
              </tr>
              <tr>
                <td>结算方式</td>
                <td>
                  <span>{{payStrategyName}}</span>
                </td>
                <td></td>
                <td></td>
              </tr>
            </template>
            <tr>
              <td>每卷规格</td>
              <td>
                <span>{{detail.batchNumber || 0}}</span>
                <span>{{detail.saleUnitName}}</span>
              </td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </div>
    <el-card class="product-prop">
      <div slot="header" class="clearfix">
        <span>属性信息</span>
      </div>
      <table class="table table-bordered table-responsive">
        <tbody>
          <template v-for="items in propertieList">
            <tr>
              <template v-for="item in items">
                <td>{{item.name}}</td>
                <td>{{item.value}}</td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </el-card>
    <el-card class="product-image">
      <div slot="header" class="clearfix">
        <span>商品图片</span>
      </div>
      <table class="table table-bordered table-responsive">
        <tbody>
        <tr>
          <td>面料色彩类型</td>
          <td>{{colorType}}</td>
        </tr>
        <tr v-if="detail.colorType == 1">
          <td>主图</td>
          <td>
            <ul class="image-list">
              <li class="image-item" v-for="(image,index) in spuImage" :key="index">
                <img :src="image.url" alt="">
              </li>
            </ul>
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
        <span>
          SKU数量：<span>{{detail.skuList.length}}</span>
        </span>
      </div>
      <table class="table table-bordered table-responsive sku-list-wrap">
        <thead>
        <tr>
          <th>色片编号</th>
          <th>色片图</th>
          <th>颜色值</th>
        </tr>
        </thead>
        <tbody>
        <tr class="sku-list-item" v-for="(sku, index) in detail.skuList" :key="index">
          <td>
            <span>{{sku.skuCode}}</span>
          </td>
          <td>
            <ul class="image-list">
              <li class="image-item" v-for="(image,index) in sku.images" :key="index">
                <img :src="image.url" alt="">
              </li>
            </ul>
          </td>
          <td>
            <span>{{sku.colorCode}}</span>
          </td>
        </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="cloth-detail-wrap">
      <div slot="header" class="clearfix">
        <span>商品详情</span>
      </div>
      <div v-html="productDetail"></div>
    </el-card>
    <el-card class="product-review-wrap" v-if="productStatus.s === 'COMFIRM' && isManager">
      <div class="product-review">
        <span class="text-box">审核结果：</span>
        <el-radio-group class="radio-box" v-model="productReview">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="3">不通过</el-radio>
        </el-radio-group>
        <div class="text-input">
          <el-input size="mini" v-show="productReview === 3" v-model="reason" placeholder="原因"></el-input>
        </div>
        <el-button type="primary" size="mini" @click="modifyProductStatus(productReview, reason)">审核</el-button>
      </div>
    </el-card>
    <el-card class="audit-list-wrap">
      <div slot="header" class="clearfix">
        <span>审核记录</span>
      </div>
      <eb-table :list="detail.auditList" :columns="columns"></eb-table>
    </el-card>
    <el-card class="actions-wrap" v-if="isManager">
      <ul class="clearfix">
        <li>
          <el-button v-if="detail.status==2" @click="modifyProductStatus(1)" size="mini" type="primary">上架</el-button>
          <el-button v-if="detail.status==1" @click="modifyProductStatus(2)" size="mini" type="primary">下架</el-button>
        </li>
        <!--<li>
          <el-button size="mini" type="button" @click="qrCodeEdit.dialogVisible = true" v-if="isManager" plain>打印批量图片二维码</el-button>
          <el-button size="mini" type="button" @click="printSpuLabel" plain>打印色卡标签</el-button>
        </li>-->
      </ul>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getProductDetail, modifyProductStatus } from '@/api/product';
  import { byTypeGetObj } from '@/utils';
  import { getPicUrl } from '@/utils/getPicUrl';
  import clipboard from '@/utils/clipboard';
  import { formatMoney, parseTime } from '../../../utils';
  import { base64 } from '../../../utils';
  import EbTable from '@/components/EbTable';

  const widthUnit = { 1: '厘米', 2: '英寸' };
  const weightUnit = { 1: 'g/m²', 2: 'OZ', 3: 'm/m' };
  const spuTypes = [{ key: 'small', name: '小布' }, { key: 'cut', name: '剪版' }, { key: 'big', name: '套版' }];
  const productStatus = {
    0: '提交审核',
    1: '上架',
    2: '下架',
    3: '审核不通过'
  };

  export default {
    name: 'cloth-detail',
    data() {
      return {
        spuId: this.$route.query.pid || 0,
        productType: 6,
        providerName: '',
        isManager: this.GLOBAL.managerRoles.indexOf(this.$store.getters.roles[0]) > -1,
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
          saleUnit: '',
          saleStatus: '',
          ingredientList: [
            { name: '', value: 0 }
          ],
          imageList: [],
          skuList: [],
          priceList: []
        },
        priceList: {},
        catStr: '',
        weightUnit: '',
        widthUnit: '',
        // bulkPrice: 0,
        // samplePrice: 0,
        // customPrice: 0,
        colorType: '',
        spuImage: [],
        qcImage: [],
        productStatus: {},
        payStrategyName: '',
        propertieList: [
        ],
        productDetail: '',
        productReview: 3,
        reason: '',
        qrCodeEdit: {
          dialogVisible: false,
          spuTypes: spuTypes,
          type: 'small'
        },
        isEnough: false,
        columns: [
          { prop: 'time', label: '时间' },
          { prop: 'status', label: '状态' },
          { prop: 'userName', label: '账号' }
        ]
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        getProductDetail({ productId: this.spuId, productType: this.productType }).then(res => {
          res.createTime = parseTime(res.createTime);
          this.detail = res;
          this.detail.auditList.forEach(v => {
            v.time = parseTime(v.updateTime);
            v.status = v.fromStatus === 0 && v.toStatus === 1 ? '审核上架' : productStatus[v.toStatus];
          });
          this.providerName = res.providerName;
          this.productStatus = byTypeGetObj(res.status, this.GLOBAL.productStatus);
          this.$set(this.detail, 'saleStatusName', this.GLOBAL.saleStatus[this.detail.saleStatus] || '');
          this.detail.gross = this.detail.gross || '';
          this.detail.paper = this.detail.paper || '';
          this.detail.weight = this.detail.weight || '';
          this.payStrategyName = this.GLOBAL.payStrategy[this.detail.payStrategyId].s || '';
          this.widthUnit = widthUnit[this.detail.widthUnit] || '';
          this.weightUnit = weightUnit[this.detail.weightUnit] || '';
          this.colorType = this.detail.colorType == 1 ? '单色染色' : this.detail.colorType == 2 ? '多色印花' : '';
          this.productDetail = base64.atob(this.detail.detailInfo);
          let catList = [];
          this.detail.catList.forEach(v => {
            catList.push(v.catName);
          });
          this.catStr = catList.join('-');
          let key = this.detail.catList[0] ? this.detail.catList[0].catId : '';
          let key2 = this.detail.catList[1] ? this.detail.catList[1].catId : '';
          if (key == 3102 && key2 == 310207) {
            key = key2;
          }
          this.isEnough = this.detail.catList[0] ? (this.detail.catList[0].catId == 3101) : false;
          this.detail.priceList.map(v => {
            this.priceList[v.priceType] = formatMoney(v.salePrice)
          });
          // this.detail.priceList.forEach(v => {
          //   let price = formatMoney(v.salePrice);
          //   switch (v.priceType) {
          //     case 19: this.bulkPrice = price; break;
          //     case 20: this.samplePrice = price; break;
          //     case 21: this.customPrice = price;
          //   }
          // });
          this.detail.imageList.forEach(value => {
            this.$set(value, 'url', getPicUrl(value.image, 1, value.imgType));
            switch (value.imgType) {
              case 5: this.spuImage.push(value); break;
              case 7: this.qcImage.push(value);
            }
          });
          this.$set(this.detail, 'saleUnitName', byTypeGetObj(this.detail.saleUnit, this.GLOBAL.priceUnit).n);
          let properties = [];
          for (let k in this.detail.propertieList) {
            if (k != 999) {
              properties.push({
                name: this.detail.propertieList[k].name,
                value: this.detail.propertieList[k].value.join('、')
              });
            }
          }
          let row = 3;
          let num = properties.length % row;
          num > 0 && (properties = properties.concat(new Array(row - num).fill('')));
          for (let i = 0; i < properties.length; i += row) {
            this.propertieList.push(properties.slice(i, i + row));
          }
          this.detail.skuList.forEach(sku => {
            sku.images.forEach(value => {
              this.$set(value, 'url', getPicUrl(value.image, 1, value.imgType));
            });
          });
        });
      },
      modifyProductStatus(status, reason) {
        let params = {
          productType: 6,
          productId: this.spuId,
          status: status
        };
        if (status === 3) {
          if (reason !== '') {
            params.reason = reason;
          } else {
            this.$message({
              type: 'warming',
              message: '原因不能为空！'
            });
            return false;
          }
        } else if (status == 1) {
          let isEmpty = false;
          this.detail.skuList.forEach(v => {
            if (v.images.length == 0) {
              isEmpty = true;
              return false;
            }
          });
          if (isEmpty) {
            this.$message({
              type: 'warming',
              message: '有sku未上传有图片，不能审核上架'
            });
            return false;
          }
        }
        let text = '审核成功！';
        if (status == 2) {
          text = '下架成功！';
        } else if (status == 1) {
          text = '上架成功！';
        }
        modifyProductStatus(params).then(res => {
          this.$message({
            type: 'success',
            message: text,
            duration: 2000
          });
          setTimeout(() => {
            location.reload();
          }, 500);
        });
      },
      editProduct(id) {
        this.$router.push({ path: 'clothEdit', query: { pid: id }});
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
            message: '正在打印'
          });
        }, () => {
          this.$message({
            type: 'error',
            message: '打印出错'
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
      EbTable
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .cloth-detail{
    .product-status-wrap{
      .product-status-wrap-box{
        width: 100%;
        display: flex;
        .product-status-item{
          flex: 1;
          display: inline-block;
          vertical-align: top;
          &.action-button{
            text-align: right;
          }
        }
      }
    }
    .actions-list-wrap{
      .list-item{
        float: left;
        &.edit-item {
          float: right;
        }
      }
    }
    .product-base-wrap{
      .table{
        tbody{
          td:nth-child(2n-1){
            width: 10%;
          }
          td:nth-child(2n){
            width: 40%;
          }
        }
      }
    }
    .product-prop{
      .table{
        tbody{
          td:nth-child(2n-1){
            width: 10%;
          }
          td:nth-child(2n){
            width: 23.333%;
          }
        }
      }
    }
    .image-list{
      .image-item{
        display: inline-block;
        vertical-align: top;
        &:not(:last-child){
          margin-right:10px;
        }
      }
    }
    .product-image{
      .table{
        tbody{
          td:nth-child(2n-1) {
            width: 150px;
          }
        }
      }
    }
    .product-review-wrap{
      .product-review{
        .text-box,.radio-box .el-radio{
          line-height: 28px;
        }
        .text-input{
          display: inline-block;
          width: 65%;
        }
        .el-button{
          float: right;
        }
      }
    }
  }
</style>
