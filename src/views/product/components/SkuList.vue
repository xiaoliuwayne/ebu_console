<template>
  <el-card class="product-sku-wrap">
    <div slot="header" class="clearfix">
      <span>色片信息</span>
    </div>
    <div class="sku-edit-wrap clearfix">
        <span class="sku-count">
          色片数量：<span>{{skuList.length}}</span>
        </span>
      <ul class="sku-edit-box">
        <li class="sku-edit-item">
          <el-input size="mini" type="number" v-model="skuEdit.count">
            <template slot="prepend">添加数量</template>
          </el-input>
        </li>
        <li class="sku-edit-item">
          <el-input size="mini" type="number" v-model="skuEdit.startCode">
            <template slot="prepend">起始编码</template>
          </el-input>
        </li>
        <li class="sku-edit-item">
          <el-button type="primary" size="mini" @click="handleSkusAdd" plain>确认添加</el-button>
        </li>
      </ul>
    </div>
    <table class="table table-bordered table-responsive sku-list-wrap">
      <thead>
      <tr>
        <th>色片编号</th>
        <th>色片图</th>
        <th>库存</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr class="sku-list-item" v-for="(sku, index) in skuList">
        <td>
          <el-input :class="sku.isEmpty ? 'empty-background':sku.isRepeat ? 'repeat-background' : ''" size="mini" v-model="sku.skuCode"></el-input>
        </td>
        <td>
          <eb-upload
            list-type="picture-card"
            :uploadIndex="index"
            :multiple="true"
            :file-list="sku.images"
            :show-file-list="true"
            :imgType="6"
            :limit="4"
            :on-preview="handlePictureCardPreview"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove">
          </eb-upload>
        </td>
        <td>
          <el-input size="mini" type="number" v-model="sku.stock"></el-input>
        </td>
        <td>
          <el-button size="mini" @click="handleSkuRemove(index)">删除色片</el-button>
        </td>
      </tr>
      </tbody>
    </table>
    <image-preview :preview="preview"></image-preview>
  </el-card>
</template>

<script type="text/ecmascript-6">
  import EbUpload from '@/components/EbUpload';
  import imagePreview from './imagePreview';

  export default {
    name: 'sku-list',
    data() {
      return {
        skuEdit: {
          count: undefined,
          startCode: undefined
        },
        preview: {
          dialogVisible: false,
          initialIndex: 0,
          list: []
        }
      };
    },
    props: {
      skuList: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      handleSkusAdd() {
        let liStartCode = this.getSkuStartCode();
        if (!liStartCode) {
          return false;
        } else {
          this.skuEdit.startCode = '';
        }
        if (this.skuEdit.count > 0) {
          let arr = [];
          for (let i = 0; i < this.skuEdit.count; i++) {
            arr.push({
              images: [],
              skuCode: liStartCode++,
              stock: 0,
              isEmpty: false,
              isRepeat: false
            });
          }
          this.skuList = this.skuList.concat(arr);
          this.skuEdit.count = '';
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
        } else {
          this.$message({
            message: '添加数量要大于0！',
            type: 'warning'
          });
        }
      },
      handleSkuChange(index) {
        if (this.skuList[index].skuId) {
          this.skuEdit.editSkuIds[this.skuList[index].skuId] = true;
        }
      },
      getSkuStartCode() {
        let liMax = 0;
        for (let i = 0; i < this.skuList.length; i++) {
          let liCode = parseInt(this.skuList[i].skuCode);
          if (liCode >= liMax) {
            liMax = liCode;
          }
        }
        let liStartCode = parseInt(this.skuEdit.startCode || 0);
        if (liStartCode) {
          if (liStartCode > liMax) {
            return liStartCode;
          } else {
            this.$message({
              message: `起始编码要大于${liMax}`,
              type: 'warning'
            });
            return false;
          }
        } else {
          return ++liMax;
        }
      },
      handleSkuRemove(index) {
        this.$confirm('确认删除该色片?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let sku = this.skuList.splice(index, 1)[0];
          sku.skuId && this.skuEdit.delSkus.push(sku.skuId);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleRemove(data, fileList, index) {
        for (let i = 0; i < this.skuList[index].images.length; i++) {
          if (data.uid === this.skuList[index].images[i].uid) {
            this.skuList[index].images.splice(i, 1);
            break;
          }
        }
      },
      handleUploadSuccess(res, file, fileList, index) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].status !== 'success') {
            return false;
          }
        }
        // this.handleSkuChange(index);
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response) {
            let isHas = false;
            for (let j = 0; j < this.skuList[index].images.length; j++) {
              if (this.skuList[index].images[j].uid === fileList[i].uid) {
                isHas = true;
                break;
              }
            }
            if (!isHas) {
              fileList[i].image = fileList[i].response.urls[0].image;
              fileList[i].imageId = fileList[i].response.urls[0].imageId;
              fileList[i].imgType = fileList[i].response.urls[0].imageType;
              delete fileList[i].response;
              this.skuList[index].images.push(fileList[i]);
            }
          }
        }
      },
      handlePictureCardPreview(data, fileList) {
        for (let i = 0; i < fileList.length; i++) {
          fileList[i].url = fileList[i].image;
          if (data.uid === fileList[i].uid) {
            this.preview.initialIndex = i;
          }
        }
        this.preview.list = fileList;
        this.preview.dialogVisible = true;
      }
    },
    components: {
      EbUpload,
      imagePreview
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .product-sku-wrap{
    .sku-edit-wrap{
      margin-bottom: 10px;
      .sku-count{
        line-height: 28px;
      }
      .sku-edit-box{
        float: right;
        .sku-edit-item{
          float:left;
          &:not(:last-child){
            margin-right: 10px;
          }
        }
      }
    }
    .sku-list-wrap{
      .sku-list-item{
        td:nth-child(2){
          width: 650px;
        }
      }
    }
  }
</style>