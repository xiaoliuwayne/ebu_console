<template>
    <div class="content">
        <el-form :model="providerForm" status-icon ref="providerForm" label-width="100px" class="providerForm">
            <el-form-item label="用户名:">
                <p>{{userName}}</p>
            </el-form-item>
            <el-form-item label="注册手机号:">
                <p>{{regTel}}</p>
                <router-link :to="{path:'/setNewPass',query: {userId: userId,userName:userName}}" class="resetPass">重置密码</router-link>
            </el-form-item>
            <el-form-item label="现货结算等级:">
                <span>{{incomeLevel}}</span>
                <el-popover
                        ref="popover"
                        placement="right-end"
                        width="300"
                        trigger="click">
                    <div>
                        <strong>结算等级:</strong>
                        <p>结算等级为现货的结算结算周期等级</p>
                        <p>普通级：30天月结</p>
                        <p>黄金级：现金结算</p>
                    </div>
                </el-popover>
                <el-button type="text" v-popover:popover>等级说明</el-button>
            </el-form-item>
            <el-form-item label="公司名称:" prop="name">
                <el-input v-model="providerForm.name"></el-input>
            </el-form-item>
            <el-form-item label="公司地址:" prop="address">
                <el-input v-model="providerForm.address"></el-input>
            </el-form-item>
            <el-form-item label="联系人:" prop="linkman">
                <el-input v-model="providerForm.linkman"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="tel">
                <el-input v-model="providerForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="经营品类:">
                <el-checkbox-group v-model="providerForm.majorList">
                    <el-checkbox v-for="type in types" :label="type.catId" :key="type.catId">{{type.major}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="公司工商执照:">
                <el-upload
                        class="avatar-uploader"
                        :action="uploadAvatarApi"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess">
                    <img v-if="providerForm.busiLicenseImg" :src="providerForm.busiLicenseImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(providerForm)">保存</el-button>
                <!--<el-button @click="backLogin">取消</el-button>-->
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { getInfo, changeUserMgr ,option } from '@/api/user';
    import { cloneObj } from '@/utils/index';
    import { OPEN_API } from '../../../../config/prod.env';
    const oploadApi = OPEN_API.slice(1,-1);

    export default {
        data() {
            return {
                uploadAvatarApi: oploadApi + '/upload?type=0',
                types:[{catId:31,major:'面料'},{catId:321,major:'纽扣'},{catId:322,major:'拉链'}],
                userName: '',
                userId: this.$store.state.user.userId,
                regTel: '',
                incomeLevel: '',
                providerForm: {
                    linkman:'',
                    tel:'',
                    name:'',
                    address:'',
                    majorList:[],
                    busiLicenseImg: ''
                }
            };
        },
        created(){
            this.getUserDetail();
        },
        methods: {
            getUserDetail(){
                getInfo(this.userId).then(res => {
                    this.providerForm.busiLicenseImg = res.busiLicenseImg;
                    this.providerForm.address = res.address;
                    this.providerForm.name = res.name;
                    this.userName = res.userName;
                    this.providerForm.linkman = res.linkman;
                    this.providerForm.tel = res.tel;
                    this.regTel = res.regTel;
                    this.incomeLevel = res.incomeLevel==1?"普通级：30天月结":res.incomeLevel==2?"黄金级：现金结算":"";
                    this.providerForm.majorList = res.majorList.map(item =>{
                                return item.catId;
                            });
                })
            },
            handleAvatarSuccess(res, file) {
                if (res.result === '0'){
                    this.providerForm.busiLicenseImg = res.urls[0].image;
                    this.$message({message:'上传成功!',type:'success'});
                }
            },
            submitForm(formName) {
                if (formName.majorList.length==0){
                    alert("请选择一种经营品类~");
                    return;
                }else {
                    let form = cloneObj(formName);
                    form.majorList = form.majorList.map(item => {
                                return {catId: item}
                            });
                    changeUserMgr({
                        op: option.changeUserInfo,
                        toUserId: this.userId,
                        userInfo: JSON.stringify(form)
                    }).then(res => {
                        this.$message({message: '修改成功!', type: 'success'});
                    });
                }
            },
            backLogin() {

            }
        }
    }
</script>

<style scoped>
    .content{
        margin: 30px 200px;
        width: 400px;
    }

    .el-button {
        width: 117px;
    }

    .avatar-uploader  {
        width: 350px;
        height: 178px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
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
    .resetPass{
        color: #409EFF;
    }
</style>