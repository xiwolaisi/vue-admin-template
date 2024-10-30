import request from '@/utils/request'


export function getList(ns) {
  return request({
    url: '/configmap?ns=' + ns ,
    method: 'get',
  })
}

export function postConfigmap(data) {
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


