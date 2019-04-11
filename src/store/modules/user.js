import { login, getInfo } from '@/api/user';
import { getUserId, setUserId, removeUserId } from '@/utils/auth';
import { byTypeGetObj } from '@/utils/index';
import _global from '@/global/global';

const user = {
  state: {
    userId: getUserId(),
    name: '',
    avatar: '',
    roles: [],
    roleName: '',
    detail: {},
    isManager: false
  },

  mutations: {
    SET_USER: (state, userId) => {
      state.userId = userId
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLENAME: (state, roleName) => {
      state.roleName = roleName
    },
    SET_DETAIL: (state, detail) => {
      state.detail = detail
    },
    SET_ISMANAGER: (state, boole) => {
      state.isManager = boole
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      userInfo.username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          setUserId(res.userId)
          commit('SET_USER', res.userId)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.userId).then(res => {
          let roleObj = byTypeGetObj(res.roleType, _global.userRoleType);
          commit('SET_ROLES', [roleObj.s])
          commit('SET_ROLENAME', roleObj.n)
          commit('SET_NAME', res.userName)
          commit('SET_AVATAR', res.headPortrait)
          commit('SET_DETAIL', res)
          commit('SET_ISMANAGER', _global.managerRoles.indexOf(roleObj.s) > -1)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_USER', '')
        removeUserId()
        resolve()
      })
    }
  }
}

export default user
