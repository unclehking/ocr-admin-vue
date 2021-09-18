<template>
    <div class="loginWrap">
        <div class="loginWin" >
            <div class="left">
                <a class="imgWrap" href="#">
                    <img :src="logo" alt="">
                    <div class="rotate">
                        <span>懒</span>
                        <span>猴</span>
                        <span>文</span>
                        <span>字</span>
                        <span>识</span>
                        <span>别</span>
                    </div>
                </a>
            </div>
            <div class="right">
                <div class="usePassword" v-if="loginType === 'account'">
                    <ul class="tabBar">
                        <li  v-for="(item,index) in tabBarData" :key="index+item" :class="{active:index==tabIndex}" @click="changeTab(index)">{{item}}</li>
                    </ul>
                    <div class="tabContent" v-if="tabIndex==0">
                        <div class="one">
                            <input type="text" placeholder="请输入账号" v-model="loginData.user" id="loginAccount"  >
                            <i class="iconfont icon-zhanghao"></i>
                            <div class="line"></div>
                        </div>
                        <div class="one" >
                            <input type="password" placeholder="请输入密码" v-model="loginData.psw" autocomplete="new-password" @keyup.enter="login">
                            <i class="iconfont icon-mima"></i>
                            <div class="line"></div>
                        </div>
                        <div class="btnwrap">
                            <button :disabled="!loginData.user || !loginData.psw" @click="login">登录</button>
                        </div>
                    </div>
                </div>
                
                <!-- <video-test v-if="loginType === 'face'"></video-test> -->
                <face v-if="loginType === 'face'"></face>
            </div>
            <div class="topLeft"></div>
            <div class="bottomRight"></div>
        </div>
        
    </div>
    
</template>

<script>
//import { login } from '@/api/permission'
import { loginByaccount } from '../../api/ocr-admin'
import VideoTest from './video'
import Face from './face'
import logo from '../../assets/image/ocr_logo.png'

export default {
    components: {
        VideoTest,
        Face
    },

    data() {
        return {
            loginType: '',
            logo,
            tabBarData:'登录'.split('/'),
            tabIndex: 0,
            loginData: {
                user: '',
                psw: ''
            }
        }
    },
    mounted(){
        this.init()
        /* 账号输入框自动获取焦点 */
        //var target = document.querySelector("#loginAccount") || document.querySelector("#registerAccount");
        //target.value = ''
        //target.focus()
    },
    methods:{
        init(){
            navigator.mediaDevices
                .getUserMedia({ audio: false, video: true })
                .then((stream) => {
                    this.loginType = 'face'
                }).catch(err=> {
                    this.loginType = 'account'
                    console.log(err,77);
                });
        },
        removeReadonly(e) {
            e.target.readOnly = false
        },
        changeTab(index){
            this.tabIndex = index;
        },
        async login() {
            
            /* logout().then(res => res.text())
            .then( res => {
                console.log(res)
            }) */
            let data = this.loginData
            loginByaccount(data).then(res => {
                this.$store.commit('LOGIN_IN', res.token)
                let returnUrl = location.href.split('=')[1] || '/'
                this.$router.push(decodeURIComponent(returnUrl))
            }).catch(err => {
                //this.$message.error(err)
            }).finally(_ => {
                this.loading = false
            })
            /* let token = data.token
            this.$store.commit('LOGIN_IN', token)
            this.$router.replace('/') */
        }
    }
}
</script>

