<template>
  <el-card class="product-label">
    <div slot="header" class="clearfix">
      <span>商品标签</span>
    </div>
    <div>
      <table class="table table-bordered table-responsive">
        <tbody>
          <tr v-for="(item,index) in list" :key="index">
            <td>{{item.name}}</td>
            <td>
              <template v-if="(item.type === 'dialog')">
                <span>{{item.value}}</span>
                <el-button type="primary" size="mini" @click="item.visible = true" plain>选择{{item.name}}</el-button>
                <el-dialog :title="item.name" :visible.sync="item.visible">
                  <template v-for="attr in item.data">
                    <el-checkbox v-if="item.isMult" v-model="item.checked" :label="attr.name">{{attr.name}}</el-checkbox>
                    <el-radio v-else v-model="item.radio" :label="attr.name">{{attr.name}}</el-radio>
                  </template>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="item.visible = false" size="mini" plain>取消</el-button>
                    <el-button type="primary" @click="handleDialogConfirm(item)" size="mini" plain>确 定</el-button>
                  </div>
                </el-dialog>
              </template>
              <template v-else-if="item.type === 'radio'">
                <el-radio v-for="radio in item.data" :key="radio.id" v-model="item.value" :label="radio.name">{{radio.name}}</el-radio>
              </template>
              <template v-else-if="item.type === 'input'">
                <el-input type="text" size="mini" v-model="item.value"></el-input>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'product-label',
    props: {
      list: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      handleDialogConfirm(prop) {
        if (prop.isMult) {
          prop.value = prop.checked.join('，');
        } else {
          prop.value = prop.radio;
        }
        prop.visible = false;
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .product-label{
    .table{
      tbody td:first-child{
        width: 100px;
      }
      tbody{
        .el-input--mini{
          width: 45%;
        }
      }
    }
  }
</style>