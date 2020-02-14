<template>
    <div>
        <course-list :courses="courses" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {fetch} from '../../utils/fetch'
import CourseList from '../../components/CourseList.vue'
export default Vue.extend({
    components:{
        CourseList
    },
    data() {
        return {
            courses:[]
        }
    },
    onLoad(){
        this.getCourseListData()
    },
    methods:{
        async getCourseListData(){
            const result = await fetch({
                url:'course/list'
            })
            if(result.data.status === 0){
                this.courses = result.data.message
            }
        }
    }
})
</script>