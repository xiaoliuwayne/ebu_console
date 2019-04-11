<template>
  <div class="main-content">
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in types" :key="item.t"></el-tab-pane>
    </el-tabs>
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
  import { getNoticeList } from '@/api/notice';
  import EbTable from '@/components/EbTable';
  export default {
    name: '',
    data() {
      return {
        list: [],
        type: '1',
        types: [{ t: '1', n: '全部' }, { t: '2', n: '采购商' }, { t: '3', n: '供应商' }],
        columns: [
          { prop: 'newsId', label: 'id' },
          { prop: 'timeHorizon', label: '展示时间段' },
          { prop: 'newsTitle', label: '标题' },
          { prop: 'type', label: '接收方' },
          { prop: 'cneePhone', label: '状态' },
          { prop: 'payAmount', label: '发布者' },
          { slot: 'opt' }
        ],
        page: 0,
        pageSize: 10,
        totalSize: 0
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData: function(params) {
        getNoticeList({
          newsType: this.type,
          page: this.page,
          pageSize: this.pageSize
        }).then(res => {
          this.list = res.list;
          this.totalSize = res.totalSize;
        });
      },
      handleClick(tag, event) {
        this.type = tag.$attrs.type;
        this.page = 0;
        this.getData();
      },
      handleCurrentChange(val) {
        if (this.page !== val - 1) {
          this.page = val - 1;
          this.getData();
        }
      }
    },
    components: {
      EbTable
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
