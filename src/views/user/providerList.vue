<template>
  <div class="provider-list">
    <el-tabs v-model="catId" @tab-click="handleClick">
      <el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in tagsGroup" :key="item.t"></el-tab-pane>
    </el-tabs>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="opt" label="操作">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="toClothList(row.userId)">列表</el-button>
          <el-button size="mini" type="text" @click="showDetail(row.userId)">详情</el-button>
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
  import { getList } from '@/api/user';
  import EbTable from '@/components/EbTable';
  import { setTotalSize, cloneObj, byTypeGetObj } from '@/utils';

  export default {
    data() {
      return {
        page: 0,
        pageSize: 20,
        totalSize: 0,
        queryType: 2,
        roleType: byTypeGetObj('PROVIDER', this.GLOBAL.userRoleType, 's').t,
        catId: this.GLOBAL.providerMajors[0].t,
        tagsGroup: this.GLOBAL.providerMajors,
        columns: [
          { prop: 'userId', label: '供应商ID' },
          { prop: 'name', label: '供应商名称' },
          { prop: 'address', label: '地址' },
          { prop: 'majorBusiness', label: '主营业务' },
          { prop: '', label: '操作', slot: 'opt' }
        ],
        list: []
      };
    },
    created() {
      this.queryAction();
    },
    methods: {
      queryAction(params) {
        let query = cloneObj(this.$route.query);
        params = params || {};
        for (let key in params) {
          query[key] = params[key];
        }
        query.roleType = query.roleType || this.roleType;
        query.pageSize = query.pageSize || this.pageSize;
        query.type     = query.type  || this.queryType;
        query.catId    = query.catId || this.catId;
        query.page     = query.page  || 0;
        this.$router.push({ query: query });
        this.page = parseInt(query.page);
        this.getData(query);
      },
      getData(params) {
        getList(params).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page, 'User');
        });
      },
      handleCurrentChange(val) {
        if (this.page === val - 1) return;
        this.queryAction({ page: val - 1 });
      },
      handleClick(tag, event) {
        this.queryAction({ catId: tag.$attrs.type, page: 0 });
      },
      toClothList(id) {
        this.$router.push({ path: '/product/cloth/providerClothList', query: { uid: id }});
      }
    },
    components: {
      EbTable
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>