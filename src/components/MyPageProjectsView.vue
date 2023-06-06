<template>
    <h4 style="text-align: left; margin-left: 1em;">PROJECTS</h4>
    <div class="row" style="display: block; height:8%;  margin: 0;"></div>

    <!-- <div class="row" style="display: flex; height:85%; margin: 0;">
        <div class="col" v-for="(myProject) in this.myProjectList.slice(0,4)" :key="myProject" style="display:inline-block; width:25%; height:85%; margin: 0; padding: 0 0.5em; flex-grow:1;">
          <MyPageProjectsCard @click="click_ProjectCard(myProject)" :project_SummaryCard="myProject"/>
        </div>
        <div class="col" style="display:inline-block; width:25%; height:85%; margin: 0; padding: 0 0.5em; flex-grow:1;">
            <MyPageProjectsCreateCard @click="openModal" ref="mymodal" @blur="closeModal"></MyPageProjectsCreateCard>
        </div>
    </div> -->

    <div class="my-container" style="display:flex; overflow-x: auto; width:100%; height:85%; flex-wrap: nowrap; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
        <div v-for="(myProject) in this.myProjectList" :key="myProject" style="height:85%; padding: 0 0.5em; flex: 0 0 24%; scroll-snap-align : start">
            <MyPageProjectsCard @click="click_ProjectCard(myProject)" :project_SummaryCard="myProject"/>
        </div>
        <div style="height:85%; padding: 0 0.5em; flex: 0 0 24%;">
            <MyPageProjectsCreateCard @click="openModal" ref="mymodal" @blur="closeModal"></MyPageProjectsCreateCard>
        </div>
    </div>


    <!-- <div style="height:85%; width:100%; display:grid; grid-template-columns: repeat(auto-fill, minmax(calc(25% - 1em), auto)); column-gap: 1em; justify-items: stretch; justify-content: center; align-items: stretch; overflow:hidden">
        <div class="" v-for="(myProject) in this.myProjectList" :key="myProject" style="">
            <MyPageProjectsCard @click="click_ProjectCard(myProject)" :project_SummaryCard="myProject"/>
        </div>
        <div class="" style="">
            <MyPageProjectsCreateCard @click="openModal" ref="mymodal" @blur="closeModal"></MyPageProjectsCreateCard>
        </div>
    </div> -->



    <MyPageProjectsCreateModal v-if="iscreateProjectOpen" class="create-myProject" @closeModal="closeModal"></MyPageProjectsCreateModal>
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
        click_ProjectCard(myProject) {
            console.log(myProject)
            this.$store.commit("setProject", myProject)
            this.$store.commit("saveSessionStorageProject")
            this.$router.push('/project/annotate')
        },
        // click_createProject(){
        //     this.iscreateProjectOpen = true;

        // },

        openModal(){
            this.iscreateProjectOpen = true;

            // let self = this;
            // this.$nextTick(function(){
            //     self.$refs.mymodal.focus();
            // })

        },

        closeModal(){
            this.iscreateProjectOpen = false;
            console.log("modal destruct")
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

<style scoped>
/* .my-container::-webkit-scrollbar {
  display: none;
} */
.my-container::-webkit-scrollbar {
    height: 12px;  /* 스크롤바의 너비 */
}
.my-container::-webkit-scrollbar-thumb {
    background: #fff; /* 스크롤바의 색상 */
    box-shadow: inset 0px 0px 5px white;

    border-radius: 10px;
    background-clip: padding-box;
    border: 2px transparent;
}
.my-container::-webkit-scrollbar-track {
    background: #fff;  /*스크롤바 뒷 배경 색상*/
    box-shadow: inset 0px 0px 5px white;
}
.my-container::-webkit-scrollbar-thumb:hover {
    background:#BD7C4A;
}
.my-container::-webkit-scrollbar-track:hover {
    background: rgba(33, 122, 244, .1);
}

</style>