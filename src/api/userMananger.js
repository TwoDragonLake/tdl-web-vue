import request from '@/utils/request'

export function fetchData(user, query) {
  return request({
    url: '/managment/privilege/dept/update.do',
    method: 'post',
    data: {
      user: JSON.stringify(user),
      query: JSON.stringify(query)
    }
  })
}
