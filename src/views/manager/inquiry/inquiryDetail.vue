<template>
    <div class="inquiry-detail">
        <div class="submit-btn">
             <!-- <el-alert
                title="备注：XXXXX、XXXX、XXXXXXXXX、XXXX、XXXXXXXXX、XXXX、XXXXXXXXX、XXXX、XXXX"
                type="info"
                :closable="false"
                center>
            </el-alert> -->
            <div v-if="status.t == '1'">
                <el-button type="primary" @click="getSendInquiry">发布需求</el-button>
                <el-button type="danger" @click="getCloseInquiry">关闭订单</el-button>
            </div>
            
        </div>
        <el-card class="inquiry-info">
            <div slot="header" class="clearfix">
                <span>需求详情</span>
            </div>
            <table class="table table-responsive table-bordered">
                <tbody>
                <tr>
                    <td>需求ID</td>
                    <td>{{inquiryId}}</td>
                    <td>状态</td>
                    <td>{{status.n}}</td>
                </tr>
                <tr>
                    <td>需求发布时间</td>
                    <td>{{createTime}}</td>
                    <td>投放时间</td>
                    <td>{{saysPassed}}</td>
                </tr>
                <tr>
                    <td>公司名称</td>
                    <td>{{companyName}}</td>
                    <td>姓名</td>
                    <td>{{name}}</td>
                </tr>
                <tr>
                    <td>移动电话</td>
                    <td>{{phone}}</td>
                    <td>收货地址</td>
                    <td>{{area}}{{address}}</td>
                </tr>
                </tbody>
            </table>
        </el-card>

        <div class="img-list" v-viewer>
            <img v-for="(url,index) in imageList" :key="index" :src="url" alt="" >
        </div>

        <el-card class="inquiry-info">
            <table class="table table-responsive table-bordered">
                <tbody>
                <tr>
                    <td>类型</td>
                    <td>
                        
                        <el-select v-if="typeIsChange" size="mini" v-model="type" placeholder="请选择">
                            <el-option v-for="(item,index) in priceTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <span v-else>{{priceTypes[type - 1]['label']}}</span>
                        <el-button v-if="status.t == '1'" type="text" size="mini" @click="handleConfirm('type')">{{typeIsChange ? '确认' : '修改'}}</el-button>
                    </td>
                    <td>有效期</td>
                    <td>
                        
                        <el-date-picker
                        v-model="expireTime"
                        size="mini"
                        type="date"
                        placeholder="选择日期"
                        :clearable="false"
                        :picker-options="timeOptions"
                        v-if="expireTimeIsChange">
                        </el-date-picker>
                        <span v-else>{{expireTime}}</span>
                        <el-button  v-if="status.t == '1'" type="text" size="mini" @click="handleConfirm('expireTime')">{{expireTimeIsChange ? '确认' : '修改'}}</el-button>
                    </td>
                </tr>
                <tr>
                    <td>是否接受定制</td>
                    <td>
                        <el-select size="mini" v-if="acceptCustomizeIsChange" v-model="acceptCustomize" placeholder="请选择">
                            <el-option label="否" :value="0"></el-option>
                            <el-option label="是" :value="1"></el-option>
                        </el-select>
                        <span v-else>{{acceptCustomize ? '是' : '否'}}</span>

                        <el-button v-if="status.t == '1'" type="text" size="mini" @click="handleConfirm('acceptCustomize')">{{acceptCustomizeIsChange ? '确认' : '修改'}}</el-button>
                        
                    </td>
                    <td>面料种类</td>
                    <td>
                        <div>
                            <div>
                                <span v-if="matching[0].length != 0">针织：</span>
                                <span v-for="(val,index) in matching[0]" :key="index"> {{busiScope[2][val]}}、</span>
                            </div>
                            <div>
                                <span v-if="matching[1].length != 0">梭织：</span>
                                <span v-for="(val,index) in matching[1]" :key="index">{{busiScope[2][val]}}、</span>
                            </div>
                        </div>
                        <el-popover
                            placement="left"
                            title="主营业务(面料种类)"
                            width="600"
                            trigger="click"
                            v-model="matchingPopoverShow">
                            <div>
                                <label style="line-height:3;">针织：</label>

                                <el-checkbox-group v-model="matching[0]" size="mini">
                                    <el-checkbox v-for="(value,index) in busiScope[0]" :key="index" :label="value.keyId" v-model="value.keyId" border style="margin:0 0 10px 10px;">{{value.keyword}}</el-checkbox>
                                </el-checkbox-group>

                                <label style="line-height:3;">梭织：</label>

                                <el-checkbox-group v-model="matching[1]" size="mini">
                                    <el-checkbox v-for="(value,index) in busiScope[1]" :key="index" :label="value.keyId"  v-model="value.keyId" border style="margin:0 0 10px 10px;">{{value.keyword}}</el-checkbox>
                                </el-checkbox-group>

                            </div>
                            <el-button v-show="status.t == '1'" type="text" size="mini" slot="reference">修改</el-button>

                            <div style="padding:10px 0; text-align:center">
                                <el-button type="primary" size="small" @click="handleConfirm('keywords')">确认提交</el-button>
                                <el-button size="small" @click="matchingPopoverShow = false">取消选择</el-button>
                            </div>
                        </el-popover>               
                    </td>
                </tr>
                <tr>
                    <td>
                        面料说明
                    </td>
                    <td>
                        <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="desc"
                        v-if="descIsChange">
                        </el-input>
                        <p v-else>{{desc}}</p>
                        <el-button v-if="status.t == '1'" type="text" size="mini" @click="handleConfirm('desc')">{{descIsChange ? '确认' : '修改'}}</el-button>
                    </td>
                </tr>
                
                </tbody>
            </table>
        </el-card>

        <el-card class="inquiry-info">
            <table class="table table-responsive table-bordered">
                <tbody>
                    <tr>
                        <td>备注说明</td>
                        <td>
                            <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入内容"
                            v-model="detail.note"
                            v-if="noteIsChange">
                            </el-input>
                            <p v-else>{{detail.note}}</p>
                            <el-button type="text" size="mini" @click="handleConfirm('note')">{{noteIsChange ? '确认' : '修改'}}</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-card>

        <el-card class="inquiry-info">
            <div slot="header" class="clearfix">
                <span>待发供应商数量：<strong>{{usersArr.length}}</strong></span>
            </div>
            <table class="table table-responsive table-bordered">
                <tbody>
           
                        <!-- <tr v-for="(item,index) of providerList" :key="item.userId" v-if="index ==">
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                        </tr> -->
        
                    
                    <tr>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                    </tr>
                </tbody>
            </table>
        </el-card>

        <el-card class="inquiry-info">
            <table class="table table-responsive table-bordered">
                <tbody>

                    <tr v-if="status.t != '2'">
                        <td>
                            <h2>{{usersArr.length}}</h2>
                            <span>供应商数量</span>
                        </td>
                        <td>
                            <div>
                                <ul>
                                    <li v-for="(item,classifyIndex) in classifyList" :key="classifyIndex">
                                        <h3>{{item.label}}：{{item.providerList.length}}家</h3>
                                        <el-tooltip v-for="(val,providerIndex) in item.providerList" :key="providerIndex" placement="top" effect="light">
                                            <div slot="content">
                                                <div class="tips" >
                                                    <h4>主营业务</h4>
                                                    <div>
                                                        <p>
                                                            <label>针织：</label>
                                                            <span v-for="(value,index) in val.busiKeywords" :key="index">
                                                                <template v-if="value.groupId == 1">{{value.keyword}}、</template>
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            <label>梭织：</label>
                                                            <span v-for="(value,index) in val.busiKeywords" :key="index">
                                                                <template v-if="value.groupId == 2">{{value.keyword}}、</template>
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label>备注：</label>
                                                        <span>{{val.memo}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <el-tag
                                            style="margin:0 10px 10px 0;"
                                            :closable="status.t == '1'"
                                            :disable-transitions="false"
                                            @close="handleDeleteProvider(classifyIndex,providerIndex)">
                                            {{val.name}}
                                            </el-tag>
                                        </el-tooltip>
                                    </li>
                                </ul>                           
                            </div>
                        </td>
                    </tr>
                    <tr v-if="status.t != '1'">
                        <td>
                            <h2>{{sendSmsList.length}}</h2>
                            <span>已发送短信数量</span>
                        </td>
                        <td>
                            
                            <div>

                                <!-- <el-tag
                                    v-for="(item,index) in sendSmsList" :key="index"
                                    style="margin:0 10px 10px 0;"
                                    :type="item.status == 1 ? 'success' : 'danger'"
                                    plain
                                    :title="item.smsCode">
                                    {{item.provider}}
                                </el-tag> -->

                                <VNodes :vnodes="renderTagSendSms(sendSmsList)" />
                                               
                            </div>

                            <el-popover
                                placement="top"
                                title="再次发送短信给供应商"
                                width="400"
                                trigger="click"
                                v-model="sendSmsAgainShow">
                                <div>
                                    <div style="display:flex; margin-bottom:20px;">
                                        <el-input placeholder="请填写供应商ID" v-model="searchProviderId">
                                            <el-button slot="append" icon="el-icon-search" @click="getSearchProviderId" :disabled="!(searchProviderId.length == 5)"></el-button>
                                        </el-input>
                                    </div> 
                                    <div>
                                        <el-tag
                                            v-for="(item,index) in sendSmsAgainList" :key="index"
                                            style="margin:0 10px 10px 0;"
                                            type="info"
                                            closable
                                            @close="handleDeleteSendAgainSms(index)"
                                            plain>
                                            {{item.name}}
                                        </el-tag>
                                    </div>
                                </div>
                                <el-button type="text" size="mini" slot="reference">添加短信</el-button>

                                <div style="padding:10px 0; text-align:center">
                                    <el-button type="primary" size="small" @click="getSendSmsAgain" :disabled="this.sendSmsAgainList.length == 0">确认发送</el-button>
                                    <el-button size="small" @click="sendSmsAgainShow = false">取消发送</el-button>
                                </div>
                                
                            </el-popover>

                            <!-- <div style="text-align:center; width:100%;" v-else>
                                暂时还没有发送短信
                            </div> -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-card>

        <el-card class="inquiry-info">
            <table class="table table-responsive table-bordered">
                <tbody>
                    <tr>
                        <td class="single settlement">
                            <div v-if="deputeCollect == 1">
                                <label>确认委托调样：</label>
                                <div>
                                    <p>
                                        <span v-for="(item,index) in receiptList" :key="index">
                                            <template v-if="item.status == 1">
                                                {{index + 1}}. {{item.provider.name}} (调样价格：{{item.samplePrice}}/米)；
                                            </template>
                                            
                                        </span>
                                    </p>
                                    <!-- <div>
                                        <span>待支付</span>
                                        <el-button type="primary" size="mini">更改支付状态</el-button>
                                    </div> -->
                                </div>
                            </div>
                            <div>
                                <label>物流单号：</label>
                                <div>
                                    <p v-if="trackingNum == ''"><span>暂无快递信息</span></p>
                                    <p v-else><span>{{deliCom}}</span> | <span>{{trackingNum}}</span></p>
                                    <div v-if="status.t != '1'">
                                        <el-button type="primary" size="mini" @click="logisticsDialog = true">更改快递信息</el-button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-card>

        <ul class="supplier-list">
            <li v-for="(item,index) in receiptList" :key="index">
                <div v-if="item.status == 1" class="success-icon"><i class="el-icon-circle-check"></i></div>
                <el-card class="inquiry-info">
                    <div slot="header" class="clearfix">
                        <span>回样供应商{{index + 1}}：{{item.provider.name}}；</span>
                        <span>回复时间：{{item.createTime}}</span>
                    </div>
                    <div class="img-list" v-viewer>
                        <img v-for="(url,key) in item.imgUrlListValue" :key="key" :src="url" alt="">
                    </div>
                    <table class="table table-responsive table-bordered">
                        <tbody>
                            <tr>
                                <td>色卡编号</td>
                                <td>{{item.colorCardCode}}</td>
                                <td>品 名</td>
                                <td>{{item.productName}}</td>
                            </tr>
                            <tr>
                                <td>成 份</td>
                                <td>{{item.ingredients}}</td>
                                <td>幅 宽</td>
                                <td>{{item.width}}</td>
                            </tr>
                            <tr>
                                <td>克 重</td>
                                <td>{{item.weight}}</td>
                                <td>单 价</td>
                                <td>{{item.unitPrice}}</td>
                            </tr>
                            <tr>
                                <td>是否现货</td>
                                <td>{{item.spotStatus}}</td>
                                <td>调样价格</td>
                                <td>{{item.samplePrice}}</td>
                            </tr>
                            <tr>
                                <td>供应商名称</td>
                                <td>{{item.provider.name}}</td>
                                <td>移动电话</td>
                                <td>{{item.provider.regTel}}</td>
                            </tr>
                            <tr>
                                <td>联系人姓名</td>
                                <td>{{item.provider.linkman}}</td>
                                <td>公 司 地 址</td>
                                <td>{{item.provider.address}}</td>
                            </tr>
                            <tr>
                                <td>面料说明</td>
                                <td>{{item.description}}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-card>
            </li>
        </ul>

        <el-dialog :visible.sync="logisticsDialog" width="30%">
            <el-form ref="logistics" :model="logistics" :show-message="false" :status-icon="true">
            <table class="table table-responsive table-bordered" style="text-align:center;">
                <tbody>
                    <tr>
                        <td colspan="2">填写快递信息</td>
                    </tr>
                    <tr>
                        <td>快递公司</td>
                        <td>
                            <el-form-item style="margin-bottom:0;" required prop="deliType">
                                <el-select style="width:100%" size="small" v-model="logistics.deliType" placeholder="请选择快递公司"  :disabled="!deliCom == ''">
                                    <el-option
                                    v-for="(val,index) in deliComList"
                                    :key="index"
                                    :label="val.name"
                                    :value="val.type">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>物流单号</td>
                        <td>
                            <el-form-item style="margin-bottom:0;" required prop="trackingNum">
                                <el-input size="mini" type="text" placeholder="请填写物流单号" v-model="logistics.trackingNum" :disabled="!trackingNum == ''"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <el-button type="primary" size="mini" @click="getUpdateInquiryDeliveryInfo('logistics')" :disabled="!(trackingNum == '' || deliCom == '')">确认</el-button>
                            <el-button size="mini" @click="logisticsDialog = false">取消</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            </el-form>
        </el-dialog>

        <el-dialog :visible.sync="imgBrowseDialog" top="5vh" width="50vw">
            <div style="width:100%; height:78vh; text-align:center;">
                <img style="height:100%; width:auto; max-width:100%;" :src="imgBrowseUrl" alt="">
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fabricKeywords } from '@/api/product'
import { 
    inquiryDetail,
    updateInquiry,
    providerListByKeys,
    sendInquiry,
    getInquiryReceiptList,
    updateInquiryDeliveryInfo,
    updateInquiryStatus,
    querySendInquiryList,
    /* getInquiryReceiptStatus */
} from '@/api/inquiry'
import { getInfo } from '@/api/user';
import { getDeliveryCompany } from '@/api/order';
import { parseTime, cloneObj, byTypeGetObj ,formatTime } from '@/utils';
import global_ from '@/global/global';
export default {
    components: {
        VNodes: {
            functional: true,
            render: (h, ctx) => ctx.props.vnodes
        }
    },
    data(){
        return {
            inquiryId:this.$route.query.inquiryId || 0,
            
            createTime:0,
            saysPassed:0,
            expireTime:0,
            companyName:'',
            name:'',
            area:'',
            address:'',
            phone:'',
            imageList:[],
            acceptCustomize:1,
            deputeCollect:0,
            status:{},
            type:1,
            desc:'',  
            busiScope:[
                [],
                [],
                []
            ],

            matching:[
                [],
                []
            ],
            matchingPopoverShow:false,

            sendSmsAgainShow:false,
            sendSmsAgainList:[
                /* {
                    name:'',
                    userId:''
                } */
            ],
            searchProviderId: '',
            

            typeIsChange:false,
            acceptCustomizeIsChange:false,
            keywordsIsChange:true,
            expireTimeIsChange:false,
            descIsChange:false,
            noteIsChange:false,
            

            detail:{
                note:''
            },
            priceTypes: [
                {
                    label: '色卡',
                    value: 1
                },
                {
                    label: '剪版',
                    value: 2
                }
            ],
            timeOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },

            providerList:[

            ],
            classifyList:[
                /* {
                    label:'',
                    providerList:[]
                } */
            ],

            imgBrowseDialog:false,
            imgBrowseUrl:'',

            logisticsDialog:false,
            deliComList:[],

            trackingNum :'',
            deliCom     :'',
            deliType    :'',
            logistics:{
                deliCom     :'',
                deliType    :'',
                trackingNum :''
            },

            receiptList:[],
            sendSmsList:[

            ],
            /* receiptStatus:[
                
            ] */

        }
    },
    computed: {
        // 计算天数
        validityDay: function () {

                let diff =  new Date(this.expireTime) - new Date(this.createTime)

                let day  = parseInt(diff / (3600 * 24 * 1000))

                if(diff < 0){
                    return 0
                }else{
                    return day
                }

        },

        //计算有多少个需要发送短息的供应商
        usersArr: function(){
            
            let providerList = []

            for(let item of this.classifyList){
                
                for(let val of item.providerList){
                    providerList.push(val.userId)
                }

            }   //提取供应商的值

            providerList = Array.from(new Set(providerList))    //数组去重

            return providerList
        }
    },
    created(){

        /* this.GLOBAL.priceTypes.forEach(v => {
            this.priceTypes.push({
                label: v.n,
                value: v.t
            })
        }); */


        this.getData()
        
    },
    methods: {

        //使用jsx实现template实现不了的逻辑代码
        renderTagSendSms(arr){
            return (
                arr.map(item => {
                    let sendStatus = item.sendStatus
                    let reqStatus  = item.reqStatus
                    let type       = ''
                    if(sendStatus == 0){
                        type = 'warning'
                    }else if(sendStatus == 1){
                        type = 'primary'
                        if(reqStatus == 1){
                            type = 'success'
                        }
                    }else if(sendStatus == 2){
                        type = 'danger'
                    }else{
                        type = 'danger'
                    }
                    return <el-tag 
                        type  = {type}
                        key   = {item.userId}
                        title = {item.smsCode}
                        style = {{ margin: '0 10px 10px 0'}}>
                        {item.provider}
                    </el-tag>
                })
            )
        },

        handleDeleteSendAgainSms(index){
            this.sendSmsAgainList.splice(index, 1)
        },

        getSendSmsAgain(){

            let users = this.sendSmsAgainList.map((res)=>{
                return res.userId
            })

            let params = {
                inquiryId: this.inquiryId,
                users    : JSON.stringify(users)
            }

            sendInquiry(params).then(res => {

                for(let item of this.sendSmsAgainList){
                    this.sendSmsList.push({
                        reqStatus  : 1,
                        sendStatus : 0,
                        userId     : item.userId,
                        provider   : item.name,
                        smsCode    : item.smsCode
                    })
                }
            })

        },

        getSearchProviderId(){

            let send   =  this.sendSmsAgainList.findIndex((item) => item.userId == this.searchProviderId)
            let unsent =  this.sendSmsList.findIndex((item)      => item.userId == this.searchProviderId)

            /* if(send == -1 && unsent == -1){ */
                getInfo(this.searchProviderId).then(res => {
                
                    let {name,userId} = res
                    
                    this.sendSmsAgainList.push({
                        name:name,
                        userId:userId
                    })
                    this.searchProviderId = ''

                })
            /* }else{
                this.$message.error('已发送过的短信请勿重复添加！')
            } */

        },

        handleDeleteProvider(classifyIndex,providerIndex){
            this.classifyList[classifyIndex].providerList.splice(providerIndex, 1)
        },

        getUpdateInquiryDeliveryInfo(formName){

            this.$refs[formName].validate((valid) => {
                if (valid) {

                    let deliCom = this.deliComList.find(item => {return item.type == this.logistics.deliType })

                    if(deliCom){
                        this.logistics.deliCom = deliCom.name
                    }

                    let params = {
                        inquiryId   :this.inquiryId,
                        deliCom     :this.logistics.deliCom,
                        deliType    :this.logistics.deliType,
                        trackingNum :this.logistics.trackingNum
                    }
                    
                    updateInquiryDeliveryInfo(params).then(res => {

                        this.$message({
                            message: '快递单号填写成功！',
                            type: 'success'
                        })

                        this.trackingNum = this.logistics.trackingNum
                        this.deliCom = this.logistics.deliCom
                        this.deliType = this.logistics.deliType
                        this.logisticsDialog = false
                    })

                }
            })
        },

        getCloseInquiry(){

            this.$confirm('请确认您是否需要关闭订单！', '提示', {
                confirmButtonText: '确认无误',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.getUpdateInquiryStatus(4)

            }).catch(() => {})
            
        },

        getUpdateInquiryStatus(status){
            
            updateInquiryStatus({inquiryId:this.inquiryId,status:status}).then(res => {

                this.$message({
                    message: '需求订单更改成功！',
                    type: 'success'
                })

                this.$router.push({path:'/inquiryList'})
                /* this.status.t = '2'
                this.status.n = '已发布' */
            })
        },


        getSendInquiry(){

            this.$confirm('请确认页面资料是否准确无误！', '提示', {
                confirmButtonText: '确认无误',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                (async () => {

                    let params = {
                        inquiryId:this.inquiryId,
                        users: JSON.stringify(this.usersArr)
                    }

                    let SendingSMS = await sendInquiry(params).then(res => {

                        return true

                    })

                    if(SendingSMS){

                        this.getUpdateInquiryStatus(2)
                        
                    }

                })()

            }).catch(() => {})
            
        },

        //初始化页面所有接口，将复用的接口封装成重加载函数方便多次调用
        async getData() {
            
            
            //初始化面料选择器列表
            await fabricKeywords(0).then(res => {

                this.busiScope[0] = res[0].list
                this.busiScope[1] = res[1].list

                let mergeArr = [...res[0].list,...res[1].list]

                let busiScope = {}

                for(let item of mergeArr){
                    busiScope[item.keyId] = item.keyword
                }

                this.busiScope[2] = busiScope
            })

            //初始化快递选择器列表
            await getDeliveryCompany().then(res => {

                let logisticsArr = []
                
                for(let item of res){
                    logisticsArr.push({
                        name:item.name,
                        type:item.type
                    })
                }

                this.deliComList = logisticsArr
            })

            //初始化需求单基本数据
            await inquiryDetail({ inquiryId: this.inquiryId }).then(res => {
 
                this.inquiryId       = res.inquiryId
                this.createTime      = parseTime(res.createTime,"{y}-{m}-{d} {h}:{i}")
                this.expireTime      = parseTime(res.expireTime,"{y}-{m}-{d} {h}:{i}")
                this.saysPassed      = formatTime(res.createTime / 1000),
                this.companyName     = res.companyName
                this.name            = res.name
                this.area            = res.area
                this.address         = res.address
                this.phone           = res.phone
                this.imageList       = res.imageList
                this.status          = cloneObj(byTypeGetObj(res.status,global_.inquiryStatus))
                this.detail          = cloneObj(res.detail)
                this.type            = res.type
                this.acceptCustomize = res.acceptCustomize
                this.deputeCollect   = res.deputeCollect
                this.desc            = res.desc
                this.trackingNum     = res.trackingNum || ''
                this.deliCom         = res.deliCom || ''
                this.deliType        = res.deliType || ''
                this.logistics.trackingNum  = res.trackingNum || ''
                this.logistics.deliCom      = res.deliCom || ''
                this.logistics.deliType     = res.deliType || ''

                //初始化面料种类的checked状态
                for(let item of res.keywords){

                    if(item.groupId == 1){
                        this.matching[0].push(item.keyId)
                    }else if(item.groupId == 2){
                        this.matching[1].push(item.keyId)
                    }

                }
            })

            //依赖上面的初始化需求单返回的面料keywords再去查询供应商列表
            await this.getProviderList()


            /* await getInquiryReceiptStatus({
                inquiryId : this.inquiryId,
                status    :'-1',
                page:0,
                pageSize:50
            }).then(res => {
                
                let receiptStatus = res.list.map(item => {
                    return {
                        samplePrice : item.samplePrice,
                        name        : item.provider.name
                    }
                })

                this.receiptStatus = receiptStatus
            }) */
            
            //依赖初始化需求单返回的状态status再去查询供应商回单列表
            await getInquiryReceiptList({
                inquiryId : this.inquiryId,
                status    : '-1',
                page	  : 0,
                pageSize  : 50
            }).then(res => {
              
                let receiptList = [] 

                for(let item of res.list){
                    receiptList.push(
                        {
                            status          : item.status,
                            inquiryId       : item.inquiryId,
                            createTime      : parseTime(item.createTime,"{y}-{m}-{d} {h}:{i}"),
                            imgUrlListValue : item.imgUrlListValue,
                            colorCardCode   : item.colorCardCode,
                            productName     : item.productName,
                            ingredients     : item.ingredients,
                            width           : item.width,
                            weight          : item.weight,
                            unitPrice       : item.unitPrice.toFixed(2) + '/米',
                            spotStatus      : item.spotStatus ? '是' : '否',
                            samplePrice     : item.samplePrice.toFixed(2) + '/米',
                            description     : item.description,
                            provider        : {
                                name        : item.provider.name,
                                address     : item.provider.address,
                                linkman     : item.provider.linkman,
                                regTel      : item.provider.regTel
                            }
                        }
                    )
                }

                this.receiptList = receiptList
            })

            //请求该需求单是否有发送过短信给供应商
            await querySendInquiryList({inquiryId : this.inquiryId}).then(res => {

                this.sendSmsList = res.map(item => {
                    return {
                        userId    : item.userId,
                        sendStatus: item.sendStatus,
                        reqStatus : item.reqStatus,
                        provider  : item.provider,
                        smsCode   : item.smsCode,

                    }
                })
            })


        },

        //根据面料keywords加载相应的供应商列表
        getProviderList(){

            let keyIds = [...this.matching[0],...this.matching[1]]

            if(keyIds.length == 0){
                return false
            }

            let classifyList = []
            let params = {
                keyIds:keyIds.join(),
                page:0,
                pageSize:50
            }

            return providerListByKeys(params).then(res => {
                    console.log(res)

                    for(let keyId of keyIds){//循环有多少种面料种类
                        
                        let addData = {
                            label        :  this.busiScope[2][keyId],
                            keyId        :  keyId,
                            providerList :  []
                        }

                        for(let item of res.list){//list列表表示有多少家供应商有上述的面料种类

                            for(let single of item.busiKeywords){//将面料种类与供应商一一对应
                                if(keyId == single.keyId){
                                    
                                    addData['providerList'].push({
                                        busiKeywords : item.busiKeywords,
                                        userId       : item.userId,
                                        name         : item.name,
                                        memo         : item.memo
                                    })
                                }
                            }
                        }

                        classifyList.push(addData)
                        
                    }
                    
                    this.providerList = res.list
                    this.classifyList = classifyList

                    return true
                })
            
            
        },

        //点击的是确认提交修改
        async handleConfirm(noun){

            if(this[noun + 'IsChange']){

            let params = {}

            if(noun == 'keywords'){

                let keywords = [...this.matching[0],...this.matching[1]].map((val)=>{
                                    return {
                                        "keyId": val
                                    }
                                })
                params = {
                    "keywords": keywords
                }

            }else if(noun == 'note'){
                params = {
                    detail: {
                        [noun] : this.detail[noun]
                    }
                }
            }else{
                params = {[noun] : this[noun]}
            }
            
            let isSuccess = await this.getSubmitRevision(params)

            if(isSuccess){

                this.$message({
                    message: '需求单修改成功！',
                    type: 'success'
                })

                if(noun == 'keywords'){
                    
                    this.matchingPopoverShow = this.getProviderList() ? false : true
                 
                }

                this[noun + 'IsChange'] = !this[noun + 'IsChange']
            }

            }else{//点击的是修改按钮显示编辑栏

                this[noun + 'IsChange'] = !this[noun + 'IsChange']

            }
        },

        //封装成的修改数据提交接口
        getSubmitRevision(params){

            let data = {
                inquiryId: this.inquiryId,
                inquiry: JSON.stringify(params)
            }
            
            return updateInquiry(data).then(res => {

                return true

            })

        },

        //查找面料数组里面的对象数据
        /* KeywordsFind(keyId){

            let target = this.mergeArr(this.busiScope[0],this.busiScope[1]).find((item) => {

                return item.keyId == keyId

            })

            return target.keyword

        }, */

        //合并多个数组并返回新数组
        /* mergeArr(){

            let newArr = []

            for(let i=0; i < arguments.length; i++){

                newArr.push.apply(newArr,arguments[i])

            }

            return newArr
        } */
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.inquiry-detail {
  .button-box {
    text-align: center;
    margin-top: 20px;
  }
  .inquiry-info {
    .table {
      tbody {
        & > tr {
            display:flex;
            & > td{
                display:flex;
                .el-button{
                    margin:0 20px;
                }
                /* display:flex; 
                align-items:center; 
                justify-content: space-between; 
                width:100% */
            }
            & > td:nth-child(2n-1) {
                min-width: 12rem;
                text-align:center;
                justify-content: center;
                flex-direction: column;
            }
             & > td:nth-child(2n) {
                 align-items:center;
                 /* justify-content: space-between; */
                /* width:calc(35%); */
                flex:1;
            }
        }
      }
    }
  }
  .img-list{
      display:flex;
      justify-content: center;
      padding:20px;
      img{
            width:100px;
            height:100px;
            object-fit: cover;
            margin-right:10px;
            &:last-child{
                margin-right:0;
            }
      }
  }

  .submit-btn{
      /* min-height:10rem; */
      display:flex;
      flex-direction: column;
      justify-content: space-around;
      text-align:right;
      padding:20px 50px;
  }


}

.tips{
    max-width:30rem;
    label{
        min-width:3rem;
    }
    p{
        line-height:1.5;
    }
    & > div{
        margin-bottom:10px;
        display:flex;
    }
}

.single{
    width:100%;
    text-align:left !important;
}

.settlement{
    line-height:3;
    & > div{
        display:flex;
        & > div{
            display:flex; justify-content:space-between; flex:1;
        }
    }
}
.supplier-list{

    li{
        position:relative;
    }

    .success-icon{
        position: absolute;
        font-size:4rem;
        right:0;
        top:0;
        color:rgb(52,208,122);
    }

}

</style>

