<template>
  <div class="main-content">
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
        <el-button size="mini" type="text" slot-scope="{ row }" @click="showDetail(row.orderId)">查看订单</el-button>
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
  import { getList } from '@/api/order';
  import { setTotalSize, parseTime, cloneObj } from '@/utils/index';
  import { getPicUrl } from '@/utils/getPicUrl';
  import EbTable from '@/components/EbTable';
  import EbDate from '@/components/DateRange';
  import SearchInput from '@/components/SearchInputGroup';

  export default {
    data() {
      return {
        list: [],
        page: 0,
        pageSize: 10,
        totalSize: 0,
        statusTag: this.GLOBAL.orderStatus,
        status: this.GLOBAL.orderStatus[0].t,
        inputGroup: [
          [
            { value: '', name: 'orderId', holder: '订单号', width: 170 },
            { value: '', name: 'regTel', holder: '注册手机号', width: 170 },
            { value: '', name: 'cneeName', holder: '收货人', width: 170 },
            { value: '', name: 'cneePhone', holder: '收货电话', width: 170 },
            {
              value: '',
              name: 'logisticsType',
              type: 'select',
              options: [{ label: '全部', value: '' }, { label: '自提', value: '1' }, { label: '物流', value: '2' }],
              title: '收货类型:',
              width: 70
            }
          ],
          [
            {
              value: '-1',
              name: 'invoiceType',
              type: 'select',
              options: [{ label: '不限', value: '-1' }, { label: '是', value: '1' }, { label: '否', value: '0' }],
              title: '是否开票:',
              width: 80
            },
            { value: ['', ''], name: 'createTime', type: 'dateRange', title: '下单时间:' }
          ]
        ],
        columns: [
          { prop: 'orderId', label: '订单号' },
          { prop: 'regTel', label: '注册手机号', width: 110 },
          { prop: 'productTypeName', label: '收货', width: 60 },
          { prop: 'cneePhone', label: '联系电话', width: 110 },
          { prop: 'payAmount', label: '支付金额' },
          { prop: 'invoiceType', label: '是否开票', width: 70 },
          { prop: 'orderStatusName', label: '订单状态', width: 75 },
          { prop: 'payStrategyName', label: '付款类型', width: 75 },
          { prop: 'paySpeedValue', label: '付款进度', width: 75 },
          { prop: 'isSubmitAmmountDiff', label: '是否补差额', width: 75 },
          { prop: 'createTime', label: '下单时间', width: 150 },
          { slot: 'opt' }
        ],
        searchKey: {}
      };
    },
    created() {
      let query = cloneObj(this.$route.query);
      let inputs = this.inputGroup;                        //根据路由参数回填搜索框
      for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < inputs[i].length; j++) {
          if (query[inputs[i][j].name] != null) {
            inputs[i][j].value = query[inputs[i][j].name];
          }
        }
      }
      this.queryAction({ status: this.statusTag[0].t });
    },
    methods: {
      queryAction(params) {
        let query = cloneObj(this.$route.query);
        let search = this.searchKey;
        for (let key in search) {                        // 把上次搜索的内容加入参数
          if (search[key].length != 0) {
            query[key] = search[key];
          } else {
            delete query[key];
          }
        }
        params = params || {};
        for (let key in params) {                       // 获得本次操作定义的参数信息
          query[key] = params[key];
        }
        query.status = query.status || this.status;
        query.page = parseInt(query.page) || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        query.getItems = 0;
        query.getProduct = 0;
        query.productType = 6;
        query.customizeType = 0;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        getList(params).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page, 'OrderList');
        });
      },
      handleClick(tag, event) {
        this.queryAction({ status: tag.$attrs.type, page: 0 });
      },
      handleCurrentChange(val) {
        if (this.page === val - 1) return;
        this.queryAction({ page: val - 1 });
      },
      handleSearch() {
        let queryKey = this.$refs.queryData.queryData;
        if (queryKey.createTime) {
          queryKey.startTime = queryKey.createTime[0] || '';
          queryKey.endTime = queryKey.createTime[1] || '';
        }
        delete queryKey.createTime;
        this.searchKey = queryKey;
        this.queryAction({ page: 0 });
      },
      showDetail(orderId) {
        this.$router.push({ path: 'orderDetail', query: { orderId: orderId } });
      }
    },
    components: {
      EbTable,
      EbDate,
      SearchInput
    }
  };
</script>
<style scoped>
  .searchBtn {
    height: 80px;
    line-height: 80px;
    float: right;
    margin-right: 60px;
  }
</style>