<style scoped lang="scss">
    $mainColor: #0099ff;
    @keyframes rotateLogo {
        0% {
            transform:rotate(0deg);
        }
        50% {
            transform:rotate(180deg);
        }
        100% {
            transform:rotate(360deg);
        }
    }
    .loginWrap{
        user-select: none;
        height: 100%;
        background: url('https://hkingme.oss-cn-shenzhen.aliyuncs.com/yycloud/yycloud-banner.jpg') center  center no-repeat;
        /* background: url('https://ai.bdstatic.com/file/9AB9381157F74EEDB123FBEECC77C67E') center  center no-repeat; */
        background-size: cover;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        &:after {
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            content: " ";
        }
        .topNav{
            position: absolute;
            top: 0;
            left: 0;
        }
        .loginWin{
            width: 660px;
            height: auto;
            background-color: #ffffff;
            position: relative;
            z-index: 3;
            border-radius: 0;
            display: flex;
            position: relative;
            transition: height 1s;
            // box-shadow: 4px 4px 6px rgba(255,255,255,0.2);
            .left{
                width: 240px;
                background-color: $mainColor;
                opacity: 0.9;
                display: flex;
                justify-content: center;
                align-items: center;
                .imgWrap{
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    border: solid #ffffff 1px;
                    border-radius: 50%;
                    text-align: center;
                    text-decoration: none;
                    transition: all 0.4s;
                    position: relative;
                    background-color: #ffffff;
                    .rotate{
                        width: 100px;
                        height: 100px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        margin: -50% 0 0 -50%;
                        animation: rotateLogo 10s linear infinite;
                        border-radius: 50%;
                        span{
                            position: absolute;
                            color: #ffffff;
                            &:nth-child(1){
                                top: -20px;
                                left: -20px;
                                transform: rotate(-75deg);
                            }
                            &:nth-child(2){
                                top: -44px;
                                left: -6px;
                                transform: rotate(-45deg);
                            }
                            &:nth-child(3){
                                top: -62px;
                                left: 19px;
                                transform: rotate(-24deg);
                            }
                            &:nth-child(4){
                                top: -67px;
                                left: 53px;
                                transform: rotate(12deg);
                            }
                            &:nth-child(5){
                                top: -57px;
                                left: 76px;
                                transform: rotate(25deg);
                            }
                            &:nth-child(6){
                                top: -39px;
                                left: 96px;
                                transform: rotate(48deg);
                            }
                        }
                    }
                    img{
                        vertical-align: middle;
                        width: 70px;
                        height: 70px;
                    }
                    &:hover{
                        background: #ffffff;
                        transform: scale(1.1);
                        i{
                            color: $mainColor;
                        }
                    }
                }
                
            }
            .right{
                margin-left: 70px;
                flex: 1;
                min-height: 336px;
                .tabBar{
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    justify-content: flex-end;
                    li{
                        height: 34px;
                        line-height: 34px;
                        width: 60px;
                        text-align: center;
                        cursor: pointer;
                        font-size: 14px;
                        color: rgba(0,0,0,0.7);
                        transition: width 0.5s;
                        border-radius: 0 0 8px 8px;
                        &.active{
                            background-color: $mainColor;
                            color: #ffffff;
                            font-size: 15px;
                            width: 80px;
                            
                        }
                        &:last-child{
                            border-radius: 0 0 0 8px;
                        }
                    }
                }
                .tabContent{
                    margin-right: 60px;
                    margin-top: 50px;
                    
                    .one{
                        display: flex;
                        margin-bottom: 34px;
                        padding-bottom: 12px;
                        align-items: center;
                        position: relative;
                        i{
                            width: 24px;
                            height: 24px;
                            margin-right: 6px;
                            position: absolute;
                            top: 0;
                            left: 0;
                            font-size: 20px;
                            opacity: 0.5;
                        }
                        .line{
                            width: 100%;
                            height: 1px;
                            background-color: #cccccc;
                            position: absolute;
                            left: 0;
                            bottom: 0;
                        }
                        input{
                            border: none;
                            outline: none;
                            height:24px;
                            display: block;
                            flex: 1;
                            margin-left: 32px;
                            &:focus{
                                color: $mainColor;
                                & + i{
                                    color: $mainColor !important;
                                    opacity: 1;
                                }
                                & + i + .line{
                                    background-color: $mainColor;
                                }
                            }
                        }
                    }
                    .btnwrap{
                        button{
                            width: 100%;
                            outline: none;
                            height: 42px;
                            border: none;
                            background-color: $mainColor;
                            border-radius: 24px;
                            color: #ffffff;
                            letter-spacing: 4px;
                            font-size: 16px;
                            margin-top: 20px;
                            margin-bottom: 50px;
                            cursor: pointer;
                            &:hover{
                                opacity: 0.8;
                            }
                            &:disabled{
                                cursor: default;
                                opacity: 0.5;
                            }
                        }
                    }
                }

            }
            .topLeft{
                position: absolute;
                top: -20px;
                left: -20px;
                width: 200px;
                height: 200px;
                border-top: solid #ffffff 1px;
                border-left: solid #ffffff 1px;
                opacity: 0.3;
                pointer-events: none;
            }
            .bottomRight{
                position: absolute;
                bottom: -20px;
                right: -20px;
                width: 60px;
                height: 60px;
                border-bottom: solid #ffffff 1px;
                border-right: solid #ffffff 1px;
                opacity: 0.4;
                pointer-events: none;
            }
        }
    }
</style>
