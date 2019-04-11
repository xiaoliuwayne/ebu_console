<template>
  <div class="content">
    <el-container>
      <el-header><h3>账号信息</h3></el-header>
      <el-main>
        <!--<el-form :model="providerForm" status-icon ref="providerForm" label-width="100px"-->
                 <!--class="providerDetail">-->
        <el-form status-icon label-width="100px"
                 class="providerDetail">
          <el-form-item label="注册时间:">
            <p>{{registerTime}}</p>
          </el-form-item>
          <el-form-item label="采购商ID:">
            <p>{{userId}}</p>
          </el-form-item>
          <el-form-item label="注册手机号:">
            <el-input v-show="telInput" style="width: 200px;" v-model="userInfo.regTel"></el-input>
            <span v-show="!telInput">{{userInfo.regTel}}</span>
            <el-button type="text" @click="changeTel">修改注册手机号</el-button>
            <el-button v-show="telInput" type="text" @click="changeTelCancle" style="width: 50px;margin: 0px;">取消
            </el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button type="text" @click="resetPwd">重置密码为123456</el-button>
          </el-form-item>
          <el-form-item label="现货结算等级:">
            <el-radio-group v-model="userInfo.incomeLevel" style="padding-top: 13px;">
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
          <el-form-item label="对外售价:">
            <el-radio-group v-model="userInfo.pricePrivilege" style="padding-top: 13px;">
              <div style="margin-bottom: 15px;">
                <el-radio :label="0">销售价</el-radio>
              </div>
              <div style="margin-bottom: 15px;">
                <el-radio :label="1">成本价</el-radio>
              </div>
              <div style="margin-bottom: 15px;">
                <el-radio :label="2" style="vertical-align: middle;">折扣价</el-radio>
                <div style="display: inline-block;" v-show="userInfo.pricePrivilege==2">
                  <el-input size="mini" min="0" type="number" v-model="userInfo.discountRate">
                    <!--<template slot="append">%</template>-->
                  </el-input>
                </div>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-container>
      <el-header><h3>采购商备注信息（管理员后期补充信息）</h3></el-header>
      <el-main>
        <!--<el-form :model="providerForm" status-icon ref="providerForm" label-width="100px" class="providerForm">-->
        <el-form status-icon label-width="100px" class="providerForm">
          <el-form-item label="公司名称:" prop="name">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="公司地址:" prop="address">
            <el-input v-model="userInfo.address"></el-input>
          </el-form-item>
          <el-form-item label="联系人:" prop="linkman">
            <el-input v-model="userInfo.linkman"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="tel">
            <el-input v-model="userInfo.tel"></el-input>
          </el-form-item>
          <el-form-item label="经营品类:">
            <el-input v-model="userInfo.major"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button @click="backLogin">取消</el-button>
            <el-button @click="delUser">删除用户</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import { getInfo, changeUserMgr, option } from '@/api/user';
  import { parseTime, cloneObj } from '@/utils/index';

  export default {
    data() {
      return {
        userId: 0,
        types: [{ catId: 31, major: '面料' }, { catId: 321, major: '纽扣' }, { catId: 322, major: '拉链' }],
        userInfo: {},
        registerTime: '',
        telInput: false
      };
    },
    created() {
      this.userId = this.$route.query.id;
      this.getUserDetail();
    },
    methods: {
      getUserDetail() {
        getInfo(this.userId).then(res => {
          this.userInfo = res;
          this.registerTime = parseTime(res.registerTime);
        });
      },
      changeTel() {
        if (this.telInput) {
          this.$confirm(`确定将注册手机号修改成：${this.userInfo.regTel}`, '确定修改', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {
              op: 15,
              toUserId: this.userId,
              newRegTel: this.userInfo.regTel
            };
            changeUserMgr(data).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.telInput = !this.telInput;
            }).catch();
          });
        } else {
          this.telInput = !this.telInput;
        }
      },
      changeTelCancle() {
        this.telInput = false;
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
      submitForm() {
        this.userInfo.discountRate = this.userInfo.pricePrivilege == 2 ? this.userInfo.discountRate : 1;
        changeUserMgr({
          op: option.changeUserInfo,
          toUserId: this.userId,
          userInfo: JSON.stringify(this.userInfo)
        }).then(res => {
          this.$message({ message: '修改成功!', type: 'success' });
        });
        // if (this.oldRegTel != this.regTel) {
        //   changeUserMgr({
        //     op: option.changeRegTel,
        //     toUserId: this.userId,
        //     newRegTel: this.regTel
        //   }).then(res => {
        //   });
        // }
      },
      delUser() {
        this.$prompt('请输入确认密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /9876543/,
          inputErrorMessage: '不正确'
        }).then(({ value }) => {
          if (value == '9876543') {
            changeUserMgr({
              op: 11,
              toUserId: this.userId
            }).then(res => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              setTimeout(() => {
                this.$router.go(-1);
              }, 2000);
            });
          }
        });
      },
      backLogin() {
        this.$router.go(-1);
      }
    }
  };
</script>

<style scoped>
  .content {
    margin: 30px 50px;
    width: 50%;
  }

  .el-button {
    width: 117px;
  }

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
