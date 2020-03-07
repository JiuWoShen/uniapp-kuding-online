<template>
    <view class="play-container" v-if="course_detail">
        <view class="cover_image">
            <video @play="isPower" id="videoId" :src="playingURL" controls></video>
        </view>
        <!-- 基本信息的渲染 -->
        <view class="introduction">
            <view class="title-and-info">
                <text class="title">{{course_detail.course.title}}</text>
                <text class="info">
                    <text>{{course_detail.course.study_count}}人学过</text>
                    <!-- 通过计算属性的方式 -->
                    <text>难度:{{level}}</text>
                    <!-- 通过方法的方式 -->
                    <!-- <text>难度:{{getLevel(course_detail.course.level)}}</text> -->
                    <!-- 通过过滤器的方式 -->
                    <!-- <text>难度:{{course_detail.course.level | getLevel}}</text> -->
                    <text>时长:{{course_detail.course.course_duration}}</text>
                </text>
            </view>
            <view class="comment">
              <image @click="evaluate" src="/static/images/evaluate@2x.png" alt />
            </view>
        </view>
        <!-- 模态框-------控制子组件的显示与隐藏 -->
        <Maldal :isVisible='isShowMaldal'>
          <!-- 替换子组件插槽的内容 -->
          <view @click="close" :isVisible='isShowMaldal'>111111</view>
        </Maldal>
        <!-- 课程进度 -->
        <view class="course-progress">
          <view class="title">课程进度</view>
          <view class="catelog-container">
            <view @click="changePlaying(index)" class="course-item" v-for="(item,index) in course_detail.videos" :key="item.id">
              <text :class="[index === playingIndex ? 'active' : '']">{{index+1}}.{{item.name}}</text>
              <text class="studied" v-if="item.is_study === 1">已学习</text>
              <text v-else :class="[index === playingIndex ? 'active' : '']">{{item.duration}}</text>
            </view>
          </view>
        </view>
    </view>
</template>

