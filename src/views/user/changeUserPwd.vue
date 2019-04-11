<template>
  <div class="change-pwd">
    <div class="form-title">
      <h2>密码修改</h2>
    </div>
    <el-form :model="form" status-icon ref="form" :rules="rules" label-width="100px" class="form">
      <el-form-item label="用户名:">
        <div>{{name}}</div>
      </el-form-item>
      <el-form-item label="新密码:" prop="newPass">
        <el-input type="password" v-model="form.newPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" prop="checkPass">
        <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import { modifyToUserPass } from '@/api/user';

  export default {
    name: '',
    data() {
      let validateNewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码不能少于6位数'));
        } else {
          if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          callback();
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        name: this.$route.query.name,
        userId: this.$route.query.id,
        form: {
          newPass: '',
          checkPass: ''
        },
        rules: {
          newPass: [
            { validator: validateNewPass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validateCheckPass, trigger: 'blur' }
          ]
        }
      };
    },
    created: function() {},
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyToUserPass({ ...this.form, toUserId: this.userId }).then(res => {
              this.$message({
                message: `用户 ${this.name} 密码修改成功`,
                type: 'success',
                onClose: () => {
                  this.$router.go(-1);
                  // this.$store.dispatch('FedLogOut').then(() => {
                  //   location.reload(); // 为了重新实例化vue-router对象 避免bug
                  // });
                }
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .change-pwd{
    .form-title{
      padding-left: 100px;
    }
    .form{
      width: 35%;
      margin-left: 100px;
    }
  }
</style>
