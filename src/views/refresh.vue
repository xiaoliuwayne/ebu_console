<template>

</template>

<script type="text/ecmascript-6">
  export default {
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$router.replace({ path: from.path, query: vm.$route.query });
      });
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
