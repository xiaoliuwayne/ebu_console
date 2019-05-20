<template>
    <div class="inquiry-detail">
        <div class="submit-btn">

            <div>
                <el-button v-if="status.t == '1'" type="primary" @click="getSendInquiry">发布需求</el-button>
                
                <el-button v-if="status.t != '4' && status.t != '5'" type="danger" @click="handleChangeInquiry(4)">关闭订单</el-button>
                <el-button v-if="status.t != '5' && status.t != '4' && status.t != '7' && status.t != '8'" type="danger" @click="handleChangeInquiry(5)">无效化订单</el-button>
               
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
                        <span v-else>{{parseTimeClone(expireTime,"{y}-{m}-{d}")}}</span>
                        <el-button  v-if="status.t == '1'" type="text" size="mini" @click="handleConfirm('expireTime')">{{expireTimeIsChange ? '确认' : '修改'}}</el-button>
                    </td>
                </tr>
                <tr>
                    <td>是否接受定制</td>
                    <td>
                        <el-select size="mini" v-if="acceptCustomizeIsChange" v-model="acceptCustomize" placeholder="请选择">
                            <el-option label="现货" :value="0"></el-option>
                            <el-option label="定制" :value="1"></el-option>
                        </el-select>
                        <span v-else>{{!acceptCustomize ? '现货' : '定制'}}</span>

                        <el-button v-if="status.t == '1'" type="text" size="mini" @click="handleConfirm('acceptCustomize')">{{acceptCustomizeIsChange ? '确认' : '修改'}}</el-button>
                        
                    </td>
                    <td>面料种类</td>
                    <td>

                        <div>

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

                        <div style="display:flex; align-items:center; margin:20px 0;">
                            <span>修改品类：</span>
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
                            v-model="keywordsIsChange">
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
                                <el-button v-show="status.t == '1'" type="text" size="mini" slot="reference" @click="keywordsIsChange = true">修改</el-button>

                                <div style="padding:10px 0; text-align:center">
                                    <el-button type="primary" size="small" @click="handleConfirm('keywords')">确认提交</el-button>
                                    <el-button size="small" @click="keywordsIsChange = false">取消选择</el-button>
                                </div>
                            </el-popover>   

                        </div>

                        <div style="display:flex; align-items:center;">
                            <div>备注：{{otherKeywordExplicit}}</div>
                            <div>
                                
                                <el-popover
                                placement="right"
                                title="添加搜索种类关键字"
                                width="400"
                                v-model="otherKeywordIsChange"
                                trigger="click">
                                <el-input
                                    placeholder="请输入内容"
                                    v-model.trim="otherKeyword"
                                    clearable>
                                    <el-button slot="append"  @click="handleConfirm('otherKeyword')">保存</el-button>
                                </el-input>
                                <el-button  v-show="status.t == '1'" type="text" size="mini" slot="reference" @click="otherKeywordIsChange = true">修改</el-button>
                                </el-popover>
                            </div>
                        </div>

                        </div>
                    </td>
                </tr>
                <tr>
                    <td>意向价格</td>
                    <td>{{desirePrice}} 元/米</td>
                    <td>回版方式</td>
                    <td>{{deliverType}}</td>
                </tr>
                <tr>
                    <td>商圈</td>
                    <td>{{marketId}}</td>
                    <td>精准找样</td>
                    <td>{{inquiryType}}</td>
                </tr>
                </tbody>
            </table>
        </el-card>

        <el-card class="inquiry-info">
            <table class="table table-responsive table-bordered">
                <tbody>
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
                    <!-- <tr>
                        <td>
                            审核备注：采购商可见
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
                    </tr> -->
                    <tr>
                        <td>客服备注</td>
                        <td>
                            <div>
                                <div style="display:flex;">
                                    <el-input
                                    placeholder="请输入内容"
                                    v-model.trim="noteContent"
                                    size="mini"
                                    style="width:500px;"
                                    v-if="noteIsChange">
                                    </el-input>
                                    <el-button type="text" size="mini" @click="handleConfirm('note')">{{noteIsChange ? '确认' : '添加备注'}}</el-button>
                                </div>
                                <ul style="margin:10px 0;">
                                    <li v-for="(item,index) in detail.note" :key="index">
                                        {{parseTimeClone(item.createTime)}} / 内容：{{item.content}}
                                    </li>
                                </ul>
                            </div>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-card>

        <el-card class="inquiry-info" v-if="status.t == '1'" v-show="providerList.length != 0">
            <div slot="header" class="clearfix">
                <span>按品类待发送供应商数量：<strong>{{providerList.length}}</strong></span>
                <el-button type="text" size="mini" @click="providerSearchShow = true">筛选供应商</el-button>
            </div>

            <ul class="provider-list">
                <li v-for="(item,index) of providerList" :key="item.userId">
                    <div>
                        <div style="margin-bottom:10px;">
                            <el-tag :closable="true" @close="handleDeleteProvider(index)">{{item.name}}</el-tag>
                        </div>
                        <div>
                            <el-tag type="info">{{marketRange(item.marketId)}}</el-tag>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label>针织：</label>
                            <p>
                                <span v-for="val of item.busiKeywords" :key="val.keyId">
                                    <template v-if="val.groupId == 1">
                                        {{val.keyword}}、
                                    </template>
                                </span>
                            </p>
                        </div> 
                        <div>
                            <label>棱织：</label>
                            <p>
                                <span v-for="val of item.busiKeywords" :key="val.keyId">
                                    <template v-if="val.groupId == 2">
                                        {{val.keyword}}、
                                    </template>
                                </span>
                            </p>
                        </div> 
                        <div><label>备注：</label><p>{{item.memo}}</p></div>
                    </div>
                </li>
            </ul>
        </el-card>

        <el-card class="inquiry-info" v-if="status.t == '1'" v-show="providerListMemo.length != 0">

            <div slot="header" class="clearfix">
                <span>按备注待发送供应商数量：<strong>{{providerListMemo.length}}</strong></span>
            </div>

            <ul class="provider-list">
                <li v-for="(item,index) of providerListMemo" :key="item.userId">
                    <div>
                        <div style="margin-bottom:10px;">
                            <el-tag :closable="true" @close="handleDeleteProviderMemo(index)">{{item.name}}</el-tag>
                        </div>
                        <div>
                            <el-tag type="info">{{marketRange(item.marketId)}}</el-tag>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label>针织：</label>
                            <p>
                                <span v-for="val of item.busiKeywords" :key="val.keyId">
                                    <template v-if="val.groupId == 1">
                                        {{val.keyword}}、
                                    </template>
                                </span>
                            </p>
                        </div> 
                        <div>
                            <label>棱织：</label>
                            <p>
                                <span v-for="val of item.busiKeywords" :key="val.keyId">
                                    <template v-if="val.groupId == 2">
                                        {{val.keyword}}、
                                    </template>
                                </span>
                            </p>
                        </div> 
                        <div><label>备注：</label><p>{{item.memo}}</p></div>
                    </div>
                </li>
            </ul>
        </el-card>

        <el-card class="inquiry-info" v-if="status.t != '1'">
            <table class="table table-responsive table-bordered">
                <tbody>

                    <tr>
                        <td>
                            <h2>{{sendSmsList.length}}</h2>
                            <span>已发送短信数量</span>
                        </td>
                        <td>
                            <div class="send-sms">
                                <div>
                                    <span>正在发送</span>
                                    <span>已发未用</span>
                                    <span>已发已用</span>
                                    <span>发送失败</span>
                                </div>
                                <div style="display:flex">
                                    <div>
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
                                                <!-- <el-input 
                                                placeholder="请填写供应商名" 
                                                v-model="searchProviderName">
                                                    <el-button slot="append" icon="el-icon-search" @click="getSearchProviderName" :disabled="!(searchProviderName.length > 0)"></el-button>
                                                </el-input> -->

                                                <el-autocomplete
                                                    v-model="searchProviderName"
                                                    popper-class="search-autocomplete"
                                                    :fetch-suggestions="querySearchAsync"
                                                    placeholder="请输入内容"
                                                    :trigger-on-focus="false"
                                                    suffix-icon="el-icon-search"
                                                    @select="handleSelect"
                                                    style="width:100%;">
                                                    <template slot-scope="{ item }">
                                                        <div class="name">{{ item.name }}</div>
                                                        <span class="addr">地址：{{ item.address }}</span>
                                                    </template>
                                                </el-autocomplete>
                                            </div> 
                                            <div v-if="sendSmsAgainList.length != 0">
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
                                            <div v-else style="font-size:12px; text-align:center">
                                                <p>未找到结果？去<el-button type="text" size="mini" @click="handleToProviderCreated">添加供应商</el-button></p>
                                            </div>
                                        </div>

                                        <el-button v-show="status.t == '2' || status.t == '6'" type="text" size="mini" slot="reference">添加供应商</el-button>

                                        <div style="padding:10px 0; text-align:center">
                                            <el-button type="primary" size="small" @click="getSendSmsAgain" :disabled="this.sendSmsAgainList.length == 0">确认发送</el-button>
                                            <el-button size="small" @click="sendSmsAgainShow = false">取消发送</el-button>
                                        </div>
                                        
                                    </el-popover>
                                </div>
                            </div>
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
                    <!-- <tr>
                        <td class="single settlement">
                            <div v-if="deputeCollect == 1">
                                <label>确认委托调样：</label>
                                <div>
                                    <p>
                                        <span v-for="(item,index) in receiptList" :key="index">
                                            {{index + 1}}. {{item.provider.name}} (剪版价：{{item.samplePrice}})；
                                        </span>
                                    </p>
                                    <div>
                                        <span>待支付</span>
                                        <el-button type="primary" size="mini">更改支付状态</el-button>
                                    </div>
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
                    </tr> -->

                    <tr>
                        <td>支付时间</td>
                        <td>{{deliverPayTime}}</td>
                    </tr>
                    <tr>
                        <td>已付金额</td>
                        <td>￥{{deliverPayAmount}}元</td>
                    </tr>
                    <tr>
                        <td>跑腿供应商</td>
                        <td>
                            <div style="width:100%;">
                            <div>
                                <el-table
                                :data="payInfoItems"
                                style="width: 100%">
                                <el-table-column
                                    prop="name"
                                    label="供应商名称"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="payType"
                                    label="类型"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="buyNumber"
                                    label="数量">
                                </el-table-column>
                                <el-table-column
                                    prop="price"
                                    label="单价">
                                </el-table-column>
                                <el-table-column
                                    prop="buyColorCode"
                                    label="色号">
                                </el-table-column>
                                <el-table-column
                                    prop="payAmount"
                                    label="小计">
                                </el-table-column>
                                </el-table>
                            </div>
                            <div style="margin:20px 0;">
                                跑腿金额：￥{{detail.payInfo.ptAmount}}    ；
                                运费金额：￥{{detail.payInfo.freight}}    ；
                                商品金额：￥{{detail.payInfo.productAmount}}   ；
                                应付金额：￥{{deliverPayAmount}}   ；
                            </div>
                            </div>
                        </td>
                    </tr>
                     <tr>
                        <td>物流单号</td>
                        <td>
                            <p v-if="trackingNum == ''"><span>暂无快递信息</span></p>
                            <p v-else><span>{{deliCom}}</span> | <span>{{trackingNum}}</span></p>
                            <div v-if="status.t != '1'">
                                <el-button type="primary" size="mini" @click="logisticsDialog = true">更改快递信息</el-button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-card>

        <ul class="supplier-list">
            <li v-for="(item,index) in receiptList" :key="index">
                <!-- <div v-if="item.status == 1" class="success-icon">
                    <i class="el-icon-circle-check"></i>
                </div> -->
                <el-card class="inquiry-info">
                    <div slot="header" class="clearfix">
                        <div class="success-icon">
                            <div>
                                <span>回样供应商{{index + 1}}：{{item.provider.name}}；</span>
                                <span>回复时间：{{item.createTime}}</span>
                                <el-button type="text" size="mini" v-if="item.opUserId != item.userId" @click="$router.push({ name: 'updateReceipt',query:{inquiryId:item.inquiryId}})">替回修改</el-button>
                            </div>
                            <div>
                                <el-tag v-show="item.unRead == '0'">采购商已查看</el-tag>
                                <el-tag v-show="item.status == '1' || item.status == '3'" type="success">合适</el-tag>
                                <el-tag v-show="item.status == '3'" type="warning">跑腿</el-tag>
                            </div>
                        </div>
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
                                <td>剪版价</td>
                                <td>{{item.samplePrice}}</td>
                            </tr>
                            <tr>
                                <td>库存</td>
                                <td>{{item.stock}}</td>
                                <td>色卡价格</td>
                                <td>{{item.colorCard}}</td>
                            </tr>
                            <tr>
                                <td>是否现货</td>
                                <td>{{item.spotStatus}}</td>
                                <td>大货价</td>
                                <td>{{item.largeUnit}}</td>
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
                                <el-select style="width:100%" size="small" v-model="logistics.deliType" placeholder="请选择快递公司">
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

        <el-dialog :visible.sync="providerSearchShow" top="5vh" width="80vw" custom-class="provider-search-dialog">
            <!-- <div class="clearfix">
                <span>供应商筛选</span>
            </div> -->
            <el-form ref="searchProviderForm" label-width="90px" :model="searchProviderForm">
                <div class="search-screen">
                    
                        <el-form-item label="供应商名" prop="providerName">
                            <el-input size="mini" v-model.trim="searchProviderForm.providerName" placeholder="请输入供应商名称"></el-input>
                        </el-form-item>
                        <el-form-item label="主营业务" prop="keyIds">
                            <el-select v-model="searchProviderForm.keyIds" placeholder="请选择" size="mini">
                                <el-option label="无" value=""></el-option>
                                <el-option v-for="(val,key) in busiScope[2]" :key="key" :label="val" :value="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字符" prop="keyword">
                            <el-input size="mini" v-model.trim="searchProviderForm.keyword"  placeholder="请输入查找关键字"></el-input>
                        </el-form-item>
                        <el-form-item label-width="20px">
                            <el-button type="primary" size="mini" @click="handleSubmitSearchProviderForm" plain>搜索</el-button>
                            <el-button size="mini" plain @click="handleEmptySearchProviderList">清空</el-button>
                            <el-button type="success" size="mini" plain @click="handleAddToProviderList">添加</el-button>
                        </el-form-item>
                    
                </div>
            </el-form>
            <div v-if="searchProviderList.length == 0" style="text-align:center">暂无数据</div>
            <ul v-else class="provider-list">
                
                <li v-for="(item,index) of searchProviderList" 
                :key="item.userId" 
                :style="`background-color:${item.selection ? '#f0f9eb' : '#fff'}; cursor: pointer;`"
                @click="handleTwoWaySelection(index)">
                    <div>
                        <el-tag>{{item.name}}</el-tag>
                    </div>
                    <div>
                        <div>
                            <label>针织：</label>
                            <p>
                                <span v-for="val of item.busiKeywords" :key="val.keyId">
                                    <template v-if="val.groupId == 1">
                                        {{val.keyword}}、
                                    </template>
                                </span>
                            </p>
                        </div> 
                        <div>
                            <label>棱织：</label>
                            <p>
                                <span v-for="val of item.busiKeywords" :key="val.keyId">
                                    <template v-if="val.groupId == 2">
                                        {{val.keyword}}、
                                    </template>
                                </span>
                            </p>
                        </div> 
                        <div><label>备注：</label><p>{{item.memo}}</p></div>
                    </div>
                </li>
            </ul>
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
    providerListFilter,
    providerListByMemo
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

            providerSearchShow:false,
            searchProviderForm:{
                providerName:'',
                keyIds:'',
                keyword:''
            },
            searchProviderList:[

            ],
            searchProviderName: '',
            providerList:[],
            providerListMemo:[],
            deliverType:null,
            inquiryType:null,
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
            marketId:null,
            otherKeyword:null,
            otherKeywordExplicit:null,
            desc:'',  
            desirePrice:null,
            deliverPayTime:null,
            deliverPayAmount:null,
            busiScope:[
                [],
                [],
                []
            ],

            matching:[
                [],
                []
            ],

            sendSmsAgainShow:false,
            sendSmsAgainList:[
                /* {
                    name:'',
                    userId:''
                } */
            ],

            typeIsChange            :false,
            acceptCustomizeIsChange :false,
            keywordsIsChange        :false,
            otherKeywordIsChange    :false,
            expireTimeIsChange      :false,
            descIsChange            :false,
            noteIsChange            :false,
            
            noteContent:'',
            detail:{
                note:[],
                payInfo:{}
            },
            priceUnit:[
                {t:0,n:'',s:''},
                {t:1,n:'/米',s:''},
                {t:2,n:'/公斤',s:''},
                {t:3,n:'/码',s:''},
                {t:4,n:'/包',s:''},
                {t:5,n:'/条',s:''},
            ],
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

        //计算有多少个需要发送短息的供应商
        usersArr: function(){
            
            let providerList = []

            /* for(let item of this.classifyList){
                
                for(let val of item.providerList){
                    providerList.push(val.userId)
                }

            } */   //提取供应商的值

            let newProviderList = [...this.providerList,...this.providerListMemo]

            for(let item of newProviderList){
                
                for(let val of item.busiKeywords){
                    providerList.push(val.userId)
                }

            }

            providerList = Array.from(new Set(providerList))    //数组去重

            return providerList
        },
        payInfoItems:function(){
            if(this.detail.payInfo.hasOwnProperty('items')){

                let receipt = this.receiptList.find(res => res.receiptId == res.receiptId)
                let name = ''
                if(receipt){
                    name = receipt.provider.name
                }

                return this.detail.payInfo.items.map(res => {
                    return {
                        name        : name,
                        payType     : this.priceTypes[res.payType].label,
                        buyNumber   : res.buyNumber,
                        price       : `${res.price}${this.priceUnit[res.unit].n}`,
                        buyColorCode: res.buyColorCode,
                        payAmount   : res.payAmount
                    }
                })
            }else{
                return []
            }
            
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

        //克隆一个vue原型上的方法让其可以在html中使用import加载的函数
        parseTimeClone(time , format = "{y}-{m}-{d} {h}:{i}"){
            return parseTime( time,format)
        },

        //对应全局变量参数marketId
        marketRange(t){
			return t < 99 ? global_.marketRange[t].n : '其他'
		},

        //跳转外部链接事件
        handleToProviderCreated(){
            let routeUrl = this.$router.resolve({
                path: "/providerCreatedBatch",
            });
            window.open(routeUrl.href, '_blank');
        },

        //精确搜素供应商并添加到providerList列表
        handleAddToProviderList(){
            //筛选出状态为true的项
            let addArr   = this.searchProviderList.filter(res => res.selection == true)
            //合并已有项和新添加的项
            let mergeArr = [...addArr,...this.providerList]
            //使用筛选+Map类型的方式去重，has如果没有找到对象就使用set进行添加
            const newRes = new Map()
            let formatArr = mergeArr.filter((item) => !newRes.has(item.userId) && newRes.set(item.userId, 1))
            //返回数组对象去重后新添加了数据的数组
            this.providerList = formatArr

            this.$message({
                message: '供应商添加成功！',
                type: 'success'
            })

            this.providerSearchShow = false
        },

        //模糊搜索供应商
        async querySearchAsync(queryString, cb){

            let params = {
                page           : 0,
                pageSize       : 20,
                providerName   : queryString,
                keyIds         : '',
                keyword        : ''
            }

            let resList = await this.getSearchProviderForm(params)

                /* resList = resList.map((item)=>{
                    item.value = item.name
                    return item
                }) */

            cb(resList)
            
        },

        //选择模糊搜索出来的其中一个值
        handleSelect(item){
            this.sendSmsAgainList.push(item)
            this.searchProviderName = ''
        },

        //重置供应商搜索表单和列表
        handleEmptySearchProviderList(){
            this.$refs['searchProviderForm'].resetFields()
            this.searchProviderList = []
        },

        //条件搜索供应商返回并数组列表
        getSearchProviderForm(params){

            return providerListFilter(params).then(res => {

                return res.list

            }) 
        },

        //提交搜索条件并请求接口进行搜索
        async handleSubmitSearchProviderForm(){

            let {providerName,keyIds,keyword} = this.searchProviderForm

            if(providerName == '' && keyIds == '' && keyword == ''){
                this.$message({
                    message: '请至少填入一项搜索选项！',
                    type: 'warning'
                })
                return
            }

            let params = {
                page           :0,
                pageSize       :50,
                ...this.searchProviderForm
            }

            let resList = await this.getSearchProviderForm(params)

            this.searchProviderList = resList.map(item => {
                item.selection = false
                return item
            })
        },

        //搜索供应商点击切换状态
        handleTwoWaySelection(index){

            let {selection} = this.searchProviderList[index]

            this.searchProviderList[index]['selection'] = !selection
        },

        //使用jsx实现template实现不了的逻辑代码,已发送短信列表
        renderTagSendSms(arr){
            return (
                arr.map(item => {

                    let {sendStatus,reqStatus,opUserId,userId,type = ''} = item

                    let stateText = opUserId != null && opUserId != userId ? '[替回]' : ''

                    if(sendStatus == 0){

                        type = 'warning'

                    }else if(sendStatus == 1){

                        type = 'primary'

                        if(reqStatus == 1 || opUserId != null) {

                            type = 'success'

                        }
                    }else if(sendStatus == 2){

                        type = 'danger'

                    }else{

                        type = 'danger'

                    }
                    return <el-tag 
                        type    = {type}
                        key     = {item.userId}
                        nativeOnClick = {()=>{
                            if(opUserId == null){
                                /* this.$message('该功能正在开发，请下个版本再调试！') */
                                this.$router.push({path:'/inquiryReceipt', query:{
                                    inquiryId : this.inquiryId,
                                    providerId: item.userId
                                }})
                            }
                        }}
                        style   = {{ margin: '0 10px 10px 0',cursor:'pointer'}}>
                        {item.provider}[{item.smsCode}]{stateText}
                    </el-tag>
                })
            )
        },

        //删除精确搜索出来的供应商
        handleDeleteSendAgainSms(index){
            this.sendSmsAgainList.splice(index, 1)
        },

        //再次发送短信接口
        getSendSmsAgain(){

            let users = this.sendSmsAgainList.map((res)=>{
                return res.userId
            })

            let params = {
                inquiryId: this.inquiryId,
                users    : JSON.stringify(users)
            }

            sendInquiry(params).then(res => {

                this.$message({
                    message: '再次发送短信成功！',
                    type: 'success'
                })

                this.sendSmsAgainShow = false

                for(let item of this.sendSmsAgainList){
                    this.sendSmsList.push({
                        reqStatus  : 1,
                        sendStatus : 0,
                        userId     : item.userId,
                        provider   : item.name,
                        smsCode    : item.smsCode || '待收取'
                    })
                }

            })

        },

        //供应商搜索事件请求//此请求替换成了querySearchAsync模糊搜索
        async getSearchProviderName(){

            /* let send   =  this.sendSmsAgainList.findIndex((item) => item.userId == this.searchProviderId)
            let unsent =  this.sendSmsList.findIndex((item)      => item.userId == this.searchProviderId)
            if(send == -1 && unsent == -1){
                getInfo(this.searchProviderId).then(res => {
                
                    let {name,userId} = res
                    
                    this.sendSmsAgainList.push({
                        name:name,
                        userId:userId
                    })
                    this.searchProviderId = ''

                })
            }else{
                this.$message.error('已发送过的短信请勿重复添加！')
            } */

            let params = {
                page           :0,
                pageSize       :50,
                providerName   :this.searchProviderName,
                keyIds         :'',
                keyword        :''
            }

            let resList = await this.getSearchProviderForm(params)

            this.sendSmsAgainList = resList

            this.searchProviderName = ''

        },

        //删除待发供应商短信列表事件
        handleDeleteProvider(index){
            /* this.classifyList[classifyIndex].providerList.splice(providerIndex, 1) */
            this.providerList.splice(index, 1)
        },

        //删除待发供应商短信列表事件(备注查找列表)
        handleDeleteProviderMemo(index){
            /* this.classifyList[classifyIndex].providerList.splice(providerIndex, 1) */
            this.providerListMemo.splice(index, 1)
        },

        //更改快递信息
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

        //点击修改需求单状态事件
        handleChangeInquiry(status){

            this.$confirm('请确认您是否需要更改订单状态！', '提示', {
                confirmButtonText: '确认无误',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.getUpdateInquiryStatus(status)

            }).catch(() => {})
            
        },

        //修改需求单状态请求接口
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

        //发布需求的两个步骤，发送短信，修改需求单状态为成功
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
                this.inquiryType     = res.inquiryType == 1 ? '普通找版' : '精准找版'
                this.createTime      = parseTime(res.createTime,"{y}-{m}-{d} {h}:{i}")
                this.expireTime      = res.expireTime
                this.saysPassed      = formatTime(res.createTime / 1000),
                this.companyName     = res.companyName
                this.name            = res.name
                this.area            = res.area
                this.address         = res.address
                this.phone           = res.phone
                this.imageList       = res.imageList
                this.marketId        = res.marketId < 99 ? global_.marketRange[res.marketId].n : '其他'
                this.status          = cloneObj(byTypeGetObj(res.status,global_.inquiryStatusD))
                this.detail          = res.detail
                this.type            = res.type
                this.acceptCustomize = res.acceptCustomize
                this.deputeCollect   = res.deputeCollect
                this.otherKeyword    = res.otherKeyword
                this.otherKeywordExplicit = res.otherKeyword
                this.desc            = res.desc
                this.trackingNum     = res.trackingNum || ''
                this.deliCom         = res.deliCom || ''
                this.deliType        = res.deliType || ''
                this.deliverType     = res.deliverType == 1 ? '快递' : '自提'
                this.desirePrice     = res.desirePrice
                this.logistics.trackingNum  = res.trackingNum || ''
                this.logistics.deliCom      = res.deliCom || ''
                this.logistics.deliType     = res.deliType || ''
                this.deliverPayTime         = parseTime(res.deliverPayTime,"{y}-{m}-{d}")
                this.deliverPayAmount       = res.deliverPayAmount

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

            //依赖上面的备注信息查询供应商列表
            await this.getProviderListByMemo()


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
            
            //初始化供应商需求回单列表
            await getInquiryReceiptList({
                inquiryId : this.inquiryId,
                status    : '-1',
                page	  : 0,
                pageSize  : 50
            }).then(res => {

                let receiptList = [] 

                for(let item of res.list){

                    console.log(item)
                    
                    receiptList.push(
                        {
                            userId          : item.userId,
                            opUserId        : item.opUserId,
                            status          : item.status,
                            inquiryId       : item.inquiryId,
                            createTime      : parseTime(item.createTime,"{y}-{m}-{d} {h}:{i}"),
                            imgUrlListValue : item.imgUrlListValue,
                            colorCardCode   : item.colorCardCode,
                            colorCard       : item.colorCard == 1 ? '免费' : '付费' ,
                            stock           : item.stock,
                            productName     : item.productName,
                            ingredients     : item.ingredients,
                            width           : item.width,
                            weight          : item.weight,
                            unitPrice       : item.unitPrice.toFixed(2) + '元/米',
                            largeUnit       : item.largeUnit.toFixed(2) + '元/米',
                            spotStatus      : item.spotStatus ? '定制' : '现货',
                            samplePrice     : item.samplePrice.toFixed(2) + '元/米',
                            description     : item.description,
                            unRead          : item.unRead,
                            provider        : {
                                userId      : item.provider.userId,
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

                    let {opUserId} = this.receiptList.find(res => res.provider.userId == item.userId) || {opUserId:null}

                    return {
                        userId    : item.userId,
                        sendStatus: item.sendStatus,
                        reqStatus : item.reqStatus,
                        provider  : item.provider,
                        smsCode   : item.smsCode,
                        opUserId  : opUserId
                    }
                })
                
            })


        },

        //查询供应商列表
        getProviderList(){

            let keyIds = [...this.matching[0],...this.matching[1]]

            if(keyIds.length == 0){
                this.providerList = []
                return false
            }

            let classifyList = []
            let params = {
                keyIds:keyIds.join(),
                page:0,
                pageSize:20
            }

            return providerListByKeys(params).then(res => {
    
                    /* for(let keyId of keyIds){
                        
                        let addData = {
                            label        :  this.busiScope[2][keyId],
                            keyId        :  keyId,
                            providerList :  []
                        }

                        for(let item of res.list){

                            for(let single of item.busiKeywords){
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
                        
                    } */
                    
                    this.providerList = res.list
                    /* this.classifyList = classifyList */

                    return true
                })
            
            
        },

        //按备注查询供应商列表
        getProviderListByMemo(){

            if(this.otherKeyword == ''){

                this.providerListMemo = []

                return true
                
            }else{

                let params = {
                    memo    : this.otherKeyword,
                    page    : 0,
                    pageSize: 20
                }

                return providerListByMemo(params).then(res => {

                    this.providerListMemo = res.list

                    return true
                })
            }
            
        },

        //点击修改订单需求信息事件，弹出修改框/提交修改后的资料
        async handleConfirm(noun){


            if(this[noun + 'IsChange']){

            let params = {}

            //品类参数格式化
            if(noun == 'keywords'){

                let keywords = [...this.matching[0],...this.matching[1]].map((val)=>{
                                    return {
                                        "keyId": val
                                    }
                                })
                params = {
                    "keywords": keywords
                }

            //客服备注参数格式化
            }else if(noun == 'note'){

                if(this.noteContent == '') {

                    this.noteIsChange = false

                    return false

                }

                this.detail.note.push ({
                    
                    createTime  : new Date(),
                    content     : this.noteContent
                            
                })

                params = {
                    detail: this.detail
                }

            //品类备注参数格式化
            }else if(noun == 'otherKeyword'){
                
                params = {
                    [noun] : this[noun] == '' ? "null" : this[noun]
                }

            //其他参数
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
                    
                    this.getProviderList()
                 
                }

                if(noun == 'otherKeyword'){

                    this.otherKeywordExplicit = this.otherKeyword

                    this.getProviderListByMemo()

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
        display: flex;
        justify-content: space-between;
    }

}

.provider-list{
    border:1px solid #ebeef5;
    display:flex;
    flex-flow:row wrap;
    li{
        display:flex;
        width:50%;
        border-right:1px solid #ebeef5;
        border-bottom:1px solid #ebeef5;
        & > div:nth-child(1){
            text-align:center;
            padding:8px;
            min-width:30%;
            height:100%;
            border-right:1px solid #ebeef5;
        }
        & > div:nth-child(2){
            padding:8px;
            & > div{
                display:flex;
                margin-bottom:10px;
                label{
                    min-width:50px;
                }
                span{
                    white-space: nowrap;
                    display: inline-block;
                }
            }
        }
    }
}

.send-sms{
    & > div{
        &:nth-child(1){
            margin-bottom:20px;
            font-size:12px;
            span{
                position: relative;
                padding-left:20px;
                &:before{
                    content:'';
                    position: absolute;
                    width:10px;
                    height:10px;
                    left:4px;
                    top:2px;
                }
            }
            @each $i, $color in (1: #e6a23c, 2: #409EFF, 3:#67C23A, 4 :#F56C6C) {
                span:nth-child(#{$i}):before{background-color:$color;}
            }

        }
    }
}

.provider-search-dialog{

    .provider-list{
        max-height:68vh;
        overflow-y: auto;
    }
    .search-screen{
        display:flex;
        
    }
}

</style>

<style lang="scss">
.search-autocomplete{
    li{
        line-height: normal;
        padding: 7px;

    }
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
}
</style>


