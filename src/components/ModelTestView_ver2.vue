<template>
    <div style="width:100%; height:100vh; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; background-color: #EFF0F6;">

        <p style="align-self: flex-start; margin-left: 2.0em; margin-top:1.0em;">학습된 AI 모델을 비교 검증 해보세요! 헤븐 관리자 님  👋  </p>

        <div class="dard-container" style="width:98%; display:flex; flex-direction: row; align-items: center;">
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


            <div id="btn-start-test" style="margin-left: auto; margin-right: 1.0em;" @click="strat_test"
            :class="{'btn-active': ImageList.length > 0 && ModelList.length > 0 , 'btn-disable': ImageList.length == 0 || ModelList.length == 0}">
                모델 검증 시작
            </div>
            <div id="btn-clear-setting" style="margin-right: 3.0em;" @click="clear_setting">
                설정 초기화
            </div>
        </div>


        <!-- Inference 결과 보여주는 데 -->
        <div v-if="state=='ready'" class="dard-container" style="width:98%; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; margin-top:1em;">
            <div class="dard-header" style="display:flex; flex-direction: row; justify-content:flex-start; align-items: center; " ></div>
            <p style="align-self: flex-start; margin-left: 1.0em; margin-top:1.0em;"> 데이터 및 AI 모델 선택</p>
            <p style="align-self: flex-start; margin-left: 1.0em; margin-top:1.0em;"> 모델을 적용하기 전 원하는 데이터와 비교하고 싶은 두가지 모델을 선택하여 성능을 비교해보세요! </p>
            <div style="width:98%; height:80%; display:flex; flex-direction: row; justify-content: space-around; margin-top:2em;">
                <div style="width:35%; aspect-ratio: 1/1; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top:1.0em; padding-bottom:0.5em;">
                    <div v-if="ImageList.length == 0" class="empty-frame" @click="click_loadImage">
                        <p style="font-size: 3.0em; color: #898989; width:70%;">1. 검증할 영상을 선택하세요</p>
                        <i style="font-size: 9em; color: #898989" class="fa-solid fa-plus fa-sharp"></i>
                        <input type="file" id="imageInput" multiple style="display: none;" @change="handleFileInputChange">
                        <!-- <input type="file" id="imageInput" webkitdirectory multiple style="display: none;" @change="handleFileInputChange"> -->
                    </div>
                    <div v-else class="selected-frame">
                        <p style="font-size: 3.0em; width:75%;">영상 선택 완료</p>
                        <div style="height:50%;">
                            <p v-for="imageInfo in this.ImageList" :key="imageInfo" style="font-size: 1.0em; width:75%;">{{ imageInfo }}</p>
                        </div>
                    </div>
                </div>

                <div style="width:35%; aspect-ratio: 1/1; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top:1.0em; padding-bottom:0.5em;">
                    <div v-if="ModelList.length == 0" class="empty-frame" @click="click_loadModel">
                        <p style="font-size: 3.0em; color: #898989; width:70%;">2. 검증할 모델을 선택하세요</p>
                        <i style="font-size: 9em; color: #898989" class="fa-solid fa-plus fa-sharp"></i>
                    </div>
                    <div v-else class="selected-frame">
                        <p style="font-size: 3.0em; width:75%;">모델 선택 완료</p>
                        <div style="height:50%;">
                            <p v-for="modelInfo in this.ModelList" :key="modelInfo.id" style="font-size: 1.0em; width:75%;">{{ modelInfo.name }}</p>
                        </div>

                    </div>
                </div>

                <!-- <div style="width:30%; aspect-ratio: 1/1; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top:1.0em; padding-bottom:0.5em;">
                    <div v-if="setting.Model_B==null" class="empty-frame" @click="click_loadModel_B">
                        <p style="font-size: 3.0em; color: #898989; width:75%;">3. 테스트 모델B를 선택하세요</p>
                        <i style="font-size: 9em; color: #898989" class="fa-solid fa-plus fa-sharp"></i>
                    </div>
                    <div v-else class="selected-frame">
                        <p style="font-size: 3.0em; width:75%;">모델B 선택 완료</p>
                    </div>
                </div> -->
            </div>

        </div>

        <div v-else-if="state=='done'" class="dard-container" style="width:98%; height: 82%; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; margin-top:1em;">
            <div class="dard-header" style="display:flex; flex-direction: row; justify-content:flex-start; align-items: center; " >
            </div>
            <div style="width:100%; display: flex; flex-direction: row; align-items: center;">
                <p style="margin-left: 1.0em; margin-top:1.0em;"> 검증 결과</p>
                <div class="dropdown" ref="dropdownRef" style="margin-left:auto; margin-right:1.0em;">
                     <button class="dropbtn" @click="handleDropBtn">{{ selectednumArrayType_string }}</button>
                     <div class="dropdown-content" :style="{ display: showDropdownContent ? 'block' : 'none' }">
                        <a @click="selectnumArrayType(1)">1개씩</a>
                        <a @click="selectnumArrayType(2)">2개씩</a>
                        <a @click="selectnumArrayType(3)">3개씩</a>
                        <!-- <a @click="selectnumArrayType(4)">4개씩</a> -->
                        <a @click="selectnumArrayType(6)">6개씩</a>
                        <a @click="selectnumArrayType(8)">8개씩</a>
                     </div>
                  </div>
            </div>

            <!-- <div style="width:98%; display: grid; grid-template-columns: 2fr 5fr; grid-template-rows: repeat(9, minmax(60px, auto)); column-gap: 1em;">
            </div> -->

            <!-- <div v-for="(myImage) in ImageList.slice(index_image.start,index_image.end)" :key="myImage" style="padding:1em;">
                <div v-if="selectednumArrayType==1" style="width:100%; height:65vh; display:grid; justify-content: center; align-items: center; grid-template-columns: 1fr; grid-template-rows: 1fr;">
                    <div style="max-width: 100%; max-height: 100%; grid-area: 1/1;">
                        <img style="object-fit: contain; max-width: 100%; max-height: 100%;" :src="myImage.imagepath" @click="ImageZoomModal" />
                    </div>
                </div>
            </div> -->

            <!-- <div  v-if="selectednumArrayType==1 || selectednumArrayType==2" id="ImageGridContainer">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index" style="max-width: 100%; max-height: 100%;">
                    <ModelTestThumbnailCard :imageInfo="myImage" @OpenZoomImageModal="OpenZoomImageModal"></ModelTestThumbnailCard>
                </div>
            </div> -->

            <div v-if="selectednumArrayType==1" style="width:100%; height:100%; display: grid; justify-content: center; align-items: center; grid-template-columns: repeat(1, 1fr); grid-template-rows: repeat(1, minmax(0, 1fr)) gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index">
                    <ModelTestThumbnailCard :imageInfo="myImage" @OpenZoomImageModal="OpenZoomImageModal"></ModelTestThumbnailCard>
                </div>
            </div>
            <div v-else-if="selectednumArrayType==2" style="width:100%; height:65vh; display: grid; justify-content: center; align-items: center; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index">
                    <ModelTestThumbnailCard :imageInfo="myImage" @OpenZoomImageModal="OpenZoomImageModal"></ModelTestThumbnailCard>
                </div>
            </div>

            <div v-else-if="selectednumArrayType==3" style="width:100%; height:65vh; display: grid; justify-content: center; align-items: center; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index">
                    <ModelTestThumbnailCard :imageInfo="myImage" @OpenZoomImageModal="OpenZoomImageModal"></ModelTestThumbnailCard>
                </div>
            </div>

            <div v-else-if="selectednumArrayType==6" style="width:100%; height:65vh; max-height:65vh; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index">
                    <ModelTestThumbnailCard :imageInfo="myImage" @OpenZoomImageModal="OpenZoomImageModal"></ModelTestThumbnailCard>
                </div>
            </div>

            <div v-else-if="selectednumArrayType==8" style="width:100%; height:65vh; max-height:65vh; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index">
                    <ModelTestThumbnailCard :imageInfo="myImage" @OpenZoomImageModal="OpenZoomImageModal"></ModelTestThumbnailCard>
                </div>
            </div>



            <!-- <div v-if="selectednumArrayType==1" style="width:100%; height:65vh; display: grid; place-content: center; place-self: center; grid-template-rows: minmax(auto-fit,1fr); grid-template-rows: minmax(20%, 1fr);">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index" style="max-width: 100%; max-height: 100%;">
                    <ModelTestThumbnailCard :imageInfo="myImage"></ModelTestThumbnailCard>
                </div>
            </div>

            <div v-else-if="selectednumArrayType==2" style="width:100%; height:65vh; display: grid; place-content: center; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index" style="max-width: 100%; max-height: 100%;">
                    <ModelTestThumbnailCard :imageInfo="myImage"></ModelTestThumbnailCard>
                </div>
            </div>

            <div v-else-if="selectednumArrayType==3" style="width:100%; height:65vh; display: grid; justify-content: center; align-items: center; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index" style="max-width: 100%; max-height: 100%;">
                    <ModelTestThumbnailCard :imageInfo="myImage"></ModelTestThumbnailCard>
                </div>
            </div>

            <div v-else-if="selectednumArrayType==4" style="width:100%; height:65vh; display: grid; grid-template-columns: repeat(2, 1fr);; gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index" style="max-width: 100%; max-height: 100%;">
                    <ModelTestThumbnailCard :imageInfo="myImage"></ModelTestThumbnailCard>
                </div>
            </div>

            <div v-else-if="selectednumArrayType==6" style="width:100%; height:65vh; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div v-for="(myImage, index) in ImageList.slice(index_image.start, index_image.end)" :key="index" style="max-width: 100%; max-height: 100%;">
                    <ModelTestThumbnailCard :imageInfo="myImage"></ModelTestThumbnailCard>
                </div>
            </div> -->






            <!-- 1개씩 -->
            <!-- <div v-if="selectednumArrayType==1" style="width:100%; height:80%; display:grid; justify-content: center; align-items: center;">
                <div v-for="(myImage) in ImageList.slice(index_image.start,index_image.end)" :key="myImage">
                    <img style="object-fit: contain; width:100%; height:100%;" :src="myImage.imagepath" @click="ImageZoomModal" />
                </div>
            </div> -->

            <!-- 2개씩 -->
            <!-- <div v-else-if="selectednumArrayType==2" style="width:98%; height:80%; display:grid; justify-content: center; align-items: center; grid-template-columns: 1fr 1fr;">
                <div v-for="(myImage) in ImageList.slice(index_image.start,index_image.end)" :key="myImage">
                    <img style="width:100%; height:100%;" :src="myImage.imagepath" @click="ImageZoomModal" />
                </div>
            </div> -->

            <!-- 4개씩 -->
            <!-- <div v-else-if="selectednumArrayType==4" style="width:98%; height:80%; display:grid; justify-content: center; align-items: center; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;;">
                <div v-for="(myImage) in ImageList.slice(index_image.start,index_image.end)" :key="myImage">
                    <img style="width:100%; height:100%;" :src="myImage.imagepath" @click="ImageZoomModal" />
                </div>
            </div> -->

            <!-- 6개씩 -->
            <!-- <div v-else-if="selectednumArrayType==6" style="width:98%; display:flex; flex-direction: row; justify-content: space-around; margin-top:2em;">
                <div v-for="(myImage) in ImageList.slice(index_image.start,index_image.end)" :key="myImage">
                    <img :src="myImage.imagepath" @click="ImageZoomModal" />
                </div>
            </div> -->

            <div style="height: 30px; width:100%; display:flex; flex-direction: row; justify-content: center; align-items: center; margin: 1.5em auto 0.5em auto">
                <vue-awesome-paginate
                    :total-items="this.ImageList.length"
                    :items-per-page="selectednumArrayType"
                    :max-pages-shown="5"
                    v-model="index_image.currentPage"
                    @click="click_page"
                />
            </div>

            <!-- <ModelTestSelectModal v-if="letFocusImage" class="" @closeModal="closeModal" @setModel="setModel"></ModelTestSelectModal> -->
        </div>


    </div>

    <ModelTestSelectModal v-if="letSelectModel" class="create-myProject" @closeModal="closeModal" @setModel="setModel"></ModelTestSelectModal>

