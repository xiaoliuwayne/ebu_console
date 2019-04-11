<template>
  <el-menu class="navbar" mode="horizontal">
    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" v-if="avatar" :src="avatar">
        <img class="user-avatar" v-else src="./headPortrait.png">
        <div class="info-wrapper">
          <p class="info-item">{{name}}</p>
          <p class="info-item">{{roleName}}</p>
        </div>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <!--<div class="user-info-wrapper">-->
        <!---->
      <!--</div>-->
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/user/changePwd">
          <el-dropdown-item>
            密码修改
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getPicUrl } from '@/utils/getPicUrl';

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'roleName',
      'name'
    ]),
    avatar() {
      return getPicUrl(this.$store.state.user.avatar, 1, 6)
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    cursor: pointer;
    .avatar-wrapper {
      position: relative;
      margin-top: 5px;
      .user-avatar {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .info-wrapper{
        display: inline-block;
        vertical-align: top;
        padding-top: 5px;
        .info-item{
          height: 18px;
          line-height: 18px;
        }
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

