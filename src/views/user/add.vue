<template>
  <div class="add-user">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title-text">1.创建一个新的用户帐号。　　　2.填写详细资料。　　　3.完成！</span>
      </div>
      <el-form ref="form" :model="userForm" :rules="rules" label-width="80px">
        <el-form-item label="用户类型" prop="roleType">
          <el-select v-model="userForm.roleType" placeholder="请选择用户类型">
            <el-option v-if="roleTypes.length > 0" v-for="item in roleTypes" :key="item.t" :label="item.n" :value="item.t"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  import { modifyUser } from '@/api/user';

  export default {
    name: 'add',
    data() {
      return {
        userForm: {
          op: 1,
          name: '',
          roleType: this.$route.query.roleType || this.GLOBAL.userRoleType[0].t
        },
        rules: {
          name: [{ required: true, message: '请输入正确的用户名', trigger: 'blur' }],
          roleType: [{ required: true, message: '请选择用户类型', trigger: 'blur' }]
        },
        roleTypes: this.GLOBAL.userRoleType
      };
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            modifyUser(this.userForm).then(res => {
              let userId = res.userId;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .add-user{
    .title-text{
      font-weight: bold;
    }
    .el-form{
      width:50%;
      .el-select,.el-input{
        width:50%;
      }
    }
  }
</style>