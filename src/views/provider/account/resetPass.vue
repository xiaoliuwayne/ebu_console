<template>
    <div class="content">
        <el-form :model="providerForm" status-icon :rules="rules" ref="providerForm" label-width="100px" class="providerForm">
            <el-form-item label="用户名:" prop="providerName">
                <span>{{userName}}</span>
            </el-form-item>
            <el-form-item label="旧密码:" prop="oldPwd">
                <el-input type="password" v-model="providerForm.oldPwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="newPwd">
                <el-input type="password" v-model="providerForm.newPwd" auto-complete="off"></el-input>
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
    import { resetUserPass } from '@/api/user';
    import crypto from 'crypto';
    export default{
        data(){
            var oldPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入原始密码~'));
                } else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码~'));
                } else {
                    if (this.providerForm.checkPass !== '') {
                        this.$refs.providerForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码~'));
                } else if (value !== this.providerForm.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                userName:this.$route.query.userName,
                providerForm: {
                    oldPwd: '',
                    newPwd: '',
                    checkPass: ''
                },
                rules: {
                    oldPwd: [
                        { validator: oldPass, trigger: 'blur' }
                    ],
                    newPwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            resetPass(providerForm){
                let oldPwd = crypto.createHash('md5').update(this.providerForm.oldPwd).digest('hex').toUpperCase();
                let checkPass = crypto.createHash('md5').update(this.providerForm.checkPass).digest('hex').toUpperCase();
                resetUserPass({
                    userName:this.userName,
                    oldPwd:oldPwd,
                    newPwd:checkPass,
                    updatePwdType:0
                }).then(res => {
                    this.$alert(this.userName+' 恭喜您! 重置密码成功', {
                            confirmButtonText: '確定',
                            callback: action => {
                            this.$store.dispatch('FedLogOut').then(() => {
                                location.reload(); // 为了重新实例化vue-router对象 避免bug
                            });
                        }
                    });
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
    }

    .el-button {
        width: 117px;
    }
</style>