<template>
  <upload
    :action="uploadUrl"
    list-type="picture-card"
    :multiple="true"
    :file-list="fileList"
    :showList="showList"
    :limit="limit"
    :on-exceed="onExceed"
    :on-preview="handlePreview"
    :on-success="handleSuccess"
    :on-remove="handleRemove">
    <slot></slot>
    <i class="el-icon-plus"></i>
  </upload>
</template>

<script type="text/ecmascript-6">
  import upload from '@/components/upload';

  export default {
    name: 'eb-upload',
    data() {
      return {
        uploadUrl: location.origin + process.env.OPEN_API + '/upload?type=' + this.imgType
      };
    },
    props: {
      uploadIndex: undefined,
      onSuccess: {
        type: Function,
        default: undefined
      },
      onRemove: {
        type: Function,
        default: undefined
      },
      onPreview: {
        type: Function,
        default: undefined
      },
      onExceed: {
        type: Function,
        default: undefined
      },
      fileList: null,
      showList: {
        type: Array,
        default() {
          return [];
        }
      },
      imgType: 0,
      limit: undefined,
      accept: {
        type: String,
        default: '.jpg,.png,.svg,.jpeg,jepg2000,.bmp'
      }
    },
    created() {
    },
    methods: {
      handleSuccess() {
        let arg = [].slice.call(arguments);
        arg.push(this.uploadIndex);
        this.onSuccess && this.onSuccess.apply(this, arg);
      },
      handleRemove() {
        let arg = [].slice.call(arguments);
        arg.push(this.uploadIndex);
        this.onRemove && this.onRemove.apply(this, arg);
      },
      handlePreview() {
        let arg = [].slice.call(arguments);
        arg.push(this.fileList);
        this.onPreview && this.onPreview.apply(this, arg);
      }
    },
    components: {
      upload
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>