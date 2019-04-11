<template>
  <div class="main-content">
    <!-- 供应商结算详情 -->
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
              <td>结算类型</td>
              <td>{{detail.payStrategyName}}</td>
              <td>联系人</td>
              <td>{{detail.providerName}}({{detail.providerTel}})</td>
            </tr>
            <tr>
              <td>是否开发票</td>
              <td>
                <el-radio v-model="detail.invoiceType" :label="1">是</el-radio>
                <el-radio v-model="detail.invoiceType" :label="0">否</el-radio>
              </td>
              <td>开票信息</td>
              <td class="invoice_input">
                <el-input v-model="detail.invoiceTitle" :disabled="detail.invoiceType == 0" class="input_item" placeholder="抬头" size="mini"></el-input>
                <el-input v-model="detail.taxNumber" :disabled="detail.invoiceType == 0" class="input_item" placeholder="税号" size="mini"></el-input>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="edit_button">
          <el-button type="primary" @click="save" size="medium">保存</el-button>
          <el-button @click="cancel" plain size="medium">取消</el-button>
        </div>
      </el-card>
    </div>
    <!-- 支付信息表格 -->
    <el-card class="order-detail-list">
      <div slot="header" class="clearfix">
        <span>支付信息</span>
      </div>
      <eb-table :list="list" :columns="columns">
        <el-table-column slot="payWay" label="支付方式" width="150">
          <template slot-scope="{row}">
            <el-select size="mini" v-model="row.payWay">
              <el-option v-for="item in payWays" :key="item.value" :label="item.label" :value="item.value" :style="{width:'130px'}">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column slot="realTransId" label="流水号">
          <template slot-scope="{row}">
            <el-input size='mini' v-model="row.realTransId" type="text" />
          </template>
        </el-table-column>
        <el-table-column slot="payTime" label="支付日期" width="150">
          <template slot-scope="{row}">
            <el-date-picker size="mini" v-model="row.payTime" value-format="timestamp" type="datetime" placeholder="支付日期" :style="{width:'130px'}">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column slot="payerName" label="打款人">
          <template slot-scope="{ row }">
            <el-input size="mini" v-model="row.payerName" type="text"></el-input>
          </template>
        </el-table-column>
        <el-table-column slot="opt" label="操作">
          <el-button size='mini' @click="seveRow(row)" type="text" slot-scope="{ row }">保存</el-button>
        </el-table-column>
      </eb-table>
    </el-card>
  </div>
</template>
<script>
import EbTable from "@/components/EbTable";
import { parseTime } from "@/utils/index";
import {
  modification,
  payDetailModification,
  getSupplierSettleAccountDetail
} from "@/api/financial";
export default {
  data() {
    return {
      id: this.$route.query.id || undefined,
      detail: {
        invoiceType: 0,
        invoiceTitle: "",
        taxNumber: "",
        payer: ""
      },
      payWap: "",
      list: [],
      columns: [
        { prop: "payType", label: "结算进度" },
        { prop: "amount", label: "支付金额" },
        { prop: "status", label: "结算状态" },
        { prop: "planTime", label: "支付期限", width: 150 },
        { prop: "id", label: "付款单号" },
        { slot: "payWay" },
        { slot: "realTransId" },
        { slot: "payTime" },
        { slot: "payerName" },
        { slot: "opt" }
      ],
      payWays: [
        { value: 0, label: "不用支付（赠送）" },
        { value: 1, label: "微信" },
        { value: 2, label: "支付宝" },
        { value: 3, label: "余额" },
        { value: 4, label: "转账" }
      ]
    };
  },
  created() {
    this.getData();
  },
  // computed: {
  //   toggleDetail: function() {
  //     return this.detail.invoiceType;
  //   }
  // },
  // watch: {
  //   // 如果选择不开发票，则清空发票抬头和税号
  //   toggleDetail: function(val) {
  //     if (val == 0) {
  //       this.detail.invoiceTitle = "";
  //       this.detail.taxNumber = "";
  //     }
  //   }
  // },
  methods: {
    getData() {
      getSupplierSettleAccountDetail({ purchaseOrderId: this.id }).then(res => {
        res.payStrategyName = this.GLOBAL.payStrategy[res.payStrategyId] || "-";
        res.customizeType =
          this.GLOBAL.customizeTypes[res.customizeType] || "-";
        this.detail = res;
        res.disbursementList.forEach((item, index) => {
          item.payType = this.GLOBAL.paySchedule[item.payType];
          item.planTime = parseTime(item.planTime);
          // item.payTime = parseTime(item.payTime);
          item.status = item.status == 1 ? "已支付" : "未支付";
          // item.payWay = this.GLOBAL.payWays[item.payWays];
        });
        this.list = res.disbursementList;
      });
    },
    // 保存订单信息
    save() {
      let params = {
        purchaseOrderId: this.detail.purchaseOrderId,
        invoiceType: this.detail.invoiceType,
        invoiceTitle: this.detail.invoiceTitle,
        invoiceContent: "测试发票内容",
        taxNumber: this.detail.taxNumber
      };
      if (params.invoiceType) {
        if (!params.invoiceTitle) {
          this.$message({
            type: "warning",
            message: "请填写发票抬头"
          });
          return false;
        } else if (!params.taxNumber) {
          this.$message({
            type: "warning",
            message: "请填写发票税号"
          });
          return false;
        }
      } else {
        delete params.invoiceTitle;
        delete params.taxNumber;
      }
      modification(params).then(res => {
        if (res.result == 0) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
        }
      });
    },
    // 保存支付信息
    seveRow(item) {
      let { id, realTransId, payTime, payWay, payerName } = item;
      payTime = parseTime(payTime);
      let params = {
        id: id,
        transId: realTransId,
        payTime: payTime,
        payWay: payWay,
        payerName: payerName
      };
      if (!params.transId) {
        this.$message({
          type: "warning",
          message: "请输入流水号"
        });
        return false;
      } else if (!params.payTime) {
        this.$message({
          type: "warning",
          message: "请选择支付日期"
        });
        return false;
      } else if (params.payWay == -1) {
        this.$message({
          type: "warning",
          message: "请选择支付方式"
        });
        return false;
      } else if (!params.payerName) {
        this.$message({
          type: "warning",
          message: "请输入打款人"
        });
        return false;
      }
      payDetailModification(params).then(res => {
        if (res.resule == 0) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
        }
      });
    },
    // 取消
    cancel() {
      this.$router.go(-1);
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
    margin-top: 20px;
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
