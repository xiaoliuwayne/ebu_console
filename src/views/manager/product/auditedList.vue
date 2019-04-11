<template>
  <audit-list :tags-group="tagsGroup" :is-yet="true"></audit-list>
</template>

<script type='text/ecmascript-6'>
  import auditList from './auditList';
  export default {
    name: '',
    data() {
      return {
        tagsGroup: [
          { t: '0', n: '待审核', s: 'COMFIRM' },
          { t: '1', n: '已上架', s: 'SALE' },
          { t: '2', n: '已下架', s: 'SOLD' },
          { t: '0,1,2', n: '全部', s: 'ALL' }
        ]
      };
    },
    components: {
      auditList
    }
  };
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
</style>
