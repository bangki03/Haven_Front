<template>
    <div style="width:100%; height:100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; background-color: #EFF0F6; padding-top:2em; padding-bottom: 2em;">
        <p style="align-self: flex-start; margin-left: 2.0em; margin-top:0em;">학습된 AI 모델을 비교 검증 해보세요! 헤븐 관리자 님  👋  </p>

        <!-- <div style="width:98%; text-align: left;">
            여기는 AI 모델 학습 서비스입니다.
        </div> -->

        <div class="dard-container" style="width:98%; display:flex; flex-direction: column; justify-content: flex-start;">
            <div class="dard-header"></div>
            <div class="dard-main" style="display:flex; flex-direction: row; align-items: center;">
                <div style="display:flex; flex-direction: column; align-items: center; margin:1.5em 1.0em 1.0em 2.0em;">
                    <p class="column-header">최종 모델 학습 시작 시간</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" v-if="model_deployed.deployed_ai_model">{{ model_deployed.deployed_ai_model.train_start_time }}</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" v-else>-</p>
                </div>
                <div style="display:flex; flex-direction: column; align-items: center; margin:1.5em 1.0em 1.0em 1.0em;">
                    <p class="column-header">최종 모델 학습 완료 시간</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" v-if="model_deployed.deployed_ai_model">{{ model_deployed.deployed_ai_model.train_end_time }}</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" v-else>-</p>
                </div>
                <div style="display:flex; flex-direction: column; align-items: center; margin:1.5em 1.0em 1.0em 1.0em;">
                    <p class="column-header">신규 학습 가능 OK 데이터 수</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;">{{ model_deployed.ok_data_count }}</p>
                </div>
                <div style="display:flex; flex-direction: column; align-items: center; margin:1.5em 1.0em 1.0em 1.0em;">
                    <p class="column-header">신규 학습 가능 NG 데이터 수</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;">{{ model_deployed.ng_data_count }}</p>
                </div>
                <div id="btn-deploy" style="margin-left: auto; margin-right: 3.0em;" @click="openModal" ref="mymodal" @blur="closeModal">
                    신규 모델 학습
                </div>
            </div>
        </div>

        <div style="height:30px;"></div>

        <div class="dard-container" style="width:98%; height:700px; display:flex; flex-direction: column; justify-content: flex-start;">
            <div class="dard-header"></div>
            <div class="dard-main" style="display:flex; flex-direction: column; align-items: flex-start; overflow: hidden;">
                <ModelTrainModelInfoHeader style="height:30px; width:100%;"></ModelTrainModelInfoHeader>
                <div v-for="modelInfo in this.modelList" :key="modelInfo.id" style="width:100%;" >
                    <ModelTrainModelInfoCard :modelInfo="modelInfo" style="width:100%; "></ModelTrainModelInfoCard>
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

        </div>

        <ModelTrainNewModal v-if="isModelTrainNewOpen" class="create-myProject" @closeModal="closeModal"></ModelTrainNewModal>

    </div>
</template>

<script>
import $ from 'jquery';
import ModelTrainModelInfoHeader from '@/components/ModelTrainModelInfoHeader.vue'
import ModelTrainModelInfoCard from '@/components/ModelTrainModelInfoCard.vue'
import ModelTrainNewModal from '@/components/ModelTrainNewModal.vue'
// import { ref } from "vue";

export default{
    components: {
        ModelTrainModelInfoHeader,
        ModelTrainModelInfoCard,
        ModelTrainNewModal,
    },
    data() {
        return {
            isModelTrainNewOpen : false,

            modelList: [],
            currentPage: 1,
            size: 10,
            total: 0,

            model_deployed:{
                deployed_ai_model: null,
                ok_data_count: 0,
                ng_data_count: 0,
            },


            flag_IntervalAPILoadData : false,
            IntervalAPILoadData : null,
        }
    },
    methods: {

        // Cycle
        Set_Interval_LoadData () {
            // let period = this.config.monitoring_API_period
            if(!this.flag_IntervalAPILoadData) {
                this.IntervalAPILoadData = setInterval(this.load_modellist, 10000)
                this.flag_IntervalAPILoadData = true
                console.log("Set Periodically Load Model")
            }
        },
        Clear_Interval_LoadData () {
            if (this.flag_IntervalAPILoadData) {
                clearInterval(this.IntervalAPILoadData)
                this.flag_IntervalAPILoadData = false
                console.log("Clear Periodically Load Model")
            }
        },

        //
        openModal(){
            this.isModelTrainNewOpen = true;
        },
        closeModal(){
            this.isModelTrainNewOpen = false;
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

                // 학습 중인 것 있으면, Set_Interval_LoadData
                let flag = false
                for (let i=0; i<this.modelList.length; i++) {
                    if(this.modelList[i].train_status ==  "TRAINING") {
                        flag = true
                        this.Set_Interval_LoadData()
                        break
                    }
                }
                // 없으면, Clear_Interval_LoadData
                if(!flag) {
                    this.Clear_Interval_LoadData()
                }
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
    },

    mounted() {
        this.load_modellist()
    },
    beforeUnmount() {
        this.Clear_Interval_LoadData()
    }
}

</script>

<style>
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
#btn-deploy {
  color: #2777E4;
  background-color: #F0F0F5;
  border-color: #D2E7FF;
  cursor: pointer;

  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border: 1px solid transparent;

  margin: 0 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 1.0rem;

  font-family:'NotoSansKR-Light';
  font-weight: bold;
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