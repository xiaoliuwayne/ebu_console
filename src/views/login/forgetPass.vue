<template>
    <div class="forget-content">
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
        <el-form :model="providerForm" status-icon :rules="rules" ref="providerForm" label-width="100px" class="providerForm">
            <div class="resetPass">
                <p>重置密码</p>
            </div>
            <el-form-item prop="providerPhone">
                <el-input v-model="providerForm.providerPhone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="checkCode">
                <el-input v-model="providerForm.checkCode" class="checkCode" placeholder="验证码"></el-input>
                <el-button v-show="show" @click="sendCheckCode" type="text" size="small" class="checkBtn" round>发送验证码</el-button>
                <span v-show="!show" class="count">{{count}}s后重新发送</span>
            </el-form-item>
            <el-form-item prop="pass">
                <el-input type="password" v-model="providerForm.pass" auto-complete="off" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="providerForm.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
            </el-form-item>
            <div class="register-btn">
                <div style="position: relative">
                    <el-button class="btn-left" @click="resetPass(providerForm)">重置密码</el-button>
                    <el-button class="btn-right" @click="backLogin">取消</el-button>
                </div>
            </div>
            <div class="footer">
                <p>广州衣布到位信息科技有限公司</p>
            </div>
            <!--<el-form-item>-->
                <!--<el-button type="primary" @click="resetPass(providerForm)">重置密码</el-button>-->
                <!--<el-button @click="backLogin">取消</el-button>-->
            <!--</el-form-item>-->
        </el-form>
    </div>

</template>

<script>
    import { smsSend , smsParam , findPwd , findPwdType } from '@/api/register';
    import crypto from 'crypto';

    export default{
        data(){
            var providerPhone = (rule, value, callback) => {
                if (!value){
                    return callback(new Error('注册手机号不能为空!'));
                } else if (value.length!=11||value.indexOf('1') != 0){
                    return callback(new Error('请输入正确的手机号码~'));
                }
                else{
                    callback();
                }
            }
            var pwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.providerForm.checkPass !== '') {
                        this.$refs.providerForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var checkPwd = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.providerForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                show: true,
                count:'',
                hasCheckCode: false,
                providerForm: {
                    providerPhone:'',
                    checkCode: '',
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    providerPhone:[
                        { validator: providerPhone, trigger: 'blur'}
                    ],
                    pass: [
                        { validator: pwd, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: checkPwd, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            sendCheckCode(){
                if (this.providerForm.providerPhone===''){
                    this.$message.error("请输入注册手机号~");
                    return;
                }else {
                    smsSend({tel:this.providerForm.providerPhone,op:smsParam.back}).then(res => {
                        if(res.desc === 'ok'){
                            this.hasCheckCode = true;
                            const TIME_COUNT = 30;
                            if (!this.timer) {
                                this.count = TIME_COUNT;
                                this.show = false;
                                this.timer = setInterval(() => {
                                    if (this.count > 0 && this.count <= TIME_COUNT) {
                                        this.count--;
                                    } else {
                                        this.show = true;
                                        clearInterval(this.timer);
                                        this.timer = null;
                                    }
                                }, 1000);
                            }
                        }
                    });
                }
            },
            resetPass(providerForm){
                this.$refs.providerForm.validate((valid) => {
                    if (valid){
                        console.log(providerForm);
                        let pwd = crypto.createHash('md5').update(providerForm.checkPass).digest('hex').toUpperCase();
                        findPwd({
                            tel:providerForm.tel,
                            smsCode:this.smsCode,
                            newPwd:pwd,
                            updatePwdType:findPwdType.smsCode
                        }).then(res => {
                            this.$alert(providerForm.tel+' 恭喜您! 重置密码成功', {
                                confirmButtonText: '去登陆',
                                callback: action => {
                                    this.$router.push({path:'/login'});
                                }
                            });
                        });
                    } else {
                        this.$message.error("请输入密码~");
                        return false;
                    }
                });
            },
            backLogin(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "src/styles/mixin.scss";
    $bg:#2d3a4b;
    $dark_gray:#889aa4;
    $light_gray:#000;

    .forget-content{
        background: url(bgImg.png) no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        font-family: PingFangSC-Regular;
        @include relative;
        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px white inset !important;
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
            width: 100%;
        }
        .company {
            width: 800px;
            margin: 0 auto;
            overflow: hidden;
            padding: 80px 0 20px;
        }
        .company .companyLogo {
            display: inline-block;
            margin-left: 30px;
        }
        .company .companyWeb {
            font-size: 16px;
            color: #F1F1F1;
            display: inline-block;
            margin-left: 430px;
            position: relative;
        }
        .companyWeb span:before {
            content: '';
            position: absolute;
            top: 0;
            left: 40%;
            background: #F1F1F1;
            width: 2px;
            height: 16px;
        }
        .providerForm{
            left: 0;
            right: 0;
            width: 800px;
            padding: 80px 196px 0;
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
        .el-form-item .el-form-item__content{
            margin: 0!important;
        }
        .resetPass{
            font-size: 24px;
            color: #282828;
            letter-spacing: 4px;
        }
        .checkCode {
            width: 300px;
        }
        .checkBtn{
            width: 80px;
            padding: 9px 10px;
            font-size: 12px;
            color: #282828;
        }
        .register-btn{
            text-align: center;
            background: #FFF;
            margin-top: 30px;
        }
        .register-btn .el-button{
            color: white;
        }
        .register-btn .btn-left{
            width: 60%;
            background: #282828;
            border-radius: 100px;
            position: absolute;
            left: 0;
            z-index: 9;
        }
        .register-btn .btn-right{
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