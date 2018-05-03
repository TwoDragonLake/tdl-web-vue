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

export function getAll(dictionary, query) {
  return request({
    url: '/managment/system/dictionary/getAll.do',
    method: 'post',
    data: {
      dictionary: JSON.stringify(dictionary),
      query: JSON.stringify(query)
    }
  })
}

export function update(dictionary) {
  return request({
    url: '/managment/system/dictionary/update.do',
    method: 'post',
    data: {
      dictionary: JSON.stringify(dictionary)
    }
  })
}

export function insert(dictionary) {
  return request({
    url: '/managment/system/dictionary/insert.do',
    method: 'post',
    data: {
      dictionary: JSON.stringify(dictionary)
    }
  })
}

export function dodelete(ids) {
  return request({
    url: '/managment/system/dictionary/delete.do',
    method: 'post',
    data: {
      ids: ids
    }
  })
}
