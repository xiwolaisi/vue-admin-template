import request from '@/utils/request'

//获取所有nodes列表
export function getnodeList() {
  return request({
    url: '/nodes',
    method: 'get',
  })
}
export function getNodedetail(node) {
  return request({
    url: '/nodes/'+node ,
    method: 'get',
  })
}
export function postNodedata(data) {
  return request({
    url: '/nodes',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}