import request from '@/utils/request'

/**
 * 登陆
 * @param {Object} data 登陆参数
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 获取基本信息，包括基本信息和权限信息
 * @param {h} token 获取信息
 */
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 登出处理
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
