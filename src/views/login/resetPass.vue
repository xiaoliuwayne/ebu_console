<template>
    <div class="content">
        <el-form :model="providerForm" status-icon :rules="rules" ref="providerForm" label-width="100px" class="providerForm">
            <el-form-item label="用户名:" prop="providerName">
                <span>{{providerForm.tel}}</span>
            </el-form-item>
            <el-form-item label="新密码:" prop="pass">
                <el-input type="password" v-model="providerForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass">
                <el-input type="password" v-model="providerForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="resetPass(providerForm)">重置密码</el-button>
                <el-button @click="backLogin">取消</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import { findPwd,findPwdType } from '@/api/register';
    import crypto from 'crypto';

    export default{
        data(){
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
                smsCode:'',
                providerForm: {
                    tel:'',
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    pass: [
                        { validator: pwd, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: checkPwd, trigger: 'blur' }
                    ]
                }
            }
        },
        created:function () {
          this.providerForm.tel = this.$route.query.tel;
          this.smsCode = this.$route.query.smsCode;
        },
        methods:{
            resetPass(providerForm){
                this.$refs.providerForm.validate((valid) => {
                    if (valid){
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

<style scoped>
    .content{
        margin: 60px auto;
        width: 350px;
        position: relative;
    }

    .checkCode {
        width: 160px;
    }

    .el-button {
        width: 117px;
    }

    .providerForm{
        position: absolute;
        top: 100px;
    }
</style>