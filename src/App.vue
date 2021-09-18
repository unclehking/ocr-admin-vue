<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
    mounted() {
        var _this = this
        /* //视窗resize时保存width height 到vuex */
        window.onresize = function(e) {
            var windowSize = {
                width: window.innerWidth,
                height: window.innerHeight
            }
            _this.$store.commit('windowResize', windowSize)
        }
    }
}
</script>

<style lang="scss">
    #app{
        height:100%;
        >div{
            height: 100%;
        }
    }
</style>
