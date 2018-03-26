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
