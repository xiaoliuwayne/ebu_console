<template>
    <div class="main-content">
        <el-tabs v-model="status" @tab-click="handleClick">
            <el-tab-pane :label="item.n" :name="item.t" :type="item.t" v-for="item in tabStatus"
                         :key="item.t"></el-tab-pane>
        </el-tabs>
        <div class="search-block">
            <search-input :inputList="inputGroup" ref="queryData"></search-input>
        </div>
        <div class="searchBtn">
            <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
        </div>

        <eb-table :list="list" :columns="columns">
            <el-table-column slot="opt" label="采购合同">
                <el-button size="mini" type="text" slot-scope="{ row }" :disabled="isManager?false:!row.contractId>0" @click="showContract(row.purchaseOrderId,row.contractId)">查看
                </el-button>
            </el-table-column>
            <el-table-column slot="opt1" label="操作">
                <el-button size="mini" type="text" slot-scope="{ row }" @click="showDetail(row.purchaseOrderId)">查看</el-button>
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
  import {fabricPruchaseOrderList} from '@/api/purchaseOrder';
  import {parseTime, cloneObj} from '@/utils/index';
  import {setTotalSize} from '@/utils/index';
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
        status: this.GLOBAL.confirmType[0].t,
        tabStatus: this.GLOBAL.confirmType,
        isManager: this.$store.getters.isManager,
        inputGroup: [
          [
            {value: '', name: 'skuId', holder: 'SKUID'},
            {value: '', name: 'productId', holder: 'SPUID'},
            {value: '', name: 'productCode', holder: '款号'},
            {value: ['', ''], name: 'createTime', type: 'dateRange', title: '录入时间:'}
          ],
          [
            {value: '', name: 'skuCode', holder: '色号'},
            {value: '', name: 'productName', holder: '品名'},
            {value: '', name: 'creatorName', holder: '录入账号'},
            {value: '', name: 'payType', type: 'select', options: [{ label: '无', value: '' },{ label: '月结', value: '1' },{ label: '现金', value: '2' }], title:'结算等级:',width: 100}
          ]
        ],
        columns: [
          {prop: 'purchaseOrderId', label: '采购单号'},
          {prop: 'providerName', label: '供应商'},
          {prop: 'productName', label: '品名'},
          {prop: 'productCode', label: '款号'},
          {prop: 'colorCode', label: '色号'},
          {prop: 'number', label: '数量'},
          {prop: 'price', label: '单价'},
          {prop: 'priceTax', label: '金额(含税)',width:80},
          {prop: 'purchaseStatusName', label: '采购状态',width:70},
          {prop: 'createTime', label: '创建时间',width:85},
          {prop: 'delivery', label: '货期',width:85},
          {slot: 'opt'},
          {slot: 'opt1'}
        ],
        searchKey: {},
        createTime: [parseTime(new Date(2017, 0, 1)), parseTime(new Date())]
      };
    },
    created() {
      if (this.isManager) {
        let isHas = false;
        this.tabStatus.forEach(v => {
          if (v.s === 'CANCELED') {
            isHas = true;
          }
        });
        if (!isHas) {
          this.tabStatus.push({ t: '5', n: '已取消', s: 'CANCELED' });
        }
      }
      let query  = cloneObj(this.$route.query);
      let inputs = this.inputGroup;                        //根据路由参数回填搜索框
      for (let i=0; i<inputs.length; i++){
        for (let j=0; j<inputs[i].length; j++){
          if (query[inputs[i][j].name]!=null){
            inputs[i][j].value = query[inputs[i][j].name];
          }
        }
      }
      this.queryAction({purchaseStatus: this.tabStatus[0].t});
    },
    methods: {
      queryAction(params) {
        let query = cloneObj(this.$route.query);
        let search = this.searchKey;
        for (let key in search){                        //把上次搜索的内容加入参数
          if (search[key].length!=0){
            query[key] = search[key];
          }else{
            delete query[key];
          }
        }
        params = params || {};
        for (let key in params) {                       //获得本次操作定义的参数信息
          query[key] = params[key];
        }
        query.purchaseStatus   = query.purchaseStatus || this.status;
        query.page     = parseInt(query.page)   || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        fabricPruchaseOrderList(params).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page, 'Order');
        });
      },
      handleClick(tab, event) {
        this.queryAction({purchaseStatus: tab.$attrs.type, page: 0});
      },
      handleCurrentChange(val) {
        if (this.page === val - 1) return;
        this.queryAction({page: val - 1});
      },
      showDetail(pid) {
        this.$router.push({name: 'purchaseDetail', query: {purchaseOrderId: pid}});
      },
      showContract(pid,cid) {
        this.$router.push({name: 'purchaseContract', query: {pid: pid,cid: cid}});
      },
//      isContract(cid){
//        this.isManager?false:!cid>0;
//        console.log(cid);
//      },
      handleSearch() {
        // this.searchKey = this.$refs.queryData.queryData;
        // this.queryAction({page: 0});
        let queryKey =  this.$refs.queryData.queryData;
        if (queryKey.createTime) {
          queryKey.startTime = queryKey.createTime[0]||"";
          queryKey.endTime   = queryKey.createTime[1]||"";
        }
        delete queryKey.createTime;
        this.searchKey = queryKey;
        this.queryAction({page:0});
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
        width: 100px;
        line-height: 80px;
        float: right;
        margin-right: 40px;
    }

</style>
