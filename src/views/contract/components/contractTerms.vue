<template>
  <div class="contract-terms">
    <p class="title-text">本合同除双方另有协议外，适用下列条款：</p>
    <table class="table table-bordered table-responsive">
      <tbody>
      <tr>
        <td>货期</td>
        <td>
          <div class="block">
            <el-date-picker
              v-model="deliveryTime"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择货期">
            </el-date-picker>
          </div>
        </td>
      </tr>
      <tr>
        <td>付款类型</td>
        <td>{{payStrategyName}}</td>
      </tr>
      <tr>
        <td>条款</td>
        <td>
          <el-input
            type="textarea"
            :autosize="{ minRows: 20}"
            placeholder="请输入合同条款内容"
            v-model="contactTerms"></el-input>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    props: {
      contactTerms: {
        type: String,
        default() {
          return '';
        }
      },
      deliveryTime: '',
      payStrategyName: {
        type: String,
        default() {
          return '';
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>