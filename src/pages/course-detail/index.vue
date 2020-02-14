<template>
    <view class="course-detail-container" v-if="courseDetail">
        <!-- 1.封面图 -->
        <view v-if="!isPlaying" class="cover_image">
            <image :src="courseDetail.course.cover_image_url" mode="" />
            <view class="play">
                <image @click="playVideo" src="/static/images/play@2x.png" mode="" />
                <text>播放课程简介</text>
            </view>
        </view>
        <!-- 1.2.视频播放 -->
        <view v-else class="course_video">
            <!-- 自动播放与手动播放 -->
            <video controls id="videoID" :src="courseDetail.course.course_video_url"></video>
        </view>
        <!-- 2.简介 -->
        <view class="introduction">
            <view class="title-price">
                <text>{{courseDetail.course.title}}</text>
                <text>￥{{courseDetail.course.price}}.00</text>
            </view>
            <text class="introduce">{{courseDetail.course.introduction}}</text>
            <!-- Star子组件 -->
            <view class="star">
              <stars :score="courseDetail.course.score" />
                <text>{{courseDetail.course.study_count}}人在学</text>
            </view>
            <view class="study-share">
                <image @click="gotoStudy" src="/static/images/start_study@2x.png" alt/>
                <button open-type="share" class="share-button" plain></button>
            </view>
        </view>
        <!-- 3.自定义tab栏 -->
        <view class="catalog">
          <view class="head">
            <text @click="toggleIndex(index)" v-for="(item,index) in menus" :key="index" :class="[index === activeIdex ? 'active' : '']">{{item}}</text>
          </view>
          <view class="body">
            <view class="catelog-container" v-if="activeIdex === 0">
              <text v-for="(item,index) in courseDetail.videos" :key="item.id">{{index+1}}.{{item.name}}</text>
              <text v-if="!courseDetail.videos">暂无课程视频哦，请联系客服添加~</text>
            </view>
            <view class="lecturer-container" v-else-if="activeIdex === 1">
              <view v-if="courseDetail.lecturer" class="info">
                <image :src="courseDetail.lecturer.avatar" alt/>
                <view class="name-follow">
                  <text>{{courseDetail.lecturer.name}}</text>
                  <text>关注人数：{{courseDetail.lecturer.follow_count}}</text>
                </view>
                <text @click="followOrUnfollow(courseDetail.lecturer)" :class="[courseDetail.lecturer.is_follow === 0 ? 'unfollow' : 'follow']">{{courseDetail.lecturer.is_follow===0?'未关注':'已关注'}}</text>
              </view>
              <view class="introduce" v-if="courseDetail.lecturer">
                <text>{{courseDetail.lecturer.introduction}}</text>
              </view>
              <text v-if="!courseDetail.lecturer" style="color:#636363;font-size:15px">暂无讲师简介哦~</text>
            </view>
            <!-- 评论 -->
            <view v-else class="comment-container">
              <view class="comment-item" v-for="item in courseDetail.comments" :key="item.id">
                <view class="info">
                  <image :src="item.avatar" mode="" />
                  <view class="nickname-content">
                    <view style="margin-top:12px;">{{item.nickname}}</view>
                    <view style="margin-left:20px">
                      <star :score="item.score" />
                    </view>
                    <view>{{item.content}}</view>
                  </view>
                  <text class="time">{{item.comment_time}}</text>
                </view>
                <!-- 评论点赞 -->
                <view class="star">
                  <image @click="likeOrDislike(item)" :src="item.is_like === 1 ? '/static/images/like_normal@2x.png' : '/static/images/like_highlight@2x.png'" alt />
                </view>
              </view>
            </view>
          </view>
        </view>
    </view>
</template>

