<template>
  <div style="width:100%; height:100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; background-color: #EFF0F6;">
    <p style="align-self: flex-start; margin-left:2.0rem; margin-top:1.0rem; margin-bottom:0.5rem;">학습된 AI 모델을 비교 검증 해보세요! 헤븐 관리자 님  👋  </p>

    <div style="display:flex; flex-direction: row; align-items: center; width:100%; height:calc( 100% - 3.5rem ); background-color: #EFF0F6;">
      <div style="display:flex; flex-direction:column; justify-content: space-around; align-items: center; width:82%; height:100%; background-color: #EFF0F6;">
        <div class="border-card" id="filter-container" style="display:flex; flex-direction: row; width:98%; height:18%; background-color: white;">
          <div style="width:60%; height:100%; display:flex; flex-direction: column; justify-content: space-around;">
            <div class="filter-row">
              <div class="filter-title">조회 기간</div>
              <div class="filter-item" :class="{ active: selectedFilter1 === 0 }" @click="selectFilter1(0)">지난 7일간</div>
              <div class="filter-item" :class="{ active: selectedFilter1 === 1 }" @click="selectFilter1(1)">지난 30일간</div>
              <div class="filter-item" :class="{ active: selectedFilter1 === 2 }" @click="selectFilter1(2)">지난 6개월간</div>
              <div class="filter-item" :class="{ active: selectedFilter1 === 3 }" @click="selectFilter1(3)">지난 1년간</div>
              <Datepicker class="datePicker" id="Datepicker" :class="{ active: selectedFilter1 === 4 }"
                v-model="calendarPicker.DateRange"
                :range='true'
                :lang="'en'"
                :firstDayOfWeek="'monday'"
                :date-format="{
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric' }"
                :placeholder="'날짜 직접 선택'"
                circle/>
            </div>
            <div class="filter-row">
              <div class="filter-title">판정 결과</div>
              <div class="filter-item" :class="{ active: selectedFilter2 === 1 }" @click="selectFilter2(1)">OK</div>
              <div class="filter-item" :class="{ active: selectedFilter2 === 2 }" @click="selectFilter2(2)">NG</div>
            </div>
            <div class="filter-row">
              <div class="filter-title">데이터 정렬</div>
              <div class="filter-item" :class="{ active: selectedFilter3 === 0 }" @click="selectFilter3(0)">시간</div>
              <div class="filter-item" :class="{ active: selectedFilter3 === 1 }" @click="selectFilter3(1)">모델 불확실성</div>
              <div class="filter-item disable" :class="{ active: selectedFilter3 === 2 }" @click="selectFilter3(2)">데이터 신규성</div>
            </div>
            <div class="filter-row">
              <div class="filter-title">라벨링 유무</div>
              <div class="filter-item" :class="{ active: selectedFilter4 === 0 }" @click="selectFilter4(0)">YES</div>
              <div class="filter-item" :class="{ active: selectedFilter4 === 1 }" @click="selectFilter4(1)">NO</div>
            </div>
          </div>
          <div style="width:40%; height:100%; display:flex; flex-direction: column; justify-content: flex-start; margin-top: 4px; margin-right: 1em;">
            <div class="filter-row" style="justify-content: flex-end;">
              <div class="filter-item" style="border-radius: 0.25rem; background-color: #F8F8FA; cursor: default;">{{ this.filter.start_date }} ~ {{ this.filter.end_date }}</div>
              <div class="filter-item" style="border-radius: 0.25rem; background-color: #F8F8FA; cursor: default;">
                {{ num_items.total }}건 중 {{ num_items.label_yes }}건 완료
                <span v-if="num_items.total !== 0">( {{ num_items.ratio_label }} %)</span>
                <span v-else>( 0 %)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="border-card" id="annotator-container" style="width:98%; height:80%; background-color: white;">

          <aside v-show="panels.show.left" class="left-panel">
            <hr />

            <!-- <div v-if="categories.length > 5">
              <div style="padding: 0px 5px">
                <input
                  v-model="search"
                  class="search"
                  placeholder="Category Search"
                />
              </div>
            </div> -->

            <div
              class="sidebar-section"
              :style="{ 'max-height': mode == 'label' ? '100%' : '57%' }"
            >
              <p
                v-if="categories.length == 0"
                style="color: lightgray; font-size: 12px"
              >
                No categories have been enabled for this image.
              </p>

              <div
                v-show="mode == 'segment'"
                style="overflow: auto; max-height: 100%"
              >
                <CategoryPanel
                  v-for="(category, index) in categories"
                  :key="category.id + '-category'"
                  :test = "category.id + '-category'"
                  :simplify="simplify"
                  :categorysearch="search"
                  :category="category"
                  :all-categories="categories"
                  :opacity="shapeOpacity"
                  :hover="hover"
                  :index="index"
                  @clickcategory="onCategoryClick"
                  @keypoints-complete="onKeypointsComplete"
                  :current="current"
                  :active-tool="activeTool"
                  :scale="image.scale"
                  ref="category"
                  @createAnnotation_push="createAnnotation_push"
                  @onUpdateClick_keypoint_labels="onUpdateClick_keypoint_labels"
                  @onUpdateClick_keypoint_edges="onUpdateClick_keypoint_edges"
                  @onUpdateClick_keypoint_colors="onUpdateClick_keypoint_colors"
                  @onUpdateClick_supercategory="onUpdateClick_supercategory"
                  @annotation_push="annotation_push"
                  @CategoryPanel_unite="CategoryPanel_unite"
                  @CategoryPanel_emitModify="CategoryPanel_emitModify"
                />
              </div>

              <div v-show="mode == 'label'" style="overflow: auto; max-height: 100%">
                <!-- <CLabel
                  v-for="category in categories"
                  v-model="image.categoryIds"
                  :key="category.id + '-label'"
                  :category="category"
                  :search="search"
                /> -->
              </div>
            </div>

            <div v-show="mode == 'segment'">
              <hr />
              <h6 class="sidebar-title text-center">{{ activeTool }}</h6>

              <div class="tool-section" style="max-height: 30%; color: lightgray">

                <div v-if="$refs.select != null">
                  <SelectPanel :select="$refs.select" />
                </div>

                <div v-if="$refs.brush != null">
                  <BrushPanel :brush="$refs.brush" />
                </div>

                <div v-if="$refs.eraser != null">
                  <EraserPanel :eraser="$refs.eraser" />
                </div>

              </div>
            </div>
          </aside>

          <aside v-show="panels.show.right" class="right-panel">

            <!-- <BrushSizePanel :style="{ display: activeTool=='Brush' ? 'block' :'none' }"/> -->

            <!-- <BrushSizePanel v-if="activeTool=='Brush'" @update="update_brush_radius" style="display:flex; justify-content: center; width: 84px; top:0;"/> -->

            <BrushPanel :brush="$refs.brush" v-if="activeTool=='Brush'" @update="update_brush_radius" style="display:flex; justify-content: center; width: 84px; top:0;"/>
            <EraserPanel :eraser="$refs.eraser" v-else-if="activeTool=='Eraser'" @update="update_eraser_radius" style="display:flex; justify-content: center; width: 84px; top:0;"/>
            <div v-else style="height:200px;"></div>


            <div style="height:40px;"></div>

            <SelectTool
              :selected="activeTool"
              @update="activeTool = $event"
              :scale="image.scale"
              @setcursor="setCursor"
              ref="select"
            />

            <div style="height:40px;"></div>

            <BrushTool
              :selected="activeTool"
              @update="activeTool = $event"
              :scale="image.scale"
              @setcursor="setCursor"
              ref="brush"
            />

            <div style="height:40px;"></div>

            <EraserTool
              :selected="activeTool"
              @update="activeTool = $event"
              :scale="image.scale"
              @setcursor="setCursor"
              ref="eraser"
            />

            <div style="height:40px;"></div>

            <SaveButton />
            <div style="height:80px;"></div>


          </aside>

          <div class="middle-panel" :style="{ cursor: cursor }">
            <div id="frame" class="frame" @wheel="onwheel" >
              <canvas class="canvas" id="editor" ref="image" resize />
            </div>
          </div>




        </div>

      </div>

      <!-- <div class="border-card" id="thumbnail-container"
      v-for="(myImage) in this.datalist.slice(0,4)" :key="myImage"
      style="display:flex; flex-direction:column; align-items: center; justify-content: space-around; width:18%; height: 98%; background-color: white;"> -->
      <div class="border-card" id="thumbnail-container"
      style="display:flex; flex-direction:column; align-items: center; justify-content: flex-start; width:17.5%; height: 99%; background-color: white;">
        <!-- <div style="height: 30px; width:100%; display:flex; flex-direction: row; justify-content: center; align-items: center; margin: 1.5em auto 0.5em auto">
          <vue-awesome-paginate
              :total-items="this.index_image.num_items"
              :items-per-page="4"
              :max-pages-shown="1"
              v-model="this.index_image.currentPage"
              @click="click_page"
          />
      </div> -->
      <v-pagination
        v-model="this.index_image.currentPage"
        :pages="this.index_image.num_pages"
        :range-size="1"
        active-color="#DCEDFF"
        @update:modelValue="updatePaginationHandler"
        style="margin: 0.5em auto;"
      />


        <!-- <i
          v-show=true
          id="arrow-previous"
          class="fa-solid fa-chevron-up"
          style="font-size: 30px; transform: scaleX(6); color: #6CC2FF;"
          :style = "{ 'opacity' : index_image.start !==0 ? 100 : 0 }"
          @click="index_image.start !== 0 ? route_previous() : null"
        /> -->

        <div v-for="(myImage, index) in datalist.slice(index_image.start,index_image.end)" :key="myImage">
          <AnnotatorThumbnailCard @click="click_ThumbnailCard($event, myImage, index)" :image_ThumbnailCard="myImage"
          style="border-color: #BD7C4A ; margin: 0.0em auto 0.4em auto;"
          :style="{ 'border-style': selected_data.thumbnail === myImage ? 'solid' : 'none' }"
          ></AnnotatorThumbnailCard>
        </div>

        <!-- <i
          v-show=true
          id="arrow-next"
          class="fa-solid fa-chevron-down"
          style="font-size: 30px; transform: scaleX(6); color: #6CC2FF;"
          :style = "{ 'opacity' : index_image.end !== index_image.num_items ? 100 : 0 }"
          @click="index_image.end !== index_image.num_items ? route_next() : null"
        /> -->
      </div>

    </div>

  </div>







