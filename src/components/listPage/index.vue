<template>
  <div class="cloth-list-container">
    <!--<el-tabs v-model="status" @tab-click="handleClick">-->
      <!--<el-tab-pane v-for="item in tagsGroup" :label="item.n" :name="item.t" :type="item.t" :key="item.t"></el-tab-pane>-->
    <!--</el-tabs>-->
    <!--<div class="search-block">-->
      <!--<search-input :inputList="inputGroup" ref="queryData"></search-input>-->
    <!--</div>-->
    <!--<div class="searchBtn">-->
      <!--<el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>-->
    <!--</div>-->
    <eb-table :list="list" :columns="columns">
      <slot name="test-r">
        <slot name="opt"></slot>
      </slot>
    </eb-table>
    <slot name="test-t"></slot>
    <!--<div class="pagination-box">-->
      <!--<el-pagination-->
        <!--@current-change="handleCurrentChange"-->
        <!--:current-page="page+1"-->
        <!--:page-size="pageSize"-->
        <!--layout="total, prev, pager, next, jumper"-->
        <!--:total="totalSize">-->
      <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import EbTable from '@/components/EbTable';
  import SearchInput from '@/components/SearchInputGroup';
  import { setTotalSize, cloneObj } from '@/utils';
  import DateRange from '@/components/DateRange';

  export default {
    data() {
      return {
        list: [],
        page: 0,
        pageSize: 15,
        totalSize: 0,
        uid: this.$route.query.uid || 0,
        status: '',
        searchType: false,
        searchKey: {}
      };
    },
    props: {
      getList: {
        type: Function,
        default() {
          return undefined;
        }
      },
      tagsGroup: {
        type: Array,
        default() {
          return [];
        }
      },
      columns: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    created() {
      let query  = cloneObj(this.$route.query);
      // let inputs = this.inputGroup;                        //根据路由参数回填搜索框
      // for (let i=0; i<inputs.length; i++){
      //   for (let j=0; j<inputs[i].length; j++){
      //     if (query[inputs[i][j].name]!=null){
      //       inputs[i][j].value = query[inputs[i][j].name];
      //     }
      //   }
      // }
      this.queryAction({status: this.tagsGroup.length > 0?this.tagsGroup[0].t : undefined});
    },
    methods: {
      queryAction(params) {
        let query = cloneObj(this.$route.query);
        let search = this.searchKey;
        for (let key in search){                        //把上次搜索的内容加入参数
          if (search[key].length!=0){
            query[key] = search[key];
          } else {
            delete query[key];
          }
        }
        params = params || {};
        for (let key in params) {                       //获得本次操作定义的参数信息
          query[key] = params[key];
        }
        query.roleType = this.$store.getters.detail.roleType;
        query.productType = 6;
        query.queryType = 3;
        query.status   = query.status || this.status;
        query.page     = parseInt(query.page)   || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      handleSearchData() {
        console.log(this.$refs.searchData.queryData);
      },
      getData(params) {
        if (!this.getList) { return false; }
        // console.log(params)
        this.getList(params).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page);
        });
      },
      handleClick(tab, event) {
        this.queryAction({ status: tab.$attrs.type, page: 0 });
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
      }
    },
    components: {
      EbTable,
      DateRange,
      SearchInput
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .searchBtn {
    height: 90px;
    line-height: 90px;
    float: right;
    margin-right: 60px;
  }
  .el-table .cell{
    padding: 0!important;
  }
</style>