<script lang='ts'>
import Vue from 'vue'
import {fetch} from '../../utils/fetch'
import Stars from '../../components/Stars.vue'
export default Vue.extend({
  components:{
    Stars
  },
    data(){
        return {
            isPlaying:false,
            id:null,//课程id
            courseDetail:null, //课程详情
            menus:['目录','详情介绍','评价'],
            activeIdex:0  //默认激活索引
        }
    },
    // onload中取奇特跳转页面传过来的参数
    onLoad(options:any){
        this.id = options.id
        this.getCourseData()
    },
    // 生命周期------页面分享功能的开启
    onShareAppMessage(){
      return {
        title: `${this.courseDetail.course.title}`,
        path: '/pages/home/index',//分享给别人，别人打开小程序首先进入的path中
        imageUrl:'https://www.baidu.com/img/PC-pad_6d2362fef025ffd42a538cfab26ec26c.png',
        content:'点击链接跳转至该小程序'
      }
    },
    methods:{
        async getCourseData(){
            const result = await fetch({url:`course/${this.id}`})
            if(result.data.status === 0){
                this.courseDetail = result.data.message
                this.menus[2] = `评价(${result.data.message.commentTotal})`
            }
        },
        playVideo(){
            this.isPlaying = true
            // 手动播放
            setTimeout(()=>{
                uni.createVideoContext('videoID').play()
            },200)
        },
        // 跳转到播放页面
        gotoStudy(){
            console.log('1111')
        },
        // 切换选中的索引
        toggleIndex(i){
          this.activeIdex = i
        },
        // 关注与取消关注
        async followOrUnfollow(lecturer){
            switch (lecturer.is_follow) {
              case 0:
                // 未关注点击后关注
                const res1 = await fetch({
                  url:'/lecturer/follow',
                  method:'POST',
                  data:{
                    lecturer_id:lecturer.id
                  }
                })
                if(res1.data.status === 0){
                  uni.showToast({
                    title:res1.data.message,
                    icon:'none',
                    duration:500
                  })
                  // 更改模型，变成已关注
                  lecturer.is_follow = 1
                }
                break;
              case 1:
                // 已关注点击后取消关注
                const res2 = await fetch({
                  url:'/lecturer/unfollow',
                  method:'POST',
                  data:{
                    lecturer_id:lecturer.id
                  }
                })
                if(res2.data.status === 0){
                  uni.showToast({
                    title:res2.data.message,
                    icon:'none',
                    duration:500
                  })
                  // 更改模型，变成取消关注
                  lecturer.is_follow = 0
                }
                break;
            
              default:
                break;
            }
        },
        // 评论点赞与取消点赞
        async likeOrDislike(comments){
          switch (comments.is_like) {
            // 1 不点赞 变为 2点赞
            case 1:{
              const res = await fetch({
                url:'comment/like',
                method:'POST',
                data:{
                  comment_id:comments.id,
                  is_like:2
                }
              })
              if(res.data.status === 0){
                // 更改模型数据
                comments.is_like = 2
              }
              break;
            }
            case 2:{
              const res = await fetch({
                url:'comment/like',
                method:'POST',
                data:{
                  comment_id:comments.id,
                  is_like:1
                }
              })
              if(res.data.status === 0){
                comments.is_like = 1
              }
              break;
            }
              
            default:
              break;
          }
        }
    } 
})
</script>

