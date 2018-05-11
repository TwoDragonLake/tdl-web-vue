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

export function ajaxList(loginLogVo, query) {
  return request({
    url: '/managment/system/loginLog/ajaxList.do',
    method: 'post',
    data: {
      loginLogVo: JSON.stringify(loginLogVo),
      query: JSON.stringify(query)
    }
  })
}


export function dodelete(idStrs) {
  return request({
    url: '/managment/system/loginLog/delete.do',
    method: 'post',
    data: {
      idStrs: idStrs
    }
  })
}
