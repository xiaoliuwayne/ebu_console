<template>
  <div class="provider-cloth-manage">
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData">
      </search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
      <el-button type="primary" style="margin-left: 30px;" size="mini"><router-link :to="{path:'providerCreated'}">新建供应商</router-link></el-button>
    </div>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="opt" label="操作">
        <template slot-scope="{ row }">
          <el-button type="button" size="mini" @click="providerClothList(row.providerId)" plain>商品列表</el-button>
          <el-button type="button" size="mini" @click="jumpToAdd(row.providerId)" plain>新建商品</el-button>
        </template>
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
  import { setTotalSize, cloneObj } from '@/utils/index';
  import EbTable from '@/components/EbTable';
  import SearchInput from '@/components/SearchInputGroup';

  export default {
    name: 'provider-cloth-manage',
    data() {
      return {
        list: [],
        page: 0,
        pageSize: 10,
        totalSize: 0,
        roleType: 22,
        inputGroup: [
          { value: '', name: 'toUserId', holder: '供应商ID', width: 150 },
          { value: '', name: 'name', holder: '供应商名称', width: 150 }
        ],
        columns: [
          { prop: 'providerId', label: '供应商ID' },
          { prop: 'providerName', label: '供应商名称' },
          { prop: 'spuNum', label: 'SPU数量' },
          { slot: 'opt' }
        ],
        searchKey: {}
      };
    },
    created() {
      let query  = cloneObj(this.$route.query);
      let inputs = this.inputGroup;                        //根据路由参数回填搜索框
      for (let i = 0; i < inputs.length; i++) {
        if (query[inputs[i].name] != null) {
          inputs[i].value = query[inputs[i].name];
        }
      }
      this.queryAction();
    },
    methods: {
      queryAction(params) {
        let query = cloneObj(this.$route.query);
        let search = this.searchKey;
        for (let key in search) {                        //把上次搜索的内容加入参数
          if (search[key].length !== 0) {
            query[key] = search[key];
          } else {
            delete query[key];
          }
        }
        params = params || {};
        for (let key in params) {                       //获得本次操作定义的参数信息
          query[key] = params[key];
        }
        query.page     = parseInt(query.page)   || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        query.roleType = this.roleType;
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
      handleSearch() {
        this.searchKey = this.$refs.queryData.queryData;
        this.queryAction({ page: 0 });
      },
      handleCurrentChange(val) {
        if (this.page === val - 1) return;
        this.queryAction({ page: val - 1 });
      },
      jumpToAdd(uid) {
        this.$router.push({ path: 'clothAdd', query: { uid: uid }});
      },
      providerClothList(id) {
        sessionStorage.setItem('clothProviderId', id);
        this.$router.push({ path: 'providerClothList' });
      },
      jumpToNewAdd(uid) {
        this.$router.push({ path: 'newClothEdit', query: { uid: uid }});
      }
    },
    components: {
      EbTable,
      SearchInput
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .provider-cloth-manage{
    .searchBtn{
      height: 40px;
      line-height: 50px;
      float: right;
      margin-right: 10px;
    }
  }
</style>