<style lang="less" scoped>
.course-detail-container {
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
    position: relative;
    .play {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      image {
        width: 164rpx;
        height: 164rpx;
      }
      text {
        margin-top: 10rpx;
        color: #e9e9e9;
        font-size: 30rpx;
      }
    }
  }
  .course_video {
    width: 750rpx;
    height: 434rpx;
    video {
      width: 750rpx;
      height: 434rpx;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: 0rpx;
    border-radius: 16px 16px 0px 0px;
    left: 0;
    right: 0;
    height: 452rpx;
    background-color: #ffffff;
    padding: 20rpx 30rpx;
    .title-price {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text:nth-child(1) {
        font-size: 24px;
        color: #343434;
        font-weight: Bold;
      }
      text:nth-child(2) {
        font-size: 22px;
        color: #ee3939;
      }
    }
    .introduce {
      color: #818181;
      font-size: 12px;
      margin-top: 100rpx;
    }
    .star {
      display: flex;
      margin-top: 20rpx;
      text {
        height: 50rpx;
        line-height: 50rpx;
        margin-left: 20rpx;
        font-size: 12px;
        color: #fe8e38;
      }
    }
    .study-share {
      margin-top: 42rpx;
      margin-bottom: 52rpx;
      image:nth-child(1) {
        width: 568rpx;
        height: 92rpx;
      }
      .share-button {
        border: none;
        width: 92rpx;
        height: 92rpx;
        background-color: #fff;
        border-radius: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
        background-image: url(../../static/images/share@2x.png);
        background-repeat: no-repeat;
        background-size: 34rpx 34rpx;
        background-position: 30rpx 30rpx;
      }
    }
  }
  .catalog {
    margin-top: 520rpx;
    // position: absolute;
    z-index: 5;
    width: 750rpx;
    // height: 582rpx;
    background-color: #ffffff;
    .head {
      height: 120rpx;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      text {
        text-align: center;
        color: #a8a8a8;
        font-size: 14px;
        height: 120rpx;
        line-height: 120rpx;
        flex: 1;
        position: relative;
      }
      .active {
        color: #333333;
        font-weight: bold;
        &::after {
          content: '';
          position: absolute;
          left: 88rpx;
          bottom: 0px;
          width: 74rpx;
          height: 3px;
          background-color: #ff8e43;
        }
      }
    }
    .catelog-container {
      padding: 30rpx;
      height: 582rpx;
      text {
        background-color: #ffffff;
        color: #636363;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        display: block;
      }
    }
    .lecturer-container {
      padding: 30rpx;
      .info {
        height: 200rpx;
        display: flex;
        align-items: center;
        .name-follow {
          margin-left: 30rpx;
          display: flex;
          flex-direction: column;
          flex: 1;
          text:nth-child(1) {
            font-size: 34rpx;
            color: #333333;
          }
          text:nth-child(2) {
            font-size: 28rpx;
            margin-top: 15rpx;
            color: #a8a8a8;
          }
        }
        image {
          margin-left: 12rpx;
          width: 120rpx;
          height: 120rpx;
        }
        .unfollow {
          width: 136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 26rpx;
          color: #a8a8a8;
          font-size: 28rpx;
        }
        .follow {
          width: 136rpx;
          height: 52rpx;
          line-height: 52rpx;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 26rpx;
          color: #fff;
          background-color: #a8a8a8;
          font-size: 28rpx;
        }
      }
      .introduce {
        background-color: #ffffff;
        text {
          margin-left: 12rpx;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: rgba(168, 168, 168, 1);
          opacity: 1;
        }
      }
    }
    .comment-item {
      background-color: #ffffff;
      padding: 30rpx;
      height: 180rpx;
      border-bottom: 2px solid #f1f1f1;
      .info {
        height: 120rpx;
        display: flex;
        align-items: center;
        image {
          margin-left: 6rpx;
          width: 96rpx;
          height: 96rpx;
          border-radius: 50%;
        }
        .nickname-content {
          flex: 1;
          margin-left: 30rpx;
          .nickname {
            color: #333333;
            font-size: 30rpx;
            font-weight: bold;
            align-items: center;
            display: flex;
            view {
              height: 100%;
              display: inline-block;
            }
          }
          view:nth-child(2) {
            margin-top: 16rpx;
            color: #a8a8a8;
            font-size: 12px;
          }
        }
        .time {
          color: #a8a8a8;
          font-size: 11px;
        }
      }
    }
    .star {
      image {
        margin-top: 30rpx;
        width: 44rpx;
        height: 44rpx;
        float: right;
        margin-right: 20rpx;
      }
      image:nth-child(0) {
        margin-right: 20rpx;
      }
    }
  }
}
</style>