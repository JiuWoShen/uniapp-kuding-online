<template>
  <view class="phone-login-container">
    <text class="phone-validate">手机号验证</text>
    <text class="subtitle">用于即使获取课程最新信息</text>
    <view class="content">
        <input class="phone" v-model="phone" placeholder="请输入您的手机号" type="number" />
        <view @click="getVcode" class="get_vcode" :style="{color:isCountDown?'#ccc':'black'}">{{tipName}}</view>
        <input class="vcode" v-model="vcode" placeholder="请输入验证码" type="number" />
    </view>
    <view class="phone-login">
        <image @click="phoneLogin" src="/static/images/phone_login@2x.png" alt="" />
    </view>
  </view>
</template>
<script lang='ts'>
import {fetch} from '../../utils/fetch'
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      phone:'17704051019',
      vcode:'',
      tipName:'获取验证码',
      count:10, //倒计时秒数
      isCountDown: false, //是否正在倒计时
      timer:-1    //计时器
    };
  },
  methods:{
    //   获取验证码    
    async getVcode(){
        // 1.手机非空及正则校验
        if(this.phone.trim().length === 0){
            uni.showToast({
                title:'手机号不能为空',
                icon:'none',
                duration:500
            })
            return
        }
        var reg = /^1[3456789][0-9]{9}$/
        if(!reg.test(this.phone)){
            uni.showToast({
                title:'手机号不合法',
                icon:'none',
                duration:500
            })
            return
        }
        // 2.倒计时
        // 如果正在倒计时，则返回
        if(this.isCountDown === true) return

        this.tipName = `${this.count}`
        this.isCountDown = true
        this.timer = setInterval(()=>{
            this.count--
            this.tipName = `${this.count}`
            if(this.count<=1){
                clearInterval(this.timer)
                this.count = 10
                this.isCountDown = false
                this.tipName = '获取验证码'
            }
        },1000)
        // 3.发送请求获取验证码
        const result = await fetch({
            url:'user/vcode',
            data:{
                phone:this.phone
            },
            tips:'正在获取验证码',
            isNeedAuth:false
        })
        if(result.data.status === 0){
            uni.showToast({
                // title一定是字符串类型的
                title:result.data.vcode+'',
                icon:'none',
                duration:1000
            })
        }
    },
    // 手机号登陆
    async phoneLogin(){
        const result = await fetch({
            url:'user/login',
            method:'POST',
            data: {
                phone:this.phone,
                vcode:this.vcode
            },
            tips:'正在登陆...',
            isNeedAuth:false
        })
        // 登陆成功
        if(result.data.status===0){
            // 1.提示
            uni.showToast({
                title:result.data.message,
                icon:'none',
                duration:500
            })
            // 2.保存token至本地
              uni.setStorageSync('my_token',result.data.token)
              // 3.跳转到首页--------relaunch是将所有的页面都出栈---销毁
              uni.reLaunch({
                url: '/pages/home/index'
              });
        }else{
            uni.showToast({
                title:result.data.message,
                icon:'none',
                duration:500
            })
        }
    }
  },
  // 生命周期钩子
  onUnload(){
    //   销毁登陆成功后的最后一次计时器
      clearInterval(this.timer)
  }   
});
</script>
<style lang="less" scoped>
.phone-login-container {
  padding: 0rpx 68rpx;
  .phone-validate {
    margin-top: 100rpx;
    color: #393939;
    font-size: 43px;
    display: block;
  }
  .subtitle {
    margin-top: 20rpx;
    color: #a8a8a8;
    font-size: 30rpx;
    display: block;
  }
  .content {
    margin-top: 150rpx;
    height: 250rpx;
    position: relative;
    .phone {
      height: 100rpx;
      font-size: 15px;
      // background-color: green;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        background-color: #e9e9e9;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 1px;
      }
    }
    .get_vcode {
      position: absolute;
      right: 0;
      top: 20rpx;
      width: 164rpx;
      height: 56rpx;
      text-align: center;
      line-height: 56rpx;
      font-size: 24rpx;
      color: #a8a8a8;
      border: 1px solid rgba(168, 168, 168, 1);
      border-radius: 20px;
      z-index: 2;
    }
    .vcode {
      margin-top: 30px;
      height: 100rpx;
      font-size: 15px;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        background-color: #e9e9e9;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 1px;
      }
    }
  }
  .phone-login {
    margin-top: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      width: 568rpx;
      height: 98rpx;
    }
  }
}
</style>