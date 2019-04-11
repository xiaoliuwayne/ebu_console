<template>
  <div class="bank-transfer-list">
    <el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in statusTag" :key="item.t"></el-tab-pane>
    </el-tabs>
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData"></search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
    </div>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="opt" label="操作">
        <el-button size="mini" type="text" slot-scope="{ row }" @click="showDetail(row.id)">详情</el-button>
      </el-table-column>
    </eb-table>
    <div class="pagination-box">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page+1"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getBankTransferList } from '@/api/financial';
  import { setTotalSize, parseTime, cloneObj } from '@/utils';
  import { getPicUrl } from '@/utils/getPicUrl';
  import EbTable from '@/components/EbTable';
  import EbDate from '@/components/DateRange';
  import SearchInput from '@/components/SearchInputGroup';

  const status = [{ t: '-1', n: '全部' }, { t: '0', n: '待确认' }, { t: '1', n: '已确认' }];
  export default {
    name: 'bank-transfer-list',
    data() {
      return {
        list: [],
        page: 0,
        pageSize: 10,
        totalSize: 0,
        statusTag: status,
        status: status[0].t,
        inputGroup: [
          { value: '', name: 'orderId', holder: '订单号', width: 170 },
          { value: '', name: 'regTel', holder: '注册手机号', width: 170 },
          { value: ['', ''], name: 'createTime', type: 'dateRange', title: '支付时间' }
        ],
        columns: [
          { prop: 'id', label: '付款单号' },
          { prop: 'regTel', label: '注册手机号' },
          { prop: 'amount', label: '支付金额' },
          { prop: 'statusName', label: '状态' },
          { prop: 'payTypeName', label: '付款类型' },
          { prop: 'formatTime', label: '支付时间' },
          { slot: 'opt' }
        ],
        searchKey: {}
      };
    },
    created() {
      this.queryAction();
    },
    methods: {
      queryAction(params) {
        let query = cloneObj(this.$route.query);
        let search = this.searchKey;
        for (let key in search) {                        //把上次搜索的内容加入参数
          if (search[key].length != 0) {
            query[key] = search[key];
          } else {
            delete query[key];
          }
        }
        params = params || {};
        for (let key in params) {                       //获得本次操作定义的参数信息
          query[key] = params[key];
        }
        query.status   = query.status || this.status;
        query.page     = parseInt(query.page) || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        getBankTransferList(params).then(res => {
          this.list = res.list;
          this.totalSize = setTotalSize(res.totalSize, params.page);
        });
      },
      handleClick(tag, event) {
        this.queryAction({ status: tag.$attrs.type, page: 0 });
      },
      handleCurrentChange(val) {
        if (this.page === val - 1) return;
        this.queryAction({ page: val - 1 });
      },
      showDetail(id) {
        this.$router.push({ path: 'bankTransferDetail', query: { id: id }});
      },
      handleSearch() {
        let queryKey = this.$refs.queryData.queryData;
        if (queryKey.createTime) {
          queryKey.startTime = queryKey.createTime[0]||"";
          queryKey.endTime   = queryKey.createTime[1]||"";
        }
        delete queryKey.createTime;
        this.searchKey = queryKey;
        this.queryAction({page:0});
      }
    },
    components: {
      EbTable,
      EbDate,
      SearchInput
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .searchBtn {
    height: 80px;
    width: 100px;
    line-height: 80px;
    float: right;
    margin-right: 40px;
  }
</style>