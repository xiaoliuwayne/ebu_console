<template>
  <div class="main-content">
    <!-- 管理员采购商结算详情 -->
    <div class="order-detail-info">
      <el-card class="info-item">
        <div slot="header" class="clearfix">
          <span>订单信息</span>
        </div>
        <table class="table table-bordered table-responsive">
          <tbody>
            <tr>
              <td>订单号</td>
              <td>{{detail.orderId}}</td>
              <td>商品类型</td>
              <td>{{detail.customizeType}}</td>
            </tr>
            <tr>
              <td>结算类型</td>
              <td>{{detail.payStrategyName}}</td>
              <td>是否开票</td>
              <td>{{detail.invoiceType}}</td>
            </tr>
            <tr>
              <td>注册手机号</td>
              <td>{{detail.regTel}}</td>
              <td>联系人</td>
              <td>{{detail.cneeName}}
                <span v-if="detail.cneePhone">({{detail.cneePhone}})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </el-card>
    </div>
    <!-- 支付信息表格 -->
    <el-card class="order-detail-list">
      <div slot="header" class="clearfix">
        <span>支付信息</span>
      </div>
      <eb-table :list="list" :columns="columns">

      </eb-table>
    </el-card>
  </div>
</template>
<script>
import EbTable from "@/components/EbTable";
import { getSettleAccountDetail } from "@/api/financial";
import { getDetail } from "@/api/order";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
      id: this.$route.query.id || undefined,
      orderId: "",
      detail: {},
      list: [],
      columns: [
        { prop: "payType", label: "结算进度" },
        { prop: "amount", label: "支付金额" },
        { prop: "statusName", label: "结算状态" },
        { prop: "planTime", label: "支付期限" },
        { prop: "orderId", label: "支付单号" },
        { prop: "payWay", label: "支付方式" },
        { prop: "payTransId", label: "流水号" }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getSettleAccountDetail({ id: this.id }).then(res => {
        this.orderId = res.orderId;
        getDetail({ orderId: res.orderId }).then(res => {
          res.payStrategyName =
            this.GLOBAL.payStrategy[res.payStrategyId] || "-";
          res.customizeType =
            this.GLOBAL.customizeTypes[res.customizeType] || "-"; // 商品类型
          res.invoiceType = res.invoiceType == 1 ? "是" : "否";
          res.cashNoteList.forEach(item => {
            item.payType = this.GLOBAL.paySchedule[item.payType] || "-";
            item.planTime = parseTime(item.planTime);
            item.payWay = this.GLOBAL.payWays[item.payWay];
            item.statusName = this.GLOBAL.settleAccountStatus[item.status];
          });
          this.detail = res;
          this.list = res.cashNoteList;
        });
      });
    }
  },
  components: {
    EbTable
  }
};
</script>
<style lang='scss' scoped>
.main-content {
}
.order-detail-info {
  display: flex;
  .info-item {
    flex: 1;
    margin: 0 5px;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    .table {
      tbody {
        td:first-child {
          width: 120px;
        }
      }
    }
  }
}
</style>
