<template>
    <div id="preview" style="height: 100%; width: 100%;" @click="click_ProjectCard(myProject)">
        <div id="preview-header">
            <div id="preview-header-top">
                <div style="display:inline-flex; flex-direction: row;">
                    <img
                    id="Project_Preview_Icon"
                    src="../assets/Project_Preview_Icon.png"
                    alt="../assets/Project_Preview_Icon.png"
                    style="height: 25px; width: 25px; padding: 0; margin-right:auto;"
                    />
                    <div style="margin: 0; color:white"> {{ myProject.project_type }}</div>
                </div>

                <div>
                    <!-- 사양결정 -->
                </div>
                <div>
                    <!-- 사양결정 -->
                </div>
            </div>

            <div id="preview-header-middle">{{ myProject.project_name }}</div>
            <div id="preview-header-bottom">
                <i class="fa-solid fa-pen" style="margin-left:0.2rem; font-size:1.0rem; cursor: pointer;" @click.stop="openEditModal"></i>
                <i class="fa-solid fa-trash" style="margin-left:0.5rem; font-size:1.0rem; cursor: pointer;" @click.stop="delete_project"></i>
                <div style="margin-left:auto; margin-right:0.2rem;">{{ myProject.factory_name }}</div>
            </div>

        </div>
        <div class="row" style="height: 5%; width:100%; "></div>
        <div id="preview-footer" style="height: 35%; width:100%; margin:0;">
            <p style="margin: 0 10% 1em 0; text-align: left; font-size: 1em;"> {{ myProject.project_name }}</p>
            <p style="margin: 0 10% 1em 0; text-align: left; font-size: 0.66em;"> {{ myProject.project_script }}</p>
        </div>



        <!-- <div id="preview-header" style="height: 60%; width:100%; margin:0; border-radius: 0.5em;">
            <div style="display:inline-flex; flex-direction: row;">
                <img
                id="Project_Preview_Icon"
                src="../assets/Project_Preview_Icon.png"
                alt="../assets/Project_Preview_Icon.png"
                style="height: 25px; width: 25px; padding: 0; margin-right:auto;"
                />
                <div style="margin: 0;"> {{ myProject.project_type }}</div>
            </div>

            <div>
                사양결정
            </div>
            <div>
                사양결정
            </div>



            <p style="margin: 0;"> [project_type] : {{ myProject.project_type }}</p>


            <p style="margin: 0;"> [project_name] : {{ myProject.project_name }}</p>

            <p style="margin: 0;"> [factory_name] : {{ myProject.factory_name }}</p>
            <p style="margin: 0;"> [product_name] : {{ myProject.product_name }}</p>
            <p style="margin: 0;"> [process_name] : {{ myProject.process_name }}</p>
        </div>
        <div class="row" style="height: 5%; width:100%; "></div>
        <div class="row" style="height: 35%; width:100%; margin:0; border: 1px solid black;">
            <p style="margin: 0; text-align: left;"> [project_name] : {{ myProject.project_name }}</p>
            <p style="margin: 0; text-align: left;"> {{ myProject.project_script }}</p>
        </div> -->

    </div>

    <MyPageProjectsEditModal v-if="isEditProjectOpen" :myProject="myProject" @closeModal="closeModal"></MyPageProjectsEditModal>
</template>

<script>
import axios from "axios";

import MyPageProjectsEditModal from '@/components/MyPageProjectsEditModal.vue'

export default{
    components: {MyPageProjectsEditModal},
    props: ['myProject'],
    data() {
        return {
            isEditProjectOpen: false,
            API_List: null,
        }
    },
    methods: {
        click_ProjectCard(myProject) {
            console.log(myProject)
            this.$store.commit("setProject", myProject)
            this.$store.commit("saveSessionStorageProject")
            this.$router.push('/project/annotate')
        },

        delete_project() {
            fetch(this.API_List.delete_project + this.myProject.id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify({
                //     ai_model_id: this.modelInfo.id,
                // }),
                }).then( data => {
                    console.log(data)
                if(data.status == '200'){
                    alert("프로젝트 삭제 되었습니다.");
                }
            })
            .then(() => {
                this.$router.go();
            })
            ;
        },

        openEditModal() {
            this.isEditProjectOpen = true;
            console.log("OpenModal")
        },
        closeModal(){
            this.isEditProjectOpen = false;
            console.log("CloseModal")
        },
        edit_project() {

        },
        set_APIlist() {
            return axios.get('/api_list.json')
            .then(response => {
                this.API_List = response.data;
            })
            .catch(error => {
                console.log(error);
            });
        },
    },
    created() {
        this.set_APIlist()
    }
}
</script>

<style>
#preview-header {
    display:flex;
    flex-direction: column;
    justify-content: space-between;

    height: 60%;
    width:100%;
    margin:0;
    padding: 0.75em 0.5em 0.5em 0.5em;

    border-radius: 0.5em;

    background: linear-gradient( to bottom, #151928, #313760);
    color: white
}

#preview-header-top {
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    font-size: 1em;
}

#preview-header-middle {
    font-size: 1.5em;
}
#preview-header-bottom {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 1em;
}


</style>