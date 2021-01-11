import request from '@/utils/request'

export function getUsers(data) {
  return request({
    url: '/admin/user',
    method: 'post',
    params: data
  })
}

export function addUsers(data) {
  return request({
    url: '/admin/add',
    method: 'post',
    params: data
  })
}

export function editUser(data) {
  return request({
    url: '/admin/fome',
    method: 'post',
    params: data
  })
}

export function delUser(data) {
  return request({
    url: '/admin/del',
    method: 'post',
    params: data
  })
}

export function changePwd(data) {
  return request({
    url: '/api/user/edit-psw',
    method: 'post',
    data
  })
}

export function queryUser() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}
