import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/privileManager',
    component: Layout,
    redirect: '/privileManager/systemManager',
    name: 'privileManager',
    meta: { title: 'privileManager', icon: 'example' },
    children: [
      // systemManager - 系统管理
      {
        path: 'systemManager',
        name: 'systemManager',
        component: () => import('@/views/systemmanager/systemManager'),
        meta: { title: 'systemManager', icon: 'table' }
      },
      // Module Manager 模块管理
      {
        path: 'moduleManager',
        name: 'moduleManager',
        component: () => import('@/views/modulemanager/moduleManager'),
        meta: { title: 'moduleManager', icon: 'table' }
      },
      // DepartManager - 部门管理
      {
        path: 'departManager',
        name: 'departManager',
        component: () => import('@/views/departmentManager/departmentManager'),
        meta: { title: 'departManager', icon: 'table' }
      },
      // userManager-用户管理
      {
        path: 'userManager',
        name: 'userManager',
        component: () => import('@/views/usermanager/userManager'),
        meta: { title: 'userManager', icon: 'table' }
      },
      // roleManager-角色管理
      {
        path: 'roleManager',
        name: 'roleManager',
        component: () => import('@/views/rolemanager/roleManager'),
        meta: { title: 'roleManager', icon: 'table' }
      },
      // dataDict - 数据字典
      {
        path: 'dataDict',
        name: 'dataDict',
        component: () => import('@/views/datadict/dataDict'),
        meta: { title: 'dataDict', icon: 'table' }
      },
      // systemPrivValue - 系统权限值
      {
        path: 'systemPrivValue',
        name: 'systemPrivValue',
        component: () => import('@/views/systemprivalue/systemPriValue'),
        meta: { title: 'systemPrivValue', icon: 'table' }
      },
      // systemConfig 系统配置
      {
        path: 'systemConfig',
        name: 'systemConfig',
        component: () => import('@/views/systemconfig/systemConfig'),
        meta: { title: 'systemConfig', icon: 'table' }
      },
      // signInLog - 登录日志
      {
        path: 'signInLog',
        name: 'signInLog',
        component: () => import('@/views/signinlog/signInLog'),
        meta: { title: 'signInLog', icon: 'table' }
      },

      {
        path: 'treeTable',
        name: 'treeTable',
        component: () => import('@/views/treeTable/customTreeTable'),
        meta: { title: 'treeTable', icon: 'table' }
      },
      //
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

