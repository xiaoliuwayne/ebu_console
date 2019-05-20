<template>
  <div class="content">
    <el-form :model="providerForm" status-icon :rules="rules" ref="providerForm" label-width="100px"
             class="providerForm">
      <el-form-item label="用户名:" prop="userName">
        <el-input v-model="providerForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="providerForm.name"></el-input>
      </el-form-item>
      <el-form-item label="联系电话:" prop="tel">
        <el-input v-model="providerForm.tel"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="pass">
        <el-input type="password" v-model="providerForm.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" prop="checkPass">
        <el-input type="password" v-model="providerForm.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色:">
        <el-radio-group v-model="roleName">
          <el-radio :label="52">卖布客服</el-radio>
          <el-radio :label="51">采购员</el-radio>
          <el-radio :label="61">找布客服</el-radio>
          <el-radio :label="21">商品录入员</el-radio>
          <el-radio :label="18">财务</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(providerForm)">完成注册</el-button>
        <el-button @click="backPage">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { changeUserMgr, option, getInfo } from '@/api/user';
  import { cloneObj, parseTime } from '@/utils/index';
  import crypto from 'crypto';

  export default {
    data() {
      var userName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空!'));
        } else if (value.length < 5) {
          return callback(new Error('不能少于五位字符~'));
        } else if (value.match(/[^\x00-\x80]/g)) {
          return callback(new Error('请输入英文或数字作为用户名~'));
        } else {
          callback();
        }
      };
      var name = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('姓名不能为空!'));
        } else {
          callback();
        }
      };
      var tel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('注册手机号不能为空!'));
        } else if (value.length != 11 || value.indexOf('1') != 0) {
          return callback(new Error('请输入正确的手机号码~'));
        } else {
          callback();
        }
      };
      var pass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空!'));
        } else {
          if (this.providerForm.checkPass !== '') {
            this.$refs.providerForm.validateField('checkPass');
          }
          callback();
        }
      };
      var checkPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.providerForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        roleName: '',
        providerForm: {
          name: '',
          userName: '',
          tel: '',
          pass: '',
          checkPass: ''
        },
        rules: {
          userName: [
            { validator: userName, trigger: 'blur' }
          ],
          name: [
            { validator: name, trigger: 'blur' }
          ],
          tel: [
            { validator: tel, trigger: 'blur' }
          ],
          pass: [
            { validator: pass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: checkPass, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        let checkPass = crypto.createHash('md5').update(this.providerForm.checkPass).digest('hex').toUpperCase();
        if (this.roleName == '') {
          alert('请选择一个角色~');
          return;
        } else {
          this.$refs.providerForm.validate((valid) => {
            if (valid) {
              let form = cloneObj(formName);
              let regForm = {
                password: checkPass,
                userName: form.userName,
                name: form.name,
                tel: form.tel
              };
              changeUserMgr({
                op: option.userReg,
                userInfo: JSON.stringify(regForm),
                roleInfo: JSON.stringify({
                  roleType: this.roleName,
                  appName: 3
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
