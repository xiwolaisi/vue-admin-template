import request from '@/utils/request'

//获取所有 ingress列表
export function getList(ns) {
  return request({
    url: '/secrets?ns=' + ns ,
    method: 'get',
  })
}

export function postSecret(data) {
  return request({
    url: '/secrets',
    method: 'post',
    data
  })
}
export function rmSecret(ns,name) {
  return request({
    url: '/secrets?ns'+ns +'&name='+name,
    method: 'delete',

  })
}
export function getSecret(ns,name) {
  return request({
    url: '/secrets/'+ns+'/'+name ,
    method: 'get',
  })
}

