import Cookies from 'js-cookie'
import request from '@/utils/request'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function accessAcl(systemSn, moduleSn, permission) {
  return request({
    url: '/managment/frame/hasPermission.do',
    method: 'post',
    data: {
      systemSn: systemSn,
      moduleSn: moduleSn,
      permission: permission
    }
  })
}
