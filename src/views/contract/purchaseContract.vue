<template>
  <div class="purchase-contract">
    <div class="contract-title">
      <p class="company-name">广州衣布到位服饰有限公司</p>
      <p class="title-text">{{detail.contractName}}</p>
    </div>
    <div class="company-info">
      <div class="table-box">
        <table class="table table-responsive table-bordered">
          <tbody>
          <tr>
            <td>买方</td>
            <td>{{buyerInfo.name}}</td>
            <td>买方电话</td>
            <td>{{buyerInfo.tel}}</td>
            <td>合同编号</td>
            <td>{{detail.contractCode}}</td>
          </tr>
          <tr>
            <td>卖方</td>
            <td>{{order.providerName}}</td>
            <td>卖方电话</td>
            <td>{{order.providerTel}}</td>
            <td>签约地点</td>
            <td>
              <el-input v-if="cid==0" type="text" size="mini" v-model="detail.contractAddress"></el-input>
              <p v-else>{{detail.contractAddress}}</p>
            </td>
          </tr>
          <tr>
            <td>卖方地址</td>
            <td colspan="3">{{order.providerAddress}}</td>
            <td>签订日期</td>
            <td>{{_contractDate}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="product-list">
      <p class="title-text">经买卖双方商定，按本合同条款，买方向卖方采购下列面辅材料：</p>
      <eb-table :list="list" :columns="columns">
        <el-table-column slot="specification" label="规格">
          <template slot-scope="{ row }">
            <p v-if="row.specification.length>0" v-for="item in row.specification">
              <span>{{item.name}}：</span>
              <span>{{item.value}}；</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column slot="ingredientList" label="成分" width="180px">
          <template slot-scope="{ row }">
            <p v-if="row.ingredientList.length>0" v-for="item in row.ingredientList">
              <span>{{item.name}}：</span>
              <span>{{item.value}}%；</span>
            </p>
          </template>
        </el-table-column>
      </eb-table>
    </div>
    <div class="contract-terms">
      <p class="title-text">本合同除双方另有协议外，适用下列条款：</p>
      <div class="table-box">
        <table class="table table-bordered table-responsive">
          <tbody>
          <tr>
            <td>货期</td>
            <td>
              <div class="block" v-if="cid==0">
                <el-date-picker
                  v-model="detail.deliveryTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择货期">
                </el-date-picker>
              </div>
              <p v-else>{{_deliveryTime}}</p>
            </td>
          </tr>
          <tr>
            <td>付款类型</td>
            <td>{{payStrategyName}}</td>
          </tr>
          <tr>
            <td>条款</td>
            <td class="terms-input">
              <el-input
                type="textarea"
                :autosize="{ minRows: 20}"
                placeholder="请输入合同条款内容"
                :disabled="!isManager"
                v-model="detail.contractTerms"></el-input>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="contract-signature clearfix">
      <div class="signature-item">
        卖方签章：
        <span>{{order.providerName}}</span>
      </div>
      <div class="signature-item buyer-item">
        买方签章：
        <span>{{buyerInfo.name}}</span>
      </div>
    </div>
    <div class="contract-footer">
      <el-button type="button" size="mini" plain>取消</el-button>
      <el-button v-if="isManager" type="primary" size="mini" @click="saveContract" plain>确认</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { queryContract, addContract, updateContract, purchaseDetail } from '@/api/purchaseOrder';
  import { cloneObj, formatMoney, parseTime, dataLeftCompleting, byTypeGetObj } from '@/utils';
  import EbTable from '@/components/EbTable';

  export default {
    name: 'purchase-contract',
    data() {
      return {
        oid: this.$route.query.pid || 0,
        cid: this.$route.query.cid || 0,
        isManager: this.$store.getters.isManager,
        order: {},
        buyerInfo: {
          name: '广州衣布到位服饰有限公司',
          tel: '15967385404',
          address: ''
        },
        sellerInfo: {
          name: '',
          tel: '',
          address: ''
        },
        detail: {
          contractName: '面辅料采购合同',
          deliveryTime: new Date(new Date().getTime() + 10 * 24 * 3600000),
          contractTerms: '',
          contractCode: '',
          contractAddress: '',
          contractDate: new Date()
        },
        list: [],
        columns: [
          { prop: 'productCode', label: '款号' },
          { prop: 'productName', label: '品名' },
          { prop: 'skuCode', label: '色号' },
          { prop: 'specification', label: '规格', slot: 'specification' },
          { prop: 'ingredient', label: '成分', slot: 'ingredientList' },
          { prop: 'unitPrice', label: '单价(含税)' },
          { prop: 'num', label: '数量' },
          { prop: 'unit', label: '单位' },
          { prop: 'totalAmount', label: '金额(元)' },
          { prop: 'note', label: '备注' }
        ],
        saleUnits: {},
        priceTypes: {},
        payStrategyName: ''
      };
    },
    computed: {
      _contractDate() {
        return parseTime(this.detail.contractDate, '{y}年{m}月{d}日');
      },
      _deliveryTime() {
        return parseTime(this.detail.deliveryTime, '{y}年{m}月{d}日');
      }
    },
    created() {
      this.GLOBAL.priceTypes.forEach(v => {
        this.priceTypes[v.t] = v.n;
      });
      this.GLOBAL.priceUnit.forEach(v => {
        this.saleUnits[v.t] = v.n;
      });
      if (this.cid > 0) {
        this.getData(this.cid);
      } else {
        this.detail.contractCode = parseTime(new Date(), '{y}{m}{d}') + dataLeftCompleting(8, '0', this.oid);
        this.detail.contractDate = new Date();
        this.getOrderData(this.oid);
      }
    },
    methods: {
      getData(id) {
        queryContract({ id: id }).then(res => {
          this.detail = res;
          this.order = res.order || {};
          this.list = this.formatList(this.order);
          this.payStrategyName = byTypeGetObj(res.payStrategyId, this.GLOBAL.contractPayway).n || '';
        });
      },
      getOrderData(id) {
        purchaseDetail({ purchaseOrderId: id }).then(res => {
          this.order = res;
          this.list = this.formatList(res);
          this.payStrategyName = byTypeGetObj(res.payStrategyId, this.GLOBAL.contractPayway).n || '';
        });
      },
      formatList(obj) {
        let product = obj.product || {};
        let detail = {
          productCode: obj.productCode,
          productName: obj.productName,
          skuCode: byTypeGetObj(obj.skuId, product.skuList || [], 'skuId').skuCode || '',
          ingredientList: product.ingredientList || [],
          unitPrice: formatMoney(obj.price),
          num: obj.number,
          unit: this.saleUnits[product.saleUnit] || '无',
          totalAmount: formatMoney(obj.price * obj.number)
        };
        let specification = [];
        let lsValue = '';
        lsValue = product.width;
        if (product.maxWidth > 0) {
          lsValue = lsValue + '-' + product.maxWidth;
        }
        specification.push({
          name: '布封',
          value: lsValue
        });
        if (product.weight > 0) {
          lsValue = product.weight;
          if (product.maxWeight > 0) {
            lsValue = lsValue + '-' + product.maxWeight;
          }
          specification.push({
            name: '克重',
            value: lsValue
          });
        }
        let property = product.propertieList || {};
        if (property[1]) {
          specification.push({
            name: property[1].name,
            value: property[1].value.join('，')
          });
        }
        if (property[48]) {
          specification.push({
            name: property[48].name,
            value: property[48].value.join('，')
          });
        }
        if (property[23]) {
          specification.push({
            name: property[23].name,
            value: property[23].value.join('，')
          });
        }
        this.$set(detail, 'specification', specification);
        return [detail];
      },
      saveContract() {
        if (this.cid == 0) {
          this.detail.belongsId = this.oid;
          this.detail.firstPartyInfo = this.buyerInfo;
          this.detail.contractType = 1;
          addContract({ contract: JSON.stringify(this.detail) }).then(res => {
            this.$message({
              type: 'success',
              message: '合同新建成功'
            });
            this.cid = res.id;
            this.$router.push({ query: { cid: res.id }});
            this.getData(res.id);
          });
        } else {
          let contract = {
            isFinal: 0,
            id: this.cid,
            contractTerms: this.detail.contractTerms
          };
          updateContract({ contract: JSON.stringify(contract) }).then(res => {
            this.$message({
              type: 'success',
              message: '合同修改成功'
            });
            this.getData(this.cid);
          });
        }
      },
      backPage() {
        // this.$router.push({ path: 'orderDetail', query: { orderId: this.orderId }});
      }
    },
    components: {
      EbTable
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .purchase-contract{
    padding: 0 10px;
    margin-bottom: 30px;
    .contract-title{
      padding: 20px 0;
      text-align: center;
      font-size: 20px;
      .company-name{
        padding-bottom: 10px;
      }
    }
    .table-box{
      padding: 0 10px;
    }
    .company-info{
      .table{
        tbody{
          td{
            padding-left: 20px;
            &:nth-child(2n-1){
              width: 150px;
            }
          }
        }
      }
    }
    .product-list,.contract-terms{
      .title-text{
        padding: 15px 10px;
        font-size: 16px;
      }
    }
    .contract-terms{
      .table{
        tbody{
          td{
            padding-left: 20px;
            &:nth-child(2n-1) {
              width: 150px;
            }
            &.terms-input{
              padding: 0;
              .el-textarea{
                &.is-disabled{
                  .el-textarea__inner{
                    background-color: #fff;
                    color: #606266;
                    cursor: text;
                  }
                }
              }
            }
          }
        }
      }
    }
    .contract-signature{
      .signature-item{
        float:left;
        padding: 25px 10px;
        font-size: 18px;
        &.buyer-item{
          float: right;
        }
      }
    }
    .contract-footer{
      padding: 0 10px;
      text-align: center;
      .el-button{
        margin: 0 20px;
      }
    }
  }
</style>