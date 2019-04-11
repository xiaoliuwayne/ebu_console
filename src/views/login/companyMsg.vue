<template>
    <div class="company-content">
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
            <div class="step">
                <eb-steps :items="stepItems" :activeIndex="stepIndex"></eb-steps>
            </div>
            <el-form-item prop="name">
                <el-input v-model="providerForm.name" placeholder="公司名称"></el-input>
            </el-form-item>
            <el-form-item prop="address">
                <el-input v-model="providerForm.address" placeholder="地址"></el-input>
            </el-form-item>
            <el-form-item prop="linkman">
                <el-input v-model="providerForm.linkman" placeholder="联系人"></el-input>
            </el-form-item>
            <el-form-item prop="tel">
                <el-input v-model="providerForm.tel" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item prop="fax">
                <el-input v-model="providerForm.fax" placeholder="传真"></el-input>
            </el-form-item>
            <div style="margin: 20px 0;">
                <span style="color: #B4B4B4;">经营品类:</span>
                <el-checkbox-group v-model="providerForm.majorList">
                <el-checkbox v-for="type in types" :label="type.catId" :key="type.catId" >{{type.major}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div>
                <span style="color: #B4B4B4;">公司工商执照:</span>
                <el-upload
                        class="avatar-uploader"
                        :action="uploadAvatarApi"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess">
                    <img v-if="providerForm.busiLicenseImg" :src="providerForm.busiLicenseImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <div class="register-btn">
                <div style="position: relative">
                    <el-button class="btn-left" @click="submitForm(providerForm)">完成注册</el-button>
                    <el-button class="btn-right" @click="backLogin">取消</el-button>
                </div>
            </div>
            <div class="footer"></div>
        </el-form>
    </div>
</template>
<script>
    import { userMsg, option , userInfo } from '@/api/register';
    import { byTypeGetObj , cloneObj} from '@/utils/index';
    import EbSteps from './steps';
    import { OPEN_API } from '../../../config/prod.env';
    const oploadApi = OPEN_API.slice(1,-1);

    export default {
        data() {
            var name = (rule, value, callback) => {
                if (!value){
                    return callback(new Error('公司名称不能为空!'));
                } else {
                    callback();
                }
            }
            var address = (rule, value, callback) => {
                if (!value){
                    return callback(new Error('地址不能为空!'));
                }else {
                    callback();
                }
            }
            var linkman = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('联系人不能为空!'));
                }else {
                    callback();
                }
            };
            var tel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('联系电话不能为空!'));
                }else {
                    callback();
                }
            };
            return {
                stepItems: [{text:'注册账号'},{text:'填写公司信息'},{text:'注册完成'}],
                stepIndex: 1,
                uploadAvatarApi: oploadApi + '/upload?type=0',
                types:[{catId:31,major:'面料'},{catId:321,major:'纽扣'},{catId:322,major:'拉链'}],
                userId: this.$route.query.userId || this.$store.getters.userId,
                providerForm: {
                    busiLicenseImg: '',
                    address:'',
                    name: '',
                    linkman: '',
                    tel: '',
                    fax: '',
                    majorList:[]
                },
                rules: {
                    name:[
                        { validator: name, trigger: 'blur'}
                    ],
                    tel:[
                        { validator: tel, trigger: 'blur'}
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
        created(){
            this.getUserDetail();
        },
        methods: {
            getUserDetail(){
                userInfo({userId:this.userId}).then(res => {
                    this.providerForm.busiLicenseImg = res.busiLicenseImg;
                    this.providerForm.address = res.address;
                    this.providerForm.fax = res.fax;
                    this.providerForm.name = res.name;
                    this.providerForm.linkman = res.linkman;
                    this.providerForm.tel = res.tel;
                   this.providerForm.majorList = res.majorList.map(item=>{
                               return item.catId
                           });
                 });
            },
            handleAvatarSuccess(res, file) {
                if (res.result === "0"){
                    this.providerForm.busiLicenseImg = res.urls[0].image;
                    this.$message({message:'上传成功',type:'success'});
                }
            },
            submitForm(formName) {
                if (formName.majorList.length==0){
                    alert("请选择一种经营品类~");
                    return;
                }else {
                    this.$refs.providerForm.validate((valid) => {
                        if (valid) {
                            let form = cloneObj(formName);
                            form.majorList = form.majorList.map(item=>{
                                        return {catId:item}
                                    });
                            userMsg({
                                op:option.op,
                                toUserId:this.userId,
                                userInfo:JSON.stringify(form)
                            }).then(res => {
                                alert('恭喜您,注册成功!');
                                this.$router.push({ path: '/welcome',query:{userId:this.userId} });
                        });
                        } else {
                            alert('请填写完整公司信息~');
                    return false;
                }
                });
                }
            },
            backLogin() {
                this.$store.dispatch('FedLogOut').then(() => {
                    //location.reload()
                    this.$router.go(-1);
                });
            }
        },
        components:{
            EbSteps
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "src/styles/mixin.scss";
    $bg:#2d3a4b;
    $dark_gray:#889aa4;
    $light_gray:#000;

    .company-content {
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
        .step{
            width: 550px;
            margin-bottom: 40px;
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
        .el-checkbox__label{
            color: #B4B4B4;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner{
            background-color: #CE2F2C;;
            border-color: #CE2F2C;;
        }
        .el-checkbox__input.is-checked+.el-checkbox__label {
            color: #CE2F2C;
        }
        .el-checkbox-group {
            display: inline-block;
        }
        .avatar-uploader {
            width: 400px;
            height: 178px;
            margin-top: 10px;
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
            width: 400px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 400px;
            height: 178px;
            display: block;
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
            padding: 45px 0;
        }
    }
</style>