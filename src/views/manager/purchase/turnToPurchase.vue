<template>
  <div class="turn-to-purchase">
    <el-tabs v-model="toPurchaseStatus" @tab-click="handleClick">
      <el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in tabStatus"
                   :key="item.t"></el-tab-pane>
    </el-tabs>
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData"></search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
      <el-button type="primary" size="mini" :disabled="selection.length === 0" @click="dialogVisible = true">转采购单
      </el-button>
    </div>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="opt" label="合并" width="70">
        <template slot-scope="scope">
          <el-checkbox class="hidden-text" v-model="selection" :disabled="scope.row.disabled" :label="scope.row.onlyId"
                       @change="(value) => checkIsSelected(value, scope.row.onlyId)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column slot="img" label="商品图片">
        <template slot-scope="{ row }">
          <img :src="row.img" alt="">
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
    <el-dialog title="确认转采购单" :visible.sync="dialogVisible" width="800px">
      <eb-table :list="selectionList" :columns="selectionColumns"></eb-table>
      <div class="textarea-box">
        <el-input
          type="textarea"
          placeholder="请输入备注"
          :autosize="{ minRows: 2, maxRows: 6 }"
          v-model="note">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini" plain>取 消</el-button>
        <el-button type="primary" @click="turnToPurchase" size="mini" plain>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { beTransferredOrder, addNewPruchase } from '@/api/purchaseOrder';
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
        selection: [],
        selectionList: [],
        note: '',
        dialogVisible: false,
        toPurchaseStatus: this.GLOBAL.turnPurchaseType[0].t,
        tabStatus: this.GLOBAL.turnPurchaseType,
        inputGroup: [
          { value: '', name: 'orderId', holder: '订单号' },
          { value: '', name: 'providerName', holder: '供应商' },
          { value: '', name: 'productName', holder: '品名' },
          { value: '', name: 'productCode', holder: '款号' }
        ],
        columns: [
          { slot: 'opt' },
          { prop: 'purchaseOrderStatusName', label: '状态' },
          { prop: 'payTime', label: '支付时间' },
          { prop: 'orderId', label: '订单号' },
          { prop: 'providerName', label: '供应商' },
          { slot: 'img' },
          { prop: 'productName', label: '品名' },
          { prop: 'productCode', label: '款号' },
          { prop: 'colorCode', label: '色号' },
          { prop: 'number', label: '数量' },
          { prop: 'price', label: '供货价' }
        ],
        selectionColumns: [
          { prop: 'orderId', label: '订单号' },
          { prop: 'providerName', label: '供应商' },
          { prop: 'productName', label: '品名' },
          { prop: 'productCode', label: '款号' },
          { prop: 'colorCode', label: '色号' },
          { prop: 'number', label: '数量' }
        ],
        searchKey: {},
        createTime: [parseTime(new Date(2017, 0, 1)), parseTime(new Date())]
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
      this.queryAction({ toPurchaseStatus: this.tabStatus[0].t });
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
        query.toPurchaseStatus = query.toPurchaseStatus || this.toPurchaseStatus;
        query.page = parseInt(query.page) || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        beTransferredOrder(params).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page, 'turnToPurchase');
          this.handleCheckBoxDisabled();
        });
      },
      turnToPurchase() {
        if (this.selection.length === 0) {
          return false;
        }
        let reqParamsList = this.selection.map(value => {
          return {
            orderId: value.split('/')[0],
            skuId: value.split('/')[1]
          };
        });
        let reqParams = {
          note: this.note,
          list: JSON.stringify(reqParamsList)
        };

        addNewPruchase(reqParams).then(res => {
          this.selection = [];
          this.selectionList = [];
          this.note = '';
          this.dialogVisible = false;
          this.queryAction();
          this.$message({
            message: '采购单合并成功',
            type: 'success'
          });
        });
      },
      checkIsSelected(ab, param) {
        if (ab) {
          let skuId = parseFloat(this.selection[0].split('/')[1]);
          this.list.forEach(value => {
            if (value.skuId !== skuId) {
              value.disabled = true;
            }
            if (value.onlyId === param) {
              this.selectionList.push(value);
            }
          });
        } else {
          if (this.selection.length === 0) {
            this.list.forEach(value => {
              value.disabled = false;
            });
          }
          this.selectionList = this.selectionList.filter(value => {
            return value.onlyId !== param;
          });
        }
      },
      handleCheckBoxDisabled() {
        if (this.selection.length > 0) {
          let skuId = parseFloat(this.selection[0].split('/')[1]);
          this.list.forEach(value => {
            if (value.skuId !== skuId) {
              value.disabled = true;
            }
          });
        }
      },
      getPicUrl(url, v, t) {
        return getPicUrl(url, v, t);
      },
      handleClick(tab, event) {
        this.queryAction({ toPurchaseStatus: tab.$attrs.type, page: 0 });
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
      EbDate,
      SearchInput
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .turn-to-purchase {
    .searchBtn {
      height: 40px;
      line-height: 40px;
      float: right;
      margin-right: 70px;
    }

    .el-dialog {
      .textarea-box {
        margin-top: 20px;
        padding: 0 10px;
      }
    }

    .el-dialog {
      table {
        width: 100% !important;
      }
    }
  }
</style>
