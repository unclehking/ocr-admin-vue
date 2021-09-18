/* 用户管理|icon-yonghu */
<template>
    <div style="margin:12px;padding:12px;">
        <div class="pageTitle">
            <div class="left">用户管理</div>
            <div class="right">
                <div>
                    <el-input v-model="searchKey" prefix-icon="el-icon-search" placeholder="请输入openid搜索" size="small" clearable @change="search"></el-input>
                </div>
                <div>   
                    <span>VIP</span>
                    <el-switch v-model="isPaid" @change="changeType"> </el-switch>
                </div>
                
            </div>
        </div>
        <el-table :data="tableData" v-loading="loading" :height="tableHeight" border style="width:100%;font-family: Consolas;">
            <el-table-column prop="openId" label="openId" width="280">
            </el-table-column>
            <el-table-column prop="isPaid" label="VIP" >
                <template slot-scope="scope">
                    <span v-if="scope.row.isPaid" style="color:green;">是</span>
                </template>
            </el-table-column>
            <el-table-column prop="lastTime" label="到期" width="170">
            </el-table-column>
            <el-table-column prop="payTime" label="支付日期" width="170">
            </el-table-column>
            <el-table-column prop="regTime" label="注册日期" width="170">
            </el-table-column>
            <el-table-column prop="freeCount" label="试用次数" width="90" align="center" >
            </el-table-column>
            
            <el-table-column label="操作" width="200" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="queryOneUser(scope.row.openId)" type="text" size="small">详细</el-button>
                    <el-button @click="payList(scope.row)" v-if="scope.row.isPaid" type="text" size="small">支付记录</el-button>
                    <!-- <el-button @click="openSetting(scope.row)" type="text" size="small">设置</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="goPage" :current-page.sync="page" :page-size="pageSize" layout="total, prev, pager, next" :total="allCount">
        </el-pagination>

        <el-dialog :title="form.Title" :visible.sync="dialogVisible" width="500px" >
            <table class="formTable">
                <tr>
                    <td>名称</td>
                    <td>{{form.Title}}</td>
                </tr>
                <tr>
                    <td>购买时间</td>
                    <td>{{form.Date}}</td>
                </tr>
                <tr>
                    <td>类型</td>
                    <td>{{form.Type}}</td>
                </tr>
                <tr>
                    <td>价格</td>
                    <td>{{form.Price}}</td>
                </tr>
                <tr>
                    <td>登录地址</td>
                    <td>
                        <a href="https://www.baidu.com" target="_blank">https://www.baidu.com</a>
                    </td>
                </tr>
            </table>
        </el-dialog>

        <el-drawer title="会员信息" :visible.sync="vip.show" size="500px" >
            <table class="formTable">
                <tr>
                    <td width="120px">openId</td>
                    <td>{{vip.data.openId}}</td>
                </tr>
                <tr>
                    <td>来源</td>
                    <td>{{vip.data.payFrom}}</td>
                </tr>
                <tr>
                    <td>免费次数</td>
                    <td>
                        <!-- {{vip.data.freeCount}} -->
                        <el-input v-model.number="vip.data.freeCount" size="small"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>是否终身会员</td>
                    <td>
                        <el-switch v-model="vip.data.isForever"  ></el-switch>
                    </td>
                </tr>
                <tr>
                    <td>过期</td>
                    <td>
                        <el-switch v-model="vip.data.overdue"  ></el-switch>
                    </td>
                </tr>
                <tr>
                    <td>过期时间</td>
                    <td>{{vip.data.lastTime}}</td>
                </tr>
                <tr>
                    <td>支付时间</td>
                    <td>{{vip.data.payTime}}</td>
                </tr>
                <tr>
                    <td>注册时间</td>
                    <td>{{vip.data.regTime}}</td>
                </tr>
                <tr>
                    <td>unionid</td>
                    <td>{{vip.data.unionid}}</td>
                </tr>
                <tr>
                    <td>是否付费</td>
                    <td>
                        <!-- {{vip.data.isPaid}} -->
                        <el-switch v-model="vip.data.isPaid"  ></el-switch>
                    </td>
                </tr>
            </table>
            <div class="footer">
                <el-button @click="save">保存</el-button>
            </div>
        </el-drawer>

        <el-drawer title="会员支付记录" :visible.sync="payRecordShow" direction="rtl" size="600px">
            <div class="payRecord">
                <el-table :data="onePayRecord">
                    <el-table-column prop="time_end" label="日期" width="170">
                    </el-table-column>
                    <el-table-column prop="total_fee" label="金额" width="100">
                    </el-table-column>
                    <el-table-column prop="transaction_id" label="订单号">
                    </el-table-column>
                </el-table>
            </div>
        </el-drawer>

    </div>
</template>

