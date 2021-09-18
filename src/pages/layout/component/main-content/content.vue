<template>
    <router-view class="contentWrap"></router-view>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style lang="scss">
    .contentWrap{
        margin: 12px;
        background-color: #ffffff;
        height: calc( 100vh - 74px );
        /* padding: 12px; */
        /* 解决子元素margin-top 塌陷 */
        &::before{
            content: " ";
            display: table;
        }
    }
    .pageTitle{
        border-bottom: solid #f4f4f4 1px;
        padding-bottom: 12px;
        margin-bottom: 12px;
    }
</style>
