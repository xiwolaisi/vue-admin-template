import request from '@/utils/request'

//获取所有resources列表 by ns
export function getResources() {
  return request({
    url: '/resources',
    method: 'get',
  })
}
