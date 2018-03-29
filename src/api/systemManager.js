import request from '@/utils/request'

export function getList(icSystem, listQuery) {
  try {
    return request({
      url: '/managment/privilege/icsystem/ajaxlist.do',
      method: 'post',
      data: {
        icSystem: JSON.stringify(icSystem),
        listQuery: JSON.stringify(listQuery)
      },
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.log(err)
  } finally {
    // request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }
}

export function insert(systemManager) {
  try {
    return request({
      url: '/managment/privilege/icsystem/insert.do',
      method: 'post',
      data: {
        icSystem: JSON.stringify(systemManager)
      }
    })
  } catch (err) {
    console.log(err)
  } finally {
    // request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }
}

export function update(systemManager) {
  try {
    return request({
      url: '/managment/privilege/icsystem/update.do',
      method: 'post',
      data: {
        icSystem: JSON.stringify(systemManager)
      }
    })
  } catch (err) {
    console.log(err)
  } finally {
    // request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }
}

export function dodelete(ids) {
  try {
    return request({
      url: '/managment/privilege/icsystem/delete.do',
      method: 'post',
      data: {
        ids: ids
      }
    })
  } catch (err) {
    console.log(err)
  } finally {
    // request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  }
}