</template>

<script>
// import SelectTool from "@/components/annotator/tools/SelectTool.vue";
import ModelTestSelectModal from "@/components/ModelTestSelectModal.vue"
import ModelTestThumbnailCard from "@/components/ModelTestThumbnailCard.vue"
import $ from 'jquery';
export default{
    components:{
        // SelectTool,
        ModelTestSelectModal,
        ModelTestThumbnailCard,
    },
    data() {
        return{
            letSelectModel: false,
            letFocusImage: false,

            current_Image: null,
            // ImageList: [],
            // ModelList: [],

            // ImageList: [
            // {
            //     imagepath_origin: "",
            //     imagepath: "",
            //     inference:[
            //         {model_name: "", maskpath_origin:"", maskpath:""},
            //         {model_name: "", maskpath_origin:"", maskpath:""},
            //     ]
            // },
            // ]

            // Test
            ImageList: [
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            ],
            ModelList: [{}],
            state: "done",  // ready, running, done

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
        }
    },

    methods: {
        OpenZoomImageModal() {
            this.letFocusImage = true;
        },

        closeModal() {
            this.letSelectModel = false;
        },
        selectModel() {
            alert("누가 좀 그려주세용!")
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
        },

        click_loadImage() {
            const imageInput = document.getElementById('imageInput');
            imageInput.click();
        },
        handleFileInputChange(event) {
            this.ImageList = []
            const files = event.target.files;
            // console.log("hakshdfk")
            // console.log(files)
            for (var file of files){
                this.ImageList.push({
                    imagepath: file.name,
                    imagepath_origin: file.name,
                })
            }
            console.log(this.ImageList)
            let urlPath = URL.createObjectURL(files[0]);
            console.log("urlPath: "+urlPath)
            var windowPath = (window.URL).createObjectURL(files[0]);
            var webkitURLPath = (window.webkitURL).createObjectURL(files[0]);
            console.log("windowPath: "+ windowPath)
            console.log("webkitURLPath: "+ webkitURLPath)

            var webkitOptionPath = files[0].webkitRelativePath
            console.log("webkitOptionPath: "+ webkitOptionPath)


            // Test
            this.ImageList= [
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
                {imagepath_origin: "01_origin.jpg", imagepath: "01_origin.jpg"},
            ]

        },
        click_loadModel() {
            this.letSelectModel = true
        },
        setModel(models) {
            console.log(models)
            this.ModelList = models;

        },
        clear_setting() {
            this.ImageList = []
            this.ModelList = []
        },
        strat_test() {
            alert('준비중입니다.')
            this.state = "done"


        },

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
            console.log("모모모모모모")
            if (this.showDropdownContent && !this.$refs.dropdownRef.contains(event.target)) {
                this.showDropdownContent = false;
            }
        },

        click_page(page) {
            this.index_image.currentPage = page

            this.index_image.start = (page - 1) * this.selectednumArrayType
            this.index_image.end = (page) * this.selectednumArrayType

            console.log("this.index_image.start : " + this.index_image.start)
            console.log("this.index_image.end : " + this.index_image.end)
        },

    },
    watch: {
        "state"(after) {
            if(after == "done") {
                this.click_page(1)
            }
        }
    }
}


</script>

<style>
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

.dard-container{
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
    cursor: default !important;
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

</style>