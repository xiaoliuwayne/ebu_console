<template>
  <div class="purchase-detail">
    <el-card class="status-info-wrap">
      <el-steps :space="300" :active="activeStatus" finish-status="success" process-status="process">
        <el-step v-for=" item in  stepValue " :title="item.n" :key="item.t">
        </el-step>
      </el-steps>
      <div class="button-box">
        <el-button size="mini" type="primary" v-show="buttonObj.show" @click="modifyStatus(buttonObj.next)">{{buttonObj.btnText}}</el-button>
        <el-button size="mini" v-show="showCancelButton" @click="modifyStatus(5)">取消订单</el-button>
      </div>
    </el-card>
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
            <td>付款状态</td>
            <td>{{detail.statusName}}</td>
          </tr>
          <tr>
            <td>货期</td>
            <td></td>
            <td>付款类型</td>
            <td>{{detail.payWay}}</td>
          </tr>
          <tr>
            <td>数量</td>
            <td>{{detail.number}}</td>
            <td>金额(含税)</td>
            <td>{{detail.orderPrice}}</td>
          </tr>
          <tr>
            <td>备注</td>
            <td>{{detail.note}}</td>
            <td>采购合同</td>
            <td>
              <el-button type="text" size="mini" :disabled="(!isManager) && !detail.contractId" @click="turnToPurchaseContract">查看《采购合同》</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </el-card>
    <el-card class="product-info">
      <div slot="header" class="clearfix">
        <span>商品详情</span>
      </div>
      <eb-table :list="productList" :columns="productColumns"></eb-table>
    </el-card>
    <el-card class="relevance-order" v-if="isManager">
      <div slot="header" class="clearfix">
        <span>对应订单</span>
      </div>
      <eb-table :list="orderList" :columns="orderColumns"></eb-table>
    </el-card>
    <el-card class="payment-info">
      <div slot="header" class="clearfix">
        <span>付款信息</span>
      </div>
      <eb-table :list="paymentList" :columns="paymentColumns"></eb-table>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import { querypurchaseDetail, updateStatus } from "@/api/purchaseOrder";
import ProductTable from "@/components/ProductTable";
import EbTable from "@/components/EbTable";
import EbDate from "@/components/DateRange";
import { parseTime, cloneObj, byTypeGetObj } from "@/utils/index";

export default {
  data() {
    return {
      purchaseOrderId: this.$route.query.purchaseOrderId || 0,
      isManager: this.$store.getters.isManager,
      payWays: this.GLOBAL.payWays,
      detail: {},
      productList: [],
      productColumns: [
        { prop: "productName", label: "品名" },
        { prop: "productCode", label: "款号" },
        { prop: "skuCode", label: "色号" },
        { prop: "width", label: "布封" },
        { prop: "weight", label: "克重" },
        { prop: "ingredient", label: "成分" },
        { prop: "1", label: "纱织" },
        { prop: "48", label: "结构" },
        { prop: "23", label: "工艺" },
        { prop: "price", label: "供货价(含税)" }
      ],
      orderList: [],
      orderColumns: [
        { prop: "orderId", label: "订单号" },
        { prop: "number", label: "数量" },
        { prop: "userName", label: "用户名" },
        { prop: "cneeName", label: "收货人" },
        { prop: "createTime", label: "下单时间" }
      ],
      paymentList: [],
      paymentColumns: [
        { prop: "1", label: "付款阶段" },
        { prop: "2", label: "付款时间" },
        { prop: "3", label: "付款进度" }
      ],
      stepValue: [],
      purchaseStatus: this.GLOBAL.purchaseOrderStatus,
      activeStatus: 0,
      showCancelButton: false,
      orderStatus: [],
      buttonObj: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      querypurchaseDetail({ purchaseOrderId: this.purchaseOrderId }).then(
        res => {
          this.detail = res;
          if (res.purchaseStatus === 5) {
            this.stepValue = this.purchaseStatus.filter(v => {
              if (v.t === "0" || v.t === "5") {
                return v;
              }
            });
          } else {
            this.stepValue = this.purchaseStatus.filter(v => {
              return v.t !== "-1" && v.t !== "5";
            });
          }
          this.showCancelButton = res.purchaseStatus === 0;
          if (this.isManager) {
            this.orderStatus = [
              { t: 1, btnText: "确认付款", next: 2, show: true },
              { t: 3, btnText: "确认收货", next: 4, show: true }
            ];
          } else if (this.$store.getters.roles.indexOf("PROVIDER") > -1) {
            this.orderStatus = [
              { t: 0, btnText: "确认接单", next: 1, show: true },
              { t: 2, btnText: "确认发货", next: 3, show: true }
            ];
          }
          this.buttonObj = byTypeGetObj(res.purchaseStatus, this.orderStatus);
          let statusObj = byTypeGetObj(res.purchaseStatus, this.stepValue);
          this.detail.payWay = this.payWays[res.payWay];
          this.detail.statusName = statusObj.n;
          this.activeStatus = statusObj.index;

          this.detail.createTime = parseTime(this.detail.createTime);
          let product = this.detail.product;
          let ingredient = "";
          product.ingredientList.forEach(v => {
            ingredient += v.name + v.value + "%; ";
          });
          let [width, weight] = [[], []];
          if (product.width > 0) {
            width[0] = product.width;
          }
          if (product.maxWidth > 0) {
            width[1] = product.maxWidth;
          }
          if (product.weight > 0) {
            weight[0] = product.weight;
          }
          if (product.maxWeight > 0) {
            weight[1] = product.maxWeight;
          }
          let prop = product.propertieList || {};
          let obj = {
            productCode: res.productCode,
            productName: res.productName,
            skuCode: res.skuCode,
            providerName: res.providerName,
            price: res.price,
            ingredient: ingredient,
            width: width.join("-") + "cm",
            weight: weight.join("-") + "g/m²",
            "1": prop[1] ? prop[1].value.join("，") : "",
            "48": prop[48] ? prop[48].value.join("，") : "",
            "23": prop[23] ? prop[23].value.join("，") : ""
          };
          this.productList = [obj];
          if (res.relatedOrderList) {
            this.orderList = res.relatedOrderList.map(v => {
              v.createTime = parseTime(v.createTime);
              v.num =
                v.number + byTypeGetObj(v.saleUnit, this.GLOBAL.priceUnit).n;
              return v;
            });
          }
        }
      );
    },
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
    turnToPurchaseContract() {
      this.$router.push({
        name: "purchaseContract",
        query: { pid: this.purchaseOrderId, cid: this.detail.contractId }
      });
    }
  },
  components: {
    ProductTable,
    EbTable,
    EbDate
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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