import request from '@/utils/request'

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

export function getmodules(query, module) {
  try {
    return request({
      url: '/managment/privilege/module/ajaxlist.do',
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

