<template>
  <div class="main-content">
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
      <el-table-column slot="img" label="产品图片" width="130">
        <template slot-scope="{ row }">
          <img :src="row.image" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column slot="opt" label="操作">
        <el-button size="mini" type="text" slot-scope="{ row }" @click="showDetail(row.purchaseOrderId)">查看</el-button>
      </el-table-column>
    </eb-table>
    <div class="pagination-box">
      <el-pagination @current-change="handleCurrentChange" :current-page="page+1" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { customOrderList } from "@/api/purchaseOrder";
import { parseTime, cloneObj, byTypeGetObj } from "@/utils/index";
import { setTotalSize } from "@/utils/index";
import EbTable from "@/components/EbTable";
import SearchInput from "@/components/SearchInputGroup";
export default {
  data() {
    return {
      list: [],
      page: 0,
      isManager: this.$store.getters.isManager,
      pageSize: 10,
      totalSize: 0,
      status: this.GLOBAL.customizationConfirmType[0].t,
      tabStatus: this.GLOBAL.customizationConfirmType,
      inputGroup: [
        { value: "", name: "orderId", holder: "定制订单号" },
        // {
        //   value: "",
        //   name: "status",
        //   type: "select",
        //   options: [
        //     { label: "全部", value: "-1" },
        //     { label: "待确认", value: "0" },
        //     {label:  "已确认", value: '1' },
        //     { label: "已取消", value: "4" }
        //   ],
        //   title: "定制状态:",
        //   width: 80
        // },
        {
          value: ["", ""],
          name: "createTime",
          type: "dateRange",
          title: "下单时间:"
        }
      ],
      columns: [
        { slot: "img" },
        { prop: "purchaseOrderId", label: "定制采购订单号" },
        { prop: "providerName", label: "供应商" },
        { prop: "productName", label: "品名" },
        { prop: "productCode", label: "款号" },
        { prop: "payTypeName", label: "付款类型" },
        { prop: "purchaseStatusName", label: "定制状态" },
        { prop: "createTime", label: "下单时间", width: 150 },
        { prop: "leadTime", label: "货期", width: 150 },
        { slot: "opt" }
      ]
    };
  },
  created() {
    if (this.isManager) {
      let isHas = false;
      this.tabStatus.forEach(v => {
        if (v.s === "CANCELED") {
          isHas = true;
        }
      });
      if (!isHas) {
        this.tabStatus.push({ t: "5", n: "已取消", s: "CANCELED" });
      }
    }
    let query = cloneObj(this.$route.query);
    let inputs = this.inputGroup; // 根据路由参数回填搜索框
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < inputs[i].length; j++) {
        if (query[inputs[i][j].name] != null) {
          inputs[i][j].value = query[inputs[i][j].name];
        }
      }
    }
    this.queryAction({ purchaseStatus: this.tabStatus[0].t });
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
      query.customizeType = 1; // 定制类型
      this.page = query.page;
      this.$router.push({ query: query });
      this.getData(query);
    },
    getData(params) {
      customOrderList(params).then(res => {
        res.list.forEach(item => {
          item.createTime = parseTime(item.createTime) || "-";
          item.leadTime = parseTime(item.leadTime) || "-";
          item.purchaseStatusName =
            byTypeGetObj(
              item.purchaseStatus,
              this.GLOBAL.customizationOrderStatus
            ).n || "-";
          item.payTypeName = this.GLOBAL.payStrategy[item.payStrategyId] || "-";
        });
        this.list = res.list;
        this.totalSize = setTotalSize(
          res.totalSize,
          params.page,
          "customizationPurchase"
        );
      });
    },
    // 跳转详情
    showDetail(pid) {
      this.$router.push({
        path: "customizationPurchaseDetail",
        query: { purchaseOrderId: pid }
      });
    },
    // 切换页
    handleCurrentChange(val) {
      if (this.page === val - 1) return;
      this.queryAction({ page: val - 1 });
    },
    // 点击搜索
    handleSearch() {
      let queryKey = this.$refs.queryData.queryData;
      if (queryKey.createTime) {
        queryKey.createTimeStart = queryKey.createTime[0] || "";
        queryKey.createTimeEnd = queryKey.createTime[1] || "";
      }
      delete queryKey.createTime;
      this.searchKey = queryKey;
      this.queryAction({ page: 0 });
    },
    // 标题切换
    handleClick(tab, event) {
      let type = tab.$attrs.type;
      if (type == "0-3") {
        this.queryAction({ confirmedStatus: 1, page: 0 });
      } else {
        this.queryAction({
          purchaseStatus: tab.$attrs.type,
          confirmedStatus: "",
          page: 0
        });
      }
    }
  },
  components: {
    EbTable,
    SearchInput
  }
};
</script>
<style lang='scss' scoped>
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
