<template>
    <div style="height: 55px; width:100%; display:grid; grid-template-columns: 3.5fr 3.5fr 3fr 3fr 2fr 2fr 1fr 2fr 1.5fr 1fr 1fr 1fr; justify-items: stretch; justify-content: center; align-items: center; overflow:hidden">
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em; grid-column-start: 1; grid-column-end: 2;">{{ modelInfo.train_start_time || "-" }}</p>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.train_end_time || "-" }}</p>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.name || "-" }}</p>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">Segmentation</p>

        <!-- 작업자 -->
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.create_user_name || "-" }}</p>

        <!-- 학습진행률 -->
        <div><progress id="progress" :value="this.modelInfo.train_progress_rate" min="0" max="100"></progress></div>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto auto auto 0.5em;">{{ train_progress_rate_fixed }}</p>

        <!-- 진행상태 -->
        <div id="status" :style="{ backgroundColor: status_color}">{{ modelInfo.deploy_status }}</div>

        <!-- 정확도 -->
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 1.0em auto 1.0em;">{{ val_score_fixed }}</p>

        <div v-if="modelInfo.deploy_status === 'deployed'">"-"</div>
        <div v-else><button @click="ClickButtonAction" class="image-icon-action"></button></div>
        <div><button @click="ClickButtonTest" class="image-icon-test"></button></div>
        <!-- <div><button @click="ClickButtonInfo" class="image-icon-info"></button></div> -->
        <div><button @click="ClickButtonDelete" class="image-icon-delete"></button></div>
    </div>

</template>

<script>
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
            train_progress_rate_fixed: "",
            val_score_fixed: ""
        }
    },
    methods: {
        ClickButtonAction() {
            fetch("http://183.105.120.175:30004/ai-model/" + this.modelInfo.id + "/deploy", {
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
            fetch("http://183.105.120.175:30004/ai-model/" + this.modelInfo.id, {
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
    },
    computed: {
        status_color() {
            if(this.modelInfo.deploy_status == 'Training') {
                return '#DCC236'
            }
            else if(this.modelInfo.deploy_status == 'Finished') {
                return '#3430ED'
            }
            else{
                return '#E93434'
            }
        },
        set_train_progress_rate() {
            if(this.modelInfo.train_progress_rate == null) {
                return "0%"
            }
            else if(this.modelInfo.train_progress_rate == 100) {
                return this.modelInfo.train_progress_rate + "%"
            }
            else{
                return this.modelInfo.train_progress_rate.toFixed(1) + "%"
            }
        },
        set_val_score() {
            if(this.modelInfo.val_score == null) {
                return "-"
            }
            else{
                return this.modelInfo.val_score.toFixed(2) + "%"
            }
        },
    },
    created() {
        this.train_progress_rate_fixed = this.set_train_progress_rate
        this.val_score_fixed = this.set_val_score
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
#status{
    width: 100%;
    height: 70%;
    color: white;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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