<template>
    <div class="testTracking">

        <video id="video" ref="video" :class="{'flash':errShow}" width="320" height="240" preload autoplay loop muted></video>
        <canvas id="canvas" width="320" height="240"></canvas>
        <!-- <div class="buttonDiv">
      <button type="button" @click="submit">上传照片</button>
      <button type="button" name="button" @click="openCamera">点击我拍照</button>
    </div> -->
    </div>
</template>

<script>
import { login } from "../../api/ocr-admin";
require("@/assets/tracking/build/tracking-min.js");
require("@/assets/tracking/build/data/face-min.js");
require("@/assets/tracking/build/data/mouth-min.js");
//require('@/assets/tracking/examples/assets/stats.min.js')

export default {
    name: "testTracking",
    data() {
        return {
            locked: false,
            trackerTask: null,
            errShow: false
        };
    },
    mounted() {
        this.openCamera();
        let _this = this
        setInterval(function() {
            _this.errShow = false
        },2000)
    },
    methods: {
        openCamera() {
            let _this = this;
            var video = document.getElementById("video");
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");

            var tracker = new tracking.ObjectTracker("face");
            tracker.setInitialScale(4);
            tracker.setStepSize(2);
            tracker.setEdgesDensity(0.1);

            this.trackerTask = tracking.track("#video", tracker, {
                camera: true,
            });

            tracker.on("track", function (event) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                event.data.forEach(function (rect) {
                    context.font = "11px Helvetica";
                    //context.fillText("已识别到人脸，请点击拍照",100,40);
                    context.strokeStyle = "#008000";
                    context.strokeRect(
                        rect.x - 15,
                        rect.y - 30,
                        rect.width + 30,
                        rect.height + 60
                    );
                });
                if (event.data.length) {
                    if (!_this.locked) {
                        _this.locked = true;
                        _this.submit();
                    }
                }
            });
        },
        stop() {
            return (
                this.$refs.video.srcObject &&
                this.$refs.video.srcObject.getTracks().map((t) => t.stop())
            );
        },
        submit() {
            let that = this;
            let canvas = document.getElementById("canvas");
            let context = canvas.getContext("2d");
            let video = document.getElementById("video");
            context.drawImage(video, 0, 0, 320, 240);
            let photoSrc = canvas.toDataURL("image/jpeg", 0.8);
            //console.log(photoSrc.split(',')[1]);
            //that.locked = false
            this.login(photoSrc.split(",")[1]);
            /* canvas.toBlob((blob) => {
                console.log(URL.createObjectURL(blob),999);
                that.locked = false
                axios.post({faceUrl: URL.createObjectURL(blob)})
                .then((res) => {
                console.log('上传成功')
                })
            }) */
        },
        async login(faceData) {
            login(faceData)
                .then((res) => {
                    this.$store.commit("LOGIN_IN", res.token);
                    let returnUrl = location.href.split("=")[1] || "/";
                    this.$router.push(decodeURIComponent(returnUrl)).catch(e => e);
                    this.stop();
                })
                .catch((err) => {
                    //this.$message.error(err)
                    console.log(err);
                    this.errShow = true
                })
                .finally((_) => {
                    this.locked = false;
                });
        },
    },
    destroyed() {},
};
</script>

<style lang="scss" scoped>
@keyframes flash{
    0%   { opacity:1;     outline: solid red 2px;}
    25%  { opacity:0.85;  outline: solid red 2px;}
    50%  { opacity:0.75;  outline: solid red 2px;}
    75%  { opacity:0.65;  outline: solid red 2px;}
    100% { opacity:0.25;  outline: solid red 2px;}
}
.testTracking {
    width: 100%;
    position: relative;
    > * {
        position: absolute;
        left: -20px;
        margin: auto;
    }
    video,
    canvas {
        top: 42px;
        background: transparent;
    }
    video{
        background: #f4f4f4;
        
    }
    video.flash{
        animation: flash 1s linear;
    }
    .buttonDiv {
        bottom: 10px;
    }
}
</style>



