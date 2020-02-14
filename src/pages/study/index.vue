<template>
   <view class="study-container">
	<view class="study-item" v-for="item in studyProgress" :key="item.sid">
		<image :src="item.icon" alt="" />
		<view class="meta">
			<text class="title">{{item.title}}</text>
			<text class="progress">已学习{{item.study_hour}}课时/{{item.total_hour || 0}}课时</text>
		</view>
		<view class="circle">
            <!-- 宽高要求是数值型数据-------因此使用绑定否则传过去的是字符串类型 -->
            <!-- 给子组件传值需要绑定 -->
			<circle canvasId="item.sid" :progress="item.study_progress" :width="55" :height="55"></circle>
		</view>
	</view>
	<view v-if="isEmpty">
		<text class="no-study-tip">您还没有任何学习记录哦，赶快去学习吧~</text>
	</view>
</view>
</template>
<script lang="ts">
import Vue from 'vue'
import {fetch} from '../../utils/fetch'
import Circle from '../../components/Circle.vue'
export default Vue.extend({
    components:{
        Circle
    },
    data() {
        return {
            studyProgress:[],
            isEmpty:true
        }
    },
    // 切换到该页面就请求/刷新数据
    onShow(){
        this.getStudyProgress()
    },
    methods:{
        async getStudyProgress(){
            const result = await fetch({
                url:'study/progress'
            })
            if(result.data.status === 0){
                this.studyProgress = result.data.message
                this.isEmpty = result.data.message.length === 0
            }
        }
    }

})
</script>

<style lang="less" scoped>
.study-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 32rpx;
  align-items: center;
  position: relative;
}
.study-item {
  margin-top: 32rpx;
  background-color: #fff;
  border-radius: 12rpx;
  width: 686rpx;
  height: 220rpx;
  display: flex;
  align-items: center;
  image {
    width: 108rpx;
    height: 108rpx;
    margin-left: 50rpx;
  }
  .meta {
    flex: 1;
    margin-left: 50rpx;
    .title {
        display: block;
      font-size: 30rpx;
      color: #333333;
    }
    .progress {
      margin-top: 10rpx;
      font-size: 22rpx;
      color: #a8a8a8;
    }
  }
  .circle {
    width: 109rpx;
    height: 109rpx;
    margin-right: 56rpx;
  }
}
.no-study-tip {
  margin-top: 500rpx;
  font-size: 15px;
}
</style>