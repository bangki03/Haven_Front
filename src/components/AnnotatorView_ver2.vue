<template>

  <div style="display:flex; flex-direction: column; justify-content: space-evenly; align-items: center;">

    <div id="filter-container" style="width:98%; height:160px; background-color: white; margin-top:1em; border-radius: 1em;">

    </div>

    <div id="annotator-container" style="width:98%; height:500px; margin-top:1em; border-radius: 1em;">
      <aside v-show="panels.show.left" class="left-panel shadow-lg">
        <div v-show="mode == 'segment'">
          <hr />

          <!-- <SelectTool
            v-model="activeTool"
            :scale="image.scale"
            @setcursor="setCursor"
            ref="select"
          /> -->
          <SelectTool
            :selected="activeTool"
            @update="activeTool = $event"
            :scale="image.scale"
            @setcursor="setCursor"
            ref="select"
          />
          <hr />

          <BrushTool
            :selected="activeTool"
            @update="activeTool = $event"
            :scale="image.scale"
            @setcursor="setCursor"
            ref="brush"
          />
          <EraserTool
            :selected="activeTool"
            @update="activeTool = $event"
            :scale="image.scale"
            @setcursor="setCursor"
            ref="eraser"
          />

        </div>
        <hr />

        <!-- <div v-show="mode == 'segment'">
          <CopyAnnotationsButton
            :categories="categories"
            :image-id="image.id"
            :next="image.next"
            :previous="image.previous"
          />
          <ShowAllButton />
          <HideAllButton />
        </div> -->
        <hr>
        <!-- <CenterButton /> -->
        <!-- <UndoButton /> -->

        <hr />

        <!-- <DownloadButton :image="image" /> -->
        <SaveButton />
        <!-- <ModeButton v-model="mode" /> -->
        <!-- <SettingsButton
          :metadata="image.metadata"
          :commands="commands"
          ref="settings"
        /> -->

        <hr />
        <!-- <DeleteButton :image="image" /> -->
      </aside>

      <aside v-show="panels.show.right" class="right-panel shadow-lg">
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

      <div class="middle-panel" :style="{ cursor: cursor }">
        <div id="frame" class="frame" @wheel="onwheel" >
          <canvas class="canvas" id="editor" ref="image" resize />
        </div>
      </div>

    </div>

    <div id="thumbnail-container" style="display:flex; flex-direction:row; width:98%; height:160px; background-color: white; margin-top:1em; border-radius: 1em;">
      <AnnotatorThumbnailCard></AnnotatorThumbnailCard>
      <AnnotatorThumbnailCard></AnnotatorThumbnailCard>
      <AnnotatorThumbnailCard></AnnotatorThumbnailCard>
      <AnnotatorThumbnailCard></AnnotatorThumbnailCard>
    </div>

  </div>

  <div style="display:flex; flex-direction: row;">
    <div style="width:82%; height:100%;">

    </div>

    <div style="width:18%; height:100%;">

    </div>

  </div>




