<template>
    <div class="product-table">
        <table class="table table-bordered table-responsive left-Table" v-if="s_showByRow" >
            <tbody>
            <tr v-for="index in rowCount" >
                <td class="column">{{tableData[index*2-2].key}}</td>
                <td>{{tableData[index*2-2].value}}</td>
                <td class="column">{{tableData[index*2-1] !== undefined ? tableData[index*2-1].key : ''}}</td>
                <td>{{tableData[index*2-1] !== undefined ? tableData[index*2-1].value : ''}}</td>
            </tr>
            </tbody>
        </table>
        <table class="table table-bordered table-responsive left-Table" v-else>
            <tbody>
            <tr v-for="index in rowCount">
                <td class="column">{{tableData[index-1].key}}</td>
                <td>{{tableData[index-1].value}}</td>
                <td class="column">{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].key : ''}}</td>
                <td>{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].value : ''}}</td>
            </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
  export default {
    name: "productTable",
    data() {
      return {
        s_showByRow: true,
      };
    },
    props: ['tableData', 'showByRow'],
    computed: {
      rowCount: function() {
        return Math.ceil(this.tableData.length/2);
      }
    },
    created() {
      if(this.showByRow !== undefined){
        this.s_showByRow = this.showByRow;
      }
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss">
    .product-table{
        .table{
            tbody tr{
                td:nth-child(2n-1){
                     width: 15%;
                     text-align: center;
                }
                td:nth-child(2n){
                    width: 35%;
                }
            }
        }
    }
</style>