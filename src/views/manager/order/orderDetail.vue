<template>
  <div class="order-detail">
    <el-card class="order-detail-title">
      <ul class="order-detail-title-wrap">
        <li class="detail-title-item">订单状态：{{detail.statusName}}</li>
        <li class="detail-title-item">订单号：{{detail.orderId}}</li>
        <li class="detail-title-item">下单时间：{{detail.createTime}}</li>
        <li class="detail-title-item">
          <span>手机号：{{detail.cneePhone}}(ID: {{detail.userId}})</span>
          <el-button type="text" size="mini" @click="checkContract()">查看合同</el-button>
        </li>
        <li class="detail-title-item button-box" v-if="orderHandle.show">
          <el-button type="primary" size="mini" @click="handleOrder(orderHandle.next)">{{orderHandle.btnText}}</el-button>
        </li>
      </ul>
    </el-card>
    <div class="order-detail-info">
      <el-card class="info-item cash-note-list">
        <div slot="header" class="clearfix">
          <span>付款信息</span>
        </div>
        <template v-for="item in cashNoteList">
          <table class="table table-bordered table-responsive">
            <tbody>
            <tr>
              <td>金额</td>
              <td>
                &yen;{{item.amount}}
                <span v-if="item.payType==8">（补差额）</span>
              </td>
            </tr>
            <tr>
              <td>付款方式</td>
              <td>{{item.payWayName}}</td>
            </tr>
            <tr>
              <td>交易流水号</td>
              <td>{{item.realTransId||'无'}}</td>
            </tr>
            <tr>
              <td>说明</td>
              <td>{{item.note}}</td>
            </tr>
            <tr v-if="item.payWay===4 && item.payTransId > 0">
              <td>转账凭证</td>
              <td>
                <el-button type="primary" size="mini" @click="checkPaymentVoucher(cashNote.payTransId)" plain>查看图片
                </el-button>
              </td>
            </tr>
            </tbody>
          </table>
        </template>
      </el-card>
      <el-card class="info-item">
        <div slot="header" class="clearfix">
          <span>发票信息</span>
        </div>
        <table class="table table-bordered table-responsive">
          <tbody>
            <tr>
              <td>是否开发票</td>
              <td>{{detail.invoiceType?'是':'否'}}</td>
            </tr>
            <template v-if="detail.invoiceType">
              <tr>
                <td>发票抬头</td>
                <td>{{detail.invoiceTitle || '无'}}</td>
              </tr>
              <tr>
                <td>内容</td>
                <td>{{detail.invoiceContent || '无'}}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </el-card>
      <el-card class="info-item">
        <div slot="header" class="clearfix">
          <span>收货信息</span>
        </div>
        <table class="table table-bordered table-responsive">
          <tbody>
          <tr>
            <td>收货类型</td>
            <td>{{detail.logisticsTypeName}}</td>
          </tr>
          <tr>
            <td>收货人</td>
            <td>{{detail.cneeName || '无'}}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{detail.cneePhone || '无'}}</td>
          </tr>
          <tr>
            <td>收货地址</td>
            <td>{{detail.cneeAddr || '无'}}</td>
          </tr>
          <tr v-if="detail.status === 2 && detail.logisticsType === 2">
            <td>物流状态</td>
            <td>
              <el-button type="primary" size="mini" @click="checkDeliveryStatus" plain>查看</el-button>
            </td>
          </tr>
          </tbody>
        </table>
      </el-card>
    </div>
    <el-card class="order-detail-list">
      <div slot="header" class="clearfix">
        <span>订单商品</span>
        <el-button type="primary" size="mini" v-if="[0,6,1].indexOf(detail.status) > -1" @click="balanceVisible = true" style="float:right;" plain>{{paid ? '补差额': '修改订单金额'}}</el-button>
      </div>
      <eb-table :list="list" :columns="columns">
        <el-table-column slot="img" label="商品图片" width="150">
          <template slot-scope="{ row }">
            <img :src="row.image" alt="">
          </template>
        </el-table-column>
      </eb-table>
      <div class="product-total-wrap">
        <ul class="amount-list">
          <li class="amount-list-item">合计金额：<span>&yen; {{totalAmount}}</span></li>
          <li class="amount-list-item">税费：<span>&yen; {{invoiceAmount}}</span></li>
          <li class="amount-list-item">实付金额：<span>&yen; {{payAmount}}</span></li>
          <!--<li class="amount-list-item" v-if="detail.status==0">
            加价：
            <div class="adjust-input-box">
              <el-input type="number" v-model="adjustAmount2" size="mini"></el-input>
            </div>
            <div class="adjust-btn-box">
              <el-button type="primary" size="mini" @click="updateAdjustAmount(adjustAmount2, 2)" :disabled="adjustAmount2 == 0 || adjustAmount2==''">提交修改</el-button>
            </div>
          </li>-->
        </ul>
      </div>
    </el-card>
    <el-card class="order-detail-note">
      <div slot="header" class="clearfix">
        <span>订单备注</span>
      </div>
      <table class="table table-bordered table-responsive">
        <thead>
        <tr>
          <th>客户备注</th>
          <th>客服备注</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <el-input
              type="textarea"
              disabled
              :rows="3"
              v-model="detail.note">
            </el-input>
          </td>
          <td>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="detail.serviceNote">
            </el-input>
            <el-button type="button" size="mini" @click="updateOrderNote">保存备注</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </el-card>
    <el-dialog
      title="填写物流信息"
      :visible.sync="logistics.dialogVisible"
      width="30%">
      <el-form ref="form" :model="delForm" :roule="delRules" label-width="80px">
        <el-form-item label="物流公司">
          <el-select v-model="delForm.deliType" placeholder="请选择物流公司">
            <el-option
              v-for="item in logistics.list"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="delForm.trackingNum"></el-input>
        </el-form-item>
        <el-form-item label="运费">
          <el-input v-model="delForm.freight"></el-input>
        </el-form-item>
        <el-form-item label="包裹重量">
          <el-input v-model="delForm.packWeight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logistics.dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmationDelivery" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
        title="物流状态"
        :visible.sync="delivery.dialogVisible"
        width="50%">
      <eb-table :list="delivery.recordList" :columns="delivery.columns"></eb-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delivery.dialogVisible = false" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="转账凭证"
      :visible.sync="voucherDialogVisible"
      width="50%">
      <div>
        <img class="voucher-image" :src="voucherImage" alt="">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="voucherDialogVisible = false" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="paid ? '补差额': '修改订单金额'" :visible.sync="balanceVisible" width="540px">
      <div>金额：</div>
      <el-input type="number" size="mini" v-model="adjustAmount"></el-input>
      <template v-if="paid">
        <div>说明：</div>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="adjustNote">
        </el-input>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="balanceVisible = false" size="mini" plain>取 消</el-button>
        <el-button type="primary" @click="updateAdjustAmount(adjustAmount)" size="mini" plain>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getDetail, modifyOrderStatus, getDeliveryCompany, getDeliveryInfo, updateOrderNote, updateAmount } from '@/api/order';
  import { getBankTransferDetail } from '@/api/financial';
  import { getPicUrl } from '@/utils/getPicUrl';
  import EbTable from '@/components/EbTable';
  import { byTypeGetObj, parseTime, cloneObj, formatMoney } from '@/utils';

  const logisticsTypes = { 1: '自提', 2: '物流' };

  export default {
    data() {
      return {
        orderId: this.$route.query.orderId || 0,
        detail: {},
        list: [],
        cashNoteList: [],
        payWayName: '',
        columns: [
          { slot: 'img' },
          { prop: 'providerName', label: '供应商' },
          { prop: 'productName', label: '商品名称' },
          { prop: 'productCode', label: '款号' },
          { prop: 'skuCode', label: '色号' },
          { prop: 'clothType', label: '商品类型' },
          { prop: 'num', label: '数量' },
          { prop: 'unitPrice', label: '单价(元)' },
          { prop: 'totalAmount', label: '总金额(元)' }
        ],
        priceTypes: {},
        saleUnits: {},
        totalAmount: 0,
        invoiceAmount: 0,
        payAmount: 0,
        paymentProgress: 0,
        voucherImage: '',
        voucherDialogVisible: false,
        orderHandle: {},
        orderStatus: [
          { t: 1, btnText: '确认处理', next: 5, show: true },
          { t: 5, btnText: '确认发货', next: 2, show: true }
        ],
        logistics: {
          dialogVisible: false,
          list: []
        },
        delForm: {
          deliType: '',
          trackingNum: '',
          freight: 0,
          packWeight: 0
        },
        delRules: {
          deliType: [
            { required: true, message: '请选择物流公司', trigger: 'blur' }
          ],
          trackingNum: [
            { required: true, message: '请填写物流单号', trigger: 'blur' }
          ]
        },
        delivery: {
          dialogVisible: false,
          recordList: [],
          columns: [
            { prop: 'time', label: '时间', width: 150 },
            { prop: 'content', label: '状态' }
          ]
        },
        balanceVisible: false,
        adjustAmount: 0,
        adjustNote: '',
        paid: false
      };
    },
    created() {
      this.GLOBAL.priceTypes.forEach(v => {
        this.priceTypes[v.t] = v.n;
      });
      this.GLOBAL.priceUnit.forEach(v => {
        this.saleUnits[v.t] = v.n;
      });
      this.getData();
    },
    methods: {
      getData() {
        getDetail({ orderId: this.orderId }).then(res => {
          this.detail = res;
          this.detail.statusName = byTypeGetObj(this.detail.status, this.GLOBAL.orderStatus).n;
          this.paymentProgress = this.detail.receivedAmount >= 0 && this.detail.payAmount > 0 ? (this.detail.receivedAmount / this.detail.payAmount * 100) : 0;
          this.$set(this.detail, 'logisticsTypeName', logisticsTypes[this.detail.logisticsType] || '无');
          this.detail.createTime = parseTime(this.detail.createTime);
          this.cashNoteList = this.detail.cashNoteList.map(v => {
            if (v.payType !== 8 && v.status === 1) {
              this.paid = true;
            }
            return {
              amount: formatMoney(v.amount),
              payWayName: this.GLOBAL.customizationPayWays[v.payWay] || '未支付',
              status: v.status === 1 ? '已支付' : '未支付',
              payType: v.payType,
              payTransId: v.payTransId,
              realTransId: v.realTransId,
              note: v.note
            };
          });
          this.orderHandle = byTypeGetObj(this.detail.status, this.orderStatus);
          let totalAmount = 0;
          let list = [];
          this.detail.items.forEach(item => {
            item.providerName = item.product ? item.product.providerName || '' : '';
            item.subItems.forEach(v => {
              item = cloneObj(item);
              let unit = '份';
              if (v.priceType !== 3) {
                unit = this.saleUnits[v.saleUnit] || '';
              }
              item.num = (v.number || 0) + unit;
              item.skuCode = v.skuCode || '';
              item.image = getPicUrl(v.image, 1, 6);
              item.clothType = this.priceTypes[v.priceType] || '';
              item.unitPrice = formatMoney(v.price);
              let total = v.number * v.price;
              item.totalAmount = formatMoney(total);
              totalAmount += total;
              list.push(item);
            });
          });
          this.list = list;
          this.totalAmount = formatMoney(totalAmount);
          this.payAmount = formatMoney(this.detail.payAmount);
          this.invoiceAmount = formatMoney(this.detail.invoiceAmount);
        });
      },
      handleOrder(status) {
        if (status === 2 && this.detail.logisticsType === 2) {
          if (this.logistics.list.length === 0) {
            getDeliveryCompany().then(res => {
              this.logistics.list = res;
            });
          }
          this.logistics.dialogVisible = true;
        } else if (status == 5) {
          this.$confirm('确认处理该订单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.modifyOrderStatus({ orderId: this.orderId, status: status });
          });
        }
      },
      confirmationDelivery() {
        const params = this.delForm;
        this.logistics.list.forEach(v => {
          if (params.deliType === v.type) {
            params.deliCom = v.name;
            return false;
          }
        });
        if (!params.deliType) {
          this.$message({
            type: 'waring',
            message: '请选择物流公司'
          });
          return false;
        }
        if (!params.trackingNum) {
          this.$message({
            type: 'waring',
            message: '请填写物流单号'
          });
          return false;
        }
        params.orderId = this.orderId;
        params.status = this.orderHandle.next;
        this.modifyOrderStatus(params);
      },
      modifyOrderStatus(params) {
        modifyOrderStatus(params).then(res => {
          this.$message({
            type: 'success',
            message: '处理成功'
          });
          this.getData();
          this.logistics.dialogVisible = false;
        });
      },
      checkDeliveryStatus() {
        getDeliveryInfo({ companyType: this.detail.deliType, number: this.detail.trackingNum }).then(res => {
          this.delivery.recordList = res.recordList;
          this.delivery.dialogVisible = true;
        });
      },
      checkContract() {
        this.$router.push({ path: 'orderContract', query: { cid: this.detail.contractId, oid: this.detail.orderId }});
      },
      checkPaymentVoucher(id) {
        if (this.voucherImage === '') {
          getBankTransferDetail({ id: id }).then(res => {
            this.voucherImage = res.image;
            this.voucherDialogVisible = true;
          });
        } else {
          this.voucherDialogVisible = true;
        }
      },
      updateOrderNote() {
        updateOrderNote({ orderId: this.orderId, serviceNote: this.detail.serviceNote }).then(res => {
          this.$message({
            type: 'success',
            message: '保存备注成功'
          });
        });
      },
      updateAdjustAmount(amount) {
        let msg = this.paid ? '补差额' : '加价';
        this.$confirm(`确认${msg}${amount}`, '确认').then(() => {
          updateAmount({ orderId: this.orderId, adjustAmount: amount, note: this.adjustNote }).then(res => {
            this.$message({
              type: 'success',
              message: `${msg}成功`
            });
            this.balanceVisible = false;
            this.adjustAmount = 0;
            this.getData();
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
  .order-detail{
    .voucher-image{
      width: 100%;
    }
    .order-detail-title{
      .order-detail-title-wrap{
        display: flex;
        .detail-title-item{
          flex: 1;
          line-height: 28px;
        }
      }
    }
    .order-detail-info{
      display: flex;
      .cash-note-list{
        .table:not(:first-child){
          margin-top: 20px;
        }
      }
      .info-item{
        flex: 1;
        margin: 0 5px;
        &:first-child{
          margin-left: 0;
        }
        &:last-child{
          margin-right: 0;
        }
        .table{
          tbody{
            td:first-child{
              width: 120px;
            }
          }
        }
      }
    }
    .product-total-wrap{
      padding-top: 20px;
      padding-right: 10px;
      text-align: right;
      font-size: 16px;
      .amount-list{
        .amount-list-item{
          display: inline-block;
          &:not(:last-child){
            margin-right: 20px;
          }
          .adjust-input-box{
            display: inline-block;
          }
          .adjust-btn-box{
            display: inline-block;
          }
        }
      }
    }
    .order-detail-note{
      .table{
        tbody{
          td{
            width: 50%;
            .el-button{
              float:right;
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
</style>
