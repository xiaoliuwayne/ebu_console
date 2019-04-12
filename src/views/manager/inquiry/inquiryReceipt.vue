<template>
    <el-container>
        <el-main>
            <h3>上传需求方在找的面料照片：</h3>
            <p style="padding-bottom: 15px">请上传要找的完整图案、细节图、尺寸参照图、正反面对比等</p>
            <eb-upload class="product-image"
                       list-type="picture-card"
                       :multiple="true"
                       :imgType="5"
                       :limit="5"
                       :file-list="imageList.filter(function(value){return value.imgType === 5})"
                       :on-preview="handlePictureCardPreview"
                       :on-success="handleImgUploadSuccess"
                       :on-remove="handleImgRemove">
            </eb-upload>
            <el-dialog :visible.sync="preview.dialogVisible" width="540px" :before-close="beforePreviewClose">
                <el-carousel indicator-position="outside" :autoplay="false" :initial-index="preview.initialIndex" height="500px">
                    <el-carousel-item v-for="item in preview.list" :key="item.uid">
                        <img :src="item.url" alt="" width="100%" height="100%">
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
            <h3>回样说明：</h3>
            <el-form ref="form" :model="form" label-width="110px" label-position="left" :rules="rules">
                <el-form-item label="色卡编号：" prop="colorCardCode" >
                    <el-input v-model="form.colorCardCode"></el-input>
                </el-form-item>
                <el-form-item label="单价(元/米)：" prop="unitPrice">
                    <el-input v-model="form.unitPrice" type="number"></el-input>
                    <!--<el-input v-model="form.unitPrice"></el-input>-->
                </el-form-item>
                <el-form-item label="品名：">
                    <el-input v-model="form.productName"></el-input>
                </el-form-item>
                <el-form-item label="成份：">
                    <el-input v-model="form.ingredients"></el-input>
                </el-form-item>
                <el-form-item label="幅宽：">
                    <el-input v-model="form.width"></el-input>
                </el-form-item>
                <el-form-item label="克重：">
                    <el-input v-model="form.weight"></el-input>
                </el-form-item>
                <el-form-item label="是否现货：">
                    <el-radio-group v-model="form.spotStatus">
                        <el-radio label='0'>现货</el-radio>
                        <el-radio label='1'>定制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="调样价格：">
                    <el-radio-group v-model="form.sampleStatus" style="min-width: 145px">
                        <el-radio label='0' style="">免费</el-radio>
                        <el-radio label='1'>收费</el-radio>
                    </el-radio-group>
                    <el-input v-model="form.samplePrice" style="width: 100px;float: right;margin-right: 80%" :disabled="flag" placeholder="元" type="number"></el-input>
                </el-form-item>
                <el-form-item label="面料说明：">
                    <el-input type="textarea" v-model="form.description" :autosize="{minRows: 5}"></el-input>
                </el-form-item>
            </el-form>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>我的联系方式：</span>
                </div>
                <div v-for="(item, index) in providerInfo" :key="index" class="text item" v-if="typeof(item.value)!=='object'">
                    {{item.label}}：{{item.value}}
                </div>
                <div v-else><span>{{item.label}}:</span>
                    <div v-for="obj in item.value"  :key="obj.groupId" v-show="obj.value" style="padding: 5px 0">
                        {{CLOTH_STYLE[obj.groupId]}}：{{obj.value}}
                    </div>
                </div>
            </el-card>
            <div style="padding: 10px 0;float: right">
                <el-button type="primary" @click="send">提交</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script>

import { insertInquiryReceipt } from '@/api/inquiry';
import { getInfo } from '@/api/user';
import EbUpload from '@/components/EbUpload';
// import { parseTime, cloneObj, byTypeGetObj, formatTime } from '@/utils';

