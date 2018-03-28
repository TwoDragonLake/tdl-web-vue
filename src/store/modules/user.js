import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, accessAcl } from '@/utils/auth'
import router from '@/router/index'
import Layout from '../../views/layout/Layout'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    systems: [],
    modules: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
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
    SET_SYSTEMS: (state, systems) => {
      state.systems = systems
    },
    SET_MODULES: (state, modules) => {
      state.modules = modules
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const selectFlag = userInfo.selectFlag
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, selectFlag).then(response => {
          const data = response
          setToken(data)
          commit('SET_TOKEN', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    accessAcl({ commit, state }, obj) {
      return accessAcl(obj.sessionId, obj.systemSn, obj.nameSpace, obj.permission).then(response => {
        return response
      }).catch(error => {
        console.log(error)
      })
    },

    // 获取用户信息(角色、名称、头像地址、系统、权限模块，并且根据模块标示动态规划路由规则)
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_SYSTEMS', data.systems)
          // console.log(router.options.routes)
          // console.log(data.systems)
          // console.log(data.firstSystemModules)

          var privileManagerChilds = []
          var privileManagerroute = {
            path: '/privileManager',
            component: Layout,
            redirect: '/privileManager/systemManager',
            name: 'privileManager',
            meta: { title: 'privileManager', icon: 'example' },
            children: privileManagerChilds
          }
          var privileManagerroutes = []
          privileManagerroutes.push(privileManagerroute)
          /**
          if (router.options.routes && router.options.routes.length > 0) {
            for (let i = 0; i < router.options.routes.length; i++) {
              var item = router.options.routes[i]
              if (item.name === 'privileManager') {
                privileManagerChilds = item.children
                break
              }
            }
          }
           **/
          if (data.firstSystemModules && data.firstSystemModules.length > 0) {
            for (let i = 0; i < data.firstSystemModules.length; i++) {
              var citem = data.firstSystemModules[i]
              if (citem.sn === 'icsystem') {
                privileManagerChilds.push({
                  path: 'systemManager',
                  name: 'systemManager',
                  component: () => import('@/views/systemmanager/systemManager'),
                  meta: { title: 'systemManager', icon: 'table' }
                })
              } else if (citem.sn === 'module') {
                privileManagerChilds.push({
                  path: 'moduleManager',
                  name: 'moduleManager',
                  component: () => import('@/views/modulemanager/moduleManager'),
                  meta: { title: 'moduleManager', icon: 'table' }
                })
              } else if (citem.sn === 'user') {
                privileManagerChilds.push({
                  path: 'userManager',
                  name: 'userManager',
                  component: () => import('@/views/usermanager/userManager'),
                  meta: { title: 'userManager', icon: 'table' }
                })
              } else if (citem.sn === 'dept') {
                privileManagerChilds.push({
                  path: 'departManager',
                  name: 'departManager',
                  component: () => import('@/views/departmentManager/departmentManager'),
                  meta: { title: 'departManager', icon: 'table' }
                })
              } else if (citem.sn === 'role') {
                privileManagerChilds.push({
                  path: 'roleManager',
                  name: 'roleManager',
                  component: () => import('@/views/rolemanager/roleManager'),
                  meta: { title: 'roleManager', icon: 'table' }
                })
              } else if (citem.sn === 'config') {
                privileManagerChilds.push({
                  path: 'systemConfig',
                  name: 'systemConfig',
                  component: () => import('@/views/systemconfig/systemConfig'),
                  meta: { title: 'systemConfig', icon: 'table' }
                })
              } else if (citem.sn === 'dictionary') {
                privileManagerChilds.push({
                  path: 'dataDict',
                  name: 'dataDict',
                  component: () => import('@/views/datadict/dataDict'),
                  meta: { title: 'dataDict', icon: 'table' }
                })
              } else if (citem.sn === 'loginlog') {
                privileManagerChilds.push({
                  path: 'signInLog',
                  name: 'signInLog',
                  component: () => import('@/views/signinlog/signInLog'),
                  meta: { title: 'signInLog', icon: 'table' }
                })
              } else if (citem.sn === 'pval') {
                privileManagerChilds.push({
                  path: 'systemPrivValue',
                  name: 'systemPrivValue',
                  component: () => import('@/views/systemprivalue/systemPriValue'),
                  meta: { title: 'systemPrivValue', icon: 'table' }
                })
              }
            }
          }
          //  样例demo【后期删除，开始场景使用】
          privileManagerChilds.push({
            path: 'customTreeTable',
            name: 'customTreeTable',
            component: () => import('@/views/treetable/customTreeTable'),
            meta: { title: 'customTreeTable', icon: 'table' }
          })
          privileManagerChilds.push({
            path: 'tree',
            name: 'Tree',
            component: () => import('@/views/tree/index'),
            meta: { title: 'Tree', icon: 'tree' }
          })
          // console.log(privileManagerroutes)
          // commit('SET_MODULES', privileManagerroutes)
          router.options.routes.push(privileManagerroute)
          router.addRoutes(privileManagerroutes)
          // console.log('-------------')
          // console.log(router.options.routes)
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_SYSTEMS', [])
          commit('SET_MODULES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
