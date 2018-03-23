import request from '@/utils/request'

export function getList(icSystem, listQuery) {
  return request({
    url: '/managment/privilege/icsystem/ajaxlist.do',
    method: 'post',
    //  headers: { 'Content-Type': 'application/json' },
    data: {
      icSystem: icSystem,
      listQuery: listQuery
    }
  })
}
