import request from '@/utils/request'
export function getTags(data) {
  return request({
    url: '/admin/tabsearch',
    method: 'post',
    params: data
  })
}

export function addTag(data) {
  return request({
    url: '/admin/tabadd',
    method: 'post',
    params: data
  })
}

export function writeTag(data) {
  return request({
    url: '/admin/tabrewrite',
    method: 'post',
    params: data
  })
}

export function delTag(data) {
  return request({
    url: '/admin/tabdel',
    method: 'post',
    params: data
  })
}

export function editTag(data) {
  return request({
    url: '/admin/tabedit',
    method: 'post',
    params: data
  })
}

export function queryTag() {
  return request({
    url: '/tablist',
    method: 'post',
    params: {}
  })
}

export function editTagSearch(data) {
  return request({
    url: '/search',
    method: 'post',
    params: data
  })
}

