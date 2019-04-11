<template>
  <div class="purchase-detail">
    <!-- 需求定制详情 -->
    <!-- 步骤条 -->
    <el-card class="status-info-wrap">
      <el-steps align-center :space="300" :active="activeStatus" finish-status="success" process-status="process">
        <el-step v-for=" item in  stepValue " :title="item.n" :key="item.t">
        </el-step>
      </el-steps>
      <div class="button-box">
        <el-button size="mini" type="primary" v-show="buttonObj.show" @click="modifyStatus(buttonObj.next)">{{buttonObj.btnText}}</el-button>
        <el-button size="mini" v-show="showCancelButton" @click="modifyStatus(5)">取消订单</el-button>
      </div>
    </el-card>
    <!-- 采购详情 -->
    <el-card class="purchase-info">
      <div slot="header" class="clearfix">
        <span>采购详情</span>
      </div>
      <table class="table table-responsive table-bordered">
        <tbody>
          <tr v-if="isManager">
            <td>供应商名称</td>
            <td>{{detail.providerName}}</td>
            <td>供应商电话</td>
            <td>{{detail.providerTel}}</td>
          </tr>
          <tr>
            <td>采购单号</td>
            <td>{{detail.purchaseOrderId}}</td>
            <td>创建时间</td>
            <td>{{detail.createTime}}</td>
          </tr>
          <tr>
            <td>采购单状态</td>
            <td>{{detail.statusName}}</td>
            <td>付款类型</td>
            <td>{{detail.payStrategyName}}</td>
          </tr>
          <tr>
            <td>货期</td>
            <td>{{detail.leadTime}}</td>
            <td>金额(含税)</td>
            <td>{{detail.orderPrice}}</td>
          </tr>
          <tr>
            <td>数量</td>
            <td>{{detail.number}}</td>
            <td>客户订单备注</td>
            <td>{{detail.note}}</td>
          </tr>
          <!-- <tr>
            <td>采购合同</td>
            <td>
              <el-button type="text" size="mini" :disabled="(!isManager) && detail.contractId" @click="turnToPurchaseContract">查看《采购合同》</el-button>
            </td>
          </tr> -->
        </tbody>
      </table>
    </el-card>
    <!-- 商品信息表格 -->
    <el-card class="product-info">
      <div slot="header" class="clearfix">
        <span>商品详情</span>
      </div>
      <eb-table :list="productList" :columns="productColumns"></eb-table>
    </el-card>
    <!-- 对应订单 -->
    <el-card class="product-info">
      <div slot="header" class="clearfix">
        <span>对应订单</span>
      </div>
      <eb-table :list="orderList" :columns="orderColumns"></eb-table>
    </el-card>
  </div>
</template>
<script>
import { getCustomizationPurchase, updateStatus } from "@/api/purchaseOrder";
import ProductTable from "@/components/ProductTable";
import EbTable from "@/components/EbTable";
import { parseTime, cloneObj, byTypeGetObj } from "@/utils/index";
export default {
  data() {
    return {
      purchaseOrderId: this.$route.query.purchaseOrderId || 0,
      isManager: this.$store.getters.isManager,
      activeStatus: 0,
      detail: {},
      buttonObj: {},
      stepValue: [],
      showCancelButton: false,
      purchaseStatus: this.GLOBAL.customizationOrderStatus, // 步骤条
      productList: [],
      productColumns: [
        { prop: "aliasName", label: "品名" },
        { prop: "productCode", label: "款号" },
        { prop: "customizePrice", label: "定制价" }
      ],
      orderList: [],
      orderColumns: [
        { prop: "orderId", label: "订单号" },
        { prop: "number", label: "数量" },
        { prop: "userName", label: "用户名" },
        { prop: "cneeName", label: "收货人" },
        { prop: "createTime", label: "下单时间" }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getCustomizationPurchase({ purchaseOrderId: this.purchaseOrderId }).then(
        res => {
          res.leadTime = parseTime(res.leadTime);
          this.detail = res;
          this.productName = res.product.aliasName;
          this.detail.payStrategyName =
            this.GLOBAL.payStrategy[res.payStrategyId] || "-";
          this.productList = [res.product];

          // 处理步骤条
          if (res.purchaseStatus === 5) {
            // 如果取消了 就只显示 待确认 已取消
            this.stepValue = this.purchaseStatus.filter(v => {
              if (v.t === "0" || v.t === "5") {
                return v;
              }
            });
          } else {
            // 否则显示 待确认 待付款 生产中 确认中 已完成
            this.stepValue = this.purchaseStatus.filter(v => {
              return v.t !== "5";
            });
          }
          this.showCancelButton = res.purchaseStatus === 0;
          if (this.isManager) {
            this.orderStatus = [
              { t: 1, btnText: "确认付款", next: 2, show: true },
              { t: 3, btnText: "确认完成", next: 4, show: true }
            ];
          } else if (this.$store.getters.roles.indexOf("PROVIDER") > -1) {
            this.orderStatus = [
              { t: 0, btnText: "确认接单", next: 1, show: true },
              { t: 2, btnText: "生产完成", next: 3, show: true }
            ];
          }
          this.buttonObj = byTypeGetObj(res.purchaseStatus, this.orderStatus);
          let statusObj = byTypeGetObj(res.purchaseStatus, this.stepValue);
          this.detail.statusName = statusObj.n;
          this.activeStatus =
            statusObj.index == 4 ? ++statusObj.index : statusObj.index;
          this.detail.createTime = parseTime(this.detail.createTime) || "-";
          this.orderList = res.relatedOrderList.map(v => {
            v.createTime = parseTime(v.createTime) || "-";
            v.num =
              v.number + byTypeGetObj(v.saleUnit, this.GLOBAL.priceUnit).n; // 单位
            return v;
          });
        }
      );
    },
    // 修改订单状态
    modifyStatus(status) {
      updateStatus({
        purchaseOrderId: this.purchaseOrderId,
        status: status
      }).then(res => {
        this.$message({
          type: "success",
          message: "处理成功"
        });
        this.getData();
      });
    },
    // 查看合同
    turnToPurchaseContract() {
      this.$router.push({
        name: "purchaseContract",
        query: { pid: this.purchaseOrderId, cid: this.detail.contractId }
      });
    }
  },
  components: {
    EbTable
  }
};
</script>
<style lang='scss' scpoed>
.purchase-detail {
  .button-box {
    text-align: center;
    margin-top: 20px;
  }
  .purchase-info {
    .table {
      tbody {
        td:nth-child(2n-1) {
          width: 15%;
        }
        td:nth-child(2n) {
          width: 35%;
        }
      }
    }
  }
}
</style>
