<template>
  <div class="main-content">
    <!-- 管理员后台的供应商结算 -->
    <el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in tabStatus" :key="item.t"></el-tab-pane>
    </el-tabs>
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData"></search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
    </div>
    <eb-table :list='list' :columns='columns'>
      <el-table-column slot="opt" label="操作">
        <el-button size='mini' type="text" slot-scope="{ row }" @click="showDetail(row.purchaseOrderId)">详情</el-button>
      </el-table-column>
    </eb-table>
    <div class="pagination-box">
      <el-pagination @current-change="handleCurrentChange" :current-page="page+1" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getSupplierSettleAccountList } from "@/api/financial";
import { cloneObj } from "@/utils/index";
import { setTotalSize,parseTime  } from "@/utils/index";
import EbTable from "@/components/EbTable";
import SearchInput from "@/components/SearchInputGroup";
export default {
  data() {
    return {
      list: [],
      page: 0,
      pageSize: 10,
      totalSize: 0,
      tabStatus: this.GLOBAL.paymentStatus,
      status: this.GLOBAL.paymentStatus[0].t,
      inputGroup: [
        [
          { value: "", name: "id", holder: "付款单号" },
          { value: "", name: "purchaseOrderId", holder: "采购单号" },
          {
            value: ["", ""],
            name: "createTime",
            type: "dateRange",
            title: "支付期限:"
          }
        ],
        [
          {
            value: "",
            name: "customizeType",
            type: "select",
            options: [
              { label: "全部", value: "-1" },
              { label: "现货", value: "0" },
              { label: "新品定制", value: "1" },
              { label: "需求定制", value: "2" }
            ],
            title: "商品类型:",
            width: 100
          },
          {
            value: "",
            name: "payStrategyId",
            type: "select",
            options: [
              { label: "全部", value: "-1" },
              { label: "月结", value: "1" },
              { label: "现金", value: "2" },
              { label: "3-6-1", value: "3" },
              { label: "3-7", value: "4" }
            ],
            title: "结算类型:",
            width: 90
          }
          // { value: "", name: "", holder: "结算状态" }
        ]
      ],
      columns: [
        { prop: "id", label: "付款单号" },
        { prop: "purchaseOrderId", label: "采购单号" },
        { prop: "planTime", label: "支付期限", width:150},
        { prop: "customizeType", label: "商品类型" },
        { prop: "payStrategyName", label: "结算类型" },
        { prop: "payType", label: "结算进度" },
        { prop: "amount", label: "支付金额" },
        { prop: "statusName", label: "结算状态" },
        { prop: "providerName", label: "联系人" },
        { prop: "providerTel", label: "联系电话", width: 110 },
        { prop: "invoiceType", label: "是否开票", width: 70 },
        { slot: "opt" }
      ]
    };
  },
  created() {
    let query = cloneObj(this.$route.query);
    let inputs = this.inputGroup; // 根据路由参数回填搜索框
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < inputs[i].length; j++) {
        if (query[inputs[i][j].name] != null) {
          inputs[i][j].value = query[inputs[i][j].name];
        }
      }
    }
    this.queryAction({ status: this.tabStatus[0].t });
  },
  methods: {
    queryAction(params) {
      let query = cloneObj(this.$route.query);
      let search = this.searchKey;
      for (let key in search) {
        //把上次搜索的内容加入参数
        if (search[key].length != 0) {
          query[key] = search[key];
        } else {
          delete query[key];
        }
      }
      params = params || {};
      for (let key in params) {
        //获得本次操作定义的参数信息
        query[key] = params[key];
      }
      query.page = parseInt(query.page) || 0;
      query.pageSize = parseInt(query.pageSize) || this.pageSize;
      this.page = query.page;
      this.$router.push({ query: query });
      this.getData(query);
    },
    getData(params) {
      getSupplierSettleAccountList(params).then(res => {
        res.list.forEach(item => {
          item.planTime = parseTime(item.planTime);
          item.payStrategyName =
            this.GLOBAL.payStrategy[item.payStrategyId] || "-";
          item.invoiceType = item.invoiceType ? "是" : "否";
          item.customizeType = this.GLOBAL.customizeTypes[item.customizeType] || '-';
          item.statusName = this.GLOBAL.settleAccountStatus[item.status];
          item.payType = this.GLOBAL.paySchedule[item.payType];
        });
        this.list = res.list;
        this.totalSize = setTotalSize(res.totalSize, params.page);
      });
    },
    // 点击搜索
    handleSearch() {
      let queryKey = this.$refs.queryData.queryData;
      if (queryKey.createTime) {
        queryKey.planTimeStart = queryKey.createTime[0] || "";
        queryKey.planTimeEnd = queryKey.createTime[1] || "";
      }
      delete queryKey.createTime;
      this.searchKey = queryKey;
      this.queryAction({ page: 0 });
    },
    // 切换标题
    handleClick(tab, event) {
      this.queryAction({ status: tab.$attrs.type, page: 0 });
    },
    // 跳转详情
    showDetail(id) {
      this.$router.push({
        path: "supplierSettleAccountDetail",
        query: { id: id }
      });
    },
    // 切换页
    handleCurrentChange(val) {
      if (this.page === val - 1) return;
      this.queryAction({ page: val - 1 });
    }
  },
  components: {
    EbTable,
    SearchInput
  }
};
</script>
<style lang="scss" scoped>
.main-content {
  .searchBtn {
    height: 80px;
    width: 100px;
    line-height: 80px;
    float: right;
    margin-right: 40px;
  }
}
</style>