</template>







  <script>
  import AnnotatorThumbnailCard from "@/components/AnnotatorThumbnailCard.vue"
  import paper from "paper";
  // import axios from "axios";
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
        activeTool: "Select",
        paper: null,
        shapeOpacity: 0.6,
        zoom: 0.2,
        cursor: "move",
        mode: "segment",
        simplify: 1,
        panels: {
          show: {
            left: true,
            right: true
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
          data: null
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
        console.log("onCategoryClick(indices) : ")
        console.log(indices.annotation)
        console.log(indices.category)
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
        this.image.filename = 'TestSampleImage.png';
        this.image.next = null;
        this.image.previous = null;
        this.image.categoryIds = [6]

        this.annotating = [];

        // Set other data
        // this.dataset = data.dataset;
        this.categories = [
          {
            annotations: [],
//             annotations: [
//   {
//     "id": 304,
//     "image_id": 274,
//     "category_id": 6,
//     "dataset_id": 13,
//     "segmentation": [
//       [
//         892,
//         791.5,
//         893.5,
//         787.9,
//         897,
//         786.5,
//         898.8,
//         786.8,
//         902.3,
//         785.4,
//         910.8,
//         785.5,
//         913.8,
//         787.4,
//         915.8,
//         791.5,
//         915.8,
//         795.7,
//         914.7,
//         798.8,
//         913.6,
//         800,
//         912.6,
//         802,
//         908.7,
//         804.8,
//         905.5,
//         806,
//         899.1,
//         805.9,
//         896.2,
//         804,
//         894,
//         801.9,
//         892,
//         797.8,
//         892,
//         792
//       ]
//     ],
//     "area": 404,
//     "bbox": [
//       892,
//       785,
//       24,
//       21
//     ],
//     "iscrowd": false,
//     "isbbox": false,
//     "creator": "jrlee",
//     "width": 2448,
//     "height": 2048,
//     "color": "#034add",
//     "keypoints": [],
//     "metadata": {},
//     "paper_object": [
//       "CompoundPath",
//       {
//         "applyMatrix": true,
//         "opacity": 0.6,
//         "data": {
//           "annotationId": 0,
//           "categoryId": 0
//         },
//         "children": [
//           [
//             "Path",
//             {
//               "applyMatrix": true,
//               "segments": [
//                 [
//                   -332,
//                   -232.5
//                 ],
//                 [
//                   -330.5,
//                   -236.1
//                 ],
//                 [
//                   -327,
//                   -237.5
//                 ],
//                 [
//                   -325.2,
//                   -237.2
//                 ],
//                 [
//                   -321.7,
//                   -238.6
//                 ],
//                 [
//                   -313.2,
//                   -238.5
//                 ],
//                 [
//                   -310.2,
//                   -236.6
//                 ],
//                 [
//                   -308.2,
//                   -232.5
//                 ],
//                 [
//                   -308.2,
//                   -228.3
//                 ],
//                 [
//                   -309.3,
//                   -225.2
//                 ],
//                 [
//                   -310.4,
//                   -224
//                 ],
//                 [
//                   -311.4,
//                   -222
//                 ],
//                 [
//                   -315.3,
//                   -219.2
//                 ],
//                 [
//                   -318.5,
//                   -218
//                 ],
//                 [
//                   -324.9,
//                   -218.1
//                 ],
//                 [
//                   -327.8,
//                   -220
//                 ],
//                 [
//                   -330,
//                   -222.1
//                 ],
//                 [
//                   -332,
//                   -226.2
//                 ],
//                 [
//                   -332,
//                   -232
//                 ]
//               ],
//               "closed": true
//             }
//           ]
//         ],
//         "fillColor": [
//           0,
//           0.6,
//           0.7
//         ]
//       }
//     ],
//     "deleted": false,
//     "milliseconds": 32926,
//     "events": []
//   }
// ],
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
        console.log("here")
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
      }
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
      // this.setDataset(null);

      // this.loading.loader = this.$loading.show({
      //   color: "white",
      //   // backgroundColor: "#4b5162",
      //   height: 150,
      //   opacity: 0.8,
      //   width: 150
      // });

      this.initCanvas();
      this.getData();

      // this.$socket.emit("annotating", { image_id: this.image.id, active: true });


      // 임시
      // this.activeTool = this.$refs.select;
      // this.activeTool.click();

      console.log("this.categories : " + this.categories)
      console.log("this.categories.length : " + this.categories.length)
      console.log("this.mode : " + this.mode)
      console.log("this.image.scale : " + this.image.scale)
  },
  created() {
    this.paper = new paper.PaperScope();

    this.image.id = parseInt(this.identifier);
    // this.image.url = "/api/image/" + this.image.id;
    this.image.url = "/images/TestSampleImage.png";
  }

  };
  </script>

  <style scoped>
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

  .left-panel {
    background-color: white;
    width: 40px;
    /* padding-top: 40px; */
    float: left;
    height: 100%;
    /* height: inherit; */
    box-shadow: 5px 10px;
  }

  .right-panel {
    padding-top: 40px;
    background-color: #4b5162;
    width: 250px;
    height: 100%;
    /* height: inherit; */
    float: right;
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
    height: 98%;

    /* margin-left: 1em; */

    background-color: #7c818c;
    overflow: hidden;
    position: relative;
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