<script>
import Vue from 'vue'
import {fetch} from '../../utils/fetch'
import Maldal from '../../components/Modal'
export default Vue.extend({
    components:{
      Maldal
    },
    data(){
        return {
            id:null,// 当前课程的id
            course_detail:null,
            playingURL:null,
            playingIndex:0,  //现在播放的项
            isValidatePlay:false,//是否进行过校验
            isShowMaldal:false //是否显示模态框
        }
    },
    onLoad(options){
      // 当前课程的id
        this.id = options.id
        this.getcourseData()
    },
    computed: {
        // 计算属性有缓存-------优先使用
        level(){
          // 计算属性会执行两次------刚开始会执行一次-----使用时执行一次----刚开始没有数据需作判断
            if(!this.course_detail) return null
            switch (this.course_detail.course.level) {
                case 1:{
                    return '初级'
                    break;
                }
                    
                case 2:{
                    return '中极'
                    break;
                }
                    
                case 3:{
                    return '高级'
                    break;
                }
                    
            
                default:
                    return '无等级'
                    break;
            }
        }
    },
    // 过滤器实现等级
    /* filters:{
        getLevel(level){
             switch (level) {
                case 1:
                    {
                      return '初级'
                      break;
                    }
                case 2:
                   {
                      return '中极'
                      break;
                   }
                case 3:
                   {
                      return '高级'
                      break;
                   }
            
                default:
                    {
                      return '无等级'
                    break;
                    }
            }
        }
    }, */
    methods:{
        async getcourseData(){
            const result = await fetch({
                url:`course/play/${this.id}`
            })
            if(result.data.status === 0){
                this.course_detail = result.data.message
                // 当前播放视频的地址
                this.playingURL = result.data.message.videos[0].video_url
            }
        },
        // 评价
        async evaluate(){
          // 判断课程是否学习完
          const res = await fetch({
            url:'study/complete',
            data:{
              course_id:this.id
            }
          })
          if(res.data.status === 0){
            if(!res.data.complete){//没有学习完
              uni.showModal({
                title: '提示',
                content: '请先学习完毕，再来评价~',
                showCancel:false,
                confirmColor:'#ff9a29'
              });
            }
            return 
          }
          // 弹出评价模态框
          this.isShowMaldal = true

        },
        isPower(){
          if(!this.isValidatePlay){
            this.changePlaying(0)
          }
        },
        // 关闭模态框
        close(){
          this.isShowMaldal = false
        },
        // 点击切换播放
        async changePlaying(i){
          // 切换索引
          this.playingIndex = i
          
          this.playingURL = this.course_detail.videos[i].video_url
          // 切换时停止播放之前的视频
          uni.createVideoContext('videoId').pause()

          // 去鉴权，如果支付了则正常播放，未支付则提示跳转支付页面-------promise对象
          const isplaying = await this.isPlayingRinght()   //这里isplaying是布尔值
          // console.log('------isplaying----',isplaying)
          if(!isplaying){////不可播放
            uni.showModal({
              title: '提示',
              content: '您还没有购买，请先购买后，再来播放 O ~',
              success: res => {
                if (res.confirm) {
                  uni.navigateTo({
                     url: `/pages/pay/index?id=${this.id}&title=${this.course_detail.course.title}&price=${this.course_detail.course.price}&cover_image_url=${this.course_detail.course.cover_image_url}`
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            })
            return
          }
          // 有权限----正常播放
          setTimeout(()=>{
            uni.createVideoContext('videoId').play()
          },200)

          // 发送请求-----记录学习进度
          const result = await fetch({
            url:'study/video',
            method:'POST',
            data:{
              course_id:this.id,
              video_id:this.course_detail.videos[i].id
            }
          })
          console.log(result.data)
          if(result.data.status === 0){
            this.course_detail.videos[i].is_study = 1
          }

        },
        // 发送请求查看当前课程是否购买过
        async isPlayingRinght(){
          // 异步操作
          /* 1.
          return new Promise((resolve,reject)=>{
            // 发送请求通过resolve，reject吧结果传递出去
          }) */

          const result = await fetch({
            url:'order/info',
            data:{
              course_id:this.id
            }
          })
          // console.log(result.data)
          if(result.data.status === 0){
            if(result.data.message.pay_status === 0){//未支付
              return Promise.resolve(false)
            }else{//已支付
              this.isValidatePlay = true
              return Promise.resolve(true)
            }
          }else{
            // ES6语法-----快速返回一个Promise对象
            return Promise.resolve(false)
          }
        }
    }

})
</script>

<style lang="less" scoped>
.play-container {
  background-color: #efefef;
  position: relative;
  .cover_image {
    width: 750rpx;
    height: 434rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    image {
      width: 750rpx;
      height: 434rpx;
    }
    video {
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: -10rpx;
    border-radius: 16px 16px 0px 0px;
    border-bottom: 1px solid #f5f5f5;
    left: 0;
    right: 0;
    height: 192rpx;
    background-color: #ffffff;
    padding: 38rpx 32rpx;
    display: flex;
    align-items: center;
    .title-and-info {
      flex: 1;
      .title {
        color: #343434;
        font-size: 24px;
        font-weight: bold;
      }
      .info {
        margin-top: 12rpx;
        height: 34rpx;
        line-height: 34rpx;
        color: #818181;
        font-size: 12px;
        display: block;
        text {
          padding-right: 15rpx;
        }
        text:nth-child(2),
        text:nth-child(3) {
          padding-left: 15rpx;
        }
        text:nth-child(2) {
          position: relative;
          &::before {
            position: absolute;
            content: '';
            background-color: #ebebeb;
            left: 0rpx;
            width: 1px;
            top: 8rpx;
            height: 20rpx;
          }
          &::after {
            position: absolute;
            content: '';
            background-color: #ebebeb;
            right: 0rpx;
            width: 1px;
            top: 8rpx;
            height: 20rpx;
          }
        }
      }
    }
    .comment {
      margin-top: 32rpx;
      image {
        width: 198rpx;
        height: 80rpx;
      }
    }
  }
  .course-progress {
    margin-top: 222rpx;
    padding: 44rpx 32rpx;
    background-color: #fff;
    .title {
      color: #343434;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 800;
    }
    .catelog-container {
      .course-item {
        display: flex;
        justify-content: space-between;
      }
      text {
        color: #636363;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
      }
      .studied {
        float: right;
        margin-top: 16rpx;
        font-size: 10px;
        text-align: center;
        color: #aaaaaa;
        background-color: #f5f5f5;
        border-radius: 12rpx;
        width: 98rpx;
        height: 48rpx;
        line-height: 48rpx;
      }
      .time {
        float: right;
      }
      .active {
        color: #ff5e00;
      }
    }
  }
}
.comment-content {
  label {
    width: 100rpx;
  }
  textarea {
    width: 100%;
    height: 200rpx;
  }
}
</style>