</template>


<script>
  import AnnotatorThumbnailCard from "@/components/AnnotatorThumbnailCard.vue"
  import paper from "paper";
  import axios from "axios";
  import $ from "jquery";
  // import { usePinch } from '@vueuse/touch'

  // import { mapMutations } from "vuex";

  // Paginnation
  import VPagination from "@hennge/vue3-pagination";
  import "@hennge/vue3-pagination/dist/vue3-pagination.css";

  // Calendar Picker
  import VueDatepickerUi from 'vue-datepicker-ui';
  import 'vue-datepicker-ui/lib/vuedatepickerui.css';


  // Annotator Tool
  import SelectTool from "@/components/annotator/tools/SelectTool";
  import BrushTool from "@/components/annotator/tools/BrushTool";
  import EraserTool from "@/components/annotator/tools/EraserTool";
  import CategoryPanel from "@/components/annotator/CategoryPanel";
  import SelectPanel from "@/components/annotator/panels/SelectPanel";
  import BrushPanel from "@/components/annotator/panels/BrushPanel";
  import EraserPanel from "@/components/annotator/panels/EraserPanel";
  import SaveButton from "@/components/annotator/tools/SaveButton";



  export default {
    name: "AnnotationView",
    components: {
      AnnotatorThumbnailCard,
      SelectTool,
      EraserTool,
      BrushTool,
      CategoryPanel,
      SelectPanel,
      BrushPanel,
      EraserPanel,
      SaveButton,
      VPagination,
      Datepicker: VueDatepickerUi,

    },
    // setup() {
    //   const { start, move, end } = usePinch()

    //   function onpinchstart(event) {
    //     start(event)
    //   }

    //   function onpinch(event) {
    //     move(event)
    //   }

    //   function onpinchend(event) {
    //     end(event)
    //   }

    //   return {
    //     onpinchstart,
    //     onpinch,
    //     onpinchend
    //   }
    // },
    data() {
      return {
        calendarPicker: {
          DateRange: [
            // new Date(),
            // new Date()
          ],

        },

        selected_data: {
          thumbnail: null,
        },

        tools: [],
        loading_created : true,

        API_List : null,
        selectedFilter1: -1,
        selectedFilter2: -1,
        selectedFilter3: -1,
        selectedFilter4: -1,

        num_items: {
          label_yes: 0,
          label_no: 0,
          total: 0,
          ratio_label : 0,
        },

        filter: {
          start_date: "",
          end_date: "",
          predict_result: "",
          is_label: false,
          order_by: "",
          page: 1,
          size: 100,
        },
        index_image: {
          limit: 100,
          num_items : 0,
          num_items_per_page : 4,
          num_pages : 0,

          currentPage: 1,
          index_inPage: 1,
          index_inTotalList: 1,

          start: 0,
          end: 0,
        },


        color_arrow: {
          active: "#6CC2FF",
          disabled: "black",
        },

        datalist: [],

        activeTool: "Select",
        paper: null,
        shapeOpacity: 0.6,
        zoom: 0.2,
        cursor: "move",
        mode: "segment",
        simplify: 1,
        panels: {
          show: {
            left: false,
            right: true,
          }
        },
        current: {
          category: -1,
          annotation: -1,
          keypoint: -1,
        },
        hover: {
          category: -1,
          annotation: -1,
          keypoint: -1,
        },
        image: {
          raster: {},
          scale: 0,
          // metadata: {},
          ratio: 0,
          rotate: 0,
          id: null,
          url: "",
          url_origin: "",
          filename: "",
          dataset: 0,
          previous: null,
          next: null,
          categoryIds: [],
          data: null,

          // 추가
          width: 0,
          height: 0,
        },
        text: {
          topLeft: null,
          topRight: null
        },
        categories: [],
        dataset: {
          annotate_url: ""
        },
        loading: {
          image: true,
          data: true,
          loader: null
        },
        search: "",
        annotating: [],
        pinching: {
          old_zoom: 1
        }
      };
    },
    methods: {
      update_brush_radius(newRadius) {
        this.$refs.brush.brush.pathOptions.radius = newRadius
      },
      update_eraser_radius(newRadius) {
        this.$refs.eraser.eraser.pathOptions.radius = newRadius
      },
      updatePaginationHandler(page) {
          this.currentPage = page
          this.routePage(page)
      },

      //////////////////////////////////// 임시 ////////////////////////////////////
      updateCurrentAnnotation(newAnnotation) {
        this.current.annotation = newAnnotation;
      },

      //////////////////////////////////// Filter ////////////////////////////////////
      selectFilter_created() {
        let end_date = new Date()
        let start_date = new Date()
        start_date.setDate(end_date.getDate() - 7)
        this.filter.end_date = this.DateToString(end_date)
        this.filter.start_date = this.DateToString(start_date)
        this.filter.predict_result = "ok"
        this.filter.order_by = "create_time"
        this.filter.is_label = false


        this.selectedFilter1 = 0
        this.selectedFilter2 = 1
        this.selectedFilter3 = 0
        this.selectedFilter4 = 1

        this.load_data()
      },
      selectFilter1(index) {
        console.log("selectFilter1!!!!")
        this.selectedFilter1 = index
        let end_date = new Date()
        let start_date = new Date()
        if(index == 0) {
          start_date.setDate(end_date.getDate() - 7)
        }
        else if(index == 1) {
          start_date.setDate(end_date.getDate() - 30)
        }
        else if(index == 2) {
          start_date.setMonth(end_date.getMonth() - 6)
        }
        else if(index == 3) {
          start_date.setFullYear(end_date.getFullYear() - 1)
        }
        else {
          console.log("날짜 직접선택")
          start_date = this.calendarPicker.DateRange[0]
          end_date = this.calendarPicker.DateRange[1]
        }
        this.filter.end_date = this.DateToString(end_date)
        this.filter.start_date = this.DateToString(start_date)
        // console.log(start_date)
        this.load_data()
      },
      selectFilter2(index) {
        // 0: null, 1: ok, 2: ng
        if(this.selectedFilter2 == index) {
          this.selectedFilter2 = 0
        }
        else {
          this.selectedFilter2 = index
        }


        if(this.selectedFilter2 == 1) {
          this.filter.predict_result = "ok"
        }
        else if(this.selectedFilter2 == 2) {
          this.filter.predict_result = "ng"
        }
        else {
          this.filter.predict_result = ""
        }

        this.load_data()
      },
      selectFilter3(index) {
        this.selectedFilter3 = index

        if(index == 0) {
          this.filter.order_by = "create_time"
        }
        else if(index == 1) {
          this.filter.order_by = "uncertainty"
        }
        else if(index == 2) {
          this.filter.order_by = "novelty"
        }
        else {
          console.log("## [Filter] : else3")
        }

        this.load_data()
      },
      selectFilter4(index) {
        this.selectedFilter4 = index

        if(index == 0) {
          this.filter.is_label = true
        }
        else {
          this.filter.is_label = false
        }

        this.load_data()
      },
      DateToString(dateDate) {
        let year = dateDate.getFullYear(); // 년도
        let month = dateDate.getMonth() + 1;  // 월
        let date = dateDate.getDate();  // 날짜

        return year + '-' + month + '-' + date
      },

      load_data(){

        $.ajax({
          url: "http://183.105.120.175:30004/data", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
          method: "GET",   // HTTP 요청 메소드(GET, POST 등)
          dataType: "json", // 서버에서 보내줄 데이터의 타입
          data: {
              project_id: this.$store.state.project.id,
              // project_id: 1,
              start_date: this.filter.start_date,
              end_date: this.filter.end_date,
              ...(this.filter.predict_result !== "" && { predict_result: this.filter.predict_result }),
              // predict_result: this.filter.predict_result,
              is_label: !this.filter.is_label,
              order_by: this.filter.order_by,
              page: 1,
              size: this.filter.size,
          },  // HTTP 요청과 함께 서버로 보낼 데이터
        })
        .then( (data) => {
          if(!this.filter.is_label == true) {
            this.num_items.label_yes = data.total
          }
          else {
            this.num_items.label_no = data.total
          }

          return $.ajax({
            url: "http://183.105.120.175:30004/data", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
            method: "GET",   // HTTP 요청 메소드(GET, POST 등)
            dataType: "json", // 서버에서 보내줄 데이터의 타입
            data: {
                project_id: this.$store.state.project.id,
                // project_id: 1,
                start_date: this.filter.start_date,
                end_date: this.filter.end_date,
                ...(this.filter.predict_result !== "" && { predict_result: this.filter.predict_result }),
                // predict_result: this.filter.predict_result,
                is_label: this.filter.is_label,
                order_by: this.filter.order_by,
                page: 1,
                size: this.filter.size,
            },  // HTTP 요청과 함께 서버로 보낼 데이터
          })
          .then( (data) => {
            if(this.filter.is_label == true) {
              this.num_items.label_yes = data.total
            }
            else {
              this.num_items.label_no = data.total
            }
            this.num_items.total = this.num_items.label_yes + this.num_items.label_no
            this.num_items.ratio_label = Math.floor(this.num_items.label_yes / this.num_items.total * 100)


            this.index_image.num_items = Math.min(data.size, data.total)
            this.index_image.num_pages = Math.floor(this.index_image.num_items / this.index_image.num_items_per_page)

            this.index_image.start = 0
            this.index_image.end = Math.min(this.index_image.num_items_per_page, data.total)

            this.datalist = data.items.slice(0, this.index_image.num_items)

            // 배포용 data url (배포 시, 주석 해제)
            // let project_id = this.$store.state.project.id
            for (const [index, items] of this.datalist.entries()) {
              this.datalist[index].id = items.id
              this.datalist[index].image_file_path_origin =  items.image_file_path

              // 배포
              this.datalist[index].image_file_path =  items.image_file_path.split('/').slice(3).join('/')
              this.datalist[index].image_filename =  items.image_file_path.split('/').slice(2).join('/')

              // console.log("FileName 확인하자!!! : " + items.image_file_path.split('/').slice(3).join('/'))
              // /iQ.Platform/projects/1/data/2023-05-22/16-03-53/49_origin.jpg -> slice(4) /1/data/2023-05-22/16-03-53/49_origin.jpg 이렇게 요청됨

              //test
              // this.datalist[index].image_file_path =  items.image_file_path
              // this.datalist[index].image_filename =  items.image_file_path.split('/').slice(5).join('/')
            }

            if(this.index_image.num_items > 1) {
              this.click_ThumbnailCard_by_Index(1)
            }
          })
        })



      },

      //////////////////////////////////////////////////////////////////////////////////

      //////////////////////////////////// Thumbnail ////////////////////////////////////
      click_ThumbnailCard(event, data, index) {
        // paper & canvas 초기화
        this.index_image.index_inPage = index + 1
        this.index_image.index_inTotalList = (this.index_image.currentPage - 1) * this.index_image.num_items_per_page + this.index_image.index_inPage
        console.log("[click_ThumbnailCard] page: " + this.index_image.currentPage)
        console.log("[click_ThumbnailCard] index_inPage: " + this.index_image.index_inPage)
        console.log("[click_ThumbnailCard] index_inTotalList: " + this.index_image.index_inTotalList)


        this.current.category = 0
        this.current.annotation = -1
        // this.categories[0].annotations = []

        // console.log("[TEST] : "+ data.image_file_path)
        // var newPath =  data.image_file_path.split('/').slice(2).join('/')
        // this.image.url = newPath

        this.image.id = data.id
        this.image.url_origin = data.image_file_path_origin
        this.image.url = data.image_file_path
        this.image.filename = data.image_filename
        console.log("[click_ThumbnailCard] set image url : " + this.image.url)
        this.load_annotator() // 완료되면 얘가 current.annotation = 0 로 바꿔줌



        let canvas = document.getElementById("editor");
        let width = canvas.offsetWidth
        let height = canvas.offsetHeight
        // 이전에 생성된 editor 요소 제거
        if (canvas) {
          canvas.parentNode.removeChild(canvas);
        }

        // 새로운 editor 요소 생성
        // <canvas class="canvas" id="editor" ref="image" resize />
        let newEditor = document.createElement("canvas");
        newEditor.classList.add("canvas");
        newEditor.setAttribute("id", "editor");
        newEditor.setAttribute("ref", "image");
        // newEditor.setAttribute("resize", "");
        newEditor.width = width;
        newEditor.height = height;


        // editor를 추가할 부모 요소를 찾아 새로운 editor 요소를 추가
        let parentElement = document.querySelector("#frame");
        parentElement.appendChild(newEditor);

        // 새로 생성된 editor 요소에 대한 작업을 수행
        // 예: 초기 상태로 설정, 이벤트 리스너 등록 등

        // 이제 canvas 변수는 새로운 editor 요소를 참조하게 됩니다.
        canvas = newEditor;


        this.initCanvas();
        // this.getData();


        ///////////////////////////////////
        this.selected_data.thumbnail = data

      },

      click_ThumbnailCard_by_Index(index) {
        this.index_image.currentPage = Math.floor(index / 4) + 1
        this.index_image.index_inPage = index % 4
        this.index_image.index_inTotalList = index

        console.log("[click_ThumbnailCard_by_Index] page: " + this.index_image.currentPage)
        console.log("[click_ThumbnailCard_by_Index] index_inPage: " + this.index_image.index_inPage)
        console.log("[click_ThumbnailCard_by_Index] index_inTotalList: " + this.index_image.index_inTotalList)

        // if(index > this.datalist.length) {alert('Error(301)')}


        this.current.category = 0
        this.current.annotation = -1
        // this.categories[0].annotations = []

        // console.log("[TEST] : "+ data.image_file_path)
        // var newPath =  data.image_file_path.split('/').slice(2).join('/')
        // this.image.url = newPath

        this.image.id = this.datalist[index-1].id
        this.image.url_origin = this.datalist[index-1].image_file_path_origin
        this.image.url = this.datalist[index-1].image_file_path
        this.image.filename = this.datalist[index-1].image_filename
        console.log("[click_ThumbnailCard] set image url : " + this.image.url)
        this.load_annotator() // 완료되면 얘가 current.annotation = 0 로 바꿔줌



        let canvas = document.getElementById("editor");
        let width = canvas.offsetWidth
        let height = canvas.offsetHeight
        // 이전에 생성된 editor 요소 제거
        if (canvas) {
          canvas.parentNode.removeChild(canvas);
        }

        // 새로운 editor 요소 생성
        // <canvas class="canvas" id="editor" ref="image" resize />
        let newEditor = document.createElement("canvas");
        newEditor.classList.add("canvas");
        newEditor.setAttribute("id", "editor");
        newEditor.setAttribute("ref", "image");
        // newEditor.setAttribute("resize", "");
        newEditor.width = width;
        newEditor.height = height;


        // editor를 추가할 부모 요소를 찾아 새로운 editor 요소를 추가
        let parentElement = document.querySelector("#frame");
        parentElement.appendChild(newEditor);

        // 새로 생성된 editor 요소에 대한 작업을 수행
        // 예: 초기 상태로 설정, 이벤트 리스너 등록 등

        // 이제 canvas 변수는 새로운 editor 요소를 참조하게 됩니다.
        canvas = newEditor;


        this.initCanvas();
        // this.getData();


        ///////////////////////////////////
        this.selected_data.thumbnail = this.datalist[index-1]

      },

      //////////////////////////////////////////////////////////////////////////////////

      // Categorypanel 의 prop(category) 변경 error 개선 위한 emit 함수
      createAnnotation_push(data) {
        console.log("[AnnotatorView][createAnnotation_push]")
        console.log("###################################### this.categories - before ######################################")
        console.log(this.categories)
        // this.category.annotations.push(data);
        this.categories[0].annotations.push(data);
        this.categories[0].annotations[0].width = this.image.width;
        this.categories[0].annotations[0].height = this.image.height;
        console.log("###################################### this.categories - after ######################################")
        console.log(this.categories)
      },
      onUpdateClick_keypoint_labels(data) {
        this.category.keypoint_labels = [...data];
      },
      onUpdateClick_keypoint_edges(data) {
        this.category.keypoint_labels = [...data];
      },
      onUpdateClick_keypoint_colors(data) {
        this.category.keypoint_labels = [...data];
      },
      onUpdateClick_supercategory(data) {
        this.category.keypoint_labels = [...data];
      },
      annotation_push(data) {
        this.categories[0].annotations.push(data);  // 이건 socket통신으로 서버에 알려주는건가...?
      },

      // CategoryPanel 에서 + 버튼(신규 라벨) 누르면 부르는 함수
      onCategoryClick(indices) {
        this.current.annotation = indices.annotation;
        this.current.category = indices.category;
        // if (!indices.hasOwnProperty('keypoint')) {
        //   indices.keypoint = -1;
        // }

        if (!Object.prototype.hasOwnProperty.call(indices, "keypoint")) {
          indices.keypoint = -1;
        }
        if (indices.keypoint !== -1) {
          this.current.keypoint = indices.keypoint;
          // let ann = this.currentCategory.category.annotations[this.current.annotation];
          let kpTool = this.$refs.keypoint;
          let selectTool = this.$refs.select;
          let category = this.$refs.category[this.current.category];
          let annotation = category.$refs.annotation[this.current.annotation];
          annotation.showKeypoints = true;
          let keypoints = annotation.keypoints;
          if (keypoints._labelled[indices.keypoint + 1]) {
            let indexLabel = String(this.current.keypoint + 1);
            let keypoint = keypoints._labelled[indexLabel];
            keypoint.selected = true;
            this.activeTool = selectTool;
            this.activeTool.click();
          } else {
            this.currentAnnotation.keypoint.next.label = String(indices.keypoint + 1);
            this.activeTool = kpTool;
            this.activeTool.click();
          }
        }
      },
      scrollElement(element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      },



      // Current Annotation Operations
      uniteCurrentAnnotation(compound, simplify = true, undoable = true, isBBox = false) {
        console.log("[AnnotatorView][uniteCurrentAnnotation] - compound ")
        console.log(compound)
        console.log("[AnnotatorView][uniteCurrentAnnotation] - this.currentAnnotation (before)")
        if(this.currentAnnotation == null) {
          console.log(null)
        }
        else {
          console.log(this.currentAnnotation.annotation)
        }
        if (this.currentAnnotation == null) return;
        this.currentAnnotation.unite(compound, simplify, undoable, isBBox);
        console.log("[AnnotatorView][uniteCurrentAnnotation] - this.currentAnnotation (after)")
        console.log(this.currentAnnotation.compoundPath)
      },
      subtractCurrentAnnotation(compound, simplify = true, undoable = true) {
        console.log("[AnnotatorView][subtractCurrentAnnotation] - compound ")
        console.log(compound)
        if (this.currentCategory == null) return;
        this.currentAnnotation.subtract(compound, simplify, undoable);
        console.log("[AnnotatorView][subtractCurrentAnnotation] - this.currentAnnotation ")
        console.log(this.currentAnnotation.annotation)
      },

      // AnnotationPanel -> CategoryPanel -> AnnotatorView 로 2중 emit으로 category.annotate 바꾸는 함수
      CategoryPanel_unite(data){
        this.categories[0].annotations[0].isbbox = data;
      },
      CategoryPanel_emitModify(data) {
        this.categories[0].annotations[0].paper_object = data;
      },


      // pinch 이벤트 삭제 (why? PC 웹 버전에서 사용 안할듯)
      // onpinchstart(e) {
      //   e.preventDefault();
      //   if (!this.doneLoading) return;
      //   let view = this.paper.view;
      //   this.pinching.old_zoom = this.paper.view.zoom;
      //   return false;
      // },
      // onpinch(e) {
      //   e.preventDefault();
      //   if (!this.doneLoading) return;
      //   let view = this.paper.view;
      //   let viewPosition = view.viewToProject(
      //     new paper.Point(e.center.x, e.center.y)
      //   );
      //   let curr_zoom = e.scale * this.pinching.old_zoom;
      //   let beta = this.paper.view.zoom / curr_zoom;
      //   let pc = viewPosition.subtract(this.paper.view.center);
      //   let a = viewPosition.subtract(pc.multiply(beta)).subtract(this.paper.view.center);
      //   let transform = {zoom: curr_zoom, offset: a}
      //   if (transform.zoom < 10 && transform.zoom > 0.01) {
      //     this.image.scale = 1 / transform.zoom;
      //     this.paper.view.zoom = transform.zoom;
      //     this.paper.view.center = view.center.add(transform.offset);
      //   }
      //   return false;
      // },
      onwheel(e) {
        e.preventDefault();
        // if (!this.doneLoading) return;

        let view = this.paper.view;

        if (e.ctrlKey) {
          // Pan up and down
          let delta = new paper.Point(0, 0.5 * e.deltaY);
          this.paper.view.setCenter(view.center.add(delta));
        } else if (e.shiftKey) {
          // Pan left and right
          let delta = new paper.Point(0.5 * e.deltaY, 0);
          this.paper.view.setCenter(view.center.add(delta));
        } else {
          console.log("onWheel - else(ctrlkey)")
          let viewPosition = view.viewToProject(
            new paper.Point(e.offsetX, e.offsetY)
          );

          let transform = this.changeZoom(e.deltaY, viewPosition);
          if (transform.zoom < 10 && transform.zoom > 0.01) {
            this.image.scale = 1 / transform.zoom;
            this.paper.view.zoom = transform.zoom;
            this.paper.view.center = view.center.add(transform.offset);
          }
        }

        return false;
      },
      changeZoom(delta, p) {
        let oldZoom = this.paper.view.zoom;
        let c = this.paper.view.center;
        let factor = 1 + this.zoom;

        let zoom = delta < 0 ? oldZoom * factor : oldZoom / factor;
        let beta = oldZoom / zoom;
        let pc = p.subtract(c);
        let a = p.subtract(pc.multiply(beta)).subtract(c);

        return { zoom: zoom, offset: a };
      },
      fit() {
        let canvas = document.getElementById("editor");
        console.log("[AnnotatorView][fit] - canvas :")
        console.log(canvas)

        let parentX = this.image.raster.width;
        let parentY = this.image.raster.height;

        this.paper.view.zoom = Math.min(
          (canvas.width / parentX) * 0.95,
          (canvas.height / parentY) * 0.8
        );
        console.log("this.paper.view.zoom: "+  this.paper.view.zoom)

        this.image.scale = 1 / this.paper.view.zoom;
        this.paper.view.setCenter(0, 0);
      },

      setCursor(newCursor) {
        console.log("[newCursor]")
        console.log(newCursor)
        this.cursor = newCursor;
      },
      initCanvas() {
        console.log("[AnnotatorView][initCanvas]")

        // let process = "Initializing canvas";
        // this.addProcess(process);
        this.loading.image = true;
        let canvas = document.getElementById("editor");
        console.log("###################################### HERE ################################# Canvas")
        console.log(canvas)
        this.paper.setup(canvas);
        this.paper.view.viewSize = [
          // 100, 100
          // this.paper.view.size.width,
          // window.innerWidth * 0.82 * 0.98,
          // 1296,
          // (window.innerHeight - 65 ) * 0.8,
          canvas.offsetWidth, canvas.offsetHeight
        ];
        console.log("#################################### this.paper.view.viewSize ####################################")
        console.log(this.paper.view.viewSize)

        this.paper.activate();

        this.image.raster = new paper.Raster(this.image.url);
        console.log("[AnnotatorView][initCanvas] - Canvas")
        console.log(canvas)
        // setTimeout(() => {
        //   this.image.raster.onLoad = () => {
        //   let width = this.image.raster.width;
        //   let height = this.image.raster.height;
        //   console.log(width)
        //   console.log(height)
        //   this.image.raster.sendToBack();
        //   this.fit();
        //   this.image.ratio = (width * height) / 1000000;
        //   // this.removeProcess(process);

        //   let tempCtx = document.createElement("canvas").getContext("2d");
        //   tempCtx.canvas.width = width;
        //   tempCtx.canvas.height = height;
        //   tempCtx.drawImage(this.image.raster.image, 0, 0);

        //   this.image.data = tempCtx.getImageData(0, 0, width, height);
        //   let fontSize = width * 0.025;

        //   let positionTopLeft = new paper.Point(
        //     -width / 2,
        //     -height / 2 - fontSize * 0.5
        //   );
        //   this.text.topLeft = new paper.PointText(positionTopLeft);
        //   this.text.topLeft.fontSize = fontSize;
        //   this.text.topLeft.fillColor = "white";
        //   this.text.topLeft.content = this.image.filename;

        //   let positionTopRight = new paper.Point(
        //     width / 2,
        //     -height / 2 - fontSize * 0.4
        //   );
        //   this.text.topRight = new paper.PointText(positionTopRight);
        //   this.text.topRight.justification = "right";
        //   this.text.topRight.fontSize = fontSize;
        //   this.text.topRight.fillColor = "white";
        //   this.text.topRight.content = width + "x" + height;

        //   this.loading.image = false;
        // };

        // }, 100)


        this.image.raster.onLoad = () => {
          console.log('[AnnotatorView][initCanvas] - onloaded')
          let width = this.image.raster.width;
          let height = this.image.raster.height;
          console.log('[AnnotatorView][initCanvas] - image_url : ' + this.image.url)
          console.log('[AnnotatorView][initCanvas] - (width x height) : ' + width + "x"+ height)
          console.log('[AnnotatorView][initCanvas] - this.image')
          console.log(this.image)

          console.log("[AnnotatorView][initCanvas][sendToBack]")
          this.image.raster.sendToBack();
          this.fit();
          this.image.ratio = (width * height) / 1000000;
          // this.removeProcess(process);

          let tempCtx = document.createElement("canvas").getContext("2d");
          tempCtx.canvas.width = width;
          tempCtx.canvas.height = height;
          tempCtx.drawImage(this.image.raster.image, 0, 0);

          this.image.data = tempCtx.getImageData(0, 0, width, height);
          let fontSize = width * 0.025;

          let positionTopLeft = new paper.Point(
            -width / 2,
            -height / 2 - fontSize * 0.5
          );
          this.text.topLeft = new paper.PointText(positionTopLeft);
          this.text.topLeft.fontSize = fontSize;
          this.text.topLeft.fillColor = "white";
          this.text.topLeft.content = this.image.filename;
          console.log("image.filename: "+this.image.filename)

          let positionTopRight = new paper.Point(
            width / 2,
            -height / 2 - fontSize * 0.4
          );
          this.text.topRight = new paper.PointText(positionTopRight);
          this.text.topRight.justification = "right";
          this.text.topRight.fontSize = fontSize;
          this.text.topRight.fillColor = "white";
          this.text.topRight.content = width + "x" + height;

          this.loading.image = false;
        };


        // this.image.raster.source = this.image.url;
        // this.image.ratio = (this.image.width * this.image.height) / 1000000;

        // this.$nextTick(() => {
        //   console.log("[AnnotationView][initCanvas] - showAll")
        //   this.showAll();
        // });

      },
      setPreferences(preferences) {
        let refs = this.$refs;

        refs.bbox.setPreferences(preferences.bbox || preferences.polygon || {});
        refs.polygon.setPreferences(preferences.polygon || {});
        refs.select.setPreferences(preferences.select || {});
        refs.magicwand.setPreferences(preferences.magicwand || {});
        refs.brush.setPreferences(preferences.brush || {});
        refs.eraser.setPreferences(preferences.eraser || {});
      },
      // getData(response) {
      //   let data = response.data;

      //   this.loading.data = false;
      //   // Set image data
      //   this.image.metadata = data.image.metadata || {};
      //   this.image.filename = data.image.file_name;
      //   this.image.next = data.image.next;
      //   this.image.previous = data.image.previous;
      //   this.image.categoryIds = data.image.category_ids || [];

      //   this.annotating = data.image.annotating || [];

      //   // Set other data
      //   this.dataset = data.dataset;
      //   this.categories = data.categories;

      //   // Update status

      //   this.setDataset(this.dataset);

      //   let preferences = data.preferences;
      //   this.setPreferences(preferences);

      //   if (this.text.topLeft != null) {
      //     this.text.topLeft.content = this.image.filename;
      //   }

      //   this.$nextTick(() => {
      //     this.showAll();
      //   });
      // },
      getData1() {
        this.loading.data = true;
        this.loading.data = false;

        //////////////////////////////////////////////////////////////////
        // 일단 고정으로 박아넣고, 나중에 덜어내자.
        // Set image data
        // this.image.metadata = {};
        this.image.categoryIds = [6]
        this.annotating = [];

        this.categories = [
          {
            annotations: [],
            color: "#029fbb",
            creator: "khbang",
            deleted: false,
            id: 1,
            keypoint_colors: [],
            keypoint_edges: [],
            keypoint_labels: [],
            // metadata: {},
            name: "NG",
            show: true,
            supercategory: "",
            visualize: false,
          },
        ]

        //////////////////////////////////////////////////////////////////
        // Load로 받아올 데이터

        // axios
        // .get("/api/annotator/data/" + this.image.id)
        // .then(response => {
        //   let data = response.data;

        //   this.loading.data = false;
        //   // Set image data

        //   this.image.path = data.image.path;
        //   this.image.filename = data.image.file_name;
        //   this.image.width = data.image.width;
        //   this.image.height = data.image.height;
        //   // this.image.next = data.image.next;
        //   // this.image.previous = data.image.previous;

        //   for (var i=0; i<data.image.num_annotations; i++){
        //     this.categories[0].annotations[i].push(data.annotations[i])
        //   }

        //   if (this.text.topLeft != null) {
        //     this.text.topLeft.content = this.image.filename;
        //   }
        // })


        if (this.text.topLeft != null) {
          this.text.topLeft.content = this.image.filename;
        }

        this.$nextTick(() => {
          console.log('[AnnotatorView][getData1] - showAll')
          this.showAll();
        });
      },

      initData() {
        this.image.categoryIds = [6]
        this.annotating = [];

        this.categories = [
          {
            annotations: [],
            color: "#029fbb",
            creator: "khbang",
            deleted: false,
            id: 1,
            keypoint_colors: [],
            keypoint_edges: [],
            keypoint_labels: [],
            // metadata: {},
            name: "NG",
            show: true,
            supercategory: "",
            visualize: false,
          },
        ]
        console.log('[created][AnnotatorView][initData] - this.categories')
        console.log(this.categories)
      },



      showAll() {
        console.log("[AnnotationView][showAll]")
        if (this.$refs.category == null) return;

        this.$refs.category.forEach(category => {
          // category.isVisible = category.category.annotations.length > 0;
          category.isVisible = true
          console.log("[AnnotationView][showAll] - category.isVisible")
          console.log(category.isVisible)
        });
      },
      hideAll() {
        if (this.$refs.category == null) return;

        this.$refs.category.forEach(category => {
          category.isVisible = false;
          category.showAnnotations = false;
        });
      },
      // removeFromAnnotatingList() {
      //   if (this.user == null) return;

      //   var index = this.annotating.indexOf(this.user.username);
      //   //Remove self from list
      //   if (index > -1) {
      //     this.annotating.splice(index, 1);
      //   }
      // },
      onKeypointsComplete() {
        this.currentAnnotation.keypoint.next.label = -1;
        this.activeTool = this.$refs.select;
        this.activeTool.click();
      },
      getCategory(index) {
        if (index == null) return null;
        if (index < 0) return null;

        let ref = this.$refs.category;
        console.log('[AnnotatorView][getCategory] - index : ' + index)
        console.log('[AnnotatorView][getCategory] - ref : ')
        console.log(ref)

        if (ref == null) return null;
        if (ref.length < 1 || index >= ref.length) return null;

        console.log('[AnnotatorView][getCategory] - this.$refs.category[index]')
        console.log(this.$refs.category[index])

        return this.$refs.category[index];
      },

      // 임시
      initAnnotation() {
        this.$refs.category[0].initAnnotation(0)
      },

      //////////////////////////////////// Save ////////////////////////////////////
      save1(callback) {
        let refs = this.$refs;

        let data = {
          label_user_name: this.$store.state.account.Name,
          image: {
            id: this.image.id,
            path: this.image.url_origin,
            width: this.image.raster.width,
            height: this.image.raster.height,
          },
          annotations: []
        };

        if (refs.category != null && this.mode === "segment") {
          refs.category.forEach(category => {
            let categoryData = category.export();
            console.log("[AnnotatorView][save1] - categoryData")
            console.log(categoryData)

            data.annotations.push(categoryData.annotations[0])
            console.log("[AnnotatorView][save1] - data.annotations")
            console.log(data.annotations)
            delete data.annotations[0].id
            delete data.annotations[0].color
            delete data.annotations[0].fillcolor
            delete data.annotations[0].isbbox
            // delete data.annotations[0].metadata
            delete data.annotations[0].sessions
          });
        }
        console.log("[AnnotatorView][save1] - data (after)")
        console.log(data)

        axios
          .post(this.API_List.annotator_save, JSON.stringify(data))
          .then(() => {
            //TODO: updateUser
            alert('saved!')
            this.click_ThumbnailCard_by_Index(this.index_image.index_inTotalList + 1)

            if (callback != null) callback();
          })
          // .finally(() => this.removeProcess(process));
      },

      load_annotator() {
        // this.categories = []
        console.log("[load_annotator]")
        $.ajax({
          url: this.API_List.annotator_load,
          method: "GET",
          dataType: "json",
          data: {
            // 배포
            image_path: "/iQ.Platform/projects/" + this.image.url,

            // test
            // image_path: this.image.url,
          },
        })
        .then((data) => {
          console.log('[load_annotator] - data.annotations')
          console.log(data.annotations)

          console.log('[load_annotator] - data.annotations[0]')
          console.log(data.annotations[0])
          console.log('[load_annotator] - categories (before)')
          console.log(this.categories)

          console.log('[load_annotator] - set annotations')

          // this.categories[0].annotations = data.annotations

          // this.categories[0].annotations.splice(0, 1, data.annotations[0]);

          // delete this.categories[0].annotations
          // this.categories[0].annotations = data.annotations
          // if (data.annotations.length == 0) {
          //   this.$refs.category[0].createAnnotation()
          // }

          if (data.annotations.length > 0) {
            this.categories[0].annotations.splice(0, 1, data.annotations[0]);
            this.categories[0].annotations[0].id = 1
            this.categories[0].annotations[0].width = this.image.width
            this.categories[0].annotations[0].height = this.image.height
          }
          else {
            console.log('[load_annotator] ########################## No Annotations ##########################')
            let annotation1 = {
              area: 0,
              bbox: [0, 0, 0, 0],
              category_id : 6,
              color : "#d78200",
              creator : "ghbang",
              deleted : false,
              events: [],
              id: 1, // 수정 필
              image_id: 0,  // 수정 필
              isbbox: false,
              iscrowd: false,
              keypoints: [],
              // metadata: {},
              milliseconds: 0,
              paper_object: [],
              segmentation: [],
              height: this.image.width,
              width: this.image.height
            }

            this.categories[0].annotations.splice(0, 1, annotation1);
            // this.$refs.category[0].createAnnotation()
          }


          // this.categories.push({
          //   'color' : '#dc5f74',
          //   'created' : 'khbang',
          //   'deleted' : false,
          //   'id' : 1,
          //   'keypoint_colors' : [],
          //   'keypoint_edges' : [],
          //   'keypoint_labels' : [],
          //   'name' : 'NG',
          //   'show': true,
          //   'visualize': false,
          //   'width' : this.image.width,
          //   'height' : this.image.height,
          //   'annotations': data.annotations})
          console.log('[load_annotator] - categories (after)')
          console.log(this.categories[0])

        })
        .catch((error) => {
          alert(error)
          // 괜히 신규 annotating 하려했다가 통신 에러이면 라벨링파일 꼬이니까!
          // this.categories[0].annotations = []

          // 그냥 하지말고 alert 띄우자.
          // alert("[Error] 라벨링 페이지 통신 에러 (image.url): " + this.image.url)
        })
        .then(() => {
          this.$nextTick(() => {
            console.log("[AnnotatorView][load_annotator] : Done loading, So Lets set this.current.annotation = 0")
            console.log("Check if the getAnnotation set well - 1. this.categories[0].annotations")
            console.log(this.categories[0].annotations)
            console.log("Check if the getAnnotation set well - 2. this.$refs.category[0]")
            console.log(this.$refs.category[0])
            console.log("Check if the getAnnotation set well - 2-1. this.$refs.category[0].$refs")
            console.log(this.$refs.category[0].$refs)
            // console.log("Check if the getAnnotation set well - 3. this.$refs.category[0].$refs.annoation[0]")
            // console.log(this.$refs.category[0].$refs.annoation[0])
            console.log("[AnnotationView][load_annotator] - this.current.annotation (현재)")
            console.log(this.current.annotation)
            console.log("[AnnotationView][load_annotator] : set this.current.annotation = 0")
            // this.updateCurrentAnnotation(0)
            this.current.annotation = 0
            console.log("[AnnotationView][load_annotator] : showAll")
            this.showAll();
          });
        })


      },








      //////////////////////////////////// Thumbnail ////////////////////////////////////
      // route(identifier) {
      //   // Make sure we pop the latest session before annotations
      //   this.current.annotation = -1;
      //   console.log(identifier)

      //   this.$nextTick(() => {
      //     this.$parent.save(() => {
      //       this.$router.push({ name: "annotate", params: { identifier } });
      //     });
      //   });
      // },

      route_next() {
        console.log("[AnnotatorView][route][next]")
        this.index_image.start = Math.max(this.index_image.start + 4, 0);
        this.index_image.end = Math.min(this.index_image.end + 4, this.index_image.limit);

        console.log("[AnnotatorView][route][next] - this.index_image.start : " + this.index_image.start)
        console.log("[AnnotatorView][route][next] - this.index_image.end : " + this.index_image.end)

      },
      route_previous() {
        console.log("[AnnotatorView][route][previous]")
        this.index_image.start = Math.max(this.index_image.start - 4, 0);
        this.index_image.end = Math.min(this.index_image.end - 4, this.index_image.limit);

        console.log("[AnnotatorView][route][previous] - this.index_image.start : " + this.index_image.start)
        console.log("[AnnotatorView][route][previous] - this.index_image.end : " + this.index_image.end)

      },
      routePage(page) {
        console.log("routePage: " + page)
        this.index_image.start = (page - 1) * this.index_image.num_items_per_page
        this.index_image.end = page * this.index_image.num_items_per_page;
      },


      //////////////////////////////////// Test - API ////////////////////////////////////
      set_APIlist() {
        axios.get('/api_list.json')
        .then(response => {
          this.API_List = response.data;
          console.log(this.API_List)
        })
        .catch(error => {
          console.log(error);
        });
      },
      set_APIlist_async() {
        console.log('[AnnotatorView][set_APIlist_async] - Start')
        return new Promise((resolve, reject) => {
          axios.get('/api_list.json')
          .then(data => {
            console.log("[set_APIList_async]")
            this.API_List = data.data
            this.loading_API = false;
            resolve()
          })
          .catch(error => {
            reject(error);
          })
        })
      },


    },
    watch: {
      'calendarPicker.DateRange'() {
        console.log(typeof(this.calendarPicker.DateRange[1]))
        if(typeof(this.calendarPicker.DateRange[0]) != 'undefined' && typeof(this.calendarPicker.DateRange[1]) != 'undefined'){
          this.selectFilter1(4)
        }
      },
      'index_image.num_items'() {
        console.log("this.index_image.num_items : " + this.index_image.num_items)
        console.log("this.index_image.start : " + this.index_image.start)
        console.log("this.index_image.end : " + this.index_image.end)
      },
      "activeTool"(after, before){
        console.log("[watch][activeTool] - before")
        console.log(before)
        console.log("[watch][activeTool] - after")
        console.log(after)
      },
      "categories"(after, before) {
        console.log("[watch][categories] - before")
        console.log(before)
        console.log("[watch][categories] - after")
        console.log(after)
      },

      // "annotation"
      // doneLoading(done) {
      //   if (done) {
      //     if (this.loading.loader) {
      //       this.loading.loader.hide();
      //     }
      //   }
      // },
      currentCategory() {
        console.log("[watch][AnnotatorView][currentCategory]")
        if (this.currentCategory != null) {
          if (this.currentAnnotation == null || !this.currentCategory.showAnnotations) {
            let element = this.currentCategory.$el;
            this.scrollElement(element);
          }
        }
        console.log("watch > currnetCategory > this.current :")
        console.log(this.current)
      },
      currentAnnotation(newElement) {
        console.log("[watch][AnnotatorView][currentAnnotation]")
        if (newElement != null) {
          if (newElement.showAnnotations) {
            let element = newElement.$el;
            this.scrollElement(element);
          }
        }
        console.log("watch > currentAnnotation > this.current :" + this.current)
        console.log(this.current)
      },
      "current.category"(cc) {
        console.log("[watch][AnnotatorView][current.category]")
        console.log("watch > current.category > this.current :" + this.current)
        console.log(this.current)
        if (cc < -1) this.current.category = -1;
        let max = this.categories.length;
        if (cc > max) {
          this.current.category = -1;
        }
      },
      "current.annotation"(ca) {
        console.log("[watch][AnnotatorView][current.annotation]")
        console.log("watch > current.annotation > this.current :" + this.current)
        console.log(this.current)
        if (ca < -1) this.current.annotation = -1;
        if (this.currentCategory != null) {
          let max = this.currentAnnotationLength;
          if (ca > max) {
            this.current.annotations = -1;
          }
        }
      },
      "current.keypoint"(sk) {
        console.log("[watch][AnnotatorView][current.keypoint]")
        if (sk < -1) this.current.keypoint = -1;
        if (this.currentCategory != null) {
          let max = this.currentAnnotationLength;
          if (sk > max) {
            this.current.keypoint = -1;
          }
        }
      },
      // annotating() {
      //   console.log("[watch][AnnotatorView][annotating]")
      //   this.removeFromAnnotatingList();
      // },
      // user() {
      //   console.log("[watch][AnnotatorView][user]")
      //   this.removeFromAnnotatingList();
      // },




    },
    computed: {
      // doneLoading() {
      //   return !this.loading.image && !this.loading.data;
      // },
      currentAnnotationLength() {
        if (this.currentCategory == null) return null;
        return this.currentCategory.category.annotations.length;
      },
      // currentKeypointLength() {
      //   if (this.currentAnnotation == null) return null;
      //   return this.currentAnnotation.annotation.keypoints.length;
      // },
      currentCategory() {
        console.log("[computed][AnnotatorView][currentCategory] - this.current.category")
        console.log(this.current.category)
        console.log("[computed][AnnotatorView][currentCategory] - this.getCategory(this.current.category)")
        console.log(this.getCategory(this.current.category))
        return this.getCategory(this.current.category);
      },
      currentAnnotation() {
        console.log("[computed][AnnotatorView][currentAnnotation] - this.current.annotation")
        console.log(this.current.annotation)
        if (this.currentCategory == null) {
          return null;
        }
        console.log("[computed][AnnotatorView][currentAnnotation] - this.currentCategory.getAnnotation(this.current.annotation)")
        console.log(this.currentCategory.getAnnotation(this.current.annotation))
        return this.currentCategory.getAnnotation(this.current.annotation);
      },
      // currentKeypoint() {
      //   if (this.currentCategory == null) {
      //     return null;
      //   }
      //   if (this.currentAnnotation == null
      //   || this.currentAnnotation.keypointLabels.length === 0
      //   || !this.currentAnnotation.showKeypoints)
      //   {
      //     return null;
      //   }
      //   if (this.current.keypoint == -1) {
      //     return null;
      //   }
      //   return {
      //     label: [String(this.current.keypoint + 1)],
      //     visibility: this.currentAnnotation.getKeypointVisibility(this.current.keypoint)
      //   };
      // },
      // user() {
      //   return this.$store.getters["user/user"];
      // }
    },
    created() {
      console.log('[created][AnnotationView]')
      this.initData()
      this.loading_created = true
      // console.log("[created][AnnotationView] this.categories ######################################")
      // console.log(this.categories)
      // console.log("!!!!!!!!!!!!!!! PAPER - before Declaration !!!!!!!!!!!!!!!")
      // console.log(this.paper)
      console.log("[created][AnnotationView] - paper (before)")
      console.log(this.paper)
      this.paper = new paper.PaperScope();
      console.log("[created][AnnotationView] - paper (after)")
      console.log(this.paper)

      // Test API config 파일 불러오기.
      this.set_APIlist_async()
      .then(() => {
        console.log("[created][AnnotationView] - then1")
        console.log(this.API_List)
        this.selectFilter_created()
      })
      .then(() => {
        console.log("[created][AnnotationView] - then2")
        // this.load_annotator();
      })
      .then(() => {
        console.log("[created][AnnotationView] - then3")
        console.log("[created][AnnotationView] - this.loading_created : false")
        this.loading_created = false
      })
      .catch(error => {
        console.log(error)
      })


      // this.image.url = "/iQ.Platform/data/2023-05-04/17:36:48/01_image.jpg"
      // console.log("[created][AnnotationView] - set this.image.url")
      // this.image.url = "../images/TestSampleImage.png";
    },

    mounted() {
      console.log('[mounted][AnnotatorView]')
      // console.log("[mounted][AnnotationView] this.categories ######################################")
      // console.log(this.categoires)
      // this.getData1();
      // this.initCanvas();

      // this.initAnnotation(this.current.category)
      console.log('[mounted][AnnotatorView] - Mounted Done, Lets set current.category = 0')
      this.current.category = 0
      console.log('[mounted][AnnotatorView] - Mounted Done, Lets set current.annotation = 0')
      this.current.annotation = 0

      console.log("Check if the getAnnotation set well - 2-1. this.$refs.category[0].$refs")
      console.log(this.$refs.category[0].$refs)



      console.log("RightNoW!!!!!!!!!!!!!!!!!!")
      console.log("activeTool: " + this.activeTool)
    },

  };
