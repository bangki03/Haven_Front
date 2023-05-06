<template>

  <div style="display:flex; flex-direction: row; align-items: center; width:100%; height:calc( 100% - 65px ); background-color: #EFF0F6;">
    <div style="display:flex; flex-direction:column; justify-content: space-around; align-items: center; width:82%; height:100%; background-color: #EFF0F6;">
      <div class="border-card" id="filter-container" style="display:flex; flex-direction: row; width:98%; height:18%; background-color: white;">
        <div style="width:50%; height:100%; display:flex; flex-direction: column; justify-content: space-around;">
          <div class="filter-row">
            <div class="filter-title">조회 기간</div>
            <div class="filter-item" :class="{ active: selectedFilter1 === 0 }" @click="selectFilter1(0)">지난 7일간</div>
            <div class="filter-item" :class="{ active: selectedFilter1 === 1 }" @click="selectFilter1(1)">지난 30일간</div>
            <div class="filter-item" :class="{ active: selectedFilter1 === 2 }" @click="selectFilter1(2)">지난 6개월간</div>
            <div class="filter-item" :class="{ active: selectedFilter1 === 3 }" @click="selectFilter1(3)">지난 1년간</div>
            <div class="filter-item" :class="{ active: selectedFilter1 === 4 }" @click="selectFilter1(4)">날짜 직접 선택</div>
          </div>
          <div class="filter-row">
            <div class="filter-title">판정 결과</div>
            <div class="filter-item" :class="{ active: selectedFilter2 === 0 }" @click="selectFilter2(0)">OK</div>
            <div class="filter-item" :class="{ active: selectedFilter2 === 1 }" @click="selectFilter2(1)">NG</div>
          </div>
          <div class="filter-row">
            <div class="filter-title">데이터 정렬</div>
            <div class="filter-item" :class="{ active: selectedFilter3 === 0 }" @click="selectFilter3(0)">시간</div>
            <div class="filter-item" :class="{ active: selectedFilter3 === 1 }" @click="selectFilter3(1)">모델 불확실성</div>
            <div class="filter-item" :class="{ active: selectedFilter3 === 2 }" @click="selectFilter3(2)">데이터 신규성</div>
          </div>
          <div class="filter-row">
            <div class="filter-title">라벨링 유무</div>
            <div class="filter-item" :class="{ active: selectedFilter4 === 0 }" @click="selectFilter4(0)">YES</div>
            <div class="filter-item" :class="{ active: selectedFilter4 === 1 }" @click="selectFilter4(1)">NO</div>
          </div>
        </div>
        <div style="width:50%; height:100%; display:flex; flex-direction: column; justify-content: flex-start; margin-top: 4px; margin-right: 1em;">
          <div class="filter-row" style="justify-content: flex-end;">
            <div class="filter-item" style="border-radius: 0.25rem; background-color: #F8F8FA;">2022-10-23 ~ 2022-10-29</div>
            <div class="filter-item" style="border-radius: 0.25rem; background-color: #F8F8FA;">000 건 중 000건 완료 ( 00 %)</div>
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
          <div v-show="mode == 'segment'">

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

          </div>

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
    style="display:flex; flex-direction:column; align-items: center; justify-content: space-around; width:18%; height: 98%; background-color: white;">
    <!-- <i
        v-show="previousimage != null"
        class="fa fa-arrow-left image-arrows"
        style="float:left"
        @click="route(previousimage)"
      /> -->
      <i
        v-show=true
        class="fa fa-arrow-up image-arrows"
        style="font-size: 30px; transform: scaleX(4); color: gray;"
        @click="route(previousimage)"
      />

      <div v-for="(myImage) in datalist" :key="myImage">
        <AnnotatorThumbnailCard @click="click_ThumbnailCard(myImage)" :image_ThumbnailCard="myImage"></AnnotatorThumbnailCard>
      </div>

      <!-- <i
        v-show="nextimage != null"
        class="fa fa-arrow-right image-arrows"
        style="float:right"
        @click="route(nextimage)"
      /> -->
      <i
        v-show=true
        class="fa fa-arrow-down image-arrows"
        style="font-size: 30px; transform: scaleX(4); color: gray;"
        @click="route(nextimage)"
      />
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

        API_List : null,
        selectedFilter1: -1,
        selectedFilter2: -1,
        selectedFilter3: -1,
        selectedFilter4: -1,

        filter: {
          start_date: "",
          end_date: "",
          predict_result: "",
          is_label: false,
          order_by: "",
          page: 1,
          size: 50,
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
          metadata: {},
          ratio: 0,
          rotate: 0,
          id: null,
          url: "",
          dataset: 0,
          previous: null,
          next: null,
          filename: "",
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
      //////////////////////////////////// Filter ////////////////////////////////////
      selectFilter_created() {
        this.selectedFilter1 = 0
        this.selectedFilter2 = 0
        this.selectedFilter3 = 0
        this.selectedFilter4 = 0

        let end_date = new Date()
        let start_date = new Date()
        start_date.setDate(end_date.getDate() - 7)
        this.filter.end_date = this.DateToString(end_date)
        this.filter.start_date = this.DateToString(start_date)
        this.filter.predict_result = "ok"
        this.filter.order_by = "create_time"
        this.filter.is_label = true

        this.load_data()
      },
      selectFilter1(index) {
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
          console.log("## [Filter] : else1")
        }

        this.filter.end_date = this.DateToString(end_date)
        this.filter.start_date = this.DateToString(start_date)
        // console.log(start_date)
        this.load_data()
      },
      selectFilter2(index) {
        this.selectedFilter2 = index

        if(index == 0) {
          this.filter.predict_result = "ok"
        }
        else {
          this.filter.predict_result = "ng"
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
              // project_id: this.$store.state.project.id,
              project_id: 1,
              start_date: this.filter.start_date,
              end_date: this.filter.end_date,
              predict_result: this.filter.predict_result,
              is_label: this.filter.is_label,
              order_by: this.filter.order_by,
              page: 1,
              size: 4,
          },  // HTTP 요청과 함께 서버로 보낼 데이터
        })
        .then( (data) => {
          this.datalist = data.items
          console.log(this.datalist)
          
          // 임시 Test 용
          
          this.datalist[0].image_file_path = "/iQ.Platform/data/2023-05-04/16:34:06/01_image.jpg"
          this.datalist[1].image_file_path = "/iQ.Platform/data/2023-05-04/16:34:06/02_image.jpg"
          this.datalist[2].image_file_path = "/iQ.Platform/data/2023-05-04/16:34:06/03_image.jpg"
          this.datalist[3].image_file_path = "/iQ.Platform/data/2023-05-04/16:34:06/04_image.jpg"


          // this.$store.commit("setLogin", this.prop_account);
          // this.$store.commit("setUserID", data)
          // this.$store.commit("saveSessionStorageLogin")
          // console.log("Login")
          // this.$router.push('/mypage')
        })

      },

      //////////////////////////////////////////////////////////////////////////////////

      //////////////////////////////////// Thumbnail ////////////////////////////////////
      click_ThumbnailCard(data) {
        console.log("del this.paper")
        this.paper = null
        // this.image에다가 클릭한 data 넣자.
        this.ThumbnailToThis(data)
        this.load_annotator()

        this.initCanvas();
        this.getData();
      },

      ThumbnailToThis(data) {
        this.image.raster = {}
        this.image.scale = 0
        this.image.metadata = {}
        this.image.ratio = 0
        this.image.rotate = 0
        this.image.id = null

        this.image.url = data.image_file_path
        this.image.filename = data.image_file_path
        
        // raster: {},
        // scale: 0,
        // metadata: {},
        // ratio: 0,
        // rotate: 0,
        // id: null,
        // url: "",
        // dataset: 0,
        // previous: null,
        // next: null,
        // filename: "",
        // categoryIds: [],
        // data: null,

        // // 추가
        // width: 0,
        // height: 0,

      },

      //////////////////////////////////////////////////////////////////////////////////

      // Categorypanel 의 prop(category) 변경 error 개선 위한 emit 함수
      createAnnotation_push(data) {
        // this.category.annotations.push(data);
        this.categories[0].annotations.push(data);
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
        console.log("BrushTool-onMouseUp-$parent.uniteCurrentAnnotation(compound) : "+this.compound)
        if (this.currentAnnotation == null) return;
        this.currentAnnotation.unite(compound, simplify, undoable, isBBox);
        console.log(this.currentAnnotation)
      },
      subtractCurrentAnnotation(compound, simplify = true, undoable = true) {
        if (this.currentCategory == null) return;
        this.currentAnnotation.subtract(compound, simplify, undoable);
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
        console.log("AnnotatorView > fit() > canvas :" + canvas )

        let parentX = this.image.raster.width;
        let parentY = this.image.raster.height;

        this.paper.view.zoom = Math.min(
          (canvas.width / parentX) * 0.95,
          (canvas.height / parentY) * 0.8
        );

        this.image.scale = 1 / this.paper.view.zoom;
        this.paper.view.setCenter(0, 0);
      },

      setCursor(newCursor) {
        this.cursor = newCursor;
      },
      initCanvas() {
        console.log("initCanvas")
        console.log("newPaper")
        this.paper = new paper.PaperScope();

        // let process = "Initializing canvas";
        // this.addProcess(process);
        this.loading.image = true;

        let canvas = document.getElementById("editor");
        this.paper.setup(canvas);
        this.paper.view.viewSize = [
          this.paper.view.size.width,
          window.innerHeight
        ];
        this.paper.activate();

        this.image.raster = new paper.Raster(this.image.url);
        this.image.raster.onLoad = () => {
          let width = this.image.raster.width;
          let height = this.image.raster.height;

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
      getData() {
        // let process = "Loading annotation data";
        // this.addProcess(process);
        this.loading.data = true;

        // let data = response.data;

        this.loading.data = false;
        // Set image data
        this.image.metadata = {};
        this.image.next = null;
        this.image.previous = null;
        this.image.categoryIds = [6]

        this.annotating = [];

        // Set other data
        // this.dataset = data.dataset;
        this.categories = [
          {
            // annotations: [],
            annotations: [
              {
                "id": 304,
                "image_id": 274,
                "category_id": 6,
                "dataset_id": 13,
                "segmentation": [
                  [
                    892,
                    791.5,
                    893.5,
                    787.9,
                    897,
                    786.5,
                    898.8,
                    786.8,
                    902.3,
                    785.4,
                    910.8,
                    785.5,
                    913.8,
                    787.4,
                    915.8,
                    791.5,
                    915.8,
                    795.7,
                    914.7,
                    798.8,
                    913.6,
                    800,
                    912.6,
                    802,
                    908.7,
                    804.8,
                    905.5,
                    806,
                    899.1,
                    805.9,
                    896.2,
                    804,
                    894,
                    801.9,
                    892,
                    797.8,
                    892,
                    792
                  ]
                ],
                "area": 404,
                "bbox": [
                  892,
                  785,
                  24,
                  21
                ],
                "iscrowd": false,
                "isbbox": false,
                "creator": "jrlee",
                "width": 2448,
                "height": 2048,
                "color": "#034add",
                "keypoints": [],
                "metadata": {},
                "paper_object": [
                  "CompoundPath",
                  {
                    "applyMatrix": true,
                    "opacity": 0.6,
                    "data": {
                      "annotationId": 0,
                      "categoryId": 0
                    },
                    "children": [
                      [
                        "Path",
                        {
                          "applyMatrix": true,
                          "segments": [
                            [
                              -332,
                              -232.5
                            ],
                            [
                              -330.5,
                              -236.1
                            ],
                            [
                              -327,
                              -237.5
                            ],
                            [
                              -325.2,
                              -237.2
                            ],
                            [
                              -321.7,
                              -238.6
                            ],
                            [
                              -313.2,
                              -238.5
                            ],
                            [
                              -310.2,
                              -236.6
                            ],
                            [
                              -308.2,
                              -232.5
                            ],
                            [
                              -308.2,
                              -228.3
                            ],
                            [
                              -309.3,
                              -225.2
                            ],
                            [
                              -310.4,
                              -224
                            ],
                            [
                              -311.4,
                              -222
                            ],
                            [
                              -315.3,
                              -219.2
                            ],
                            [
                              -318.5,
                              -218
                            ],
                            [
                              -324.9,
                              -218.1
                            ],
                            [
                              -327.8,
                              -220
                            ],
                            [
                              -330,
                              -222.1
                            ],
                            [
                              -332,
                              -226.2
                            ],
                            [
                              -332,
                              -232
                            ]
                          ],
                          "closed": true
                        }
                      ]
                    ],
                    "fillColor": [
                      0,
                      0.6,
                      0.7
                    ]
                  }
                ],
                "deleted": false,
                "milliseconds": 32926,
                "events": []
              }
            ],
            color: "#029fbb",
            creator: "khbang",
            deleted: false,
            id: 1,
            keypoint_colors: [],
            keypoint_edges: [],
            keypoint_labels: [],
            metadata: {},
            name: "NG",
            show: true,
            supercategory: "",
            visualize: false,
          },
        ]

        // Update status

        // this.setDataset(this.dataset);

        // let preferences = data.preferences;
        // this.setPreferences(preferences);

        if (this.text.topLeft != null) {
          this.text.topLeft.content = this.image.filename;
        }

        this.$nextTick(() => {
          this.showAll();
        });
      },
      getData1() {
        this.loading.data = true;
        this.loading.data = false;

        //////////////////////////////////////////////////////////////////
        // 일단 고정으로 박아넣고, 나중에 덜어내자.
        // Set image data
        this.image.metadata = {};
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
            metadata: {},
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
          this.showAll();
        });
      },
      showAll() {
        if (this.$refs.category == null) return;

        this.$refs.category.forEach(category => {
          category.isVisible = category.category.annotations.length > 0;
        });
      },
      hideAll() {
        if (this.$refs.category == null) return;

        this.$refs.category.forEach(category => {
          category.isVisible = false;
          category.showAnnotations = false;
        });
      },
      removeFromAnnotatingList() {
        if (this.user == null) return;

        var index = this.annotating.indexOf(this.user.username);
        //Remove self from list
        if (index > -1) {
          this.annotating.splice(index, 1);
        }
      },
      onKeypointsComplete() {
        this.currentAnnotation.keypoint.next.label = -1;
        this.activeTool = this.$refs.select;
        this.activeTool.click();
      },
      getCategory(index) {
        if (index == null) return null;
        if (index < 0) return null;

        let ref = this.$refs.category;

        if (ref == null) return null;
        if (ref.length < 1 || index >= ref.length) return null;

        return this.$refs.category[index];
      },


      //////////////////////////////////// Save ////////////////////////////////////
      save(callback) {
        console.log("Clicked SAVE!!!!!!!!!!!!!!!!!!!")
        // let process = "Saving";
        // this.addProcess(process);
        let refs = this.$refs;

        let data = {
          mode: this.mode,
          user: {
            // bbox: this.$refs.bbox.export(),
            // polygon: this.$refs.polygon.export(),
            eraser: this.$refs.eraser.export(),
            brush: this.$refs.brush.export(),
            // magicwand: this.$refs.magicwand.export(),
            select: this.$refs.select.export(),
            // settings: this.$refs.settings.export()
          },
          dataset: this.dataset,
          image: {
            id: this.image.id,
            // metadata: this.$refs.settings.exportMetadata(),
            settings: {
              selectedLayers: this.current
            },
            category_ids: []
          },
          settings: {
            activeTool: this.activeTool,
            zoom: this.zoom,
            tools: {}
          },
          categories: []
        };

        if (refs.category != null && this.mode === "segment") {
          this.image.categoryIds = [];
          refs.category.forEach(category => {
            let categoryData = category.export();
            data.categories.push(categoryData);

            if (categoryData.annotations.length > 0) {
              let categoryIds = this.image.categoryIds;
              if (categoryIds.indexOf(categoryData.id) === -1) {
                categoryIds.push(categoryData.id);
              }
            }
          });
        }

        data.image.category_ids = this.image.categoryIds;

        console.log(data)

        axios
          // .post("/api/annotator/data", JSON.stringify(data))
          .post(this.API_List.annotator_save, JSON.stringify(data))
          .then(() => {
            //TODO: updateUser
            if (callback != null) callback();
          })
          // .finally(() => this.removeProcess(process));
      },
      save1(callback) {
        let refs = this.$refs;

        let data = {
          image: {
            path: this.image.path,
            filename: this.image.filename,
            width: this.image.width,
            height: this.image.height,
          },
          annotations: {}
        };

        if (refs.category != null && this.mode === "segment") {
          refs.category.forEach(category => {
            let categoryData = category.export();

            data.annotations = categoryData.annotations[0]
            delete data.annotations.id
            delete data.annotations.isbbox
            delete data.annotations.metadata
            delete data.annotations.sessions
          });
        }
        console.log("#### Clicked Save Button ####")
        console.log(data)

        axios
          .post(this.API_List.annotator_save, JSON.stringify(data))
          .then(() => {
            //TODO: updateUser
            if (callback != null) callback();
          })
          .finally(() => this.removeProcess(process));
      },

      load_annotator(callback) {
        // let data = {
        //   path: this.image.path
        // }

        axios
          .get(this.API_List.annotator_load + this.image.filename)
          .then(() => {
            //TODO: updateUser
            if (callback != null) callback();
          })

      },
      





      //////////////////////////////////// Thumbnail ////////////////////////////////////
      route(identifier) {
        // Make sure we pop the latest session before annotations
        this.current.annotation = -1;
        console.log(identifier)

        // this.$nextTick(() => {
        //   this.$parent.save(() => {
        //     this.$router.push({ name: "annotate", params: { identifier } });
        //   });
        // });
      },

      // route1(identifier) {
      //   this.initCanvas();
      //   this.getData1();
      // }


      //////////////////////////////////// Test - API ////////////////////////////////////
      set_APIlist() {
        axios.get('/api_list.json')
        .then(response => {
          this.API_List = response.data;
        })
        .catch(error => {
          console.log(error);
        });
      },


    },
    watch: {
      // doneLoading(done) {
      //   if (done) {
      //     if (this.loading.loader) {
      //       this.loading.loader.hide();
      //     }
      //   }
      // },
      currentCategory() {
        if (this.currentCategory != null) {
          if (
            this.currentAnnotation == null ||
            !this.currentCategory.showAnnotations
          ) {
            let element = this.currentCategory.$el;
            this.scrollElement(element);
          }
        }
        console.log("watch > currnetCategory > this.current :")
        console.log(this.current)
      },
      currentAnnotation(newElement) {
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
        console.log("watch > current.category > this.current :" + this.current)
        console.log(this.current)
        if (cc < -1) this.current.category = -1;
        let max = this.categories.length;
        if (cc > max) {
          this.current.category = -1;
        }
      },
      "current.annotation"(ca) {
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
        if (sk < -1) this.current.keypoint = -1;
        if (this.currentCategory != null) {
          let max = this.currentAnnotationLength;
          if (sk > max) {
            this.current.keypoint = -1;
          }
        }
      },
      annotating() {
        this.removeFromAnnotatingList();
      },
      user() {
        this.removeFromAnnotatingList();
      },




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
        return this.getCategory(this.current.category);
      },
      currentAnnotation() {
        if (this.currentCategory == null) {
          return null;
        }
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

    mounted() {
      this.initCanvas();
      this.getData();
      // this.getData1(this.image.filepath);

    },
    created() {
      // initCanvas로 옮겨서 click 될떄마다 init 해주자.
      this.paper = new paper.PaperScope();

      // Test API config 파일 불러오기.
      this.set_APIlist()
      this.selectFilter_created()
    }
  };
</script>


  <style scoped>
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
