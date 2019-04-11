<template>
  <div class="content">
    <!-- <el-container>
      <el-header><h3>账号信息</h3></el-header>
      <el-main>
        <el-form :model="providerForm" status-icon ref="providerForm" label-width="100px"
                 class="providerDetail">
          <el-form-item label="注册时间:">
            <p>{{registerTime}}</p>
          </el-form-item>
          <el-form-item label="供应商ID:">
            <p>{{userId}}</p>
          </el-form-item>
          <el-form-item label="用户名:">
            <p>{{userName}}</p>
          </el-form-item>
          <el-form-item label="注册手机号:">
            <el-input v-show="telInput" style="width: 200px;" v-model="regTel"></el-input>
            <span v-show="!telInput">{{regTel}}</span>
            <el-button type="text" @click="changeTel">修改注册手机号</el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button type="text" @click="resetPwd">重置密码为123456</el-button>
          </el-form-item>
          <el-form-item label="现货结算等级:">
            <el-radio-group v-model="providerForm.incomeLevel" style="padding-top: 13px;">
              <div style="margin-bottom: 15px;">
                <el-radio :label="2">现金结算</el-radio>
              </div>
              <div style="margin-bottom: 15px;">
                <el-radio :label="5">7天</el-radio>
                <el-radio :label="6">15天</el-radio>
                <el-radio :label="1">30天</el-radio>
                <el-radio :label="7">60天</el-radio>
              </div>
              <div style="margin-bottom: 15px;">
                <el-radio :label="3">3-6-1</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container> -->
    <el-container>
      <el-header><h3>供应商信息</h3></el-header>
      <el-main>
        <el-form :model="providerForm" status-icon ref="providerForm" label-width="100px" class="providerForm">
          
          <el-form-item label="联系电话:" prop="regTel" required>
            <el-input v-model="providerForm.regTel"></el-input>
          </el-form-item>
          <el-form-item label="公司名称:" prop="name" required>
            <el-input v-model="providerForm.name"></el-input>
          </el-form-item>
          <el-form-item label="店铺编号:" prop="shopNo">
            <el-input v-model="providerForm.shopNo"></el-input>
          </el-form-item>
          <el-form-item label="店铺地址:" prop="address" required>
            <el-input v-model="providerForm.address"></el-input>
          </el-form-item>
          <el-form-item label="联系人:" prop="linkman">
            <el-input v-model="providerForm.linkman"></el-input>
          </el-form-item>
          <el-form-item label="固定电话:" prop="tel">
            <el-input v-model="providerForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="主营关键字:">
            <div style="display:flex;">
                <div>
                  <p v-if="matching[0].length != 0">
                    <label>针织：</label>
                    <span v-for="(val,index) in matching[0]" :key="index">{{busiScope[2][val]}}、</span>
                  </p>
                  <p v-if="matching[1].length != 0">
                    <label>梭织：</label>
                    <span v-for="(val,index) in matching[1]" :key="index">{{busiScope[2][val]}}、</span>
                  </p>
                </div>
                <el-popover
                    placement="right"
                    title="主营业务(面料种类)"
                    width="600"
                    trigger="click">
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
                    <el-button type="text" size="mini" slot="reference">修改</el-button>
                </el-popover>
            </div>
            
          </el-form-item>
          <el-form-item label="备注:" prop="memo">
            <el-input type="textarea" v-model="providerForm.memo"></el-input>
          </el-form-item>
          <!-- <el-form-item label="经营品类:">
            <el-checkbox-group v-model="providerForm.majorList">
              <el-checkbox v-for="type in types" :label="type.catId" :key="type.catId">{{type.major}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <!-- <el-form-item label="公司工商执照:">
            <el-upload
              class="avatar-uploader"
              :action="uploadAvatarApi"
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="providerForm.busiLicenseImg" :src="providerForm.busiLicenseImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="submitForm('providerForm')">保存</el-button>
            <el-button @click="backPage">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import { fabricKeywords } from '@/api/product'
  import { getInfo, changeUserMgr, option,selfMdfProvider } from '@/api/user';
  import { parseTime, cloneObj } from '@/utils/index';
  import { OPEN_API } from '../../../../config/prod.env';

  const oploadApi = OPEN_API.slice(1, -1);

  export default {
    data() {
      return {
        uploadAvatarApi: oploadApi + '/upload?type=0',
        types: [{ catId: 31, major: '面料' }, { catId: 32, major: '辅料' }],
        userName: '',
        userId: 0,
        registerTime: 0,
        regTel: '',
        oldRegTel: '',
        providerForm: {
          /* incomeLevel: '', */
          userId: 0,
          linkman: '',
          tel: '',
          name: '',
          address: '',
          regTel:'',
          shopNo:'',
          memo:'',
          busiKeywords:[]
          /* majorList: [], */
          /* busiLicenseImg: '' */
        },

        busiScope:[
            [],
            [],
            []
        ],
        matching:[
            [],
            []
        ],
        telInput: false
      };
    },
    created() {
      this.userId = this.$route.query.pid;
      this.getUserDetail();
    },
    methods: {
      async getUserDetail() {

        await fabricKeywords(0).then(res => {

            this.busiScope[0] = res[0].list
            this.busiScope[1] = res[1].list
            let mergeArr = res[0].list.concat(res[1].list)
            let busiScope = {}
            for(let item of mergeArr){
                busiScope[item.keyId] = item.keyword
            }

            this.busiScope[2] = busiScope

        })

        await getInfo(this.userId).then(res => {

          this.providerForm.linkman   = res.linkman
          this.providerForm.tel       = res.tel
          this.providerForm.name      = res.name
          this.providerForm.address   = res.address
          this.providerForm.regTel    = res.regTel
          this.providerForm.shopNo    = res.shopNo
          this.providerForm.memo      = res.memo
          
          for(let item of res.busiKeywords){
              if(item.groupId == 1){
                  this.matching[0].push(item.keyId)
              }else if(item.groupId == 2){
                  this.matching[1].push(item.keyId)
              }
          }
          /* this.providerForm.busiScope = res.busiKeywords */


          /* this.providerForm.incomeLevel = res.incomeLevel;
          this.providerForm.address = res.address;
          this.providerForm.name = res.name;
          this.userName = res.userName;
          this.registerTime = parseTime(res.registerTime);
          this.regTel = res.regTel;
          this.oldRegTel = res.regTel;
          this.providerForm.linkman = res.linkman;
          this.providerForm.tel = res.tel;
          this.providerForm.busiLicenseImg = res.busiLicenseImg;
          this.providerForm.majorList = res.majorList.map(item => {
            return item.catId;
          }); */ 

        })
      },
      changeTel() {
        if (!this.telInput) {
          this.telInput = true;
        } else {
          this.telInput = false;
        }
      },
      resetPwd() {
        if (confirm('确认重置密码吗?')) {
          changeUserMgr({
            op: option.changeUserPass,
            toUserId: this.userId,
            newPwd: 'E10ADC3949BA59ABBE56E057F20F883E'
          }).then(res => {
            alert('密码重置成功!');
          });
        }
      },
      handleAvatarSuccess(res, file) {
        if (res.result === '0') {
          this.providerForm.busiLicenseImg = res.urls[0].image;
          this.$message({ message: '上传成功', type: 'success' });
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

              let busiKeywords = this.matching[0].concat(this.matching[1]).map(val => {
                  return {
                      "keyId" : val
                  }
              })

              this.providerForm.busiKeywords = busiKeywords
              this.providerForm.userId = Number(this.$route.query.pid)

              let params = {
                  userId:1,
                  provider: JSON.stringify(this.providerForm) 
              }

              selfMdfProvider(params).then(res => {
                  this.$message({ message: '供应商资料修改成功!', type: 'success' })
              })
          }
      })
        /* if (formName.majorList.length == 0) {
          alert('请选择一种经营品类~');
          return;
        } else if (!formName.incomeLevel) {
          alert('请选择一种结算等级~');
          return;
        } else {
          let form = cloneObj(formName);
          form.majorList = form.majorList.map(item => {
            return { catId: item }
          });
          changeUserMgr({
            op: option.changeUserInfo,
            toUserId: this.userId,
            userInfo: JSON.stringify(form)
          }).then(res => {
            this.$message({ message: '修改成功!', type: 'success' });
          });
          if (this.oldRegTel != this.regTel) {
            changeUserMgr({
              op: option.changeRegTel,
              toUserId: this.userId,
              newRegTel: this.regTel
            }).then(res => {
            });
          }
          ;
        } */
      },
      backPage() {
        this.$router.push({ path: 'providerList' });
      }
    }
  }
</script>

<style scoped>
  .content {
    margin: 30px 50px;
    width: 50%;
  }

  /* .el-button {
    width: 117px;
  } */

  .avatar-uploader {
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

  .resetPass {
    color: #409EFF;
  }

  .el-header {
    border-bottom: 1px solid;
  }

  .providerDetail .el-form-item {
    margin-bottom: 0;
  }
</style>
