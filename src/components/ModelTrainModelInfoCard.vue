<template>
    <div style="height: 55px; width:100%; display:grid; grid-template-columns: 3.0fr 3.0fr 2.5fr 2.5fr 2fr 2fr 1fr 2fr 2fr 1.5fr 1fr 1fr 1fr; justify-items: stretch; justify-content: center; align-items: center; overflow:hidden">
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em; grid-column-start: 1; grid-column-end: 2;">{{ modelInfo.train_start_time || "-" }}</p>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.train_end_time || "-" }}</p>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.name || "-" }}</p>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">Segmentation</p>

        <!-- 작업자 -->
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.create_user_name || "-" }}</p>

        <!-- 학습진행률 -->
        <div><progress id="progress" :value="this.modelInfo.train_progress_rate" min="0" max="100"></progress></div>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto auto auto 0.5em;">{{ train_progress_rate_fixed }}</p>

        <!-- 학습상태 -->
        <div id="box_status" :style="{ backgroundColor: color_status_train[modelInfo.train_status] }">{{ modelInfo.train_status }}</div>

        <!-- 배포상태 -->
        <div id="box_status" :style="{ backgroundColor: color_status_deploy[modelInfo.deploy_status] }">{{ modelInfo.deploy_status }}</div>

        <!-- 정확도 -->
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 1.0em auto 1.0em;">{{ val_score_fixed }}</p>

        <!-- Action -->
        <div v-if="modelInfo.deploy_status === 'DEPLOYED'">-</div>
        <div v-else-if="modelInfo.deploy_status === 'AVAILABLE'"><button @click="ClickButtonDeploy" class="image-icon-action"></button></div>
        <div v-else-if="modelInfo.train_status === 'TRAINING'"><i class="fa-solid fa-stop fa-beat-fade" style="font-size: 2rem; cursor:pointer;" @click="ClickButtonStop"></i></div>
        <div v-else>-</div>

        <div v-if="modelInfo.train_status === 'TRAINING'">-</div>
        <div v-else><button @click="ClickButtonTest" class="image-icon-test"></button></div>
        <!-- <div><button @click="ClickButtonInfo" class="image-icon-info"></button></div> -->
        <div><button @click="ClickButtonDelete" class="image-icon-delete"></button></div>
    </div>

</template>

<script>
import axios from "axios";

export default{
    props: {
        modelInfo: {
            "id": Number,
            "train_start_time": String, //"2023-05-28T15:10:25.477Z"
            "train_end_time": String, //"2023-05-28T15:10:25.477Z"
            "name": String,
            "description": String,
            "create_user_name": String,
            "train_status": String,
            "train_progress_rate": Number,
            "deploy_status": String,
            "file_path": String,
            "val_score": Number,
            "val_metric_name": String
        },
    },
    data() {
        return{
            API_List: null,
            train_progress_rate_fixed: "",
            val_score_fixed: "",

            color_status_train: {
                // #FF5F2E red
                FINISHED: "#004E66",    // green
                TRAINING: "#FCBE32",    // yellow
                ERROR: "#E1EEF6"        // gray

            },

            color_status_deploy: {
                DEPLOYED: "#FF5F2E",    // red
                AVAILABLE: "#FCBE32",   // yellow
            },

        }
    },
    methods: {
        ClickButtonDeploy() {
            fetch(this.API_List.deploy_model + this.modelInfo.id + "/deploy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify({
                //     ai_model_id: this.modelInfo.id,
                // }),
                }).then( data => {
                    console.log(data)
                if(data.status == '200'){
                    alert("[임시] deploy 요청 완료");
                    this.$router.go();
                }
                });
        },
        ClickButtonDelete() {
            fetch(this.API_List.delete_model + this.modelInfo.id, {
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
                    alert("[임시]모델 삭제 되었습니다.");
                }
            })
            .then(() => {
                this.$router.go();
            })
            ;
        },
        ClickButtonTest() {
            this.$router.push({
                name: 'ModelTestView', // 이동할 라우트 이름
                // params: {'name': "aaa", "id": "bbb"}
                query: this.modelInfo
            });
        },
        ClickButtonStop() {
            fetch(this.API_List.stop_train_model + this.modelInfo.id, {
                method: "POSt",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify({
                //     ai_model_id: this.modelInfo.id,
                // }),
            })
            .then( data => {
                console.log(data)
                if(data.status == '200'){
                    alert("[임시]학습 중지 되었습니다.");
                }
            })
            .then(() => {
                this.$router.go();
            })
        },
        set_train_progress_rate() {
            if(this.modelInfo.train_progress_rate == null) {
                this.train_progress_rate_fixed = "0%"
            }
            else if(this.modelInfo.train_progress_rate == 100) {
                this.train_progress_rate_fixed = this.modelInfo.train_progress_rate + "%"
            }
            else{
                this.train_progress_rate_fixed = this.modelInfo.train_progress_rate.toFixed(1) + "%"
            }
        },
        set_val_score() {
            if(this.modelInfo.val_score == null) {
                this.val_score_fixed = "-"
            }
            else{
                this.val_score_fixed = (this.modelInfo.val_score * 100).toFixed(2) + "%"
            }
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
    watch: {
        'modelInfo.train_progress_rate'() {
            console.log("watch train_progress_rate")
            this.set_train_progress_rate()
        },
        'modelInfo.val_score'() {
            console.log("watch val_score")
            this.set_val_score()
        },
    },
    created() {
        this.set_APIlist()
        this.set_train_progress_rate()
        this.set_val_score()
    }
}
</script>

<style>
#progress {
    width:100%;
    appearance: none;
}
#progress::-webkit-progress-bar {
    background:#f0f0f0;
    border-radius:10px;
    box-shadow: inset 3px 3px 10px #ccc;
}
#progress::-webkit-progress-value {
    border-radius:10px;
    background: #1D976C;
    background: -webkit-linear-gradient(to right, #93F9B9, #1D976C);
    background: linear-gradient(to right, #93F9B9, #1D976C);
}
#box_status{
    width: 100%;
    height: 70%;
    color: white;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    padding: 0 0.5rem;

    box-sizing: border-box;
    background-clip: content-box;
}
.image-icon-action {
    background-image: url('@/assets/viewTrain/icon_deploy.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-color: white;
    border: none;

    width: 42.75px;
    height: 34px;


}
.image-icon-test {
    background-image: url('@/assets/viewTrain/icon_test.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-color: white;
    border: none;

    width: 46.62px;
    height: 39px;
}
.image-icon-info {
    background-image: url('@/assets/viewTrain/icon_info.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-color: white;
    border: none;

    width: 42.75px;
    height: 33px;
}
.image-icon-delete {
    background-image: url('@/assets/viewTrain/icon_delete.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-color: white;
    border: none;

    width: 52.34px;
    height: 40px;
}
</style>