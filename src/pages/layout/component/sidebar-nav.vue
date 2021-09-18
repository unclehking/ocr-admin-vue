<template>
    <div>
        <div class="top-logo">
            <img :src="logo" >
            <div class="txt">
                懒猴文字识别
            </div>
        </div>
        <el-menu :collapse="isSidebarNavCollapse" background-color="#304156" text-color="#eee" active-text-color="#4dbcff" :default-active="currentMenu" :unique-opened="true" >
            <DynamicMenu :menuList="sidebarMenu"></DynamicMenu>
        </el-menu>
    </div>
</template>

<script>
import DynamicMenu from '@/components/dynamic-menu'
import { mapState } from 'vuex'
import logo from '../../../assets/image/ocr_logo_white.png'
export default {
    data() {
        return {
            logo,
            isCollapse: true
        }
    },
    computed: {
        ...mapState(['isSidebarNavCollapse']),
        ...mapState('permission', ['sidebarMenu', 'currentMenu'])
    },
    methods: {},
    components: {
        DynamicMenu
    }
}
</script>
<style lang="scss">
    .top-logo{
        height: 81px;
        border-bottom: solid rgba(255,255,255,0.4) 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-weight: bold;
        letter-spacing: 3px;
        img{
            width: 40px;
            margin-right: 8px;
        }
        .txt{
            white-space: nowrap;
        }
    }
    .el-menu-item.is-active{
        position: relative;
        &::after{
            content: " ";
            width: 12px;
            height: 12px;
            background: #f4f4f4;
            position: absolute;
            right: -6px;
            top: 24px;
            transform: rotate(45deg);
        }
    }
</style>
