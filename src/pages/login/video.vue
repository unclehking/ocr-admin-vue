<template>
    <div class="videoApp">
        <div class="videoWrap">
            <video ref="video" id="video" width="320" height="240" :loading="loading"></video>
            <div class="mask">
                <img :src="mask" alt="">
            </div>
        </div>
        
        <canvas id="canvas" ref="canvas" width="320px" height="240px" style="display:none;"></canvas>
        <!-- <button type="button" class="btn btn-info" @click="camera('environment')">Back Camera</button> -->
        <!-- <button type="button" class="btn btn-info" @click="camera('user')">验证登录</button> -->
        <el-button type="primary" :loading="loading" class="btn btn-info" @click="camera()">验证登录</el-button>
    </div>
</template>
<script>
import { login } from '../../api/ocr-admin'
import mask from '../../assets/image/photoMask.png'
export default {
    name: "video-face",
    data() {
        return {
            mask,
            video: {},
            localstream: undefined,
            loading: false
        };
    },
    mounted() {
        this.init()
    },
    methods: {
        init(){
            navigator.mediaDevices
                .getUserMedia({ audio: false, video: true })
                .then((stream) => {
                    this.$refs.video.srcObject = stream;
                    this.$refs.video.play();
                });
        },
        camera() {
            this.loading = true;
            this.pause()
            let video = this.$refs.video,
                canvas = this.$refs.canvas,
                context = canvas.getContext("2d"),
                vHeight = video.offsetHeight,
                vWidth = video.offsetWidth;
            canvas.width = vWidth; // 改变画布的宽高
            canvas.height = vHeight;
            context.drawImage(video, 0, 0, vWidth, vHeight);
            // 获取图片src  base64格式
            let photoSrc = document
                .getElementById("canvas")
                .toDataURL("image/jpeg", 0.8);
            this.login(photoSrc.split(',')[1])
        },
        stop() {
            return (
                this.$refs.video.srcObject &&
                this.$refs.video.srcObject.getTracks().map((t) => t.stop())
            );
        },
        pause() {
            this.$refs.video.pause();
        },
        play() {
            this.$refs.video.play();
        },
        async login(faceData) {
            
            login(faceData).then(res => {
                this.stop()
                this.$store.commit('LOGIN_IN', res.token)
                let returnUrl = location.href.split('=')[1] || '/'
                this.$router.push(decodeURIComponent(returnUrl))
            }).catch(err => {
                //this.$message.error(err)
            }).finally(_ => {
                this.play()
                this.loading = false
            })
        }
    },
};
</script>
<style lang="scss" scoped>
    $mainColor: #0099ff;
    .videoApp{
        margin-top: 40px;
        .videoWrap{
            position: relative;
            width: 320px;
            height: 240px;
            video{
                border: solid #f4f4ff 1px;
                background: url('../../assets/image/photoMask.png') center center #f4f4f4;
            }
            .mask{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                img{
                    width: 100%;
                    height: 100%;
                    display: none;
                }
            }
        }
        
    }
    button{
        width: 320px;
        outline: none;
        height: 42px;
        border: none;
        border-radius: 4px;
        color: #ffffff;
        letter-spacing: 4px;
        font-size: 16px;
        margin-top: 20px;
        margin-bottom: 50px;
        cursor: pointer;
        &:disabled{
            cursor: default;
            opacity: 0.5;
        }
    }
</style>