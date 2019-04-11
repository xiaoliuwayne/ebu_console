<template>
  <div class="product-list">
    <p class="title-text">经买卖双方商定，按本合同条款，买方向卖方采购下列面辅材料：</p>
    <eb-table :list="list" :columns="columns">
      <el-table-column slot="specification" label="规格">
        <template slot-scope="{ row }">
          <p v-if="row.specification.length>0" v-for="item in row.specification">
            <span>{{item.name}}：</span>
            <span>{{item.value}}；</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column slot="ingredient" label="成分" width="180px">
        <template slot-scope="{ row }">
          <p v-if="row.ingredientList.length>0" v-for="item in row.ingredientList">
            <span>{{item.name}}：</span>
            <span>{{item.value}}%；</span>
          </p>
        </template>
      </el-table-column>
    </eb-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import EbTable from '@/components/EbTable';

  export default {
    name: 'product-list',
    data() {
      return {};
    },
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
        required: true
      },
      columns: {
        type: Array,
        default() {
          return [
            { prop: 'productCode', label: '款号' },
            { prop: 'productName', label: '品名' },
            { prop: 'skuCode', label: '色号' },
            { slot: 'specification' },
            { slot: 'ingredient' },
            { prop: 'unitPrice', label: '单价(含税)' },
            { prop: 'num', label: '数量' },
            { prop: 'unit', label: '单位' },
            { prop: 'total', label: '金额' },
            { prop: 'note', label: '备注' }
          ];
        }
      }
    },
    components: {
      EbTable
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>