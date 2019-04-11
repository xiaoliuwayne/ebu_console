<template>
  <cloth-list :columns='columns'></cloth-list>
</template>

<script type='text/ecmascript-6'>
import clothList from './clothList';
export default {
  name: '',
  data() {
    return {
      columns: [
        { slot: 'img' },
        { prop: 'productId', label: 'SPUID' },
        { prop: 'productCode', label: '款号' },
        { prop: 'productName', label: '品名' },
        { prop: 'saleStatus', label: '类型' },
        { prop: 'payStrategyName', label: '结算方式' },
        { prop: 'priceTax', label: '供货价（含税）', width: 70 },
        { prop: 'unitName', label: '单位' },
        { prop: 'statusName', label: '状态' },
        { prop: 'createTime', label: '录入时间', width: 85 },
        { slot: 'opt' }
      ]
    };
  },
  components: {
    clothList
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
</style>
