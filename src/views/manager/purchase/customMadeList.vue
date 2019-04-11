<template>
  <div class="cloth-list-container">
    <!-- 供应商的定制采购单 -->
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
      <el-table-column slot="opt" label="操作" width="150">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="showDetail(row.purchaseOrderId)" plain>查看</el-button>
        </template>
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
import EbTable from "@/components/EbTable";
import SearchInput from "@/components/SearchInputGroup";
import { setTotalSize, byTypeGetObj, cloneObj, parseTime } from "@/utils";
export default {
  data() {
    return {
      page: 0,
      pageSize: 15,
      totalSize: 0,
      isManager: this.$store.getters.isManager,
      status: this.GLOBAL.confirmType[0].t,
      tagsGroup: this.GLOBAL.customizationConfirmType,
      tabStatus: this.GLOBAL.confirmType,
      inputGroup: [
        [
          { value: "", name: "orderId", holder: "定制订单号" },
          {
            value: ["", ""],
            name: "createTime",
            type: "dateRange",
            holder: "下单时间"
          }
        ]
      ],
      list: [],
      columns: [
        { prop: "orderId", label: "定制订单号" },
        { prop: "payTypeName", label: "付款类型" },
        { prop: "purchaseStatusName", label: "定制状态" },
        { prop: "createTime", label: "下单时间" },
        { prop: "delivery", label: "货期" },
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
    let inputs = this.inputGroup; //根据路由参数回填搜索框
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < inputs[i].length; j++) {
        if (query[inputs[i][j].name] != null) {
          inputs[i][j].value = query[inputs[i][j].name];
        }
      }
    }
    this.queryAction({ purchaseStatus: this.status });
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
        this.list = res.list;
        this.list.forEach(item => {
          item.createTime = parseTime(item.createTime) || "-";
          item.delivery = parseTime(item.deliveryTime) || "-";
          item.purchaseStatusName =
            byTypeGetObj(item.purchaseStatus, this.GLOBAL.customizationOrderStatus)
              .n || "-";
          item.payTypeName = this.GLOBAL.payStrategy[item.payStrategyId] || "-";
        });
        this.totalSize = setTotalSize(
          res.totalSize,
          params.page,
          "customMadeList"
        );
      });
    },
    handleCurrentChange(val) {
      if (this.page === val - 1) return;
      this.queryAction({ page: val - 1 });
    },
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
    // 查看详情
    showDetail(pid) {
      this.$router.push({
        name: "customMadeDetail",
        query: { purchaseOrderId: pid }
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
    EbTable,
    SearchInput
  }
};
</script>
<style lang="scss" scoped>
.cloth-list-container {
  .searchBtn {
    height: 90px;
    line-height: 90px;
    float: right;
    margin-right: 60px;
  }
}
</style>
