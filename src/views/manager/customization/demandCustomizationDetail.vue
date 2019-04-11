<template>
  <div class="main-content">
    <!-- 头部标题 -->
    <el-card class="order-detail-title">
      <ul class="order-detail-title-wrap">
        <li class="detail-title-item">定制状态：{{detail.statusName}}</li>
        <li class="detail-title-item">定制订单号：{{detail.orderId}}</li>
        <li class="detail-title-item">下单时间：{{detail.createTime}}</li>
        <li class="detail-title-item">
          <span>手机号：{{detail.cneePhone}}(ID: {{detail.userId}})</span>
          <el-button type="primary" size="mini" @click="checkContract()">查看合同</el-button>
        </li>
        <li class="detail-title-item button-box" v-if="orderHandle.show">
          <el-button type="primary" size='mini' v-if="orderHandle.t == 2" @click="showConfirmationDelivery">填写物流信息</el-button>
          <el-button type="primary" size="mini" @click="handleOrder(orderHandle.next)">{{orderHandle.btnText}}</el-button>
        </li>
      </ul>
    </el-card>
    <!-- 一行三列表格 -->
    <div class="order-detail-info">
      <el-card class="info-item">
        <div slot="header" class="clearfix">
          <span>付款信息</span>
        </div>
        <table class="table table-bordered table-responsive">
        <tbody>
          <tr>
              <td>付款类型</td>
              <td>
                <el-select v-model="selectActive" placeholder="请选择" @change='changePayStrategy' v-if="orderHandle.t == 6">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span v-if="orderHandle.t != 6">{{payStrategyName || '——'}}</span>
              </td>
            </tr>
        </tbody>
        </table>
        <div v-for="(item,index) in payWayList" :key="index"> 
        <table class="table table-bordered table-responsive">
          <tbody>
            <tr>
              <td>金额</td>
              <td> {{item.amount}} {{item.payType}}</td>
            </tr>
            <tr>
              <td>付款方式</td>
              <td>{{item.payWayName}}</td>
            </tr>
            <tr>
              <td>交易流水号</td>
              <td>{{item.realTransId||'无'}}</td>
            </tr>
            <tr v-if="cashNote.payWay===4 && cashNote.payTransId > 0">
              <td>转账凭证</td>
              <td>
                <el-button type="primary" size="mini" @click="checkPaymentVoucher(cashNote.payTransId)" plain>查看图片</el-button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
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
    <!-- 新品定制商品 -->
    <el-card class="order-detail-list">
      <div slot="header" class="clearfix">
        <span>客户需求定制商品</span>
      </div>
      <eb-table :list="list" :columns="columns">
        <el-table-column slot="img" label="商品图片" align="left" width="500">
          <template class="image-list" slot-scope="{ row }">
            <img class="image-item" :src="item.image" v-for="(item,index) in row.imageList" :key="index" :style="{marginLeft:15+'px'}">
          </template>
        </el-table-column>
      </eb-table>
      <!-- <div class="product-total-wrap">
                <ul class="amount-list">
                  <li class="amount-list-item">合计金额：<span>&yen; {{totalAmount}}</span></li>
                  <li class="amount-list-item">税费：<span>&yen; {{invoiceAmount}}</span></li>
                  <li class="amount-list-item">实付金额：<span>&yen; {{payAmount}}</span></li>
                  <li class="amount-list-item" v-if="detail.status==0">
                      加价：
                      <div class="adjust-input-box">
                          <el-input type="number" v-model="adjustAmount" size="mini"></el-input>
                      </div>
                      <div class="adjust-btn-box">
                          <el-button type="primary" size="mini" @click="updateAdjustAmount" :disabled="adjustAmount == 0 || adjustAmount==''">提交修改</el-button>
                      </div>
                  </li>
                </ul>
            </div> -->
    </el-card>
    <!-- 订单备注 -->
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
              <el-input type="textarea" disabled :rows="3" v-model="detail.note">
              </el-input>
            </td>
            <td>
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="detail.serviceNote">
              </el-input>
              <el-button type="button" size="mini" @click="updateOrderNote">保存备注</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </el-card>
    <!-- 弹框 -->
    <el-dialog title="填写物流信息" :visible.sync="logistics.dialogVisible" width="30%">
      <el-form ref="form" :model="delForm" :roule="delRules" label-width="80px">
        <el-form-item label="物流公司">
          <el-select v-model="delForm.deliType" placeholder="请选择物流公司">
            <el-option v-for="item in logistics.list" :key="item.type" :label="item.name" :value="item.type">
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
    <el-dialog title="物流状态" :visible.sync="delivery.dialogVisible" width="50%">
      <eb-table :list="delivery.recordList" :columns="delivery.columns"></eb-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delivery.dialogVisible = false" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="转账凭证" :visible.sync="voucherDialogVisible" width="50%">
      <div>
        <img class="voucher-image" :src="voucherImage" alt="" :style="{width:'100%'}">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="voucherDialogVisible = false" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDetail,
  modifyOrderStatus, // 修改订单状态
  getDeliveryCompany,
  getDeliveryInfo,
  updateOrderNote,
  updateAmount,
  getdemandCustomizationDetail,
  setOrderLogistInfo,
  changeOrderPayStrategy
} from "@/api/order";
import { getBankTransferDetail } from "@/api/financial";
import { getPicUrl } from "@/utils/getPicUrl";
import EbTable from "@/components/EbTable";
import { byTypeGetObj, parseTime, cloneObj, formatMoney } from "@/utils";
const logisticsTypes = { 1: "自提", 2: "物流" };
export default {
  data() {
    return {
      selectActive: "",
      options: [
        { label: "月结", value: "1" },
        { label: "现金", value: "2" },
        { label: "3-6-1", value: "3" },
        { label: "3-7", value: "4" }
      ],
      detail: {},
      payWayName: "",
      orderHandle: {},
      cashNote: {},
      paymentProgress: 0,
      list: [],
      payStrategyName: "",
      payType: "",
      columns: [
        { slot: "img" },
        { prop: "num", label: "订货量" },
        { prop: "leadTime", label: "货期" },
        { prop: "totalAmount", label: "价格(元)" }
      ],
      totalAmount: 0,
      invoiceAmount: 0,
      payAmount: 0,
      adjustAmount: 0,
      logistics: {
        dialogVisible: false,
        list: []
      },
      orderStatus: [
        { t: 6, btnText: "确认处理", next: 0, show: true },
        { t: 1, btnText: "确认生产", next: 2, show: true },
        { t: 2, btnText: "确认完成", next: 3, show: true }
      ],
      delForm: {
        deliType: "",
        trackingNum: "",
        freight: 0,
        packWeight: 0
      },
      delRules: {
        deliType: [
          { required: true, message: "请选择物流公司", trigger: "blur" }
        ],
        trackingNum: [
          { required: true, message: "请填写物流单号", trigger: "blur" }
        ]
      },
      delivery: {
        dialogVisible: false,
        recordList: [],
        columns: [
          { prop: "time", label: "时间", width: 150 },
          { prop: "content", label: "状态" }
        ]
      },
      voucherDialogVisible: false,
      voucherImage: "",
      priceTypes: {},
      saleUnits: {},
      orderId: this.$route.query.orderId || 0,
      payWayList: []
    };
  },
  created() {
    this.GLOBAL.priceTypes.forEach(v => {
      this.priceTypes[v.t] = v.n; // 大货,米样,色卡
    });
    this.GLOBAL.priceUnit.forEach(v => {
      this.saleUnits[v.t] = v.n; // 米,公斤,码,包,条
    });
    this.getData();
  },
  methods: {
    getData() {
      getdemandCustomizationDetail({ orderId: this.orderId }).then(res => {
        this.detail = res; // 将返回数据赋值给this.detail
        res.cashNoteList.forEach(item => {
          item.payWayName =
            this.GLOBAL.customizationPayWays[item.payWay] || "-";
          item.payType = this.GLOBAL.paySchedule[item.payType];
        });
        this.payWayList = res.cashNoteList;
        // 物流信息
        (this.delForm = {
          deliType: res.deliType || "",
          trackingNum: res.trackingNum || "",
          freight: res.freight || 0,
          packWeight: res.packWeight || 0
        }),
          (this.detail.statusName = byTypeGetObj(
            // 处理statusName 订单状态
            this.detail.status,
            this.GLOBAL.customizationStatus
          ).n);
        // 处理付款进度
        this.paymentProgress =
          this.detail.receivedAmount >= 0 && this.detail.payAmount > 0
            ? this.detail.receivedAmount / this.detail.payAmount * 100
            : 0;
        this.$set(
          // 设置this.detail的logisticsTypeName 收货方式
          this.detail,
          "logisticsTypeName",
          logisticsTypes[this.detail.logisticsType] || "无"
        );
        this.detail.createTime = parseTime(this.detail.createTime); // 下单时间
        this.cashNote = this.detail.cashNoteList[0] || {}; // 价钱对象 合计金额,税费,实付金额 等……
        this.payWayName =
          this.GLOBAL.customizationPayWays[this.cashNote.payWay] || "-"; // 支付方式
        this.orderHandle = byTypeGetObj(this.detail.status, this.orderStatus); // 校验显示按钮 '确认处理' '确认发货'
        let totalAmount = 0;
        this.payStrategyName = this.GLOBAL.payStrategy[
          this.detail.payStrategyId
        ];
        let list = [];
        // 处理this.detail.items对象
        this.detail.items.forEach(item => {
          item.product.imgList.forEach(img => {
            img.image = getPicUrl(img.image, 1, 6);
          });
          item.leadTime = parseTime(res.leadTime);
          item.imageList = item.product.imgList; // 客户需求定制图片
          item.providerName = item.product // items对象下面的providerName 商品名称
            ? item.product.providerName || ""
            : "";
          // 处理tiems对象下面的subTiems数组
          item.subItems.forEach(v => {
            item = cloneObj(item); // 复制一个item对象
            let unit = "份";
            if (v.priceType !== 3) {
              // 处理单位 米,公斤,码,包,条
              unit = this.saleUnits[v.saleUnit] || "";
            }
            item.num = (v.number || 0) + unit; // 数量
            item.skuCode = v.skuCode || ""; // 库存
            item.image = getPicUrl(v.image, 1, 6); // 处理图片地址
            item.clothType = this.priceTypes[v.priceType] || ""; // 处理单位 大货,米样,色卡
            item.unitPrice = formatMoney(v.price); // 处理价格
            let total = v.number * v.price; // 处理总价
            item.totalAmount = formatMoney(total); // 总价
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
    // 更改付款类型
    changePayStrategy() {
      let obj = {
        payStrategyId: this.selectActive,
        orderId: this.detail.orderId
      };
      changeOrderPayStrategy(obj).then(res => {
        if (res.result == 0) {
          //          this.$message({
          //            type: "success",
          //            message: "修改成功"
          //          });
        }
      });
    },
    // 确认处理
    handleOrder(status) {
      this.modifyOrderStatus({ orderId: this.orderId, status: status });
    },
    // 显示物流框 获取物流公司
    showConfirmationDelivery() {
      getDeliveryCompany().then(res => {
        this.logistics.list = res;
      });
      this.logistics.dialogVisible = true;
    },
    // 提交物流信息
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
          type: "waring",
          message: "请选择物流公司"
        });
        return false;
      }
      if (!params.trackingNum) {
        this.$message({
          type: "waring",
          message: "请填写物流单号"
        });
        return false;
      }
      params.orderId = this.orderId;
      setOrderLogistInfo(params).then(res => {
        if (res.result == 0) {
          this.logistics.dialogVisible = false;
          this.$message({
            type: "success",
            message: "保存成功"
          });
        }
        this.getData();
      });
    },
    // 修改订单状态
    modifyOrderStatus(params) {
      modifyOrderStatus(params).then(res => {
        this.getData();
      });
    },
    // 查看物流状态
    checkDeliveryStatus() {
      getDeliveryInfo({
        companyType: this.detail.deliType,
        number: this.detail.trackingNum
      }).then(res => {
        this.delivery.recordList = res.recordList;
        this.delivery.dialogVisible = true;
      });
    },
    // 查看合同
    checkContract() {
      this.$router.push({
        path: "orderContract",
        query: { cid: this.detail.contractId, oid: this.detail.orderId }
      });
    },
    // 查看图片
    checkPaymentVoucher(id) {
      if (this.voucherImage === "") {
        getBankTransferDetail({ id: id }).then(res => {
          this.voucherImage = res.image;
          this.voucherDialogVisible = true;
        });
      } else {
        this.voucherDialogVisible = true;
      }
    },
    // 保存备注
    updateOrderNote() {
      updateOrderNote({
        orderId: this.orderId,
        serviceNote: this.detail.serviceNote
      }).then(res => {
        this.$message({
          type: "success",
          message: "保存备注成功"
        });
      });
    },
    // 提交修改
    updateAdjustAmount() {
      this.$confirm(`确认加价${this.adjustAmount}`, "确认修改").then(() => {
        updateAmount({
          orderId: this.orderId,
          adjustAmount: this.adjustAmount
        }).then(res => {
          this.$message({
            type: "success",
            message: "付款金额修改成功"
          });
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
<style lang='scss'>
.main-content {
  .image-list {
    .image-item {
      display: inline-block;
      vertical-align: top;
      width: 100px;
      height: 100px;
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
  .order-detail-title {
    .order-detail-title-wrap {
      display: flex;
      .detail-title-item {
        flex: 1;
        line-height: 28px;
      }
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
  .product-total-wrap {
    padding-top: 20px;
    padding-right: 10px;
    text-align: right;
    font-size: 16px;
    .amount-list {
      .amount-list-item {
        display: inline-block;
        &:not(:last-child) {
          margin-right: 20px;
        }
        .adjust-input-box {
          display: inline-block;
        }
        .adjust-btn-box {
          display: inline-block;
        }
      }
    }
  }
  .order-detail-note {
    .table {
      tbody {
        td {
          width: 50%;
          .el-button {
            float: right;
            margin-top: 5px;
          }
        }
      }
    }
  }
  .el-select .el-input__inner {
    height: 30px;
  }
}
</style>
