import request from '@/utils/request'

//获取所有 svc 列表
export function getList(ns) {
  return request({
    url: '/service?ns=' + ns,
    method: 'get',
  })
}
