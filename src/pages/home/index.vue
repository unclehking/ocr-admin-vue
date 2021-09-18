/* 总览 */
<template>
    <div class="homeWrap" v-loading="loading">
        <div class="top">
            <div class="left">
                <h2>统计</h2>
                <div class="statistics">
                    <div class="one">
                        <div>今日收入</div>
                        <div class="num">
                            {{dayPayAmount/100}}
                            <span>元</span>
                        </div>
                    </div>
                    <div class="one">
                        <div>今日VIP</div>
                        <div class="num">
                            {{dayPayCount}}
                            <span>人</span>
                        </div>
                    </div>
                    
                    <div class="one">
                        <div>总VIP会员</div>
                        <div class="num">
                            {{allPayUsers}}
                            <span>人</span>
                        </div>
                    </div>
                    <div class="one">
                        <div>终身VIP</div>
                        <div class="num">
                            {{forever}}
                            <span>人</span>
                        </div>
                    </div>
                    <div class="one">
                        <div>网页版VIP</div>
                        <div class="num">
                            {{webSite}}
                            <span>人</span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="bottom">
            <h2>周趋势</h2>
            <!-- <p>
                <el-link target="_blank" href="https://h5cssjs.com/ocr">懒猴文字识别网页版</el-link>
            </p>
            <p>
                <el-link target="_blank" href="https://h5cssjs.com/ocr-about">懒猴文字识别小程序版</el-link>
            </p> -->
            <div id="myChart" :style="{width: '100%', height: '460px'}"></div>
        </div>
    </div>
</template>

<script>
/* 数组分组 */
function groupArr(list, field) {
    var obj = {};
    for (var i = 0; i < list.length; i++) {
        for (let item in list[i]) {
            if (item == field) {
                obj[list[i][item]] = {
                    list: obj[list[i][field]] ? obj[list[i][field]].list : [],
                    type: list[i][field]
                };
            }
        }
        obj[list[i][field]].list.push(list[i])
    }
    //console.log(obj, 888);
    var att = [];
    for (let item in obj) {
        //console.log(item, 88888888888);
        att.push({
            list: obj[item].list,
            date: item,
        })
    }
    return att;
}
import { payUsers, getAllPayRecord, getWeekPayRecord } from '../../api/ocr-admin'
import moment from 'moment'
//import { groupArr } from '../../utils/utils'
export default {
    data() {
        return {
            allPayUsers: '****',
            forever: '****',
            webSite: '****',
            dayPayCount: 0,
            dayPayAmount: 0,
            loading: true,
            myChart: null,
            options: {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['付费人数', '金额']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '付费人数',
                        type: 'line',
                        stack: '总量',
                        data: [],
                        smooth: true,
                        areaStyle: {
                            normal:{
                                color:new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#026B6F'}, {offset: 1, color: 'rgba(0,0,0,0)' }], false),
                                opacity:0.2
                            }
                        }
                    },
                    {
                        name: '金额',
                        type: 'line',
                        stack: '总量',
                        data: [],
                        smooth: true,
                        areaStyle: {}
                    }
                ]
            }
        }
    },
    methods: {
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            this.myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            this.myChart.setOption(this.options);
        }
    },
    async mounted() {
        let _this = this;
        let userType = [null,'forever','webSite']
        for(let i = 0; i< userType.length;i++){
            let res = await payUsers(userType[i])
            _this[userType[i]||'allPayUsers'] = res
        }
        /* 今日金额、付费人数 */
        let dayPayData = await getAllPayRecord()
        this.dayPayCount = dayPayData.length
        this.dayPayAmount = (dayPayData.length?dayPayData:[{total_fee:0}]).map(item => {
            return Number(item.total_fee)
        }).reduce(function(total, item) {
            return total + item
        })
        
        let weekData = await getWeekPayRecord()
        let lastWeekData = groupArr(weekData.map(item => {
            item.time_end = item.time_end.substring(0,8)
            return item
        }),'time_end')
        let weeks = []
        let countData = []
        let amountData = []
        lastWeekData.forEach(item => {
            weeks.push(moment(item.date, "YYYYMMDD").format('MM/DD'))
            //moment("12-25-1995", "MM-DD-YYYY")
            countData.push(item.list.length)
            amountData.push((item.list.length ? item.list : [{total_fee:0}]).map(listItem => {
                return Number(listItem.total_fee)/100
            }).reduce(function(total,val) {
                return total + val
            }))
        })

        //console.log(countData,amountData);
        this.options.series[0].data = countData
        this.options.series[1].data = amountData
        this.options.xAxis.data = weeks

        this.drawLine()

        this.loading = false
    },
    watch: {
        '$store.state.windowSize': function(val) {
            this.myChart.resize()
        }
    }
}
</script>
<style scoped lang="scss">
    .homeWrap{
        background: #f4f4f4;
        color:rgba(0,0,0,0.6);
        .top{
            display: flex;
            .left{
                background: #ffffff;
                flex: 1;
                padding: 12px;
                h2{
                    font-weight: bold;
                    border-bottom: solid #f4f4f4 1px;
                    padding-bottom: 10px;
                    margin-bottom: 12px;
                    font-size: 15px;
                }
                .statistics{
                    display: flex;
                    justify-content: flex-start;
                    .one{
                        border: solid #f4f4f4 1px;
                        margin-right: 12px;
                        padding: 20px 30px;
                        color: #409EFF;
                        border-radius: 4px;
                        div{
                            font-size: 12px;
                            &:first-child{
                                opacity: 0.6;
                                letter-spacing: 2px;
                            }
                            &.num{
                                font-size: 42px;
                                margin-top: 12px;
                                letter-spacing: 3px;
                                span{
                                    font-size: 12px;
                                    margin-left: -8px;
                                }
                            }
                        }
                    }
                }
            }
            .right{
                padding: 10px;
                background: #ffffff;
                width: 400px;
                margin-left: 12px;
                h2{
                    font-weight: bold;
                    border-bottom: solid #f4f4f4 1px;
                    padding-bottom: 10px;
                    margin-bottom: 12px;
                    font-size: 15px;
                }
            }
        }
        .bottom{
            padding: 12px;
            background: #ffffff;
            margin-top: 12px;
            height: calc( 100vh - 264px );
            h2{
                font-weight: bold;
                border-bottom: solid #f4f4f4 1px;
                padding-bottom: 10px;
                margin-bottom: 12px;
                font-size: 15px;
            }
            p{
                margin-top: 6px;
                a{
                    color: #409EFF;
                }
            }
        }
    }
</style>
