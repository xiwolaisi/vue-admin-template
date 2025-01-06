import request from '@/utils/request'

//获取所有 serviceaccounts列表 by ns
export function getSAsByNs(ns) {
  return request({
    url: '/serviceaccounts?ns=' + ns,
    method: 'get',
  })
}
export function CreateRole(data) {
  return request({
    url: '/serviceaccounts',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}