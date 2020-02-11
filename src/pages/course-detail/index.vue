<template>
    <view>
        <text>我是课程详情页面--{{id}}</text>
    </view>
</template>

<script lang='ts'>
import Vue from 'vue'
export default Vue.extend({
    data(){
        return {
            id:null
        }
    },
    // onload中取奇特跳转页面传过来的参数
    onLoad(options){
        this.id = options.id
    }
})
</script>