<script>
import { payUsers, getAllPayRecord, queryOneUser, vipList, getPayRecord } from '../../api/ocr-admin'
const userListType = localStorage['userListType'] ? JSON.parse(localStorage['userListType']) : false;
export default {
    data() {
        return {
            payRecordShow: false,
            searchKey: '',
            searchDate: '',
            dialogVisible: false,
            form: {},
            tableData: [],
            vipData: {},
            onePayRecord: [],
            vip: {
                show: false,
                data: {}
            },
            allCount: 0,
            page: sessionStorage['vipmanagePage'] ? JSON.parse(sessionStorage['vipmanagePage']) : 1,
            pageSize: 100,
            isPaid: userListType,
            loading: false
        }
    },
    methods: {
        save() {
            let data = this.vip.data
            console.log(data);
        },
        /* 查询 */
        search() {
            let searchKey = this.searchKey
            if(searchKey) {
                this.queryOneUser(searchKey, 'list')
            } else {
                this.vipList(1, this.pageSize, this.isPaid)
            }
            
        },
        /* 分页 */
        goPage(page) {
            this.page = page
            sessionStorage['vipmanagePage'] = page
            this.vipList(this.page, this.pageSize, this.isPaid)
        },
        view(data) {
            console.log(data)
            this.form = data
            this.dialogVisible = true
        },
        /* 支付记录 */
        payList(data) {
            console.log(data)
            let openId = data.openId
            getPayRecord(openId).then(res => {
                console.log(res);
                this.onePayRecord = res.map(item => {
                    item.total_fee = (item.total_fee/100).toFixed(2)
                    item.time_end = this.$moment(item.time_end,'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
                    return item
                })
                this.payRecordShow = true
            })
        },
        /* 获取用户分页列表 */
        vipList(page, pageSize, isPaid) {
            this.loading = true
            vipList(page, pageSize, isPaid).then(res => {
                this.tableData = res.result.map(item => {
                    item.regTime = this.$moment(Number(item.regTime)).format('YYYY-MM-DD HH:mm:ss')
                    item.payTime  && (item.payTime =  this.$moment(Number(item.payTime)).format('YYYY-MM-DD HH:mm:ss'))
                    if(item.lastTime && item.lastTime != 'forever') {
                        item.lastTime = this.$moment(Number(item.lastTime)).format('YYYY-MM-DD HH:mm:ss')
                    }
                    return item
                })
                this.allCount = res.total
            }).finally(function() {
                this.loading = false
            }.bind(this))
        },
        /* 选择所有、VIP */
        changeType(isPaid) {
            localStorage['userListType'] = isPaid
            this.vipList(this.page, this.pageSize, this.isPaid)
        },
        /* 通过openid获取会员信息 */
        queryOneUser(openId, list) {
            queryOneUser(openId).then(res => {
                res.regTime = res.regTime ? this.$moment(Number(res.regTime)).format('YYYY-MM-DD HH:mm:ss') : null
                res.payTime = res.payTime ? this.$moment(Number(res.payTime)).format('YYYY-MM-DD HH:mm:ss') : null
                res.lastTime =  res.lastTime ?  (res.lastTime === 'forever' ? res.lastTime : this.$moment(Number(res.lastTime)).format('YYYY-MM-DD HH:mm:ss')) : null
                res.isForever = res.lastTime === 'forever' ? true : false
                if(!list) {
                    this.vip.data = res
                    this.vip.show = true
                } else {
                    this.tableData = [res]
                }
            })
        },
        //打开设置窗口
        openSetting(data) {
            console.log(data);
        }
    },
    mounted() {
        this.vipList(1, this.pageSize, this.isPaid)
        this.searchDate = this.$moment().format('YYYYMMDD')
    },
    computed: {
        tableHeight: function() {
            return this.$store.state.windowSize.height - 200
        }
    }
}
</script>
<style lang="scss" scoped>
    .pageTitle{
        display: flex;
        align-items: center;
        .left{
            flex: 1;
        }
        .right{
            width: 420px;
            margin-right: 0px;
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .el-input{
                margin-right: 20px;
                width: 310px;
                display: block;
            }
        }
    }
    .formTable{
        margin-top: 30px;
        margin-bottom: 30px;
        tr{
            td{
                color:rgba(0,0,0,0.5);
                padding: 6px;
                font-size: 16px;
                &:first-child{
                    text-align: right;
                    color: rgba(0,0,0,0.7);
                }
                a{
                    color: #409EFF;
                    text-decoration: solid #409EFF 1px;
                }
            }
        }
    }
   
    .black{
        height: 8px;
        background: #f4f4f4;
        width: calc( 100% + 24px );
        margin-left: -12px;
        margin-top: 12px;
    }
    .el-table .cell{
        font-family: Consolas;
    }
    .el-pagination{
        margin-top: 14px;
        text-align: right;
    }
    .payRecord{
        margin: 20px;
        .one{
            border-bottom: dashed #cccccc 1px;
        }
    }
</style>
