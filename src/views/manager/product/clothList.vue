<template>
  <div class="cloth-list-container">
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
    <el-table-column slot="opt" label="操作" width="180">
      <template slot-scope="{ row }">
        <el-button size="mini" type="primary" @click="showDetail(row.productId)" v-if="row.status==0||row.status==3" plain>{{btnText[row.status]}}</el-button>
        <el-button size="mini" type="primary" @click="updateStatus(row.productId, row.status)" v-else-if="row.status==1||row.status==2" plain>{{btnText[row.status]}}</el-button>
        <el-button size="mini" type="primary" @click="editDetail(row.productId)" plain>修改</el-button>
        <!--<el-button size="mini" type="primary" @click="editDetailNew(row.productId)" plain>编辑</el-button>-->
      </template>
    </el-table-column>
    <el-table-column slot="img" label="产品图片" width="150">
      <template slot-scope="{ row }">
        <!--<el-popover-->
        <!--placement="right"-->
        <!--width="225"-->
        <!--trigger="hover">-->
        <!--<img :src="row.image" alt="" style="width: 200px;height: 200px;">-->
        <!--<span slot="reference" style="cursor: pointer;">查看图片</span>-->
        <!--</el-popover>-->
        <img :src="row.image" alt="" style="width: 100px;height: 100px;">
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
  import { getClothList, modifyProductStatus } from '@/api/product';
  import EbTable from '@/components/EbTable';
  import SearchInput from '@/components/SearchInputGroup';
  import { setTotalSize, cloneObj } from '@/utils';
  import DateRange from '@/components/DateRange';
  import { getPicUrl } from '@/utils/getPicUrl';

  export default {
    data() {
      return {
        selection: [],
        list: [],
        page: 0,
        pageSize: 15,
        totalSize: 0,
        // tagsGroup: this.GLOBAL.productStatus,
        uid: this.$route.query.uid || 0,
        status: '0',
        productType: this.$route.query.C2 || 6,
        searchType: false,
        tabStatus: this.GLOBAL.productStatus,
        inputGroup: [
          [
            { value: ['', ''], name: 'createTime', type: 'dateRange', title: '录入时间:' },
            { value: '', name: 'ebspuId', holder: 'SPUID' },
            { value: '', name: 'productCode', holder: '款号' },
            { value: '', name: 'productName', holder: '品名' }
          ],
          [
            {
              value: '',
              name: 'saleStatus',
              type: 'select',
              options: [{ label: '全部', value: '' }, { label: '现货', value: '1' }, { label: '定制', value: '2' }],
              title: '类型:',
              width: 70
            }
          ]
        ],
        searchKey: {},
        btnText: {
          0: '审核',
          1: '下架',
          2: '上架',
          3: '详情'
        }
      };
    },
    props: {
      providerId: 0,
      columns: {
        type: Array,
        default() {
          return [
            { prop: 'createTime', label: '录入时间', width: 85 },
            { slot: 'img' },
            { prop: 'catStr', label: '分类' },
            { prop: 'productId', label: 'SPUID' },
            { prop: 'providerName', label: '供应商名称' },
            { prop: 'productCode', label: '款号' },
            { prop: 'productName', label: '品名' },
            // { prop: 'priceTax', label: '供货价', width: 70 },
            { prop: 'samplePrice', label: '散剪价' },
            { prop: 'statusName', label: '状态' },
            { slot: 'opt' }
          ];
        }
      },
      tagsGroup: {
        type: Array,
        default() {
          return this.GLOBAL.productStatus;
        }
      }
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
        query.roleType = this.$store.getters.detail.roleType;
        query.productType = 6;
        query.queryType = 3;
        query.status = query.status || this.status;
        this.status = query.status;
        query.status == -1 && (query.status = '');
        query.page = parseInt(query.page) || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        params.providerId = this.providerId || undefined;
        getClothList(params).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page, 'User');
        });
      },
      editDetail(id) {
        this.$router.push({ path: 'clothEdit', query: { 'pid': id } });
      },
      editDetailNew(id) {
        this.$router.push({ path: 'clothEditNew', query: { 'pid': id } });
      },
      showDetail(id) {
        this.$router.push({ path: 'clothDetail', query: { 'pid': id } });
      },
      getPicUrl(url, v, t) {
        return getPicUrl(url, v, t);
      },
      handleClick(tab, event) {
        this.queryAction({ status: tab.$attrs.type, page: 0 });
      },
      // 换页
      handleCurrentChange(val) {
        if (this.page === val - 1) return;
        this.queryAction({ page: val - 1 });
      },
      // 搜索
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
      updateStatus(id, oldStatus) {
        let status = oldStatus == 1 ? 2 : oldStatus == 2 ? 1 : 0;
        if (!status) { return false; }
        let params = {
          productType: 6,
          productId: id,
          status: status
        };
        let text = '';
        if (status == 2) {
          text = '下架成功！';
        } else if (status == 1) {
          text = '上架成功！';
        }
        modifyProductStatus(params).then(res => {
          this.$message({
            type: 'success',
            message: text,
            duration: 2000
          });
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].productId == id) {
              this.list[i].status = status;
              break;
            }
          }
        });
      },
      handleChange(value, data) {
        console.log(data);
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

  .el-table .cell {
    padding: 0 !important;
  }
</style>
