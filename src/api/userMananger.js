import request from '@/utils/request'

// 用户列表
export function fetchData(user, query) {
  return request({
    url: '/managment/privilege/user/ajaxlist.do',
    method: 'post',
    data: {
      user: JSON.stringify(user),
      query: JSON.stringify(query)
    }
  })
}

// 插入用户
export function insert(user) {
  return request({
    url: '/managment/privilege/user/insert.do',
    method: 'post',
    data: {
      user: JSON.stringify(user)
    }
  })
}

// 更新用户
export function update(user) {
  return request({
    url: '/managment/privilege/user/update.do',
    method: 'post',
    data: {
      user: JSON.stringify(user)
    }
  })
}

// 删除用户
export function dodelete(ids) {
  return request({
    url: '/managment/privilege/user/delete.do',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

// 检查用户名唯一性
export function checkUserNameExsits(user) {
  return request({
    url: '/managment/privilege/user/checkUserNameExsits.do',
    method: 'post',
    data: {
      user: JSON.stringify(user)
    }
  })
}

// 查询所有角色。标记用户已经拥有的角色
export function getRoles(userId, user, query) {
  return request({
    url: '/managment/privilege/user/getRoles.do',
    method: 'post',
    data: {
      userId: userId,
      user: JSON.stringify(user),
      query: JSON.stringify(query)
    }
  })
}

// 添加用户角色
export function saveUserRole(userId, roleIds) {
  return request({
    url: '/managment/privilege/user/saveUserRole.do',
    method: 'post',
    data: {
      userId: userId,
      roleIds: roleIds
    }
  })
}

// 得到系统所有的模块和模块值，当然的也做了每个权限值是否勾选判断
export function getAllPriValBySystemSn(systemSn, type, releaseId) {
  return request({
    url: '/managment/privilege/module/getAllPriValBySystemSn.do',
    method: 'post',
    data: {
      systemSn: systemSn,
      type: type,
      releaseId: releaseId
    }
  })
}
// 设置ACL的值
export function setAcl(acl, position, yes) {
  return request({
    url: '/managment/privilege/acl/setAcl.do',
    method: 'post',
    data: {
      acl: JSON.stringify(acl),
      position: position,
      yes: yes
    }
  })
}

// 批量设置ACL的值-整个模块
export function setAclByModule(acl, yes) {
  return request({
    url: '/managment/privilege/acl/setAclByModule.do',
    method: 'post',
    data: {
      acl: JSON.stringify(acl),
      yes: yes
    }
  })
}

// 批量设置ACL的值--整个系统
export function setAllAcl(acl, yes) {
  return request({
    url: '/managment/privilege/acl/setAllAcl.do',
    method: 'post',
    data: {
      acl: JSON.stringify(acl),
      yes: yes
    }
  })
}

// 修改密码
export function updatePassowrd(user) {
  return request({
    url: '/managment/privilege/user/updatePassowrd.do',
    method: 'post',
    data: {
      user: JSON.stringify(user)
    }
  })
}

