<template>
  <list-page :getList="getData" :columns="columns">
    <div slot="test-t">测试测试</div>
    <template slot="test-r">
      <el-table-column slot="opt" label="操作" width="150">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="showDetail(row.productId)" plain>详情</el-button>
          <el-button size="mini" type="primary" @click="editDetail(row.productId)" plain>编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="img" label="产品图片" width="110">
        <template slot-scope="{ row }">
          <img :src="row.image" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
    </template>
  </list-page>
</template>

<script type="text/ecmascript-6">
  import listPage from '@/components/listPage';
  import { getClothList } from '@/api/product';

  export default {
    name: 'test',
    data() {
      return {
        columns: [
          { slot: 'img' },
          { prop: 'providerName', label: '供应商名称' },
          { prop: 'productId', label: 'SPUID' },
          { prop: 'productCode', label: '款号' },
          { prop: 'productName', label: '品名' },
          { prop: 'saleStatus', label: '类型' },
          { prop: 'priceTax', label: '供货价（含税）', width: 70 },
          { prop: 'bigPrice', label: '大货价' },
          { prop: 'samplePrice', label: '米样价' },
          { prop: 'unitName', label: '单位' },
          { prop: 'statusName', label: '状态' },
          { prop: 'createTime', label: '录入时间', width: 85 },
          { slot: 'opt' }
        ],
        getData: getClothList
      };
    },
    methods: {
      // getData() {
      //   return getClothList();
      // }
    },
    components: {
      listPage
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>