<template>
    <view class="mp-circle-container">
        <canvas class="mp-circle" :style="{width:width+'px',height:height+'px'}" :canvas-id="'canvasId'+canvasId"></canvas>
    </view>
</template>

<script lang= 'ts'>
import Vue from 'vue'
export default Vue.extend({
    data(){
        return {
            myForeColor:''
        }
    },
    props:{
        progress:{
            type:Number,
            default:0
        },
        canvasId:Number,
        width:{
            type:Number,
            default:100
        },
        height:{
            type:Number,
            default:100
        },
        lineWidth:{
            type:Number,
            default:5
        },
        // 背景色
        backgroundColor:{
            type:String,
            default:'#f3f3f3'
        },
        foreColor:{
            type:String,
            default:'#b4d66e'
        }
    },
    //  修改子组件自己的属性
    created() {
        this.myForeColor = this.foreColor
    },
    // 组件中使用mounted--------挂载到实例上去之后调用------------只会执行一次-----无法实现学习后的联动更新----update
    mounted(){
        this.drawCircle()

       /*  Vue.nextTick(()=>{
            this.drawCircle()
        }) */
    },
    /* updated(){
        // 数据每更新就执行
        Vue.nextTick(()=>{
            this.drawCircle()
        })
    }, */
    methods:{
        drawCircle(){
            // 根据canvasId拿到上下文
            const ctx = uni.createCanvasContext('canvasId'+this.canvasId,this)
            // 2.绘制背景圆环
            ctx.strokeStyle = this.backgroundColor
            // 设置线宽
            ctx.lineWidth = this.lineWidth
            // 绘制圆形
            ctx.arc(this.width / 2,this.height / 2,this.width / 2 - this.lineWidth,0,2*Math.PI,false)
            ctx.stroke()

            // 3.进度的绘制
            if(this.progress <=30){
                this.myForeColor = '#ff0000'
            }else if(this.progress >30 && this.progress <50) {
                this.myForeColor = '#ff783b'
            }else{
                this.myForeColor = '#b4d66e'
            }
            // 开始画另外一段之前，记得调用 beginPath 代表开启一段新的路径
            ctx.beginPath()
            ctx.strokeStyle = this.myForeColor
            // 端点样式
            ctx.setLineCap('round')
            const endAngle = (this.progress / 100) * 2 * Math.PI - 0.5 * Math.PI
            ctx.arc(this.width / 2, this.height / 2, this.width / 2 - this.lineWidth,-0.5 * Math.PI,endAngle,false)
            ctx.stroke()

            // 4、绘制数字
            ctx.beginPath()
            ctx.fillStyle = this.myForeColor
            const font_size = 12
            ctx.font = font_size + 'px Helvetica'
            if (this.progress >= 99) {
                ctx.fillText(this.progress + '%',this.width / 2 - 13,this.height / 2 + 5)
            } else {
                ctx.fillText(this.progress + '%',this.width / 2 - 10,this.height / 2 + 5)
            }

            // !!!绘制
            ctx.draw()
        }
    }
})
</script>

<style scoped>
.mp-circle-container {
  position: relative;
}
.mp-circle {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}
</style>