export default {
  components: { EbUpload },
  data() {
    var checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('价格不能为空'));
      }
      setTimeout(() => {
        // if (!Number.isInteger(value)) {
        if (isNaN(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 0) {
            callback(new Error('必须大于0'));
          } else {
            callback();
          }
        }
      }, 500);
    };
    return {
      title: '给客户回样',
      CLOTH_STYLE: { 1: '针织', 2: '梭织' },
      flag: true,
      imageList: [],
      preview: {
        list: [],
        initialIndex: 0,
        dialogVisible: false
      },
      isGo: true,
      tmpProviderId: 0,
      tmpInquiryId: 0,
      tmpImgUrls: [], // 临时的图片url数组
      form: {
        userId: 0, // 供应商Id
        inquiryId: 0,
        imgUrlListValue: [],
        colorCardCode: '',
        unitPrice: 0.0,
        productName: '',
        ingredients: '',
        width: '',
        weight: '',
        spotStatus: '0', // 0现货
        sampleStatus: '0', // 0免费
        samplePrice: 0.0, // 样品费
        description: ''
      },
      rules: {
        colorCardCode: [{ required: true, message: '色卡编号不能为空' }],
        unitPrice: [{ required: true },
          { validator: checkPrice, trigger: 'blur' }]
      },
      providerInfo: []
    };
  },
  created() {
    // 保持id,以免刷新丢失
    // if (sessionStorage.getItem('providerId')) {
    //   this.tmpProviderId = sessionStorage.getItem('providerId');
    // }
    // if (sessionStorage.getItem('inquiryId')) {
    //   this.tmpInquiryId = sessionStorage.getItem('inquiryId');
    // }
    this.tmpProviderId = this.$route.query.providerId; // 来自路由传参
    this.tmpInquiryId = this.$route.query.inquiryId; // 来自路由传参
    // this.tmpProviderId = 29239; // 测试值
    // this.tmpInquiryId = 72; // 测试值
    // sessionStorage.setItem('providerId', this.tmpProviderId);
    // sessionStorage.setItem('inquiryId', this.tmpInquiryId);
    // 获取供应商详情
    getInfo(this.tmpProviderId).then(res => {
      if (res.regTel) { // 注册电话必须有
        this.setProviderInfo(res);
      }
    }).catch(() => {
      this.$message({
        type: 'error',
        message: '系统可能维护中，请联系管理员'
      });
    });
  },
  // 监听form对象sampleStatus属性的变化
  computed: {
    sampleStatus() {
      return this.form.sampleStatus;
    }
  },
  watch: {
    sampleStatus(newVal, oldVal) {
      if (newVal === '1') {
        this.flag = false;
      } else {
        this.flag = true;
      }
    }
  },
  methods: {
    send() {
      this.form.userId = this.tmpProviderId;
      this.form.inquiryId = this.tmpInquiryId;
      if (this.form.userId <= 0 || this.form.inquiryId <= 0) {
        this.$message({
          message: '存在userId 或 inquiryId 不大于0',
          type: 'warning'
        });
        this.isGo = false;
      } else { this.isGo = true; }
      if (this.form.colorCardCode === '' || this.form.unitPrice <= 0) {
        this.$message({
          message: '色卡编号或者单价输入不正确！',
          type: 'warning'
        });
        this.isGo = false;
      } else { this.isGo = true; }
      // 图片数组去重
      this.form.imgUrlListValue = this.uniqArray(this.tmpImgUrls);
      if (this.form.imgUrlListValue.length <= 0) {
        this.$message({
          message: '请上传图片',
          type: 'warning'
        });
        this.isGo = false;
      } else { this.isGo = true; }
      this.form.unitPrice = parseFloat(this.form.unitPrice);
      this.form.samplePrice = parseFloat(this.form.samplePrice);
      // 上传form表单
      let formdata = {};
      formdata['receipt'] = JSON.stringify(this.form);
      if (this.isGo) {
        insertInquiryReceipt(formdata).then(res => {
          if (res.body.exId) {
            this.$message({
              message: res.body.exDesc,
              type: 'warning'
            });
          }
          if (res.body.result === 0) {
            this.$message({
              message: '已提交成功，请等待客户确认并联系您！',
              type: 'success'
            });
            // 跳到列表页
            this.$router.push({ name: 'inquiryList' });
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '系统可能维护中，请联系管理员'
          });
        });
      }
    },
    dealKeyWords(keywords) {
      let zz = ''; // 1 针织
      let sz = ''; // 2 梭织
      keywords.forEach(item => {
        if (item.groupId === 1) {
          zz = zz + item.keyword + ' ';
        } else {
          sz = sz + item.keyword + ' ';
        }
      });
      return [{ 'groupId': 1, 'value': zz }, { 'groupId': 2, 'value': sz }];
    },
    setProviderInfo(data) {
      let keyWords = [];
      if (data.busiKeywords && data.busiKeywords.length > 0) {
        keyWords = this.dealKeyWords(data.busiKeywords);
      }
      this.providerInfo.push({ 'label': '供应商名称', 'value': data.name }); // 公司名
      this.providerInfo.push({ 'label': '联系人', 'value': data.linkman });
      this.providerInfo.push({ 'label': '移动电话', 'value': data.regTel });
      this.providerInfo.push({ 'label': '地址', 'value': data.address });
      this.providerInfo.push({ 'label': '主营业务', 'value': keyWords }); // 关键字
    },
    uniqArray(array) { // 数组去重
      let temp = [];
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) === -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    handleImgRemove(data, fileList) {
      this.tmpImgUrls = [];
      if (fileList.length > 0) {
        fileList.forEach(obj => {
          this.tmpImgUrls.push(obj.url);
        });
      }
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
    },
    handleImgUploadSuccess(res, file, fileList) {
      this.tmpImgUrls = [];
      if (fileList.length > 0) {
        fileList.forEach(obj => {
          this.tmpImgUrls.push(obj.url);
        });
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
            let image = fileList[i].response.urls ? fileList[i].response.urls[0] : null;
            if (!isHas && image) {
              fileList[i].image = image.image;
              fileList[i].imageId = image.imageId;
              fileList[i].imgType = image.imageType;
              delete fileList[i].response;
              this.imageList.push(fileList[i]);
            }
          }
        }
      }
    },
    beforePreviewClose(done) {
      this.preview.list = []; // 暂时解决图片预览initialIndex改变，activeIndex不变的问题
      done();
    }
  }
};
</script>
<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 100%;
    }
</style>
