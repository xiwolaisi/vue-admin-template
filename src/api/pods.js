import request from '@/utils/request'

//获取所有 pods列表 by ns
export function getPodsByNs(ns) {
  return request({
    url: '/pods?ns=' + ns,
    method: 'get',
  })
}
//获取所有 pod的容器列表（只返回名称）
export function getPodContainers(ns,podname) {
  return request({
    url: '/pods/containers?ns=' +ns+ '&podname='+ podname,
    method: 'get',
  })
}
//获取容器日志
export function getPodLogs(ns,podname,cname) {
  return request({
    url: '/pods/logs?ns=' +ns+ '&podname='+ podname+ '&cname='+ cname,
    method: 'get',
  })
}