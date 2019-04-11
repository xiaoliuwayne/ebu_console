<template>
  <el-dialog :visible.sync="preview.dialogVisible" width="540px" :before-close="beforePreviewClose">
    <el-carousel indicator-position="outside" :autoplay="false" :initial-index="preview.initialIndex" height="500px">
      <el-carousel-item v-for="item in preview.list" :key="item.uid">
        <img :src="item.url" alt="" width="100%" height="100%">
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    props: {
      preview: {
        type: Object,
        default() {
          return {
            dialogVisible: false,
            initialIndex: 0,
            list: []
          };
        }
      }
    },
    methods: {
      beforePreviewClose(done) {
        this.preview.list = []; // 暂时解决图片预览initialIndex改变，activeIndex不变的问题
        done();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>