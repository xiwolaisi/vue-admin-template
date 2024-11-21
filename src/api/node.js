import request from '@/utils/request'

//获取所有nodes列表
export function getnodeList() {
  return request({
    url: '/nodes',
    method: 'get',
  })
}