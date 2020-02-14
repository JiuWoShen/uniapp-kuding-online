<template>
    <view class="container">
        <view class="star-bg">
            <image v-for="(item,index) in 5" :key="index" src="/static/images/star_empty@2x.png" alt/>
        </view>
        <view class="star">
            <image v-for="(item,index) in myscore" :key="index" src="/static/images/star_fill@2x.png" alt/>
        </view>
    </view>
</template>

<script lang='ts'>
import Vue from 'vue'
export default Vue.extend({
    // 组件自己的模型值
    data(){
        return {
            myscore:0
        }
    },
    // 父组件的模型值
    props:{
        score:{
            type:Number,
            default:0
        }
    },
    // 在生命周期钩子中进行父组件模型给组件自己模型赋值
    onReady(){
        this.myscore = this.score
    }
})
</script>

<style lang="less" scoped>
.container {
  position: relative;
}
.star,
.star-bg {
  float: left;
  display: flex;
  height: 50rpx;
  align-items: center;
  image {
    width: 38rpx;
    height: 36rpx;
  }
}
.star {
  position: absolute;
  top: 0;
  left: 0;
}
</style>