<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        mpType: 'app',
        onLaunch() {
            // 判断用户是否登录，如果登录将所有页面出栈然后跳转到首页
            const my_token = uni.getStorageSync('my_token')
            if(my_token){
                uni.reLaunch({
                    url:'/pages/home/index'
                })
            }
        },
        onShow() {
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        }
    });
</script>

<style>
    /*每个页面公共css */
</style>
