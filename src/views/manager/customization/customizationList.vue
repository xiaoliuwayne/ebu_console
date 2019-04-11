<template>
  <div class="main-content">
    <!-- 定制订单列表 -->
    <el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in tagsGroup" :key="item.t"></el-tab-pane>
    </el-tabs>
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData"></search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
    </div>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="opt" label="操作" width="110">
        <el-button size="mini" type="text" slot-scope="{ row }" @click="showDetail(row)">查看订单</el-button>
      </el-table-column>
    </eb-table>
    <div class="pagination-box">
      <el-pagination @current-change="handleCurrentChange" :current-page="page+1" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getCustomizationList } from "@/api/order";
import {
  parseTime,
  cloneObj,
  setTotalSize,
  byTypeGetObj,
  formatTime
} from "@/utils/index";
import SearchInput from "@/components/SearchInputGroup";
import EbTable from "@/components/EbTable";
import DateRange from "@/components/DateRange";
import { getPicUrl } from "@/utils/getPicUrl";
export default {
  data() {
    return {
      selection: [],
      page: 0,
      pageSize: 15,
      totalSize: 0,
      tagsGroup: this.GLOBAL.customizationStatus,
      orderId: this.$route.query.orderId || 0,
      status: this.GLOBAL.customizationStatus[0].t,
      productType: this.$route.query.C2 || 6,
      searchType: false,
      searchKey: {},
      inputGroup: [
        [
          { value: "", name: "orderId", holder: "定制订单号" },
          { value: "", name: "regTel", holder: "注册手机号" },
          {
            value: ["", ""],
            name: "createTime",
            type: "dateRange",
            title: "下单时间:"
          }
        ],
        [
          { value: "", name: "cneePhone", holder: "联系电话" },
          { value: "", name: "cneeName", holder: "收货人" },
          {
            value: "",
            name: "customizeTypes",
            type: "select",
            options: [
              { label: "全部", value: "1,2" },
              // { label: "现货", value: "0" },
              { label: "新品定制", value: "1" },
              { label: "需求定制", value: "2" }
            ],
            title: "定制类型:",
            width: 100
          }
        ]
      ],
      list: [],
      columns: [
        { prop: "orderId", label: "定制订单号" },
        { prop: "regTel", label: "注册手机号", width: 110 },
        { prop: "customizeTypeName", label: "定制类型" },
        { prop: "payStrategyName", label: "付款类型" },
        { prop: "customStatus", label: "定制状态" },
        { prop: "cneeName", label: "收货人" },
        { prop: "cneePhone", label: "联系电话", width: 110 },
        { prop: "payAmount", label: "支付金额" },
        { prop: "invoiceType", label: "是否开票" },
        { prop: "createTime", label: "下单时间", width: 150 },
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
    this.queryAction({ status: this.tagsGroup[0].t });
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
      query.customizeTypes = query.customizeTypes || "1,2";
      query.status = query.status || this.status;
      query.page = parseInt(query.page) || 0;
      query.pageSize = parseInt(query.pageSize) || this.pageSize;
      query.getItems = 1;
      query.getProduct = 0;
      query.productType = 6;
      this.page = query.page;
      this.$router.push({ query: query });
      this.getData(query);
    },
    getData(params) {
      getCustomizationList(params).then(res => {
        res.list.forEach(item => {
          item.customizeTypeName = this.GLOBAL.customizeTypes[
            item.customizeType
          ];
          item.invoiceType = item.invoiceType == 1 ? "是" : "否";
          item.createTime = parseTime(item.createTime);
          item.payStrategyName = this.GLOBAL.payStrategy[item.payStrategyId];
          item.customStatus = byTypeGetObj(
            item.status,
            this.GLOBAL.customizationStatus
          ).n;
        });
        this.list = res.list;
        this.totalSize = setTotalSize(
          res.totalSize,
          params.page,
          "customizationList"
        );
      });
    },
    handleCurrentChange(val) {
      if (this.page === val - 1) return;
      this.queryAction({ page: val - 1 });
    },
    // 搜索
    handleSearch() {
      let queryKey = this.$refs.queryData.queryData;
      if (queryKey.createTime) {
        queryKey.startTime = queryKey.createTime[0] || "";
        queryKey.endTime = queryKey.createTime[1] || "";
      }
      delete queryKey.createTime;
      this.searchKey = queryKey;
      this.queryAction({ page: 0 });
    },
    // 点击切换
    handleClick(tab, event) {
      this.queryAction({ status: tab.$attrs.type, page: 0 });
    },
    // 跳转详情页
    showDetail(item) {
      let id = item.orderId;
      //  1 新品定制 customizationDetail
      //  2 需求定制 demandCustomizationDetail
      this.$router.push({
        path:
          item.customizeType == 1
            ? "customizationDetail"
            : item.customizeType == 2 ? "demandCustomizationDetail" : "",
        query: { orderId: id }
      });
      // if (item.customizeType == 1) {
      //   this.$router.push({
      //     path: "customizationDetail",
      //     query: { orderId: id }
      //   });
      // } else if (item.customizeType == 2) {
      //   this.$router.push({
      //     path: "demandCustomizationDetail",
      //     query: { orderId: id }
      //   });
      // }
    }
  },
  components: {
    EbTable,
    DateRange,
    SearchInput
  }
};
</script>
<style lang='scss' scoped>
.searchBtn {
  height: 80px;
  line-height: 80px;
  float: right;
  margin-right: 10px;
}
</style>
