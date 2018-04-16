import request from '@/utils/request'

// 获取所有系统列表树
export function getsystems() {
  try {
    return request({
      url: '/managment/privilege/module/getsystems.do',
      method: 'post'
    })
  } catch (err) {
    console.log(err)
  } finally {
    // request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }
}
// 拉取系统下的所有模块
export function getmodules(query, module) {
  try {
    return request({
      url: '/managment/privilege/module/getAll.do',
      method: 'post',
      data: {
        query: JSON.stringify(query),
        module: JSON.stringify(module)
      }
    })
  } catch (err) {
    console.log(err)
  } finally {
    // request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }
}

// getAllPriValBySystemSn
/*
     * 得到系统所有的模块和模块值，当然的也做了每个权限值是否勾选判断
     * @param systemSn  系统标识
     * @param type      role或者user
     * @param releaseId roleId或者userId
 */
export function getAllPriValBySystemSn(systemSn, type, releaseId) {
  try {
    return request({
      url: '/managment/privilege/module/getAll.do',
      method: 'post',
      data: {
        systemSn: systemSn,
        type: type,
        releaseId: releaseId
      }
    })
  } catch (err) {
    console.log(err)
  } finally {
    // request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }
}

// 插入模块
export function insert(module) {
  return request({
    url: '/managment/privilege/module/insert.do',
    method: 'post',
    data: {
      module: JSON.stringify(module)
    }
  })
}
// 更新模块
export function update(module) {
  return request({
    url: '/managment/privilege/module/update.do',
    method: 'post',
    data: {
      module: JSON.stringify(module)
    }
  })
}
// 删除模块
export function dodelete(ids) {
  return request({
    url: '/managment/privilege/module/delete.do',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

// 删除模块权限
export function deletePriVal(systemPrivilegeValueId, moduleId) {
  return request({
    url: '/managment/privilege/module/deletePriVal.do',
    method: 'post',
    data: {
      systemPrivilegeValueId: systemPrivilegeValueId,
      moduleId: moduleId
    }
  })
}

// 拉取可以授权给模块的权限列表
export function getAllPriVal(moduleId, systemId) {
  return request({
    url: '/managment/privilege/module/getAllPriVal.do',
    method: 'post',
    data: {
      moduleId: moduleId,
      systemId: systemId
    }
  })
}

// 添加模块权限值
export function insertPriVal(pvs, moduleId) {
  return request({
    url: '/managment/privilege/module/insertPriVal.do',
    method: 'post',
    data: {
      pvs: pvs,
      moduleId: moduleId
    }
  })
}