</script>


<style scoped>
.datePicker {
  --v-calendar-datepicker-icon-size: 0rem;
  --v-calendar-input-font-size: 0.875rem;
  --v-calendar-input-bg-color: #F0F0F5;
  --v-calendar-input-text-color: black;
  --v-calendar-input-border: 1px solid transparent;
  --v-calendar-input-font-weight: bold;

  font-family: 'NotoSansKR-Light';

  width: 250px;
  cursor: pointer;
}
.datePicker.active {
  --v-calendar-input-bg-color: #1B7CFE;
  --v-calendar-input-text-color: white;
}
#datePicker .input
/* vuedatepickerui.css 라이브러리 원본파일의  여기의
.v-calendar .input-field input {
  padding-left: 40px -> 0.5rem
  padding-right: 20px -> 0.5rem

  border-radius: 6px -> 1.0rem
  height: 50px -> 32px
  cursor: pointer; 추가
  text-align:center; 추가
}


.v-calendar .input-field.long {
  min-width:290px -> 175px;
  cursor: pointer; 추가
}

.v-calendar .input-field input::placeholder {
  color:black;
}  추가

로 수정했다 */


.border-card {
  border: #E7E7EE solid 1px;
  border-radius: 1em;
}

.filter-row {
  display:flex;
  flex-direction: row;
}
.filter-title{
  color: black;
  width: 7rem;

  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;

  margin: 0 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 1.0rem;
  line-height: 1.5;

  font-family:'NotoSansKR-Light';
  font-weight: bold;
}
.filter-item {
  color: black;
  background-color: #F0F0F5;
  border-color: #F0F0F5;
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
.filter-item.active {
  background-color: #1B7CFE;
  color: white;
}
.filter-item.disable {
  pointer-events: none;
}

.alert {
    bottom: 0;
    width: 50%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: white;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #9feeb0;
  }

  .right-panel {
    background-color: white;
    width: 84px;
    /* padding-top: 40px; */
    float: right;
    height: 100%;
    /* height: inherit; */
    /* box-shadow: 5px 10px; */

    display: flex;
    flex-direction: column;
    justify-content: center;

    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
  }

  .left-panel {
    /* padding-top: 40px; */
    background-color: #4b5162;
    width: 250px;
    height: 100%;
    /* height: inherit; */
    float: left;
  }

  /* .middle-panel {
    display: block;
    width: calc(100% - 250px - 40px);
    height: 100%;
    background-color: #7c818c;
    overflow: hidden;
    position: relative;
  } */
  .middle-panel {
    display: block;
    /* width: calc(100% - 250px - 40px); */
    height: 100%;

    /* margin-left: 1em; */

    background-color: #7c818c;
    overflow: hidden;
    position: relative;

    border-top-left-radius: 1em;
    border-bottom-left-radius: 1em;
  }

  .frame {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  #image {
    position: absolute;
  }

  .sidebar-section {
    width: 100%;
    padding-left: 5px;
    padding-right: 5px;
    overflow: auto;
  }

  .sidebar-title {
    color: white;
  }

  /* Tool section */
  .tool-section {
    margin: 5px;
    border-radius: 5px;
    background-color: #383c4a;
    padding: 0 5px 5px 5px;
    overflow: auto;
  }

  /* Categories/Annotations section */
  .meta-input {
    padding: 3px;
    background-color: inherit;
    width: 100%;
    height: 100%;
    border: none;
  }

  .meta-item {
    background-color: inherit;
    height: 30px;
    border: none;
  }

  .status-icon {
    font-size: 150px;
    color: white;
    position: absolute;
    left: calc(50% - 75px);
    top: calc(50% - 75px);
  }

  .search {
    width: 100%;
    height: 18px;
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    text-align: center;
    border-radius: 4px;
  }
  </style>
