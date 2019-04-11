import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 递归获取动态路由第一个path        动态设置首页
 * @param routers
 * @returns {*}
 */
function getFirstPath(routers) {
  if (routers[0].children && routers[0].children.length > 0) {
    return getFirstPath(routers[0].children);
  } else {
    return routers[0].path;
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    firstPath: ''
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_FIRSTPATH: (state, routers) => {
      state.firstPath = getFirstPath(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_FIRSTPATH', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
