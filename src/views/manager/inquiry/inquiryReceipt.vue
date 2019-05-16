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
                <el-form-item label="品名：">
                    <el-input v-model="form.productName"></el-input>
                </el-form-item>
                <el-form-item label="成份：">
                    <el-input v-model="form.ingredients"></el-input>
                </el-form-item>
                <el-form-item label="幅宽：">
                    <el-input v-model="form.width" type="number">
                        <template slot="append">CM</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="克重：">
                    <el-input v-model="form.weight" type="number">
                        <template slot="append">克/CM</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="剪版价：" prop="samplePrice">
                    <el-input v-model="form.samplePrice" type="number" style="float: left;width: 60%"> <!--86.2-->
                    </el-input>
                    <el-select v-model="form.cuttingUnit">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="大货价：" prop="unitPrice">
                    <el-input v-model="form.unitPrice" type="number" style="float: left;width: 60%"></el-input>
                    <el-select v-model="form.largeUnit">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="免费色卡：">
                    <el-radio-group v-model="form.colorCard" style="min-width: 145px">
                        <el-radio :label='1' style="">提供</el-radio>
                        <el-radio :label='2'>不提供</el-radio>
                    </el-radio-group>
                  </el-form-item>
                <el-form-item label="是否现货：">
                    <el-radio-group v-model="form.spotStatus">
                        <el-radio :label='0'>现货</el-radio>
                        <el-radio :label='1'>定制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="库存：" prop="stock">
                    <el-input v-model="form.stock" type="number">
                        <template slot="append">{{unitName[form.largeUnit]}}</template>
                    </el-input>
                    <!--<el-input v-model="form.unitPrice"></el-input>-->
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
import global from '@/global/global';
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
    var checkNum = (rule, value, callback) => {
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
      unitName: global.unitName,
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
      // tmpImgUrls: [], // 临时的图片url数组
      form: {
        userId: 0, // 供应商Id
        inquiryId: 0,
        imgUrlListValue: [],
        colorCardCode: '',
        unitPrice: null,
        productName: '',
        ingredients: '',
        width: '',
        weight: '',
        spotStatus: 0, // 0现货
        sampleStatus: null, // 0免费
        samplePrice: null, // 样品费
        description: '',
        colorCard: 1,
        stock: null,
        cuttingUnit: 1,
        largeUnit: 1
      },
      rules: {
        colorCardCode: [{ required: true, message: '色卡编号不能为空' }],
        samplePrice: [{ required: true }, { validator: checkPrice, trigger: 'blur' }],
        unitPrice: [{ validator: checkNum, trigger: 'blur' }],
        stock: [{ validator: checkNum, trigger: 'blur' }]
      },
      providerInfo: [],
      options: [{
        value: 1,
        label: '元/米'
      }, {
        value: 2,
        label: '元/公斤'
      }, {
        value: 3,
        label: '元/码'
      }],
      value: 1
    };
  },
  created() {
    this.tmpProviderId = this.$route.query.providerId; // 来自路由传参
    this.tmpInquiryId = this.$route.query.inquiryId; // 来自路由传参
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
      if (this.form.colorCardCode === '' || this.form.samplePrice <= 0) {
        this.$message({
          message: '请正确输入色卡编号或者单价！',
          type: 'warning'
        });
        this.isGo = false;
      } else { this.isGo = true; }
      // 图片url数组
      this.form.imgUrlListValue = [];
      this.imageList.forEach(obj => {
        this.form.imgUrlListValue.push(obj.image);
      });
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
      // this.isGo = false;
      if (this.isGo) {
        insertInquiryReceipt(formdata).then(res => {
          console.log('send=>res', res);
          if (res.exId) {
            this.$message({
              message: res.exDesc,
              type: 'warning'
            });
          }
          if (res.result === 0) {
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
      // console.log('success=>this.imageList', this.imageList);
    },
    handleImgRemove(data, fileList) {
      for (let i = 0; i < this.imageList.length; i++) {
        if (data.uid === this.imageList[i].uid) {
          this.imageList.splice(i, 1);
          break;
        }
      }
      // console.log('remove=>this.imageList', this.imageList);
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
