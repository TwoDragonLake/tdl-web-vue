import request from '@/utils/request'

// 拉取系统列表
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

export function insertPriVal(pvs, moduleId) {
  return request({
    url: '/managment/privilege/module/getAllPriVal.do',
    method: 'post',
    data: {
      pvs: pvs,
      moduleId: moduleId
    }
  })
}
