const getters = {
  sidebar: state => state.app.sidebar,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  roleName: state => state.user.roleName,
  isManager: state => state.user.isManager,
  userId: state => state.user.userId,
  detail: state => state.user.detail,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  firstPath: state => state.permission.firstPath
}
export default getters
