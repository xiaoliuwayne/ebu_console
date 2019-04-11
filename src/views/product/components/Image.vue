<template>
  <el-card class="product-img-wrap">
    <div slot="header" class="clearfix">
      <span>商品图片</span>
    </div>
    <table class="table table-bordered table-responsive">
      <tbody>
      <tr>
        <td>展示图</td>
        <td>
          <eb-upload class="product-image"
            list-type="picture-card"
            :multiple="true"
            :imgType="5"
            :file-list="spuImg"
            :on-preview="handlePictureCardPreview"
            :on-success="handleImgUploadSuccess"
            :on-remove="handleImgRemove">
          </eb-upload>
        </td>
        <td>质检图</td>
        <td>
          <eb-upload class="product-image"
            list-type="picture-card"
            :multiple="true"
            :imgType="7"
            :file-list="qcImg"
            :on-preview="handlePictureCardPreview"
            :on-success="handleImgUploadSuccess"
            :on-remove="handleImgRemove">
          </eb-upload>
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
    name: 'product-image',
    data() {
      return {
        preview: {
          dialogVisible: false,
          initialIndex: 0,
          list: []
        }
      };
    },
    props: {
      imageList: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    computed: {
      spuImg() {
        return this.imageList.filter(function(value) { return value.imgType === 5; });
      },
      qcImg() {
        return this.imageList.filter(function(value) { return value.imgType === 7; });
      }
    },
    methods: {
      handleImgUploadSuccess(res, file, fileList) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].status !== 'success') {
            return false;
          }
        }
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response) {
            let isHas = false;
            for (let j = 0; j < this.imageList.length; j++) {
              if (this.imageList[j].uid === fileList[i].uid) {
                isHas = true;
                break;
              }
            }
            if (!isHas) {
              fileList[i].image = fileList[i].response.urls[0].image;
              fileList[i].imageId = fileList[i].response.urls[0].imageId;
              fileList[i].imgType = fileList[i].response.urls[0].imageType;
              delete fileList[i].response;
              this.imageList.push(fileList[i]);
            }
          }
        }
      },
      handleImgRemove(data, fileList) {
        for (let i = 0; i < this.imageList.length; i++) {
          if (data.uid === this.imageList[i].uid) {
            this.imageList.splice(i, 1);
            break;
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
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>