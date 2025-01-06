import request from '@/utils/request'

//获取所有 rolebindings列表 by ns
export function getRoleBindingsByNs(ns) {
  return request({
    url: '/rolebindings?ns=' + ns,
    method: 'get',
  })
}
export function CreateRoleBinding(data) {
  return request({
    url: '/rolebindings',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}