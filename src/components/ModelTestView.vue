<template>
    <div style="width:100%; height:100vh; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; background-color: #EFF0F6;">
        <p style="align-self: flex-start; margin-left: 2.0em; margin-top:1.0em;">학습된 AI 모델을 비교 검증 해보세요! 헤븐 관리자 님  👋  </p>

        <div class="dard-container1" style="width:98%; display:flex; flex-direction: row; align-items: center;">
            <div style="display:flex; flex-direction: column; align-items: center; margin:1.5em 1.0em 1.0em 2.0em;">
                <p class="column-header">검증 시작 시간</p>
                <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" >-</p>
                <!-- <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" v-if="model_deployed.deployed_ai_model">{{ model_deployed.deployed_ai_model.train_start_time }}</p>
                <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" v-else>-</p> -->
            </div>
            <div style="display:flex; flex-direction: column; align-items: center; margin:1.5em 1.0em 1.0em 1.0em;">
                <p class="column-header">검증 완료 시간</p>
                <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" >-</p>
                <!-- <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" v-if="model_deployed.deployed_ai_model">{{ model_deployed.deployed_ai_model.train_end_time }}</p>
                <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;" v-else>-</p> -->
            </div>
            <div style="display:flex; flex-direction: column; align-items: center; margin:1.5em 1.0em 1.0em 1.0em;">
                <p class="column-header">선택된 데이터 이미지 수</p>
                <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;">{{ ImageList.length }}</p>
            </div>
            <div style="display:flex; flex-direction: column; align-items: center; margin:1.5em 1.0em 1.0em 1.0em;">
                <p class="column-header">선택된 AI 모델 수</p>
                <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;">{{ ModelList.length }}</p>
            </div>


            <progress id="progress" :value="this.progress_rate" min="0" :max="ImageList.length" style="width: 10rem; margin-left: auto; margin-right: 1.0em;"></progress>
            <p  style="font-family: Poppins-SemiBold; font-size:1.0rem; margin-right: 1.0em; margin-top:auto; margin-bottom: auto;">{{ progress_rate }}/{{ ImageList.length }}</p>
            <div id="btn-start-test" style="margin-right: 1.0em;" @click="start_test"
            :class="{'btn-active': ImageList.length > 0 && ModelList.length > 0 , 'btn-disable': ImageList.length == 0 || ModelList.length == 0}">
                모델 검증 시작
            </div>
            <!-- <div id="btn-clear-setting" style="margin-right: 3.0em;" @click="clear_setting">
                설정 초기화
            </div> -->
            <div id="btn-clear-setting" style="margin-right: 3.0em;" @click="clear_setting">
                설정 초기화
            </div>
        </div>

        <div class="dard-container" style="width:98%; height: 780px; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; margin-top:1em;">
            <div class="dard-header" style="display:flex; flex-direction: row; justify-content:flex-start; align-items: center; " >
                <div v-show="letFocusImage" id="btn-back" @click="CloseZoomImageModal" style="margin-left:1.0em; cursor: pointer;">
                    <i id="arrow-previous" class="fa fa-arrow-left image-arrows" style="font-size: 15px; transform: scaleX(1); color: white;"/> 뒤로가기
                </div>
            </div>
            <div v-if="state=='ready'" class="dard-main" style="display:flex; flex-direction: column; justify-content: flex-start; align-items: center;">
                <p style="color:#6E738A; font-family: NotoSansKR-Regular; font-size: 1.25rem; align-self: flex-start; margin-left: 1.0rem; margin-top:1.0rem;"> 데이터 및 AI 모델 선택</p>
                <p style="font-family: NotoSansKR-Regular; font-weight: bold; font-size:1.5rem; align-self: flex-start; margin-left: 1.0rem; margin-top:0rem; margin-bottom: 0rem;"> 모델을 적용하기 전 원하는 데이터와 비교하고 싶은 두가지 모델을 선택하여 성능을 비교해보세요! </p>
                <div style="width:98%; height:calc(100% - 4rem); display:flex; flex-direction: row; justify-content: space-around; margin-top:2em;">
                    <div style="width:35%; aspect-ratio: 1/1; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top:1.0em; padding-bottom:0.5em;">
                        <input type="file" id="imageInput" multiple style="display: none;" @change="handleFileInputChange" accept="image/*" value="">
                        <div v-if="ImageList.length == 0" class="empty-frame" @click="click_loadImage">
                            <p style="font-size: 3.0em; color: #898989; width:70%;">1. 검증할 영상을 선택하세요</p>
                            <i style="font-size: 9em; color: #898989" class="fa-solid fa-plus fa-sharp"></i>
                            <!-- <input type="file" id="imageInput" webkitdirectory multiple style="display: none;" @change="handleFileInputChange"> -->
                        </div>
                        <div v-else class="selected-frame" @click="click_loadImage">
                            <p style="font-size: 3.0em; width:75%;">영상 선택 완료</p>
                            <!-- <div style="height:50%; width:100%; display:flex; flex-direction: column; align-items: center;">
                                <p v-for="imageInfo in this.ImageList" :key="imageInfo" style="font-size: 1.0em; width:75%;">{{ imageInfo }}</p>
                            </div> -->
                        </div>
                    </div>

                    <div style="width:35%; aspect-ratio: 1/1; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top:1.0em; padding-bottom:0.5em;">
                        <div v-if="ModelList.length == 0" class="empty-frame" @click="OpenSetModelModal">
                            <p style="font-size: 3.0em; color: #898989; width:70%;">2. 검증할 모델을 선택하세요</p>
                            <i style="font-size: 9em; color: #898989" class="fa-solid fa-plus fa-sharp"></i>
                        </div>
                        <div v-else class="selected-frame" @click="OpenSetModelModal">
                            <p style="font-size: 3.0em; width:75%;">모델 선택 완료</p>
                            <!-- <div style="height:50%; width:100%; display:flex; flex-direction: column; align-items: center;">
                                <p v-for="modelInfo in this.ModelList" :key="modelInfo" style="font-size: 1.0em; width:75%;"></p>
                            </div> -->

                        </div>
                    </div>

                    <!-- <div style="width:30%; aspect-ratio: 1/1; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top:1.0em; padding-bottom:0.5em;">
                        <div v-if="setting.Model_B==null" class="empty-frame" @click="OpenSetModelModal_B">
                            <p style="font-size: 3.0em; color: #898989; width:75%;">3. 테스트 모델B를 선택하세요</p>
                            <i style="font-size: 9em; color: #898989" class="fa-solid fa-plus fa-sharp"></i>
                        </div>
                        <div v-else class="selected-frame">
                            <p style="font-size: 3.0em; width:75%;">모델B 선택 완료</p>
                        </div>
                    </div> -->
                </div>
            </div>
            <div v-else-if="state=='running'" class="dard-main" style="width:100%; height:calc(100% - 40px); display:flex; flex-direction: column; justify-content: center; align-items: center;">
                <fade-loader :color="'#BD7C4A'"></fade-loader>
            </div>
            <div v-else-if="state=='done' && !letFocusImage" class="dard-main" style="width:100%; height:calc(100% - 40px); display:flex; flex-direction: column; justify-content: flex-start; align-items: center;">
                <div style="width:100%; display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
                    <p style="margin-left: 1.0em; margin-top:1.0em; margin-right:auto;"> 검증 결과</p>
                    <div style="display:flex; flex-direction: row; margin-left:auto; margin-right:0rem;">
                        <div v-for="(MaskInfo, index) in InferenceData[0].mask" :key="MaskInfo.ModelName">
                            <label class="form-check-label" :style="{ color: colorList[index] }" style="font-weight:200;font-size: 1.2em; margin-right:2em; margin-top:0.3em;">{{ MaskInfo.name }}</label>
                        </div>
                    </div>

                    <div class="dropdown" ref="dropdownRef" style="margin-left:1rem; margin-right:1.0rem;">
                        <button class="dropbtn" @click="handleDropBtn">{{ selectednumArrayType_string }}</button>
                        <div class="dropdown-content" :style="{ display: showDropdownContent ? 'block' : 'none' }">
                            <a @click="selectnumArrayType(1)">1개씩</a>
                            <a @click="selectnumArrayType(2)">2개씩</a>
                            <a @click="selectnumArrayType(3)">3개씩</a>
                            <a @click="selectnumArrayType(4)">4개씩</a>
                            <a @click="selectnumArrayType(6)">6개씩</a>
                            <a @click="selectnumArrayType(8)">8개씩</a>
                        </div>
                    </div>
                </div>
                <div style="width:100%; height:calc(100% - 3.5rem - 30px); padding:1rem;  max-height:622px;">
                    <!-- <ModelTestThumbnailCard :imageInfo="ImageList[0]" @OpenZoomImageModal="OpenZoomImageModal" style="height:100%;"></ModelTestThumbnailCard> -->
                    <!-- <img :src="ImageList[0].imagepath" style="object-fit: contain; height:100%; width:100%;"/> -->

                    <div v-if="selectednumArrayType==1" style="display:flex; justify-content:center; align-items:center; width:100%; height: 100%;">
                        <div v-for="(myInferenceData, index) in InferenceData.slice(index_image.start,index_image.end)" :key="myInferenceData" style="height:100%;">
                            <ModelTestThumbnailCard :inferenceInfo="myInferenceData" :index="index" :colorList="colorList" @OpenZoomImageModal="OpenZoomImageModal(index_image.start+index)" style="height:100%;"></ModelTestThumbnailCard>
                        </div>
                    </div>
                    <div v-else-if="selectednumArrayType==2" style="display:flex; justify-content:center; align-items:center; width:100%; height: 100%; gap: 10px;">
                        <div v-for="(myInferenceData, index) in InferenceData.slice(index_image.start,index_image.end)" :key="myInferenceData" style="height:100%;">
                            <ModelTestThumbnailCard :inferenceInfo="myInferenceData" :index="index" :colorList="colorList" @OpenZoomImageModal="OpenZoomImageModal(index_image.start+index)" style="height:100%;"></ModelTestThumbnailCard>
                        </div>
                    </div>
                    <div v-else-if="selectednumArrayType==3" style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; height:100%;">
                        <div v-for="(myInferenceData, index) in InferenceData.slice(index_image.start,index_image.end)" :key="myInferenceData" style="height:100%;">
                            <ModelTestThumbnailCard :inferenceInfo="myInferenceData" :index="index" :colorList="colorList" @OpenZoomImageModal="OpenZoomImageModal(index_image.start+index)" style="height:100%;"></ModelTestThumbnailCard>
                        </div>
                    </div>
                    <div v-else-if="selectednumArrayType==4" style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 10px; height:100%;">
                        <div v-for="(myInferenceData, index) in InferenceData.slice(index_image.start,index_image.end)" :key="myInferenceData" style="height:100%;">
                            <ModelTestThumbnailCard :inferenceInfo="myInferenceData" :index="index" :colorList="colorList" @OpenZoomImageModal="OpenZoomImageModal(index_image.start+index)" style="height:100%;"></ModelTestThumbnailCard>
                        </div>
                    </div>
                    <div v-else-if="selectednumArrayType==6" style="display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 10px; height:100%;">
                        <div v-for="(myInferenceData, index) in InferenceData.slice(index_image.start,index_image.end)" :key="myInferenceData" style="height:100%;">
                            <ModelTestThumbnailCard :inferenceInfo="myInferenceData" :index="index" :colorList="colorList" @OpenZoomImageModal="OpenZoomImageModal(index_image.start+index)" style="height:100%;"></ModelTestThumbnailCard>
                        </div>
                    </div>
                    <div v-else-if="selectednumArrayType==8" style="display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 10px; height:100%;">
                        <div v-for="(myInferenceData, index) in InferenceData.slice(index_image.start,index_image.end)" :key="myInferenceData" style="height:100%;">
                            <ModelTestThumbnailCard :inferenceInfo="myInferenceData" :index="index" :colorList="colorList" @OpenZoomImageModal="OpenZoomImageModal(index_image.start+index)" style="height:100%;"></ModelTestThumbnailCard>
                        </div>
                    </div>


                </div>
                <div style="height: 30px; width:100%; display:flex; flex-direction: row; justify-content: center; align-items: center; margin: 1.5em auto 0.5em auto">
                    <vue-awesome-paginate
                        :total-items="this.ImageList.length"
                        :items-per-page="selectednumArrayType"
                        :max-pages-shown="5"
                        v-model="index_image.currentPage"
                        @click="click_page"
                    />
                </div>
            </div>

            <!-- <ModelTestZoomModal v-if="state=='done' && letFocusImage" class="dard-main" style="width:100%; display:flex; flex-direction: column; justify-content: flex-start; align-items: center;"
            :InferenceData="SelectedImage"></ModelTestZoomModal> -->

            <div v-if="state=='done' && letFocusImage" class="dard-main" style="width:100%; height:calc(100% - 40px); display:flex; flex-direction: column; justify-content: flex-start; align-items: center;">
                <ModelTestZoomModal :InferenceData="SelectedImage" :colorList="colorList"></ModelTestZoomModal>
            </div>


        </div>

    </div>

    <ModelTestSelectModal v-if="letSelectModel" class="create-myProject" @closeModal="CloseSetModelModal" @setModel="setModel"></ModelTestSelectModal>

