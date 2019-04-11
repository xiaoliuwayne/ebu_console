<template>
  <div class="main-content">
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData"></search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
      <el-button type="primary" style="margin-left: 30px;" size="mini">
        <router-link :to="{path:'providerCreated'}">新建供应商</router-link>
      </el-button>
      <el-button type="primary" style="margin-left: 30px;" size="mini">
        <router-link :to="{path:'providerCreatedBatch'}">批量新建供应商</router-link>
      </el-button>
    </div>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="opt" label="操作">
        <el-button size="mini" type="text" slot-scope="{ row }" @click="showDetail(row.providerId)">编辑</el-button>
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
  import { getProviderList } from '@/api/user';
  import { setTotalSize, parseTime, cloneObj } from '@/utils/index';
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
        inputGroup: [
          [
            { value: '', name: 'providerId', holder: '供应商ID', width: 150 },
            { value: '', name: 'userName', holder: '用户名', width: 150 },
            { value: '', name: 'regTel', holder: '手机号', width: 150 },
            { value: ['', ''], name: 'createTime', type: 'dateRange', title: '注册时间:' }
          ],
          [
            { value: '', name: 'name', holder: '供应商名称', width: 150 },
            { value: '', name: 'linkman', holder: '联系人', width: 150 },
            { value: '', name: 'tel', holder: '固定电话', width: 150 },
            {
              value: '',
              name: 'catId',
              type: 'select',
              options: [{ label: '全部', value: '' }, { label: '面料', value: '31' }, {
                label: '纽扣',
                value: '321'
              }, { label: '拉链', value: '322' }],
              title: '主营品类:',
              width: 100
            },
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
          { prop: 'providerId', label: '供应商ID' },
          /* { prop: 'userName', label: '用户名' }, */
          { prop: 'providerName', label: '供应商名称' },
          /* { prop: 'cneeName', label: '联系人' }, */
          { prop: 'registerPhone', label: '手机号' },
          /* { prop: 'cneePhone', label: '固定电话' }, */
          /* { prop: 'majorName', label: '主营关键字' }, */
          { prop: 'address', label: '地址',width:300},
          { prop: 'busiKeywords', label: '主营关键字',width:400},
          /* { prop: 'incomeLevel', label: '结算等级', width: 70 },
          { prop: 'createTime', label: '注册时间', width: 160 }, */
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
        // query.roleType = 22;
        // query.status = query.status || this.status;
        query.page = parseInt(query.page) || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        getProviderList(params).then(res => {
          
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page, 'providerList');
        });
      },
      handleCurrentChange(val) {
        if (this.page === val - 1) return;
        this.queryAction({ page: val - 1 });
      },
      showDetail(pid) {
        this.$router.push({ name: 'providerDetail', query: { pid: pid } });
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
    height: 80px;
    line-height: 80px;
    float: right;
    margin-right: 10px;
  }
</style>
