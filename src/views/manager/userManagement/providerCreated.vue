<template>
  <div class="content">
    <el-form :model="providerForm" status-icon :rules="rules" ref="providerForm" label-width="100px"
             class="providerForm">
      <el-form-item label="用户名:" prop="userName">
        <el-input v-model="providerForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="注册手机号:" prop="regTel">
        <el-input v-model="providerForm.regTel"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <span>默认"123456"</span>
      </el-form-item>
      <el-form-item label="公司名称:" prop="name">
        <el-input v-model="providerForm.name"></el-input>
      </el-form-item>
      <el-form-item label="地址:" prop="address">
        <el-input v-model="providerForm.address"></el-input>
      </el-form-item>
      <el-form-item label="联系人:" prop="linkman">
        <el-input v-model="providerForm.linkman"></el-input>
      </el-form-item>
      <el-form-item label="联系电话:" prop="tel">
        <el-input v-model="providerForm.tel"></el-input>
      </el-form-item>
      <el-form-item label="经营品类:">
        <el-checkbox-group v-model="majorList">
          <el-checkbox v-for="type in types" :label="type.catId" :key="type.catId">{{type.major}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="现货结算等级:">
        <el-radio-group v-model="providerForm.incomeLevel" style="padding-top: 13px;">
          <div style="margin-bottom: 15px;">
            <el-radio :label="2">现金结算</el-radio>
          </div>
          <div style="margin-bottom: 15px;">
            <el-radio :label="5">7天</el-radio>
            <el-radio :label="6">15天</el-radio>
            <el-radio :label="1">30天</el-radio>
            <el-radio :label="7">60天</el-radio>
          </div>
          <div style="margin-bottom: 15px;">
            <el-radio :label="3">3-6-1</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司工商执照:" prop="busiLicenseImg">
        <el-upload
          class="avatar-uploader"
          :action="uploadAvatarApi"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          <img v-if="busiLicenseImg" :src="busiLicenseImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(providerForm)">完成注册</el-button>
        <el-button @click="backPage">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { changeUserMgr, option } from '@/api/user';
  import { byTypeGetObj, cloneObj } from '@/utils/index';
  import { OPEN_API } from '../../../../config/prod.env';

  const oploadApi = OPEN_API.slice(1, -1);

  export default {
    data() {
      var userName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('登录用户名不能为空!'));
        } else if (value.length < 3) {
          return callback(new Error('不能少于三位字符~'));
        } else if (value.match(/[^\x00-\x80]/g)) {
          return callback(new Error('请输入英文或数字作为登录用户名~'));
        } else {
          callback();
        }
      }
      var regTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('注册手机号不能为空!'));
        } else if (value.length != 11 || value.indexOf('1') != 0) {
          return callback(new Error('请输入正确的手机号码~'));
        } else {
          callback();
        }
      }
      var name = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('公司名称不能为空!'));
        } else {
          callback();
        }
      }
      var address = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('地址不能为空!'));
        } else {
          callback();
        }
      }
      var linkman = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('联系人不能为空!'));
        } else {
          callback();
        }
      };
      var tel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('联系电话不能为空!'));
        } else {
          callback();
        }
      };
      return {
        uploadAvatarApi: oploadApi + '/upload?type=0',
        types: [{ catId: 31, major: '面料' }, { catId: 32, major: '辅料' }],
        userId: this.$route.query.userId || this.$store.getters.userId,
        majorList: [],
        busiLicenseImg: '',
        incomeLevel: 2,
        providerForm: {
          address: '',
          name: '',
          userName: '',
          linkman: '',
          tel: '',
          regTel: '',
          password: 'E10ADC3949BA59ABBE56E057F20F883E'
        },
        rules: {
          userName: [
            { validator: userName, trigger: 'blur' }
          ],
          regTel: [
            { validator: regTel, trigger: 'blur' }
          ],
          name: [
            { validator: name, trigger: 'blur' }
          ],
          tel: [
            { validator: tel, trigger: 'blur' }
          ],
          address: [
            { validator: address, trigger: 'blur' }
          ],
          linkman: [
            { validator: linkman, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        if (res.result === '0') {
          this.busiLicenseImg = res.urls[0].image;
          this.$message({ message: '上传成功', type: 'success' });
        }
      },
      submitForm(formName) {
        if (this.majorList.length == 0) {
          alert('请选择一种经营品类~');
          return;
        } else if (!this.incomeLevel) {
          alert('请选择一种结算等级~');
          return;
        } else {
          this.$refs.providerForm.validate((valid) => {
            if (valid) {
              let roleType = byTypeGetObj('PROVIDER', this.GLOBAL.userRoleType, 's').t;
              let form = cloneObj(formName);
              let majorList = this.majorList.map(item => {
                return { catId: item }
              });
              changeUserMgr({
                op: option.userReg,
                userInfo: JSON.stringify(form),
                roleInfo: JSON.stringify({
                  roleType: roleType,
                  appName: 3
                }),
                detailInfo: JSON.stringify({
                  incomeLevel: form.incomeLevel,
                  majorList: majorList,
                  busiLicenseImg: this.busiLicenseImg
                })
              }).then(res => {
                alert('恭喜您,注册成功!');
                this.$router.go(-1);
              });
            } else {
              alert('请填写完整注册信息~');
              return false;
            }
          });
        }
      },
      backPage() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>
  .content {
    margin: 50px 200px;
    width: 400px;
  }

  .el-button {
    width: 117px;
  }

  .avatar-uploader {
    width: 350px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 350px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 350px;
    height: 178px;
    display: block;
  }
</style>
