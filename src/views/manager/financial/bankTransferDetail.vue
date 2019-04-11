<template>
  <div class="bank-transfer-detail">
    <el-card class="bank-transfer-title">
      <ul class="clearfix">
        <li class="bank-transfer-title-item">状态：
          <span>{{detail.statusName}}</span>
        </li>
        <li class="bank-transfer-title-item">支付时间：
          <span>{{detail.formatTime}}</span>
        </li>
        <li class="bank-transfer-title-item">手机号：
          <span>{{detail.regTel}}</span>（id：
          <span>{{detail.userId}}</span>）
          <span class="warn-text">"如付款信息有误，请联系客户"</span>
        </li>
      </ul>
    </el-card>
    <el-card class="bank-transfer-order">
      <div slot="header" class="clearfix">
        <span>关联订单</span>
      </div>
      <table class="table table-bordered table-responsive">
        <tbody>
          <tr>
            <td>订单号</td>
            <td v-for="(item,index) in orderList" :key="index">{{item.orderId}}</td>
          </tr>
          <tr>
            <td>是否开发票</td>
            <td v-for="(item,index) in orderList" :key="index">{{item.invoiceType?'是':'否'}}</td>
          </tr>
          <tr>
            <td>金额</td>
            <td v-for="(item,index) in orderList" :key="index">{{item.payAmount}}</td>
          </tr>
          <tr>
            <td>付款进度</td>
            <td v-for="(item,index) in orderList" :key="index">{{item.paymentProgress}}%</td>
          </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="bank-transfer-info">
      <div slot="header" class="clearfix">
        <span>付款单</span>
      </div>
      <table class="table table-responsive table-bordered">
        <tbody>
          <tr>
            <td>付款单号</td>
            <td>{{detail.id}}</td>
          </tr>
          <tr>
            <td>总付款金额</td>
            <td>{{detail.amount}}</td>
          </tr>
          <tr>
            <td>付款方式</td>
            <td>转账</td>
          </tr>
          <tr>
            <td>转账凭证</td>
            <td>
              <img :src="detail.image" alt="">
            </td>
          </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="bank-transfer-action" v-if="detail.statusName === '待确认'">
      <el-button type="primary" size="mini" @click="_modifyBankTransferStatus(1)">确认付款</el-button>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  getBankTransferDetail,
  modifyBankTransferStatus
} from "@/api/financial";

export default {
  name: "bank-transfer-detail",
  data() {
    return {
      id: this.$route.query.id || undefined,
      detail: {},
      orderList: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getBankTransferDetail({ id: this.id }).then(res => {
        this.detail = res;
        this.orderList = res.orderList;
      });
    },
    _modifyBankTransferStatus(status) {
      modifyBankTransferStatus({ transId: this.id, status: status }).then(
        res => {
          if (res.result == 0) {
            this.$message({
              type: "success",
              message: "确认成功"
            });
          }
          this.getData();
          // setTimeout(() => {
          //   location.reload();
          // }, 200);
        }
      );
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.bank-transfer-detail {
  .bank-transfer-title {
    .bank-transfer-title-item {
      float: left;
      padding: 0 10px;
      &:first-child {
        padding-left: 0;
      }
      &:not(:last-child) {
        border-right: 2px solid #888;
      }
      .warn-text {
        color: red;
      }
    }
  }
  .bank-transfer-action {
    text-align: right;
  }
}
</style>