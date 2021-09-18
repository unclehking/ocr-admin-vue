import axios from '../config/httpConfig'
const baseUrl = 'https://www.h5cssjs.com/ocradmin'

/* 
登录
data: {
    user: String,
    psw: String
}
 */
export function login(faceData) {
    return axios.post(`${baseUrl}/login`, { faceData: faceData})
}

export function loginByaccount(data) {
    return axios.post(`${baseUrl}/loginByaccount`, data)
}

/* 退出登录 */
export function logout() {
    return fetch(`${baseUrl}/logout`, { mode: "no-cors" })
}

/* 总付费用户数 */
export function payUsers(type) {
    let queryStr = type ? `?type=${type}` : ``
    return axios.get(`${baseUrl}/payUsers${queryStr}`)
}

/* 某日最近一周交易记录 */
export function getWeekPayRecord(date) {
    return axios.get(`${baseUrl}/getWeekPayRecord`)
}

/* 某日交易记录 */
export function getAllPayRecord(date) {
    let queryStr = date ? `?date=${date}` : ``
    return axios.get(`${baseUrl}/getAllPayRecord${queryStr}`)
}

/* 通过openid获取会员信息 */
export function queryOneUser(openid) {
    return axios.get(`${baseUrl}/queryOneUser?openid=${openid}`)
}

/* 通过openid获取支付记录 */
export function getPayRecord(openid) {
    return axios.get(`${baseUrl}/getPayRecord?openId=${openid}`)
}

/* 获取用户分页列表 */
export function vipList(page, pageSize, isPaid) {
    let queryStr = isPaid ? `&isPaid=${isPaid}` : ``
    return axios.get(`${baseUrl}/vipList?page=${page}&pageSize=${pageSize}${queryStr}`)
}

/* 订单查询 */
export function queryOneOrder(id) {
    return axios.get(`${baseUrl}/queryOneOrder?id=${id}`)
}
