<template>
  <div class="main-content">
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData"></search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="$router.push({path:'/buyercreated'})" type="primary" size="mini">新建采购商</el-button>
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
    </div>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="opt" label="操作">
        <el-button size="mini" type="text" slot-scope="{ row }" @click="showDetail(row.userId)">编辑</el-button>
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
  import { getmaterialBuyerList } from '@/api/user';
  import { parseTime, cloneObj, setTotalSize } from '@/utils/index';
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
        roleType: '',
        inputGroup: [
          [
            { value: '', name: 'toUserId', holder: '采购商ID' },
            { value: '', name: 'regTel', holder: '注册手机号' },
            { value: '', name: 'name', holder: '采购商名称' },
            { value: ['', ''], name: 'createTime', type: 'dateRange', title: '注册时间:' }
          ],
          [
            { value: '', name: 'linkman', holder: '联系人' },
            { value: '', name: 'tel', holder: '联系电话' },
            {
              value: '',
              name: 'incomeLevel',
              type: 'select',
              options: [{ label: '全部', value: '' }, { label: '月结', value: '1' }, { label: '现金', value: '2' }],
              title: '结算等级:',
              width: 100
            }
          ]
        ],
        columns: [
          { prop: 'userId', label: '采购商ID' },
          { prop: 'regTel', label: '注册手机号' },
          { prop: 'name', label: '采购商名称' },
          { prop: 'linkman', label: '联系人' },
          { prop: 'tel', label: '联系电话' },
          { prop: 'incomeLevel', label: '结算等级', width: 70 },
          { prop: 'pricePrivilege', label: '对外售价' },
          { prop: 'createTime', label: '注册时间', width: 160 },
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
        query.page = parseInt(query.page) || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        // query.roleType = 20;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        getmaterialBuyerList(params).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page, 'buyerListList');
        });
      },
      handleCurrentChange(val) {
        if (this.page === val - 1) return;
        this.queryAction({ page: val - 1 });
      },
      showDetail(id) {
        this.$router.push({ name: 'buyerDetail', query: { id: id } });
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
  .eb-date-range {
    padding: 10px 15px;
  }

  .searchBtn {
    height: 90px;
    line-height: 90px;
    float: right;
    margin-right: 70px;
  }
</style>
