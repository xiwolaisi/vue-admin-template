import request from '@/utils/request'

//获取所有 ingress列表
export function getList(ns) {
  return request({
    url: '/configmap?ns=' + ns ,
    method: 'get',
  })
}

// 新增ingress
export function postSecret(data) {
  return request({
    url: '/configmap',
    method: 'post',
    data
  })
}
export function rmConfigmap(ns,name) {
  return request({
    url: '/configmap?ns'+ns +'&name='+name,
    method: 'delete',

  })
}


