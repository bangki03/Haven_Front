<template>
    <div style="height: 55px; width:100%; display:grid; grid-template-columns: 1fr 3.0fr 3.0fr 2.5fr 2fr 2.5fr 0.5fr 2fr 2fr 1.5fr; justify-items: stretch; justify-content: center; align-items: center; overflow:hidden">
        <div class="form-check" style="width:1.5em; margin-left:2rem;">
            <input class="form-check-input" type="checkbox" :name="'Radio${modelInfo.id}'" :id="'Radio${modelInfo.id}'" v-model="selectedBtn" :disabled="modelInfo.train_status !== 'FINISHED'">
            <label class="form-check-label" :for="'Radio${modelInfo.id}'"></label>
        </div>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.train_start_time || "-" }}</p>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.train_end_time || "-" }}</p>
        <p style="font-family: Poppins-SemiBold; font-size:1.0rem; margin: auto 0.5em auto 0.5em;">{{ modelInfo.name || "-" }}</p>

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
            selectedBtn: null,

            train_progress_rate_fixed: "",
            val_score_fixed: "",

            color_status_train: {
                TRAINING: "#DCC236",    // Yellow
                FINISHED: "#3430ED",    // Blue
                ERROR: "#E93434"        // Red
            },

            color_status_deploy: {
                DEPLOYED: "#DCC236",
                AVAILABLE: "#3430ED",
            },
        }
    },
    methods: {
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
        selectedBtn() {
            if(this.selectedBtn){
                this.$emit('btn-selected', this.modelInfo);
            }
            else{
                this.$emit('btn-unselected', this.modelInfo);
            }

        }
    },
    created() {
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