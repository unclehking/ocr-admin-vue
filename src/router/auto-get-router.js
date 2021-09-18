
/* 
    按目录自动生成router
 */
const fs = require("fs");
var path = require("path");

/* 读取目录树 */
const getDirTree = function (level, dir) {
    var filesNameArr = []
    let cur = 0
    // 用个hash队列保存每个目录的深度
    var mapDeep = {}
    mapDeep[dir] = 0
    // 先遍历一遍给其建立深度索引
    function getMap(dir, curIndex) {
        var files = fs.readdirSync(dir) //同步拿到文件目录下的所有文件名
        files.map(function (file) {
            //var subPath = path.resolve(dir, file) //拼接为绝对路径
            var subPath = path.join(dir, file) //拼接为相对路径
            var stats = fs.statSync(subPath) //拿到文件信息对象
            // 必须过滤掉node_modules文件夹
            if (file != 'node_modules') {
                mapDeep[file] = curIndex + 1
                if (stats.isDirectory()) { //判断是否为文件夹类型
                    return getMap(subPath, mapDeep[file]) //递归读取文件夹
                }
            }
        })
    }
    getMap(dir, mapDeep[dir])
    function readdirs(dir, folderName, myroot) {
        var result = { //构造文件夹数据
            path: dir,
            title: path.basename(dir),
            type: 'directory',
            deep: mapDeep[folderName]
        }
        var files = fs.readdirSync(dir) //同步拿到文件目录下的所有文件名
        result.children = files.map(function (file) {
            //console.log(file, 888)
            //var subPath = path.resolve(dir, file) //拼接为绝对路径
            var subPath = path.join(dir, file) //拼接为相对路径
            var stats = fs.statSync(subPath) //拿到文件信息对象
            
            /* fs.readFile(subPath, 'utf-8', function (err, data) {
                if (err) {
                } else {
                    console.log(data.split('\n')[0]);
                }
            }) */
            if (stats.isDirectory()) { //判断是否为文件夹类型
                return readdirs(subPath, file, file) //递归读取文件夹
            }else{
                if (/index\.vue/.test(subPath)){
                    var textData = fs.readFileSync(subPath, 'utf-8')
                    let icon_name = textData.split('\n')[0].replace(/(\*)|(\/)|(\s+)/g,"")
                    //console.log(cnName);
                    let iconNameArr = icon_name.split("|");
                    result.cnName = iconNameArr[0];
                    result.icon = iconNameArr[1] || '';
                }
                
            }
            return { //构造文件数据
                path: subPath,
                name: file,
                type: 'file'
            }
        })
        return result //返回数据
    }
    filesNameArr.push(readdirs(dir, dir))
    return filesNameArr
}
const dirPath = path.resolve(__dirname,'../pages');
const data = getDirTree(4, dirPath)[0].children;

let strRouter = `export default [
    `

data.forEach((item,itemIndex) => {
    let reg = new RegExp(item.title)
    if (reg.test('errorPage') || reg.test('home') || reg.test('layout') || reg.test('login') ){
        return false
    }
    let itemEndFlag = itemIndex == data.length - 1 ? `` : `,
    `
    let itemChildren = item.children.filter(item => {
        return item.type == 'directory'
    });
    let hasChildFlag = itemChildren.length ? ",":""
    strRouter += `{
        path: '/${item.title}',
        name: '${item.title}',
        meta: {
            EnCode: '${item.title}',
            name: '${item.cnName}',
            icon: '${item.icon}'
        },
        component: () => import('@/pages/${item.title}')${hasChildFlag}`
    if (itemChildren.length) {
        strRouter += `
        children: [`
        itemChildren.forEach((oneChild,childIndex) => {
            let childEndFlag = childIndex == itemChildren.length - 1 ? "" : ","
            strRouter += `
            {
                path: '${oneChild.title}',
                name: '${oneChild.title}',
                meta: {
                    EnCode: '${oneChild.title}',
                    name: '${oneChild.cnName}',
                    icon: '${oneChild.icon}'
                },
                component: () => import('@/pages/${item.title}/${oneChild.title}')
            }${childEndFlag}`
        })
        strRouter += `
        ]`
    }
    strRouter += `
    }${itemEndFlag}`

})
strRouter += `
]
// ${(new Date()).toLocaleString('chinese', { hour12: false })}
`
console.log(strRouter);
const filePath = path.resolve(__dirname, './auto-router.js');
fs.writeFile(filePath, strRouter, error => {
    if (error) return console.log("生成路由失败,原因是" + error.message);
    console.log("成功生成路由: ./src/router/auto-router.js");
    console.log(" ");
});