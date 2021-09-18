/* 数组分组 */
function groupArr(list, field) {
    var obj = {};
    for (var i = 0; i < list.length; i++) {
        for (item in list[i]) {
            if (item == field) {
                obj[list[i][item]] = {
                    list: obj[list[i][field]] ? obj[list[i][field]].list : [],
                    type: list[i].type
                };
            }
        }
        obj[list[i][field]].list.push(list[i])
    }
    var att = [];
    for (item in obj) {
        att.push({
            list: obj[item].list,
            type: obj[item].type,
        })
    }
    return att;
}

export default {
    groupArr
}
