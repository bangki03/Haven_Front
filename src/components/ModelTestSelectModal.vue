<template>
    <div class="mymodal-wrapper" @click="close_modal()">
        <div class="mymodal" @click.stop="do_nothing()">
            <div class="mymodal-header">검증 모델 선택</div>

            <div class="dard-main" style="display:flex; flex-direction: column; align-items: flex-start; overflow: hidden;">
                <ModelTestSelectModelHeader style="height:30px; width:100%;"></ModelTestSelectModelHeader>
                <div v-for="modelInfo in this.modelList" :key="modelInfo.id" style="width:100%;" >
                    <ModelTestSelectModelCard :modelInfo="modelInfo" style="width:100%;" @btn-selected="handleBtnSelected" @btn-unselected="handleBtnUnSelected"></ModelTestSelectModelCard>
                </div>
                <div style="height: 30px; width:100%; display:flex; flex-direction: row; justify-content: center; align-items: center; margin: 1.5em auto 0.5em auto">
                    <vue-awesome-paginate
                        :total-items="this.total"
                        :items-per-page="this.size"
                        :max-pages-shown="5"
                        v-model="currentPage"
                        @click="click_page"
                    />
                </div>
            </div>
            <div class="mymodal-footer">
               <input type="submit" class="btn" value="선택" style="background-color: #BD7C4A; color:white; font-size: 2em; padding:0.1em 1em;" @click="handle_submit">
            </div>
        </div>
    </div>


</template>

<script>
import $ from 'jquery';
import ModelTestSelectModelHeader from '@/components/ModelTestSelectModelHeader.vue'
import ModelTestSelectModelCard from '@/components/ModelTestSelectModelCard.vue'
// import { ref } from "vue";

export default{
    components: {
        ModelTestSelectModelHeader,
        ModelTestSelectModelCard,
    },
    data() {
        return {
            modelList: [],
            currentPage: 1,
            size: 10,
            total: 0,

            selected_model:[],
        }
    },
    methods: {

        close_modal() {
            this.$emit('closeModal')
        },
        do_nothing() {

        },
        load_modellist() {
            $.ajax({
                url: "http://183.105.120.175:30004/ai-model", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
                method: "GET",   // HTTP 요청 메소드(GET, POST 등)
                dataType: "json", // 서버에서 보내줄 데이터의 타입
                data: {
                    project_id: this.$store.state.project.id,
                    page: this.currentPage,
                    size: this.size,
                }
            })
            .then( data => {
                this.modelList = data.items
                this.total = data.total
            })

            // 임시 Test
            // this.modelList.push({
            //     "id": 0,
            //     "project_id": 0,
            //     "train_start_time": "2023-05-28T15:47:03.415Z",
            //     "train_end_time": "2023-05-28T15:47:03.415Z",
            //     "name": "string",
            //     "description": "string",
            //     "create_user_name": "이진래",
            //     "train_status": "string",
            //     "train_progress_rate": 20,
            //     "deploy_status": "Training",
            //     "file_path": "string",
            //     "val_score": 80,
            //     "val_metric_name": "string"
            // })
            // this.modelList.push({
            //     "id": 1,
            //     "project_id": 0,
            //     "train_start_time": "2023-05-28T15:47:03.415Z",
            //     "train_end_time": "2023-05-28T15:47:03.415Z",
            //     "name": "string121",
            //     "description": "string2",
            //     "create_user_name": "이진래",
            //     "train_status": "string2",
            //     "train_progress_rate": 80,
            //     "deploy_status": "Finished",
            //     "file_path": "string",
            //     "val_score": 90,
            //     "val_metric_name": "string"
            // })

        },
        load_model_deployed() {
            $.ajax({
                url: "http://183.105.120.175:30004/ai-model/deployed", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
                method: "GET",   // HTTP 요청 메소드(GET, POST 등)
                dataType: "json", // 서버에서 보내줄 데이터의 타입
                data: {
                    project_id: this.$store.state.project.id,
                }
            })
            .then( data => {
                this.model_deployed.ok_data_count = data.trainable_data_count.ok_data_count
                this.model_deployed.ng_data_count = data.trainable_data_count.ng_data_count
                this.load_model(data.deployed_ai_model)
            })

        },
        load_model(id) {
            $.ajax({
                url: "http://183.105.120.175:30004/ai-model/deployed", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
                method: "GET",   // HTTP 요청 메소드(GET, POST 등)
                dataType: "json", // 서버에서 보내줄 데이터의 타입
                data: {
                    ai_model_id : id,
                }
            })
            .then( data => {
                this.model_deployed.deployed_ai_model = data;
            })
        },

        click_page(page) {
            this.currentPage = page
            this.load_modellist()
        },

        handleBtnSelected(model) {
            this.selected_model.push(model);
        },
        handleBtnUnSelected(model){
            this.selected_model = this.selected_model.filter(item => item.id !== model.id);
        },
        handle_submit() {
            this.selected_model = [...new Set(this.selected_model)];
            this.$emit("setModel", this.selected_model)
            this.$emit('closeModal')
        },
    },

    mounted() {
        this.load_modellist()
    },
}

</script>

<style scoped>
.mymodal-wrapper {
   position: fixed;
   width: 100vw;
   height: 100vh;
   left:0vw;
   top:0vh;
   /* background-color: rgba(250,252,254,0.7); */
   background-color: rgba(0, 0, 0, 0.5); /* 불투명한 배경 스타일 */
}
.mymodal {
   display: block;
   width: 90vw;
   height: none;
   left:5vw;
   top:10vh;
   position : fixed;

   border-radius: 0.5em;

   background-color: rgba(250,252,254,1);
   box-shadow: 0px 0px 1px 1px #dddddd;
}
.mymodal-header{
   margin-top: 0.5em;
   padding-bottom: 0.5em;

   display: flex;
   justify-content: center;
   font-size: 1.8em;
   border: 0px solid;
   border-bottom-width: 2px;

   border-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
   border-image-slice: 1;
}
.mymodal-footer {
   display: flex;
   justify-content: center;
   align-items: center;

   margin-bottom: 1.0em;
   padding-top: 1.0em;

   /* font-size: 1.8em; */
   border: 0px solid;
   border-top-width: 2px;

   border-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
   border-image-slice: 1;
}
.dard-header {
    width: 100%;
    height: 40px;

    background-color: #BD7C4A;

    border-top-right-radius: 1em;
    border-top-left-radius: 1em;
}
.dard-main {
    width: 100%;
    height: calc(100% - 40px);

    background-color: white;

    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
}

.column-header {
    color: #6E738A;
    font-family:'Poppins-Semibold';
    font-size: 0.75rem;
    margin-bottom: 0;
}

.pagination-container {
    display: flex;
    column-gap: 10px;
}
.paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
}
.paginate-buttons:hover {
    background-color: #d8d8d8;
}
.active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
}
.active-page:hover {
    background-color: #2988c8;
}
</style>

