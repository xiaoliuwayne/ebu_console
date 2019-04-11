<template>
    <div class="welcome-content">
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
        <div class="welComeMsg">
            <div class="step">
                <eb-steps :items="stepItems" :activeIndex="stepIndex"></eb-steps>
            </div>
            <div class="msg">
                <p style="font-size: 26px;">嗨! {{userName}}, 感谢您进驻衣布到位~</p>
            </div>
            <div class="welcomeBtn">
                <el-button @click="turnToProduct">进入衣布到位</el-button>
            </div>
            <div class="footer">
                <p>广州衣布到位信息科技有限公司</p>
            </div>
        </div>
    </div>
</template>
<script>
    import { userInfo } from '@/api/register';
    import EbSteps from './steps'

    export default {
        data() {
            return {
                stepItems: [{text:'注册账号'},{text:'填写公司信息'},{text:'注册完成'}],
                stepIndex: 2,
                userId: 0,
                userName:'',
                busiLicenseImg:''
            };
        },
        created(){
            this.userId = this.$route.query.userId;
            this.getUserDetail();
        },
        methods: {
            getUserDetail(){
                userInfo({userId:this.userId}).then(res => {
                    this.userName = res.userName;
                    this.busiLicenseImg = res.busiLicenseImg;
                });
            },
            turnToProduct() {
                //注册用户没有营业执照时,跳回用户信息修改界面
//                if (this.busiLicenseImg.indexOf('http')==0){
//                    this.$router.push({name:'clothList'});
//                }else {
//                    this.$router.push({name:'companyMsg',query:{userId:this.userId}});
//                }
                this.$router.push({name:'clothList'});
            }
        },
        components:{
            EbSteps
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";

    .welcome-content{
        background: url(bgImg.png) no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        font-family: PingFangSC-Regular;
        padding-bottom: 1px;
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
        .welComeMsg{
            left: 0;
            right: 0;
            width: 800px;
            padding: 80px 196px 0;
            margin: 0 auto 120px;
            background: rgba(255,255,255,0.9);
            box-shadow: 0 8px 16px 0 rgba(180,180,180,0.47);
            border-radius: 18px;
        }
        .welComeMsg .msg{
            text-align: center;
            margin-top: 80px;
        }
        .footer{
            font-size: 12px;
            color: #B4B4B4;
            letter-spacing: 2px;
            text-align: center;
            padding: 180px 0 50px;
        }
        .welcomeBtn{
            text-align: center;
        }
        .welcomeBtn .el-button {
            width: 200px;
            margin: 40px;
            color: #FAFAFA;
            background: #CE2F2C;
            border-radius: 100px;
        }
    }
</style>