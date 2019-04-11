import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getUserId } from '@/utils/auth' // 验权

// permissiom judge
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('ADMIN') >= 0) return true // admin权限 直接通过
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login','/register','/companyMsg','/welcome','/forgetPass','/resetPass','/admin-login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getUserId()) {
    if (to.path === '/login' || to.path === '/admin-login') {
      next()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const roles = store.getters.roles
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            if (to.path === '/dashboard') {
              next({ path: '/' + store.getters.firstPath });  // 动态配置首页为第一个路由
            } else {
              next({ ...to }) // hack方法 确保addRoutes已完成
            }
            // 暂时不要供应商营业执照判断逻辑
            // if ((roles.indexOf('PROVIDER') > -1 && res.busiLicenseImg) || (roles.indexOf('PROVIDER') === -1)) {
            //   next({ ...to }) // hack方法 确保addRoutes已完成
            // } else {
            //   next({ path: '/companyMsg' });
            // }
          });
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.role)) {
          if (to.path === '/dashboard') {
            next({ path: '/' + store.getters.firstPath }); // 动态配置首页为第一个路由
          } else {
            next()
          }
        } else {
          next({ path: '/401', query: { noGoBack: true }})
          NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
        // 可删 ↑
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
