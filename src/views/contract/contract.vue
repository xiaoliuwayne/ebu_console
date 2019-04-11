<template>
  <div>
    <div class="contract-title">
      <p class="company-name">广州衣布到位服饰有限公司</p>
      <p class="title-text">{{detail.contractName}}</p>
    </div>
    <div class="company-info">
      <div class="table-box">
        <table class="table table-responsive table-bordered">
          <tbody>
            <tr>
              <td>买方</td>
              <td>{{buyerInfo.name}}</td>
              <td>买方电话</td>
              <td>{{buyerInfo.tel}}</td>
              <td>合同编号</td>
              <td>{{detail.contractCode}}</td>
            </tr>
            <tr>
              <td>卖方</td>
              <td>{{seller.name}}</td>
              <td>卖方电话</td>
              <td>{{seller.tel}}</td>
              <td>签约地点</td>
              <td>
                <el-input v-if="cid==0" type="text" size="mini" v-model="detail.contractAddress"></el-input>
                <p v-else>{{detail.contractAddress}}</p>
              </td>
            </tr>
            <tr>
              <td>卖方地址</td>
              <td colspan="3">{{seller.address}}</td>
              <td>签订日期</td>
              <td>{{_contractDate}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <product-list :list="[]"></product-list>
    <contract-terms :data="data"></contract-terms>
  </div>
</template>

<script type="text/ecmascript-6">
import productList from "./components/productList";
import contractTerms from "./components/contractTerms";

export default {
  name: "",
  data() {
    return {
      oid: this.$route.query.pid || 0,
      cid: this.$route.query.cid || 0,
      isManager: this.$store.getters.isManager,
      buyer: {
        name: "广州衣布到位服饰有限公司",
        tel: "15967385404",
        address: ""
      },
      seller: {
        name: "",
        tel: "",
        address: ""
      },
      detail: {
        contractName: "面辅料采购合同",
        deliveryTime: "",
        contractTerms: "",
        contractCode: "",
        contractAddress: "",
        contractDate: ""
      }
    };
  },
  components: {
    productList,
    contractTerms
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>