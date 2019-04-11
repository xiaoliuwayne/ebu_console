<template>
  <div class="login-container">
    <div class="company">
      <div class="companyLogo">
        <img src="../../assets/ebLogo.png" alt="">
      </div>
      <div class="companyWeb">
        <a href="http://www.ebdaowei.com">官网</a>
        <span></span>
        <a href="http://ebudaowei.cn" style="margin-left: 36px;">APP下载</a>
      </div>
    </div>
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <div class="title">
        <span style="margin-left: 20px;">欢迎登录到衣布到位！</span>
      </div>
      <el-form-item prop="username">
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="登录用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon style="color: #B4B4B4" icon-class="eye"/></span>
      </el-form-item>
      <el-form-item prop="imgCode">
        <el-input class="in-img-code" name="imgCode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.imgCode" autoComplete="on" placeholder="验证码"></el-input>
        <img class="img-code" :src="codeImgUrl" alt="" @click="setImgCodeUrl">
      </el-form-item>
      <div class="forgetPass">
        <div class="forgerLeft"></div>
        <div class="forgetRight">
          <router-link :to="{path:'/forgetPass'}">忘记密码?</router-link>
        </div>
      </div>
      <div class="login-btn">
        <div style="position: relative">
          <el-button class="btn-left" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
          <el-button class="btn-right" @click="handleRegister">
            供应商注册
          </el-button>
        </div>
      </div>
      <div class="footer">
        <p>广州衣布到位信息科技有限公司</p>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate';

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    const validateImgCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('验证码输入不正确'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        type: 1,
        roleType: 22,
        username: '',
        password: '',
        imgCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        imgCode: [{ required: true, trigger: 'blur', validator: validateImgCode }]
      },
      loading: false,
      pwdType: 'password',
      codeImgUrl: ''
    };
  },
  created() {
    this.setImgCodeUrl();
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = '';
      } else {
        this.pwdType = 'password';
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false;
            this.$router.push({ path: '/' });
          }).catch(() => {
            this.loading = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleRegister(){
      this.$router.push({ path: '/register' });
    },
    setImgCodeUrl() {
      this.codeImgUrl = location.origin + process.env.USER_API + '/imgCode?' + Math.random();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#000;

  .login-container {
    background: url(bgImg.png) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    font-family: PingFangSC-Regular;
    @include relative;
    @-webkit-keyframes setbackgroundcolor {
      to {
        background: transparent;
      }
    }
    input:-webkit-autofill {
      -webkit-animation-name: setbackgroundcolor;
      -webkit-animation-fill-mode: forwards;
    }
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 0;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .title {
      margin: 0 auto 40px auto;
      text-align: center;
      font-size: 24px;
      color: #282828;
      letter-spacing: 4px;
      position: relative;
    }
    .title span:before{
      content: '';
      position: absolute;
      top: 52%;
      left: 0;
      background: #B4B4B4;
      width: 32px;
      height: 2px;
    }
    .login-form {
      left: 0;
      right: 0;
      width: 800px;
      padding: 120px 215px 0;
      margin: 0 auto 120px;
      background: rgba(255,255,255,0.9);
      box-shadow: 0 8px 16px 0 rgba(180,180,180,0.47);
      border-radius: 18px;
    }
    .el-form-item {
      border-bottom: 1px solid #EFEFEF;
      margin-bottom: 10px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .el-input.in-img-code{
      width:55%;
    }
    .img-code{
      width:100px;
      height:40px;
      position: absolute;
      top:50%;
      right: 0;
      margin-top:-20px;
    }
    .company{
      width: 800px;
      margin: 0 auto;
      overflow: hidden;
      padding: 80px 0 20px;
    }
    .company .companyLogo{
      display: inline-block;
      margin-left: 30px;
    }
    .company .companyWeb{
      font-size: 16px;
      color: #F1F1F1;
      display: inline-block;
      margin-left: 430px;
      position: relative;
    }
    .companyWeb span:before{
      content: '';
      position: absolute;
      top: 0;
      left: 40%;
      background: #F1F1F1;
      width: 2px;
      height: 16px;
    }
    .forgetPass{
      height: 100%;
      margin-bottom: 50px;
    }
    .forgetLeft{
      float: left;
    }
    .forgetRight{
      float: right;
      font-size: 12px;
      color: #B4B4B4;
    }
    .forgetRight:hover{
      color: #409EFF;
    }
    .login-btn{
      opacity: 1;
      text-align: center;
      background: #FFF;
    }
    .login-btn .el-button{
      color: white;
    }
    .login-btn .btn-left{
      width: 60%;
      background: #282828;
      border-radius: 100px;
      position: absolute;
      left: 0;
      z-index: 9;
    }
    .login-btn .btn-right{
      width: 60%;
      border-radius: 100px;
      position: absolute;
      left: 40%;
      color: #000 !important;
    }
    .footer{
      font-size: 12px;
      color: #B4B4B4;
      letter-spacing: 2px;
      text-align: center;
      padding: 200px 0 50px;
    }
  }
</style>
