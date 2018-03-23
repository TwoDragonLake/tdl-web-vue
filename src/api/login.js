import request from '@/utils/request'

export function login(username, password, selectFlag) {
  return request({
    url: '/login.do',
    method: 'post',
    data: {
      username: username,
      password: password,
      selectFlag: selectFlag
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/managment/frame/getInfo.do',
    method: 'post',
    data: {
    }
  })
}

export function logout() {
  return request({
    url: '/logout.do',
    method: 'post'
  })
}
