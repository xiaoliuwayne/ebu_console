<template>
  <div class="brand-logo clearfix">
    <div class="brand-logo-wrap clearfix">
      <div class="logo-img">
        <img src="./img/logo.png" alt="" width="50" height="50">
      </div>
      <div class="brand-info">
        <div class="brand-name">衣布到位</div>
        <div>& EBUDAOWEI</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'brand-logo'
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .brand-logo{
    color: #fff;
    .brand-logo-wrap{
      padding:20px;
      .logo-img{
        float:left;
        width:50px;
        height:50px;
      }
      .brand-info{
        float:left;
        margin-left:20px;
        .brand-name{
          margin-bottom:10px;
          font-size:22px;
          font-weight: 700;
        }
      }
    }
  }
</style>
