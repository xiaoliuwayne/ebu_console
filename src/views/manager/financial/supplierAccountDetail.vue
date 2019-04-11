<template>
  <div class="main-content">
    <!-- 采购商结算详情 -->
    <div class="order-detail-info">
      <el-card class="info-item">
        <div slot="header" class="clearfix">
          <span>订单信息</span>
        </div>
        <table class="table table-bordered table-responsive">
          <tbody>
            <tr>
              <td>订单号</td>
              <td>{{detail.purchaseOrderId}}</td>
              <td>商品类型</td>
              <td>{{detail.customizeType}}</td>
            </tr>
            <tr>
              <td>计算类型</td>
              <td>{{detail.payStrategyName}}</td>
              <td>联系人</td>
              <td>{{detail.providerName}}
                <span v-if="detail.providerTel">
                  ({{detail.providerTel}})
                </span>
              </td>
            </tr>
            <tr>
              <td>是否开发票</td>
              <td>{{detail.invoiceType}}</td>
              <td>开票信息</td>
              <td class="invoice_input">
                <span>{{detail.invoiceTitle}}</span>
                <span>{{detail.taxNumber}}</span>
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
import { parseTime } from "@/utils/index";
import EbTable from "@/components/EbTable";
import { getSupplierSettleAccountDetail, modification } from "@/api/financial";
export default {
  data() {
    return {
      id: this.$route.query.id || undefined,
      detail: {},
      list: [],
      columns: [
        { prop: "payType", label: "结算进度" },
        { prop: "amount", label: "支付金额" },
        { prop: "status", label: "结算状态" },
        { prop: "planTime", label: "支付期限" },
        { prop: "id", label: "支付单号" },
        { prop: "payWay", label: "支付方式" },
        { prop: "realTransId", label: "流水号" }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getSupplierSettleAccountDetail({ purchaseOrderId: this.id }).then(res => {
        res.payStrategyName = this.GLOBAL.payStrategy[res.payStrategyId] || "-";
        res.customizeType =
          this.GLOBAL.customizeTypes[res.customizeType] || "-";
        res.invoiceType = res.invoiceType == 1 ? "是" : "否";
        this.detail = res;
        res.disbursementList.forEach((item, index) => {
          item.payType = this.GLOBAL.paySchedule[item.payType];
          item.planTime = parseTime(item.planTime);
          item.status = item.status == 1 ? "已支付" : "未支付";
        });
        this.list = res.disbursementList;
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
  .invoice_input {
    display: flex;
    .input_item {
      margin-right: 20px;
    }
  }
  .edit_button {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
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
