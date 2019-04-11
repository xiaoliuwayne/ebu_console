<template>
  <div class="material-list">
    <el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane :label="item.n" :name="item.t" v-for="(item, index) in tabStatus" :key="index"></el-tab-pane>
    </el-tabs>
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData"></search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
    </div>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="img" label="产品图片" width="110">
        <template slot-scope="{ row }">
          <img :src="row.image" alt="" width="85" height="85">
        </template>
      </el-table-column>
      <el-table-column slot="edit" label="库存">
        <template slot-scope="scope">
          <div class="input-box" v-show="scope.row.isEdit">
            <el-input type="text" size="mini" min="0" v-model="scope.row.stock"></el-input>
          </div>
          <span class="stock-count" v-show="!scope.row.isEdit">{{scope.row.stock}}</span>
          <el-button type="text" v-if="isManager" size="mini" @click="modifySkuStock(scope.row)">{{scope.row.isEdit?'确认':'修改'}}</el-button>
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
  import { queryProductList, modifyProductSku } from '@/api/product';
  import { parseTime, cloneObj, setTotalSize } from '@/utils/index';
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
        isManager: this.$store.getters.isManager,
        stock: -1,
        status: this.GLOBAL.materialStock[0].t,
        tabStatus: this.GLOBAL.materialStock,
        inputGroup: [
          [
            { value: '', name: 'providerName', holder: '供应商名称' },
            { value: '', name: 'skuId', holder: 'SKUID' },
            { value: '', name: 'spuId', holder: 'SPUID' },
            { value: ['', ''], name: 'createTime', type: 'dateRange', title: '录入时间:'}
          ],
          [
            { value: '', name: 'productCode', holder: '款号' },
            { value: '', name: 'skuCode', holder: '色号' },
            { value: '', name: 'productName', holder: '品名' },
            { value: '', name: 'creatorName', holder: '录入账号' },
            { value: '', name: 'saleStatus', type: 'select', options: [{ label: '全部', value: '' },{ label: '现货', value: '1' },{ label: '新品定制', value: '2' }], title:'类型:',width: 100}
          ]
        ],
        columns: [
          { slot: 'img' },
          { prop: 'providerName', label: '供应商名称' },
          { prop: 'providerId', label: '供应商ID' },
          { prop: 'spuId', label: 'SPUID' },
          { prop: 'skuId', label: 'SKUID' },
          { prop: 'productCode', label: '款号' },
          { prop: 'colorCode', label: '色号' },
          { slot: 'edit' },
          { prop: 'productName', label: '品名' },
          { prop: 'productType', label: '类型' },
          { prop: 'priceTax', label: '供货价(含税)', width: 60 },
          { prop: 'unitName', label: '单位' }
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
        query.status = '';
        query.page = parseInt(query.page) || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        queryProductList(params).then(res => {
          this.list = res.formatList.map(v => {
            this.$set(v, 'isEdit', false);
            return v;
          });
          this.totalSize = setTotalSize(res.totalSize, params.page, 'Order');
        });
      },
      getPicUrl(url, v, t) {
        return getPicUrl(url, v, t);
      },
      handleClick(tab, event) {
        let stock = -1;
        if (this.status === '-2') {
          stock = 50;
        }
        this.queryAction({ status: tab.$attrs.type, page: 0, stock: stock });
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
      modifySkuStock(params) {
        if (params.isEdit) {
          modifyProductSku({ op: 5, productType: 6, productId: params.spuId, skuId: params.skuId, stock: params.stock }).then(res => {
            this.$message({
              type: 'success',
              message: '修改库存成功！'
            });
            params.isEdit = !params.isEdit;
          });
        } else {
          params.isEdit = !params.isEdit;
        }
      }
    },
    components: {
      EbTable,
      EbDate,
      SearchInput
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .material-list{
    .searchBtn {
      height: 80px;
      line-height: 80px;
      float: right;
      margin-right: 70px;
    }
    .el-table{
      .input-box{
        display: inline-block;
        width: 50px;
      }
    }
  }
</style>
