<template>
  <div class="content">
    <el-form :model="providerForm" status-icon :rules="rules" ref="providerForm" label-width="100px"
             class="providerForm">
      <el-form-item label="用户ID:">
        <span>{{userId}}</span>
      </el-form-item>
      <el-form-item label="注册时间:">
        <span>{{registerTime}}</span>
      </el-form-item>
      <el-form-item label="用户名:" prop="newUserName">
        <el-input v-model="providerForm.newUserName"></el-input>
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="providerForm.name"></el-input>
      </el-form-item>
      <el-form-item label="联系电话:" prop="tel">
        <el-input v-model="providerForm.tel"></el-input>
      </el-form-item>
      <el-form-item label="角色:">
        <el-radio-group v-model="roleName">
          <el-radio :label="52">客服</el-radio>
          <el-radio :label="51">采购员</el-radio>
          <el-radio :label="61">找布客服</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(providerForm)">修改</el-button>
        <el-button type="primary" @click="goChangePwd">修改密码</el-button>
        <el-button @click="backPage">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { changeUserMgr, option, getInfo } from '@/api/user';
  import { byTypeGetObj, cloneObj, parseTime } from '@/utils/index';
  import crypto from 'crypto';

  export default {
    data() {
      var newUserName = (rule, value, callback) => {
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
      return {
        roleName: '',
        roleNameOnly: '',
        userId: 0,
        registerTime: 0,
        providerForm: {
          name: '',
          userName: '',
          newUserName: '',
          tel: ''
        },
        rules: {
          newUserName: [
            { validator: newUserName, trigger: 'blur' }
          ],
          name: [
            { validator: name, trigger: 'blur' }
          ],
          tel: [
            { validator: tel, trigger: 'blur' }
          ]
        }
      };
    },
    created: function() {
      this.userId = this.$route.query.id;
      this.getUserDetail();
    },
    methods: {
      getUserDetail() {
        getInfo(this.userId).then(res => {
          this.providerForm.name = res.name;
          this.providerForm.userName = res.userName;
          this.providerForm.newUserName = res.userName;
          this.providerForm.tel = res.tel;
          this.registerTime = parseTime(res.registerTime);
          this.roleName = res.roleType;
          this.roleNameOnly = res.roleType;
        });
      },
      submitForm(formName) {
        let checkPass = crypto.createHash('md5').update(this.providerForm.checkPass).digest('hex').toUpperCase();
        if (this.roleName == '') {
          alert('请选择一个角色~');
          return;
        } else if (this.roleName != this.roleNameOnly) {
          alert('角色不能修改!');
          return;
        } else {
          this.$refs.providerForm.validate((valid) => {
            if (valid) {

              let form = cloneObj(formName);
              let regForm = {
//                                userName:form.userName,
                name: form.name,
                tel: form.tel,
                roleType: this.roleName
              };
              changeUserMgr({
                op: option.changeUserInfo,
                toUserId: this.userId,
                userInfo: JSON.stringify(regForm)
              }).then(res => {
                alert('修改信息成功!');
              });
              if (this.providerForm.newUserName != this.providerForm.userName) {
                changeUserMgr({
                  op: option.changeUserName,
                  toUserId: this.userId,
                  newUserName: this.providerForm.newUserName
                });
              }
            } else {
              alert('请填写完整修改信息~');
              return false;
            }
          });
        }
      },
      goChangePwd() {
        this.$router.push({ path: '/user/changeUserPwd', query: { id: this.userId, name: this.providerForm.newUserName }});
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
    width: 480px;
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