</template>

<script>
// import path from 'path';

// import SelectTool from "@/components/annotator/tools/SelectTool.vue";
import ModelTestSelectModal from "@/components/ModelTestSelectModal.vue"
import ModelTestThumbnailCard from "@/components/ModelTestThumbnailCard.vue"
import ModelTestZoomModal from "@/components/ModelTestZoomModal.vue"

import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import $ from 'jquery';
import axios from "axios";

export default{
    components:{
        // SelectTool,
        ModelTestSelectModal,
        ModelTestThumbnailCard,
        ModelTestZoomModal,
        FadeLoader,
    },
    data() {
        return{
            API_List: null,
            // Modal 및 State
            letSelectModel: false,
            letFocusImage: false,
            state: "ready",  // ready, running, done

            // 검증 시작 Input
            ImageList: [],
            ModelList: [],

            // 검증 시작 Input (Test)
            // ImageList: [
            // {imagepath_origin: "2023-06-21_15-43-00_02image.jpg", imagepath: "2023-06-21_15-43-00_02image.jpg"},
            // {imagepath_origin: "2023-06-21_15-43-00_03image.jpg", imagepath: "2023-06-21_15-43-00_03image.jpg"},
            // {imagepath_origin: "2023-06-21_15-43-00_04image.jpg", imagepath: "2023-06-21_15-43-00_04image.jpg"},
            // {imagepath_origin: "2023-06-21_15-43-00_05image.jpg", imagepath: "2023-06-21_15-43-00_05image.jpg"},
            // {imagepath_origin: "2023-06-21_15-43-00_06image.jpg", imagepath: "2023-06-21_15-43-00_06image.jpg"},
            // {imagepath_origin: "2023-06-21_15-43-00_07image.jpg", imagepath: "2023-06-21_15-43-00_07image.jpg"},
            // // {imagepath_origin: "2023-06-21_15-43-00_08image.jpg", imagepath: "2023-06-21_15-43-00_08image.jpg"},
            // // {imagepath_origin: "2023-06-21_15-43-00_09image.jpg", imagepath: "2023-06-21_15-43-00_09image.jpg"},
            // // {imagepath_origin: "2023-06-20_19-23-07_01image.jpg", imagepath: "2023-06-20_19-23-07_01image.jpg"},

            // ],
            // ModelList: [
            //     {id:'175'},
            //     // {id:'176'},
            // ],



            // 검증 시작 Output
            InferenceData: [],
            colorList: ['#FF0000', '#0000FF', '#FF00FF'],

            // 검증 시작 Output (Test)
            // InferenceData: [
            //     {
            //         'image_path_raw': "/iQ.Platform/projects/1/data/2023-06-16/16-19-41/2023-06-16_16-19-41_01image.jpg",
            //         "result": "OK",
            //         "uncertainty": 0,
            //         "image_path1": "2023-06-16/16-19-41/2023-06-16_16-19-41_01image.jpg",
            //         "image_path2": "",
            //         "mask" : [
            //             {id: "175", name: "175", data_base64Decoded: []},
            //             {id: "176", name: "176", data_base64Decoded: []},
            //         ],
            //     }
            // ],

            // 검증 요청 (Progress)
            progress_rate: 0,


            // 검증 결과 페이지
            SelectedImage: null,

            showDropdownContent: false,
            selectednumArrayType_string: '1개씩',
            selectednumArrayType: 1,
            num_items: {
                row: 1,
                col: 1,
            },

            index_image: {
                currentPage: 1,
                start: 0,
                end: 0,
            },


            // Socket
            socket: null,
            messages: [],
        }
    },

    methods: {
        ////////// 이미지 선택 //////////
        click_loadImage() {
            const imageInput = document.getElementById('imageInput');
            imageInput.click();
        },
        async handleFileInputChange(event) {
            const files = event.target.files;
            if (files.length === 0) {
                console.log('파일 선택이 취소되었습니다.');
                return;
            }

            this.ImageList = []
            for (var file of files){
                let data = await this.encode_base64(file)
                let base64_encoded = data.base64Data
                let raw_binary = data.binaryString
                let image_size = await this.getSizeImage(file)

                this.ImageList.push({
                    filename: file.name,
                    imagepath: this.set_origin_filepath(file.name),
                    height: image_size.height,
                    width: image_size.width,
                    image_binary: raw_binary,
                    base64_encoded: base64_encoded
                })
            }




            // Test
            // this.ImageList= [
            //     {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            //     {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            //     {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            //     {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            //     {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            //     {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            //     {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            // ]

        },

        ////////// 모델 선택 모달 //////////
        OpenSetModelModal() {
            this.letSelectModel = true
        },
        CloseSetModelModal() {
            this.letSelectModel = false;
        },
        load_modellist() {
            $.ajax({
                url: this.API_List.get_modellist, // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
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
        },
        setModel(models) {
            console.log(models)
            this.ModelList = models;
        },
        clear_setting() {
            this.ImageList = []
            this.ModelList = []
            this.InferenceData = []
            this.progress_rate = 0
            this.state = "ready"
        },

        ////////// 검증 시작 요청 버튼 //////////
        start_test() {
            // this.setupEventSource()
            // this.setupSocket()
            // this.setupSocket2()
            this.setupSocket3()
            // this.state = "done"
        },
        
        // Socket (WebSocket 사용)
        setupSocket2() {
            console.log("setupSocket2")
            // console.log(this.config.eval_web_socket)
            this.socket = new WebSocket(this.API_List.eval_web_socket)
            console.log("this.socket.readyState: ",this.socket.readyState)

            this.socket.onopen = () => {
                this.state = "running"
                console.log("소켓 연결이 열렸습니다.")
                console.log("this.socket.readyState: ",this.socket.readyState)

                let image_files_Array = []
                for(let i=0; i<this.ImageList.length; i++) {
                    image_files_Array.push(this.ImageList[i].imagepath)
                }

                let models_Array_ids = []
                let models_Array_names = []
                let models_Array_paths = []

                console.log(this.ModelList)

                for(let i=0; i<this.ModelList.length; i++) {
                    models_Array_ids.push(String(this.ModelList[i].id))
                    models_Array_names.push(String(this.ModelList[i].name))
                    models_Array_paths.push(String(this.ModelList[i].file_path))
                }

                var jsonData = {
                    'project_id': this.$store.state.project.id,
                    'image_files': image_files_Array,
                    'ai_model_ids': models_Array_ids,
                    'ai_model_names': models_Array_names,
                    'ai_model_paths': models_Array_paths,
                }
                console.log(jsonData)

                // Test
                // var jsonData = {
                //     'project_id': this.$store.state.project.id,
                //     'image_files': [
                //         '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_02image.jpg',
                //         '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_03image.jpg',
                //         '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_04image.jpg',
                //         '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_05image.jpg',
                //         '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_06image.jpg',
                //         '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_07image.jpg',
                //         // '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_08image.jpg',
                //         // '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_09image.jpg',
                //         // '/iQ.Platform/projects/40/data/2023-06-21/15-42-59/2023-06-21_15-43-00_10image.jpg',
                //     ],

                //     // 'ai_model_ids':['175','176']
                //     'ai_model_ids':['175']
                // }

                this.socket.send(JSON.stringify(jsonData));
            };

            this.socket.onmessage = (event) => {
                console.log(event)
                var validJSONstring = event.data.replace(/'/g, '"');
                const data = JSON.parse(validJSONstring); // 받은 데이터를 JSON 형태로 파싱합니다.
                this.Parse_InferenceData(data)

                if(this.InferenceData.length == this.ImageList.length) {
                    this.state = "done"
                    this.clearSocket()
                    console.log(this.InferenceData)
                }

                // Test
                // for(let j=0; j<3; j++){
                //     let mask_binary = '';
                //     let length = Math.pow(2, 20); // 2^20 개수

                //     for (let i = 0; i < length; i++) {
                //         let randomBit = Math.round(Math.random()); // 0 또는 1 랜덤 생성
                //         mask_binary += randomBit;
                //     }

                //     this.InferenceData[data.progress-1].mask[j].data_base64Decoded = mask_binary
                //     this.InferenceData[data.progress-1].mask[j].data_base64 = btoa(mask_binary)
                // }

                // Test2
                // let mask_binary1 = '';
                // let mask_binary2 = '';
                // let mask_binary3 = '';
                // let length = Math.pow(2, 18); // 2^20 개수

                // for (let i = 0; i < length; i++) {
                //     mask_binary1 += 1;
                //     mask_binary2 += 0;
                //     mask_binary3 += 0;
                // }
                // for (let i = 0; i < length; i++) {
                //     mask_binary1 += 0;
                //     mask_binary2 += 1;
                //     mask_binary3 += 0;
                // }
                // for (let i = 0; i < length; i++) {
                //     mask_binary1 += 0;
                //     mask_binary2 += 0;
                //     mask_binary3 += 1;
                // }
                // for (let i = 0; i < length; i++) {
                //     mask_binary1 += 0;
                //     mask_binary2 += 0;
                //     mask_binary3 += 0;
                // }

                // this.InferenceData[data.progress-1].mask[0].data_base64Decoded = mask_binary1
                // this.InferenceData[data.progress-1].mask[0].data_base64 = btoa(mask_binary1)

                // this.InferenceData[data.progress-1].mask[1].data_base64Decoded = mask_binary2
                // this.InferenceData[data.progress-1].mask[1].data_base64 = btoa(mask_binary2)

                // this.InferenceData[data.progress-1].mask[2].data_base64Decoded = mask_binary3
                // this.InferenceData[data.progress-1].mask[2].data_base64 = btoa(mask_binary3)


            };

            // this.socket.onmessage = function(event) {
            //     console.log("서버 응답:", event.data);

            // };

            this.socket.onerror = (error) => {
                console.error('소켓 연결 중 오류가 발생했습니다:', error);
            };

            this.socket.onclose = (event) => {
                console.log('소켓 연결이 닫혔습니다:', event.code);
                // alert("서버와 소켓통신 끊어졌습니다. 확인 바랍니다.")
                // this.state="ready"
            };

        },
        // image를 서버에 직접 쏘는 메쏘드 (Data 입출력 변경함. 그 전에는 [] 였는데, Object로 )
        setupSocket3() {
            this.socket = new WebSocket(this.API_List.eval_web_socket)
            console.log("this.socket.readyState: ",this.socket.readyState)

            this.socket.onopen = () => {
                this.state = "running"
                console.log("소켓 연결이 열렸습니다.")
                console.log("this.socket.readyState: ",this.socket.readyState)

                let imageDataList = []
                for(let i=0; i<this.ImageList.length; i++) {
                    let imageData = {}
                    imageData.file_name = this.ImageList[i].filename
                    imageData.encoded_image = this.ImageList[i].base64_encoded
                    imageData.width = this.ImageList[i].width
                    imageData.height = this.ImageList[i].height

                    imageDataList.push(imageData)
                }

                let aiModelList = []
                for(let i=0; i<this.ModelList.length; i++) {
                    let aiModel = {}
                    aiModel.id = String(this.ModelList[i].id)
                    aiModel.name = String(this.ModelList[i].name)
                    aiModel.path = String(this.ModelList[i].file_path)

                    aiModelList.push(aiModel)
                }

                var jsonData = {
                    'project_id': this.$store.state.project.id,
                    'images': imageDataList,
                    'ai_models': aiModelList,
                }

                console.log("Socket onOpen <Send>")
                console.log(JSON.stringify(jsonData))
                this.socket.send(JSON.stringify(jsonData));
            };

            this.socket.onmessage = (event) => {
                console.log(event)
                var validJSONstring = event.data.replace(/'/g, '"');
                const data = JSON.parse(validJSONstring); // 받은 데이터를 JSON 형태로 파싱합니다.
                this.Parse_InferenceData_v2(data)   // 이미지를 직접 내가 만드는

                if(this.InferenceData.length == this.ImageList.length) {
                    this.state = "done"
                    this.clearSocket()
                    console.log(this.InferenceData)
                }

            };

            this.socket.onerror = (error) => {
                console.error('소켓 연결 중 오류가 발생했습니다:', error);
            };

            this.socket.onclose = (event) => {
                console.log('소켓 연결이 닫혔습니다:', event.code);
                // alert("서버와 소켓통신 끊어졌습니다. 확인 바랍니다.")
                // this.state="ready"
            };

            // console.log("setupSocket2 - 종료")
        },
        clearSocket() {
            if(this.socket == null) {
                console.log('소켓 연결이 열려있지 않습니다..');
            }
            else{
                this.socket.close();
                console.log('소켓 연결이 닫혔습니다.');
            }

        },

        ////////// 검증 결과 //////////
        selectnumArrayType(type) {
            this.selectednumArrayType_string = String(type) + "개씩"
            this.selectednumArrayType = type;

            if(type==1) {
                this.num_items.row = 1
                this.num_items.col = 1
            }
            else if(type==2) {
                this.num_items.row = 1
                this.num_items.col = 2
            }
            else if(type==4) {
                this.num_items.row = 2
                this.num_items.col = 2
            }
            else if(type==6) {
                this.num_items.row = 2
                this.num_items.col = 3
            }

            console.log(this.num_items)

            this.showDropdownContent = false;
            this.click_page(1)
        },

        handleDropBtn() {
            this.showDropdownContent = !this.showDropdownContent
        },
        handleDropdownContentClick(event) {
            event.stopPropagation(); // 클릭 이벤트 전파 중지
        },
        handleOutsideClick(event) {
            if (this.showDropdownContent && !this.$refs.dropdownRef.contains(event.target)) {
                this.showDropdownContent = false;
            }
        },

        click_page(page) {
            this.index_image.currentPage = page

            this.index_image.start = (page - 1) * this.selectednumArrayType
            this.index_image.end = (page) * this.selectednumArrayType
        },


        ////////// 검증결과 데이터 처리 //////////
        Parse_InferenceData(rawData) {
            if(rawData != null && Object.prototype.hasOwnProperty.call(rawData, "progress")) {
                this.progress_rate = rawData.progress
                let output = {}
                // 1. filepath 세팅
                output.image_path_raw = rawData.image_path
                output.image_path1 = this.get_filepath_to_show_filename(rawData.image_path)
                output.image_path2 = this.get_filepath_to_load_image(rawData.image_path)
                // test
                // output.image_path2 = "/project/" + rawData.image_path.split('/')[7]

                // 2. 기타 데이터 저장
                output.result = rawData.result
                output.uncertainty = rawData.uncertainty

                // 3. mask 데이터 Decoding
                output.mask=[]
                for( let ModelNo in rawData.mask) {
                    let mask_tmp = {}
                    mask_tmp.id = ModelNo
                    mask_tmp.name = ModelNo
                    mask_tmp.data_base64 = rawData.mask[ModelNo]
                    mask_tmp.data_base64Decoded = this.decode_base64(rawData.mask[ModelNo])
                    output.mask.push(mask_tmp)
                }
                this.InferenceData.push(output)
            }

        },

        // project 외 경로의 이미지에 대해서도 그려야하기 때문에,
        Parse_InferenceData_v2(rawData) {
            if(rawData != null && Object.prototype.hasOwnProperty.call(rawData, "progress")) {
                this.progress_rate = rawData.progress
                let output = {}

                // 1. filename 확인
                let status_image_matching = false
                for(let index in this.ImageList) {
                    if(this.ImageList[index].filename == rawData.filename) {
                        output.image_binary = this.ImageList[index].image_binary
                        output.base64_encoded = this.ImageList[index].base64_encoded
                        output.width = this.ImageList[index].width
                        output.height = this.ImageList[index].height
                        // console.log("index: ", index)
                        // console.log("filename: ", this.ImageList[index].filename)
                        // console.log("image_binary: ")
                        // console.log(this.ImageList[index].image_binary)
                        status_image_matching = true;
                        break;
                    }
                }
                if(!status_image_matching) {
                    alert("No image named []", rawData.filename)
                    return
                }

                output.image_path1 = rawData.image_filename
                console.log("binaryImage")
                console.log(output.image_binary)

                // test
                // output.image_path2 = "/project/" + rawData.image_path.split('/')[7]

                // 2. 기타 데이터 저장
                output.result = rawData.result
                output.uncertainty = rawData.uncertainty

                // 3. mask 데이터 Decoding
                output.mask=[]
                for( let ModelNo in rawData.mask) {
                    let mask_tmp = {}
                    mask_tmp.id = ModelNo
                    mask_tmp.name = ModelNo
                    mask_tmp.data_base64 = rawData.mask[ModelNo]
                    mask_tmp.data_base64Decoded = this.decode_base64(rawData.mask[ModelNo])
                    output.mask.push(mask_tmp)
                }
                this.InferenceData.push(output)
            }

        },

        decode_base64(encodedData) {
            const decodedData = atob(encodedData);

            var binaryData = "";
            for (let i = 0; i < decodedData.length; i++) {
                binaryData += decodedData.charCodeAt(i);
            }

            return binaryData
        },
        encode_base64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    console.log("ImageFile Onload")
                    const fileData = reader.result; // fileData : Arraybuffer
                    const uint8Array = new Uint8Array(fileData);    // unit8 Array

                    let binaryString = '';
                    for (let i = 0; i < uint8Array.length; i++) {
                        binaryString += String.fromCharCode(uint8Array[i]);     // binaryString
                    }
                    const base64Data = btoa(binaryString);
                    resolve({binaryString: binaryString, base64Data: base64Data});
                };

                reader.onerror = (error) => {
                    reject(error)
                };
                reader.readAsArrayBuffer(file);
            })
        },
        getSizeImage(file) {

            return new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = function() {
                    const width = img.width;
                    const height = img.height;
                    resolve({width: width, height: height})
                };

                img.onerror = (error) => {
                    reject(error)
                };

                img.src = URL.createObjectURL(file);

            })


        },

        ////////// 이미지 확대 모달 //////////
        OpenZoomImageModal(index) {
            console.log("OpenZoomImageModal index: ", index)
            console.log("selectedImage: ", this.InferenceData[index].image_path2)
            this.SelectedImage = this.InferenceData[index]

            this.letFocusImage = true;
        },
        CloseZoomImageModal() {
            this.letFocusImage = false;
        },






        ////////// 기타 //////////

        // local 파일명으로 부터 fullpath 얻어내는 함수
        set_origin_filepath(filename){
            // filename='2023-06-16_16-19-41_01image.jpg'
            let filename_list = filename.split('_')
            // console.log(filename_list)
            // let filepath = "/iQ.Platform/projects/" + this.$store.state.project.id + "/data/" + filename_list[0] + "/" + filename_list[1] + "/"+ filename
            let filepath = "/iQ.Platform/projects/" + this.$store.state.project.id + "/data/" + filename_list[0] + "/"+ filename
            // console.log(filepath)
            return filepath
        },

        // 파일명 표시 위한 filepath
        get_filepath_to_show_filename(input){
            // console.log("get_filepath_to_show_filename")
            // console.log(input.split('/').slice(5).join('/'))
            return input.split('/').slice(5).join('/')
        },

        // 이미지 로드 위한 filepath
        // input : "/iQ.Platform/projects/1/data/2023-06-16/16-19-41/2023-06-16_16-19-41_01image.jpg"
        // output : "../project/1/data/2023-06-16/16-19-41/2023-06-16_16-19-41_01image.jpg"
        get_filepath_to_load_image(input){
            // console.log("get_filepath_to_load_image")
            // console.log("../project/" + input.split('/').slice(3).join('/'))
            return "../project/" + input.split('/').slice(3).join('/')
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
        "state"(after) {
            if(after == "done") {
                this.click_page(1)
            }
        }
    },
    created(){
        this.set_APIlist()
        this.$emit("emit_selectedMenu", 2)

        if (Object.prototype.hasOwnProperty.call(this.$route.query, "id")) {
          this.ModelList.push(this.$route.query)
        }
    },

    beforeUnmount() {
        this.clearSocket()

    }

}


