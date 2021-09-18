/* 订单管理|icon-dingdan */
<template>
    <div style="margin:12px;padding:12px;">
        <div class="pageTitle">
            <div class="left">订单管理</div>
            <div class="right">
                <div>
                    <el-input v-model="searchKey" prefix-icon="el-icon-search" placeholder="请输入订单号搜索" size="small" clearable @change="search"></el-input>
                </div>
                <div>
                    <el-date-picker v-model="searchDate" @change="changeDate" value-format="yyyyMMdd" type="date" placeholder="选择日期" size="small" style="width:140px;">
                    </el-date-picker>
                </div>
            </div>
        </div>
        <el-table :data="tableData" v-loading="loading" :height="tableHeight" border style="width:100%;font-family: Consolas;">
            <el-table-column prop="transaction_id" label="订单号" width="270">
            </el-table-column>
            
            <el-table-column prop="openid" label="openid" width="270">
            </el-table-column>
            <el-table-column prop="trade_type" label="交易类型" >
            </el-table-column>
            <el-table-column prop="time_end" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="total_fee" :label="'金额('+dayAmount+'元)'" width="120" align="center">
                <template slot-scope="scope">
                    {{scope.row.total_fee}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="queryOneUser(scope.row)" type="text" size="small">用户信息</el-button>
                </template>
            </el-table-column>
        </el-table>

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
                    <td>{{vip.data.freeCount}}</td>
                </tr>
                <tr>
                    <td>过期</td>
                    <td>{{vip.data.overdue}}</td>
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
                    <td>{{vip.data.isPaid}}</td>
                </tr>
            </table>
        </el-drawer>
    </div>
</template>

<script>
import { payUsers, getAllPayRecord, queryOneUser, queryOneOrder } from '../../api/ocr-admin'
export default {
    data() {
        return {
            searchKey: '',
            searchDate: '',
            dialogVisible: false,
            form: {},
            tableData: [],
            vipData: {},
            vip: {
                show: false,
                data: {}
            },
            loading: false
        }
    },
    methods: {
        /* 查询 */
        search() {
            let searchKey = this.searchKey
            if(searchKey) {
                this.queryOneOrder(searchKey)
            } else {
                this.getAllPayRecord()
            }
            
        },
        //订单号查询
        queryOneOrder(id) {
            this.loading = true
            queryOneOrder(id).then(res => {
                this.tableData = res.map(function(item){
                    item.time_end = this.$moment(item.time_end,'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
                    item.total_fee = item.total_fee/100
                    return item
                }.bind(this))
            }).finally(function() {
                this.loading = false
            }.bind(this))
        },
        /* 获取某日订单数据 */
        getAllPayRecord(day) {
            this.loading = true
            getAllPayRecord(day).then(res => {
                this.tableData = res.map(function(item){
                    item.time_end = this.$moment(item.time_end,'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
                    item.total_fee = item.total_fee/100
                    return item
                }.bind(this))
            }).finally(function() {
                this.loading = false
            }.bind(this))
        },
        /* 选择日期 */
        changeDate(day) {
            console.log(day)
            this.getAllPayRecord(day)
        },
        /* 通过openid获取会员信息 */
        queryOneUser(data) {
            let openid = data.openid
            queryOneUser(openid).then(res => {
                res.regTime = this.$moment(Number(res.regTime)).format('YYYY-MM-DD HH:mm:ss')
                res.payTime = this.$moment(Number(res.payTime)).format('YYYY-MM-DD HH:mm:ss')
                this.vip.data = res
                this.vip.show = true
            })
        }
    },
    mounted() {
        this.getAllPayRecord()
        this.searchDate = this.$moment().format('YYYYMMDD')
    },
    computed: {
        //表格动态高度
        tableHeight: function() {
            return this.$store.state.windowSize.height - 156
        },
        //统计
        dayAmount: function() {
            let amountArray = this.tableData.map(item => {
                return item.total_fee
            })
            let dayAmount = amountArray.length ? amountArray.reduce(function(total, num){
                return total + num
            }) : 0
            return dayAmount
        }
    }
}
</script>
<style lang="scss" scoped>
    .pageTitle{
        display: flex;
        .left{
            flex: 1;
        }
        .right{
            width: 420px;
            margin-right: 0px;
            text-align: right;
            display: flex;
            .el-input{
                margin-right: 12px;
                width: 270px;
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
    .unPayWrap{
        display: flex;
        .one{
            border: solid #cccccc 1px;
            width: 240px;
            height: 320px;
            padding: 12px;
            border-radius: 4px;
            position: relative;
            .title{
                font-size: 16px;
                border-bottom: solid #f4f4f4 1px;
                padding-bottom: 6px;
                margin-bottom: 6px;
                text-align: center;
                color: #409EFF;
                letter-spacing: 3px;
            }
            .c{
                color: rgba(0,0,0,0.5);
                font-size: 15px;
            }
            button{
                position: absolute;
                right: 10px;
                bottom: 10px;
                background: #409EFF;
                border: none;
                outline: none;
                width: calc( 100% - 20px );
                height: 34px;
                color:#ffffff;
                letter-spacing: 3px;
                cursor: pointer;
                &:hover{
                    opacity: 0.8;
                }
            }
            &:hover{
                border-color: #409EFF;
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
</style>
