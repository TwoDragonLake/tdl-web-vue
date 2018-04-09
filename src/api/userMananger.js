import request from '@/utils/request'

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