</script>

<style scoped>
#ImageGridContainer {
    width:100%;
    height:calc(100% - 1.5rem - 1rem - 1rem - 30px - 2rem);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    grid-auto-rows: minmax(48%, 1fr);
    /* grid-auto-rows: repeat(auto-fit, minmax(0, 1fr)); */
    gap: 10px;

    /* align-content: center;
    justify-content: center; */
    place-content: center;
    place-self: center;
}

.dard-container1{
    border-radius: 1em;
    background-color: white;
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
    /* height:760px; */
    height: calc(100% - 40px);

    background-color: white;

    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
}
.frame{
    width: 95%;
    height: calc(100% - 24px);
    background-color: #7c818c;
}
.empty-frame {
    width: 95%;
    /* height: calc(100% - 24px); */
    aspect-ratio: 1/1;
    background-color: #202020;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}
.selected-frame {
    width: 95%;
    /* height: calc(100% - 24px); */
    aspect-ratio: 1/1;
    background-color: #202020;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    color: #14E54F;
}
#btn-start-test {
  background-color: #F0F0F5;
  border-color: #D2E7FF;


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
.btn-active {
    color: #2777E4 !important;
    cursor: pointer !important;
}
.btn-disable {
    color: #898989 !important;
    pointer-events: none;
}
#btn-clear-setting {
  background-color: #F0F0F5;
  border-color: #D2E7FF;
  color: #2777E4;
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


/* Dropdown */
.dropdown {
   width: 5rem;
   position: relative;
   display: inline-block;
}
.dropbtn {
   margin-bottom: 0px;
   /* border-radius: 20px; */
   font-size: 0.8rem;
   font-family: Actor-Regular;
   padding-left: 1em;

   color: black;
   display: block;
   width: 5rem;
   padding: 0.375rem 0.75rem;
   /* font-size: 1rem; */
   font-weight: 400;
   line-height: 1.5;
   text-align: start;
   padding-left: 1em;

   background-color: #fff;
   background-clip: padding-box;
   border: 1px solid #ced4da;

   appearance: none;

   transition: border-color .15s;

   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
   cursor: pointer;
}



.dropdown-content {
  width:5rem;
  display: none;
  position: absolute;
  /* background-color: #f1f1f1; */
  background-color: white;
  /* border-radius: 20px; */
  /* min-width: 160px; */
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 0.8rem;
}

.dropdown-content a:hover {
    background-color: #ddd;
    /* border-radius: 20px; */
}

.dropdown:hover .dropdown-content {display: block;}

/* .dropdown:hover .dropbtn {background-color: #3e8e41;} */

#btn-back {
  /* color: #2777E4; */
  color: white;

  font-family:'HermeneusOne-Regular';
  /* font-weight: bold; */
}


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
</style>