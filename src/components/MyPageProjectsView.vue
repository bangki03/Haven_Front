<template>
    <h4 style="text-align: left; margin-left: 1em;">PROJECTS</h4>
    <div class="row" style="display: block; height:12%;  margin: 0;"></div>
    <div class="row" style="display: flex; height:85%; margin: 0;">
        <div class="col" v-for="(myProject) in this.myProjectList" :key="myProject" style="display:inline-block; width:25%; height:85%; margin: 0; padding: 0 0.5em; flex-grow:1;">
          <MyPageProjectsCard @click="click_ProjectCard(myProject)" :project_SummaryCard="myProject"/>
        </div>
        <div class="col" style="display:inline-block; width:25%; height:85%; margin: 0; padding: 0 0.5em; flex-grow:1;">
            <MyPageProjectsCreateCard @click="openModal" ref="mymodal" @blur="closeModal"></MyPageProjectsCreateCard>
        </div>

        <!-- <div class="col" style="display:inline-block; width:25%; height:85%; margin: 0; padding: 0 0.5em;">
            <MyPageProjectsCard @click=" click_ProjectCard" ></MyPageProjectsCard>
        </div>
        <div class="col" style="display:inline-block; width:25%; height:85%; margin: 0; padding: 0 0.5em;">
            <MyPageProjectsCard @click=" click_ProjectCard"></MyPageProjectsCard>
        </div>
        <div class="col" style="display:inline-block; width:25%; height:85%; margin: 0; padding: 0 0.5em;">
            <MyPageProjectsCard @click=" click_ProjectCard"></MyPageProjectsCard>
        </div>
        <div class="col" style="display:inline-block; width:25%; height:85%; margin: 0; padding: 0 0.5em;">
            <MyPageProjectsCard @click=" click_ProjectCard"></MyPageProjectsCard>
        </div> -->
    
    </div>

    <MyPageProjectsCreateModal v-if="iscreateProjectOpen" class="create-myProject" @blur="closeModal"></MyPageProjectsCreateModal>
</template>

<script>
import MyPageProjectsCard from "@/components/MyPageProjectsCard.vue"
import MyPageProjectsCreateCard from "@/components/MyPageProjectsCreateCard.vue"
import MyPageProjectsCreateModal from "@/components/MyPageProjectsCreateModal.vue"

import $ from 'jquery';

export default {
    components: {
        MyPageProjectsCard,
        MyPageProjectsCreateCard,
        MyPageProjectsCreateModal
    },
    data() {
        return {
            iscreateProjectOpen: false,
            myProjectList: []
        }
    },

    methods: {
        click_ProjectCard() {
            this.$router.push('/project')
        },
        click_createProject(){
            this.iscreateProjectOpen = true;

        },

        openModal(){
            this.iscreateProjectOpen = true;

            // let self = this;  
            // this.$nextTick(function(){
            //     self.$refs.mymodal.focus();
            // })    
            
        },
                
        closeModal(){
            this.iscreateProjectOpen = false;
            // var LayerPopup = $(".create-myProject");
            // if(LayerPopup.has(e.target).length === 0){
            //     // LayerPopup.removeClass("show");
            //     this.iscreateProjectOpen = false;
            // }
        },

        get_ProjectList() {
            $.ajax({
                url: "http://183.105.120.175:30004/project", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
                method: "GET",   // HTTP 요청 메소드(GET, POST 등)
                dataType: "json", // 서버에서 보내줄 데이터의 타입
                data: {
                    user_id: this.$store.state.account.UserID,
                },  // HTTP 요청과 함께 서버로 보낼 데이터
            })
            .then( data => {
                for (var data_tmp of data) {
                    this.myProjectList.push(data_tmp.project)
                }
                console.log(this.myProjectList)
            })
        },

    },
    mounted() {
        this.get_ProjectList()
    },
}
</script>

<style>
</style>