
const isSidebarNavCollapse = localStorage['isSidebarNavCollapse'] ? JSON.parse(localStorage['isSidebarNavCollapse']) : false
export default {
    get UserToken() {
        return localStorage.getItem('ocr-admin-token')
    },
    set UserToken(value) {
        localStorage.setItem('ocr-admin-token', value)
    },
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: isSidebarNavCollapse,
    /* 面包屑导航列表 */
    crumbList: [],
    /* 视窗口大小 */
    windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
    }
}
