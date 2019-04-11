<template>
  <div class="main-content" style="padding:10px;">


        <el-button type="primary" style="float:right;margin-bottom: 10px;" size="small" @click="addOne">
            添加一条
        </el-button>
  
    
    <el-table
        :data="providerList"
        border
        style="width: 100%;"
        @cell-click="edit"
        empty-text="没有数据"
        :row-class-name="tableRowIndex">
        <el-table-column
            type="index"
            width="50">
        </el-table-column>
        
        <el-table-column
            v-for="(column,index) in columns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width">
                
                <template slot-scope="scope">

                    <div v-if="column.slot == 'busiScope'">

                        <div class="busi-scope">
                            <div v-if="scope.row.busiScope.knitting.length != 0">
                                <label style="line-height:3;">针织：</label>
                                <!-- <span v-for="(val,index) in scope.row.busiScope.knitting" :key="index">{{val}}、</span> -->
                                <span v-for="(val,index) in conversion(scope.row.busiScope.knitting,'knitting')" :key="index">{{val}}、</span>
                            </div>
                            <div v-if="scope.row.busiScope.tatting.length != 0">
                                <label style="line-height:3;">梭织：</label>
                                <span v-for="(val,index) in conversion(scope.row.busiScope.tatting,'tatting')" :key="index">{{val}}、</span>
                            </div>
                        </div>

                        <el-popover
                            placement="left"
                            title="主营业务(面料种类)"
                            width="600"
                            trigger="click">
                            <div>
                                <label style="line-height:3;">针织：</label>

                                <el-checkbox-group v-model="scope.row.busiScope.knitting" size="mini">
                                    <el-checkbox v-for="(value,index) in busiScope.knitting" :key="index" :label="value.keyId" border style="margin:0 0 10px 10px;">{{value.keyword}}</el-checkbox>
                                </el-checkbox-group>

                                <label style="line-height:3;">梭织：</label>

                                <el-checkbox-group v-model="scope.row.busiScope.tatting" size="mini">
                                    <el-checkbox v-for="(value,index) in busiScope.tatting" :key="index" :label="value.keyId" border style="margin:0 0 10px 10px;">{{value.keyword}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                            
                            <el-button size="mini" type="text" slot="reference">
                                {{scope.row.busiScope.knitting == 0 && scope.row.busiScope.tatting == 0 ? '添加' : '修改'}}
                            </el-button>
                        </el-popover>

                    </div>

                    <div v-else>
                        <el-input
                        :autofocus="true"
                        v-model.trim="scope.row[column.prop]"
                        @blur="complete(scope.$index)"
                        size="mini"
                        @keyup.enter.native="complete(scope.$index)"
                        v-show="inputShow[0] == scope.$index && inputShow[1] == column.prop"
                        :placeholder="'请输入' + column.label"/>
                        <span v-show="!(inputShow[0] == scope.$index && inputShow[1] == column.prop)">
                            {{scope.row[column.prop]}}
                        </span>
                    </div>
                    
                </template>

        </el-table-column>

        <el-table-column label="操作" prop="operation">
            <template slot-scope="scope">
                <el-button size="mini" type="text" @click.stop="deleteOne(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    
    <div style="text-align:center; padding:10px;">
        <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
    
  </div>
</template>

<script type="text/ecmascript-6">

    import { changeUserMgrBatch } from '@/api/user';
    import { fabricKeywords } from '@/api/product';

    export default {
        /* components: {
            ComponentA:{
                template:" <div><h3>这里是子组件</h3><slot></slot></div>"
            }
        }, */
        data() {
            return {
                providerList :[
                    
                ],
                columns: [
                    { prop: 'shopNo', label: '档口编号', required :true},
                    { prop: 'name', label: '档口名称', required :true},
                    { prop: 'linkman', label: '联系人' },
                    { prop: 'regTel', label: '电话' , required :true},
                    { prop: 'address', label: '地址' , width:200, required :true},
                    { prop: 'busiScope', label: '主营品类' , width:200, slot:'busiScope'},
                    { prop: 'tel', label: '固定电话' },
                    { prop: 'memo', label: '备注' }
                ],
                inputShow:[null,null],
                busiScope:{
                    knitting:[
                        {
                            "keyId":1002,
                            "keyword":"卫衣"
                        }],
                    tatting:[
                        {
                            "keyId":1002,
                            "keyword":"卫衣"
                        }
                    ]
                }
            }
        },
        created() {

            for (let i = 0; i < 5; i++) {
                this.providerList.push({
                    shopNo:'',
                    name:'',
                    linkman:'',
                    regTel:'',
                    address:'',
                    busiScope:{
                        knitting:[],
                        tatting :[]
                    },
                    tel:'',
                    memo:''
                })
            }

            fabricKeywords(0).then(res => {

                this.busiScope.knitting = res[0].list
                this.busiScope.tatting  = res[1].list

            })

            

            
        },
        mounted () {
            window.onbeforeunload = (e) => {
                if (this.$route.name == "providerCreatedBatch") {
                    e = e || window.event;
                    // 兼容IE8和Firefox 4之前的版本
                    if (e) {
                        e.returnValue = '请确认提交后再关闭网页！'
                    }
                    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                    return '请确认提交后再关闭网页！'
                } else {
                    window.onbeforeunload = null
                }
            }
        },
        methods: {

            conversion:function(arr,type){

                let newArr = []

                for(let val of arr){
                    
                    let target = this.busiScope[type].find((obj) => obj.keyId == val)

                    newArr.push(target.keyword)
                }
            
                return newArr
            },

            tableRowIndex({row, rowIndex}){
                row.index = rowIndex
            },

            edit : function(row, column, event){

                if(column.property == "busiScope" || column.property == "operation" ){
                    return 
                }

                let prop = column.property
                let index  = row.index
                this.inputShow = [index,prop]
                this.$nextTick(function () {
                    event.querySelector('input').focus()
                })
                
            },
            addOne: function(){
                
                if(this.providerList.length == 10){
                    return alert('至多只能输入10条信息~');
                }

                this.providerList.push({
                    shopNo:'',
                    name:'',
                    linkman:'',
                    regTel:'',
                    address:'',
                    busiScope:{
                        knitting:[],
                        tatting :[]
                    },
                    tel:'',
                    memo:''
                })
            },
            deleteOne(index){

                this.providerList.splice(index,1)
            },
            submitForm() {
                
                if(this.providerList.length <= 0){
                    return alert('请至少添加一条数据~');
                }

                for(let index in this.providerList){

                    for(let value in this.providerList[index]){

                        let providerObject = this.providerList[index]

                        delete providerObject.index

                        /* if(value == 'busiScope'){

                            if(providerObject[value].knitting.length == 0 && providerObject[value].tatting.length == 0){

                                alert("第"  + (Number(index) + 1) + "行的主营业务请至少选择一个！" )

                                return
                            }

                        }else{ */
                            if(providerObject[value] == '' && value != 'memo' && value != 'tel' && value != 'linkman'){
                            
                                let column = this.columns.find((el)=> el.prop == value)
                                
                                alert("第"  + (Number(index) + 1) + "行的" + column.label + "不能为空！" )

                                return
                            }
                        /* } */
                    }

                }

                let formatArr = this.providerList.concat().map((item)=>{

                    let newArr = item.busiScope.knitting.concat(item.busiScope.tatting)

                    let busiScope = []

                    for(let value of newArr){
                        busiScope.push({
                            keyId : value
                        })
                    }
                    
                    return {
                        shopNo    :item.shopNo,
                        name      :item.name,
                        linkman   :item.linkman,
                        regTel    :item.regTel,
                        address   :item.address,
                        busiKeywords :busiScope,
                        tel       : item.tel,
                        memo      : item.memo,
                    }
                })

                this.$confirm('请确认录入的资料是否填写正确?', '提示', {
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    changeUserMgrBatch({

                        datas: JSON.stringify(formatArr)

                    }).then(res => {

                        alert('提交成功!')
                        this.providerList = []

                    })

                }).catch(() => {})
   
                
            },
            complete : function(index){
                this.inputShow = [null,null]
            }
        },
    };
</script>

<style lang="scss" scoped>
.busi-scope{
    font-size:12px;
}
</style>
