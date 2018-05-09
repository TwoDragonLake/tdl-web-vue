/*
 * Copyright (C) 2018 The TwoDragonLake Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import request from '@/utils/request'

export function fetchData(role, query) {
  return request({
    url: '/managment/privilege/role/ajaxlist.do',
    method: 'post',
    data: {
      role: JSON.stringify(role),
      query: JSON.stringify(query)
    }
  })
}

export function insert(role) {
  return request({
    url: '/managment/privilege/role/insert.do',
    method: 'post',
    data: {
      role: JSON.stringify(role)
    }
  })
}

export function update(role) {
  return request({
    url: '/managment/privilege/role/update.do',
    method: 'post',
    data: {
      role: JSON.stringify(role)
    }
  })
}

export function dodelete(ids) {
  return request({
    url: '/managment/privilege/role/delete.do',
    method: 'post',
    data: {
      ids: ids
    }
  })
}
// 检测角色标识的唯一性 传入id和sn即可
export function checkSnExsits(role) {
  return request({
    url: '/managment/privilege/role/checkSnExsits.do',
    method: 'post',
    data: {
      role: JSON.stringify(role)
    }
  })
}
