import request from '@/utils/request'

//获取所有 roles列表 by ns
export function getRolesByNs(ns) {
  return request({
    url: '/roles?ns=' + ns,
    method: 'get',
  })
}
