import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'
import i18n from './lang' // Internationalization
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })

//  Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
/**
 * 权限鉴定，全局方法
 * @param systemSn 系统标示
 * @param nameSpace 模块标示
 * @param permission 权限值
 * @returns {Promise<any>}
 */
Vue.prototype.accessAcl = function(systemSn, nameSpace, permission) {
  return store.dispatch('accessAcl', { systemSn: systemSn, nameSpace: nameSpace, permission: permission }).then(res => {
    return (res & res === 1)
  }).catch((error) => {
    console.log(error)
  })
}
