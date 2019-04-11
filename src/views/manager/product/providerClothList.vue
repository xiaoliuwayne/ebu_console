<template>
  <cloth-list :providerId="providerId"></cloth-list>
</template>

<script type="text/ecmascript-6">
  import clothList from './clothList';

  export default {
    name: 'provider-cloth-list',
    data() {
      return {
        providerId: sessionStorage.getItem('clothProviderId')
      };
    },
    components: {
      clothList
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
