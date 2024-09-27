import request from '@/utils/request'

//获取所有 pods列表 by ns
export function getPodsByNs(ns) {
  return request({
    url: '/pods?ns=' + ns,
    method: 'get',
  })
}