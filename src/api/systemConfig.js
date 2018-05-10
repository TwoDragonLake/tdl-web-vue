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

export function ajaxList(config, query) {
  return request({
    url: '/managment/system/systemConfig/ajaxList.do',
    method: 'post',
    data: {
      config: JSON.stringify(config),
      query: JSON.stringify(query)
    }
  })
}

export function add(systemConfig) {
  return request({
    url: '/managment/system/systemConfig/add.do',
    method: 'post',
    data: {
      systemConfig: JSON.stringify(systemConfig)
    }
  })
}

export function update(systemConfig) {
  return request({
    url: '/managment/system/systemConfig/update.do',
    method: 'post',
    data: {
      systemConfig: JSON.stringify(systemConfig)
    }
  })
}

export function dodelete(idStrs) {
  return request({
    url: '/managment/system/systemConfig/delete.do',
    method: 'post',
    data: {
      idStrs: idStrs
    }
  })
}

export function checkSnExsits(systemConfig) {
  return request({
    url: '/managment/system/systemConfig/checkSnExsits.do',
    method: 'post',
    data: {
      systemConfig: JSON.stringify(systemConfig)
    }
  })
}

export function checkKeyExsits(systemConfig) {
  return request({
    url: '/managment/system/systemConfig/checkKeyExsits.do',
    method: 'post',
    data: {
      systemConfig: JSON.stringify(systemConfig)
    }
  })
}
