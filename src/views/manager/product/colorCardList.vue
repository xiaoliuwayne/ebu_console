<template>
  <div class="cloth-list-container">
    <div class="search-block">
      <search-input :inputList="inputGroup" ref="queryData"></search-input>
    </div>
    <div class="searchBtn">
      <el-button @click="handleSearch" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
    </div>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="opt" label="操作" width="150">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="printSpuLabel(row)" plain>打印标签</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="img" label="产品图片" width="110">
        <template slot-scope="{ row }">
          <el-popover
            placement="left"
            width="225"
            trigger="hover">
            <img :src="row.image" alt="" style="width: 200px;height: 200px;">
            <span slot="reference" style="cursor: pointer;">查看图片</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column slot="print" label="打印" width="220">
        <template slot-scope="{ row }">
          <template v-for="(type,index) in qrCodeEdit.spuTypes">
            <el-button  size="mini" type="primary" @click="printSpuQrCode(type.key, row, $event)" plain>{{type.name}}</el-button>
          </template>
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
    <el-dialog title="二维码打印类型" :visible.sync="qrCodeEdit.dialogVisible" width="540px">
      <template v-for="(type,index) in qrCodeEdit.spuTypes">
        <el-radio v-model="qrCodeEdit.type" :label="type.key" :key="index">{{type.name}}</el-radio>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qrCodeEdit.dialogVisible = false" size="mini" plain>取 消</el-button>
        <el-button type="primary" @click="printSpuQrCode(qrCodeEdit.type, $event)" size="mini" plain>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getClothList } from '@/api/product';
  import EbTable from '@/components/EbTable';
  import SearchInput from '@/components/SearchInputGroup';
  import { setTotalSize, cloneObj, formatMoney } from '@/utils';
  import DateRange from '@/components/DateRange';
  import clipboard from '@/utils/clipboard';

  const spuTypes = [{ key: 'small', name: '小布' }, { key: 'cut', name: '剪版' }, { key: 'big', name: '套版' }];
  const widthUnits = { 1: '厘米', 2: '英寸' };
  const weightUnits = { 1: 'g/m²', 2: 'OZ', 3: 'm/m' };
  const unitNames = { 1: '米', 2: '公斤', 3: '码' };


  export default {
    data() {
      return {
        list: [],
        page: 0,
        pageSize: 15,
        totalSize: 0,
        status: -1,
        productType: this.$route.query.C2 || 6,
        searchType: false,
        inputGroup: [
          [
            { value: ['', ''], name: 'createTime', type: 'dateRange', title: '录入时间:' },
            { value: '', name: 'ebspuId', holder: 'SPUID' },
            { value: '', name: 'productCode', holder: '款号' },
            { value: '', name: 'productName', holder: '品名' }
          ]
        ],
        searchKey: {},
        detail: {},
        qrCodeEdit: {
          dialogVisible: false,
          spuTypes: spuTypes,
          type: 'small'
        }
      };
    },
    props: {
      columns: {
        type: Array,
        default() {
          return [
            { prop: 'colorCardCode', label: '色卡编号', width: 110 },
            { prop: 'providerName', label: '供应商名称' },
            { prop: 'productId', label: 'SPUID' },
            { prop: 'productCode', label: '款号' },
            { prop: 'catStr', label: '分类' },
            { prop: 'productName', label: '品名' },
            { slot: 'img' },
            { slot: 'opt' },
            { slot: 'print' }
          ];
        }
      },
      isYet: {
        type: Boolean,
        default() {
          return false;
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
        query.page = parseInt(query.page) || 0;
        query.pageSize = parseInt(query.pageSize) || this.pageSize;
        this.page = query.page;
        this.$router.push({ query: query });
        this.getData(query);
      },
      getData(params) {
        params.status = '0,1,2,3';
        getClothList(params).then(res => {
          this.list = res.formatList;
          this.totalSize = setTotalSize(res.totalSize, params.page, 'colorCardList');
        });
      },
      handlePrint(detail) {
        this.detail = detail;
        this.qrCodeEdit.dialogVisible = true;
      },
      printSpuLabel(detail) {
        detail = detail || {};
        let unitName = unitNames[detail.saleUnit];
        let price = 0;
        detail.priceList.forEach(v => {
          if (v.priceType == 1) {
            price = v.salePrice;
            return;
          }
        });
        price = formatMoney(price);

        let arr = detail.ingredientList || [];
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
          newArr.push({ Name: arr[i].name.split('/')[0], Percent: arr[i].value });
        }
        let data = {
          Ebu: 'Ebu',
          RandomStr: Math.random(),
          SpuId: detail.productId,
          ProductCode: detail.productCode || '',
          ProductName: detail.productName,
          ColorCardCode: detail.colorCardCode,
          Component: newArr, // 成分
          Width: detail.width + ' ' + widthUnits[detail.widthUnit],
          Weight: detail.weight > 0 ? detail.weight + ' ' + weightUnits[detail.weightUnit] : '',
          Supplier: detail.providerId,
          ProductType: detail.productType,
          Price: `￥${price}元/${unitName}`,
          CodeType: 0 // 二维码类型
        };
        clipboard(JSON.stringify(data), event, () => {
          this.$message({
            type: 'success',
            message: '打印成功'
          });
        }, () => {
          this.$message({
            type: 'error',
            message: '打印失败'
          });
        });
      },
      printSpuQrCode(type, detail, event) {
        detail = detail || {};
        let data = {
          Business: detail.providerName,
          ColorId: detail.productCode,
          Ebu: 'Ebu',
          RandomStr: Math.random(),
          ebuSpuInfo: {
            SkuType: type,
            Yid: detail.productId
          }
        };
        clipboard(JSON.stringify(data), event, () => {
          this.qrCodeEdit.dialogVisible = false;
          this.$message({
            type: 'success',
            message: '正在打印'
          });
        }, () => {
          this.$message({
            type: 'error',
            message: '打印出错'
          });
        });
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
      handleChange(value, data) {
        console.log(data);
      }
    },
    components: {
      EbTable,
      DateRange,
      SearchInput
    }
  };
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

