import request from '@/utils/request'

// 拉取所有部门
export function ajaxlist() {
  try {
    return request({
      url: '/managment/privilege/dept/ajaxlist.do',
      method: 'post',
      data: {}
    })
  } catch (err) {
    console.log(err)
  }
}
// 插入部门
export function insert(dept) {
  return request({
    url: '/managment/privilege/dept/insert.do',
    method: 'post',
    data: {
      dept: JSON.stringify(dept)
    }
  })
}
// 更新部门
export function update(dept) {
  return request({
    url: '/managment/privilege/dept/update.do',
    method: 'post',
    data: {
      dept: JSON.stringify(dept)
    }
  })
}

// 删除部门
export function dodelete(ids) {
  return request({
    url: '/managment/privilege/dept/delete.do',
    method: 'post',
    data: {
      ids: ids
    }
  })
}

export function getDeptTree() {
  try {
    return request({
      url: '/managment/privilege/dept/getDeptTree.do',
      method: 'post'
    })
  } catch (err) {
    console.log(err)
  }
}

export function getDeptList() {
  try {
    return request({
      url: '/managment/privilege/dept/getDeptList.do',
      method: 'post'
    })
  } catch (err) {
    console.log(err)
  }
}
