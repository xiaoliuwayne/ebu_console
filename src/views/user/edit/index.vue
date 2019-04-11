<template>
  <div class="edit-user">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title-text">用户名：{{detail.userName}}</span>
      </div>
      <el-form ref="form" :model="detail" label-width="80px">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="detail.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="detail.sex" placeholder="请选择性别">
            <el-option label="请选择" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="detail.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="tel">
          <el-input v-model="detail.tel" placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getInfo, modifyUser } from '@/api/user';
  import { MessageBox } from 'element-ui';

  export default {
    name: 'index',
    data() {
      return {
        id: this.$route.query.id,
        detail: {}
      };
    },
    created() {
      getInfo(this.id).then(res => {
        this.detail = res;
        this.detail.sex = this.detail.sex.toString();
      });
    },
    methods: {
      onSubmit() {
        modifyUser({ op: 7, toUserId: this.id, userInfo: JSON.stringify(this.detail) }).then(res => {
          MessageBox('修改成功！');
        });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .edit-user{
    .el-form{
      width:50%;
    }
  }
</style>