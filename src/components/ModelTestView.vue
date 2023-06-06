<template>
    <div style="width:100%; height:100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; background-color: #EFF0F6;">
        <!-- Inference 결과 보여주는 데 -->
        <div class="dard-container" style="width:98%; height:65%; display:flex; flex-direction: row; justify-content: flex-start; margin-top:2em;">
            <div style="width:50%; height:100%; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top:1.0em; padding-bottom:0.5em;">
                <div v-if="current_Image==null" class="empty-frame" @click="click_loadImage">
                    <p style="font-size: 4em; color: #898989; width:55%;">테스트 영상을 선택하세요</p>
                    <i style="font-size: 9em; color: #898989" class="fa-solid fa-plus fa-sharp"></i>
                    <input type="file" id="imageInput" multiple style="display: none;" @change="handleFileInputChange">
                </div>
                <div v-else id="frame" class="frame" @wheel="onwheel" >
                    <canvas class="canvas" id="editor" ref="image" resize />
                </div>
                <div style="display:flex; flex-direction: row; justify-content: center; align-items: center; padding-top:0.5em; color: #2777E4; cursor: default;" v-if="model_ref == null" @click="selectModel"> 모델을 선택하세요 </div>
            </div>
            
            <div style="width:50%; height:100%; display:flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top:1.0em; padding-bottom:0.5em;">
                <div v-if="current_Image==null" class="empty-frame" @click="click_loadImage">
                    <p style="font-size: 4em; color: #898989; width:55%;">테스트 영상을 선택하세요</p>
                    <i style="font-size: 9em; color: #898989" class="fa-solid fa-plus fa-sharp"></i>
                </div>
                <div v-else id="frame" class="frame" @wheel="onwheel" >
                    <canvas class="canvas" id="editor" ref="image" resize />
                </div>
                <div style="display:flex; flex-direction: row; justify-content: center; align-items: center; padding-top:0.5em; color: #2777E4; cursor: default;" v-if="model_test == null" @click="selectModel"> 모델을 선택하세요 </div>
            </div>

            <!-- <SelectTool
                v-show="false"
                :selected="activeTool"
                @update="activeTool = $event"
                :scale="image.scale"
                ref="select"
            /> -->
            
        </div>

        <!-- Test Image Thumbnail List 보여주는 데 -->
        <div class="dard-container" style="width:98%; height:25%; display:flex; flex-direction: row; justify-content: space-around; align-items: center; margin-top: 1em;">
            <i
                v-show=true
                id="arrow-previous"
                class="fa-solid fa-chevron-left"
                style="font-size: 60px; transform: scaleY(2.5); color: #6CC2FF;"
            />
            <!-- <i
                v-show=true
                id="arrow-previous"
                class="fa fa-arrow-left image-arrows"
                style="font-size: 30px; transform: scaleY(4); color: #6CC2FF;"
                :style = "{ 'opacity' : index_image.start !==0 ? 100 : 0 }"
                @click="index_image.start !== 0 ? route_previous() : null"
            /> -->

            <!-- <div v-for="(myImage) in datalist.slice(index_image.start,index_image.end)" :key="myImage">
                <AnnotatorThumbnailCard @click="click_ThumbnailCard($event, myImage)" :image_ThumbnailCard="myImage"
                style="border-color: #BD7C4A ;"
                :style="{ 'border-style': selected_Thumbnail === myImage ? 'solid' : 'none' }"
                ></AnnotatorThumbnailCard>
            </div> -->

            <i
                v-show=true
                id="arrow-next"
                class="fa-solid fa-chevron-right"
                style="font-size: 60px; transform: scaleY(2.5); color: #6CC2FF;"
            />

            <!-- <i
                v-show=true
                id="arrow-next"
                class="fa fa-arrow-right image-arrows"
                style="font-size: 30px; transform: scaleY(4); color: #6CC2FF;"
                :style = "{ 'opacity' : index_image.end !== index_image.num_items ? 100 : 0 }"
                @click="index_image.end !== index_image.num_items ? route_next() : null"
            /> -->
        </div>
    </div>

</template>

<script>
// import SelectTool from "@/components/annotator/tools/SelectTool.vue";
import $ from 'jquery';
export default{
    components:{
        // SelectTool,
    },
    data() {
        return{
            model_ref: null,
            model_test: null,

            current_Image: null,
            ImageList: [],
        }
    },

    methods: {
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
            for (var file of files){
                this.ImageList.push(file.name)
            }
            console.log(this.ImageList)
        }
    }
}


</script>

<style>
.dard-container{
    border-radius: 1em;
    background-color: white;
}

.frame{
    width: 95%;
    height: calc(100% - 24px);
    background-color: #7c818c;
}
.empty-frame {
    width: 95%;
    height: calc(100% - 24px);
    background-color: #202020;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}
</style>