<template>
  <el-card class="actions-wrap">
    <ul class="clearfix">
      <li v-show="detail.productId > 0">
        <el-button size="mini" type="button" @click="dialogVisible = true" plain>打印批量图片二维码</el-button>
        <el-button size="mini" type="button" @click="printSpuLabel" plain>打印色卡标签</el-button>
      </li>
      <li>
        <el-button size="mini" type="primary" :disabled="btnDisabled" @click="_saveProduct(false)" plain>保存</el-button>
        <el-button size="mini" type="primary" :disabled="btnDisabled" @click="_saveProduct(true)" plain>保存并新建一条</el-button>
      </li>
    </ul>
    <el-dialog title="二维码打印类型" :visible.sync="dialogVisible" width="540px">
      <template v-for="type in skuTypes">
        <el-radio v-model="qrCodeType" :label="type.key">{{type.name}}</el-radio>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini" plain>取 消</el-button>
        <el-button type="primary" @click="printSpuQrCode(qrCodeType, $event)" size="mini" plain>确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script type="text/ecmascript-6">
  import { addProduct, modifyProduct, modifyProductSku } from '@/api/product';
  import clipboard from '@/utils/clipboard';

  export default {
    name: 'actions-wrap',
    data() {
      return {
        qrCodeType: '',
        dialogVisible: false,
        btnDisabled: false
      };
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {};
        }
      },
      skuTypes: {
        type: Array,
        default() {
          return [];
        }
      },
      saveProduct: {
        type: Function,
        default() {
          return function() {};
        }
      }
    },
    methods: {
      printSpuQrCode(type, event) {
        let lo_detail = this.detail;
        let data = {
          Business: lo_detail.providerName,
          ColorId: lo_detail.productCode,
          Ebu: 'Ebu',
          RandomStr: Math.random(),
          ebuSpuInfo: {
            SkuType: type,
            Yid: lo_detail.productId
          }
        };
        clipboard(JSON.stringify(data), event, () => {
          this.qrCodeEdit.dialogVisible = false;
          this.$message({
            type: 'success',
            message: '打印成功'
          });
        }, () => {
          this.$message({
            type: 'error',
            message: '打印失败'
          });
        });
      },
      printSpuLabel() {
        let lo_detail = this.detail;
        let arr = lo_detail.ingredientList || [];
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
          newArr.push({ Name: arr[i].name.split('/')[0], Percent: arr[i].value });
        }
        let data = {
          Ebu: 'Ebu',
          RandomStr: Math.random(),
          SpuId: lo_detail.productId,
          Component: newArr, // 成分
          Width: lo_detail.width + 'cm',
          Weight: lo_detail.weight + 'g/m²',
          Supplier: lo_detail.providerId,
          ProductType: lo_detail.productType,
          CodeType: 0 // 二维码类型
        };
        clipboard(JSON.stringify(data), event, () => {
          this.$message({
            type: 'success',
            message: '打印成功'
          });
        }, () => {
          this.$message({
            type: 'error',
            message: '打印失败'
          });
        });
      },
      _saveProduct(params) {
        this.btnDisabled = true;
        setTimeout(() => {
          this.btnDisabled = false;
        }, 1000);
        this.saveProduct(params);
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>