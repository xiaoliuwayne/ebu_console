<template>
  <div class="company-info">
    <div class="table-box">
      <table class="table table-responsive table-bordered">
        <tbody>
        <tr>
          <td>{{firstInfo.key_1}}</td>
          <td>{{firstInfo.val_1}}</td>
          <td>{{firstInfo.key_2}}</td>
          <td>{{firstInfo.val_2}}</td>
          <td>合同编号</td>
          <td>{{contractCode}}</td>
        </tr>
        <tr>
          <td>{{secondInfo.key_1}}</td>
          <td>{{secondInfo.val_1}}</td>
          <td>{{secondInfo.key_2}}</td>
          <td>{{secondInfo.val_2}}</td>
          <td>签约地点</td>
          <td>
            <el-input v-if="!cid>0" type="text" size="mini" v-model="contractAddress"></el-input>
            <p v-else>{{contractAddress}}</p>
          </td>
        </tr>
        <tr>
          <td>{{thirdInfo.key_1}}</td>
          <td colspan="3">{{thirdInfo.val_1}}</td>
          <td>签订日期</td>
          <td>{{contractDate}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'companyInfo',
    props: {
      firstInfo: {
        type: Object,
        default() {
          return {};
        }
      },
      secondInfo: {
        type: Object,
        default() {
          return {};
        }
      },
      thirdInfo: {
        type: Object,
        default() {
          return {};
        }
      },
      contractAddress: {
        type: String,
        default() {
          return '';
        }
      },
      cid: 0
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>