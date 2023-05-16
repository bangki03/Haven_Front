<template>
  <div
    class="card"
    v-show="showCategory"
    :style="{
      'background-color': backgroundColor,
      'border-color': borderColor
    }"
  >
    <div class="card-header" :id="'heading' + category.id">
      <div :style="{ color: isVisible ? 'white' : 'gray' }">
        <div @click="onEyeClick">
          <i
            v-if="isVisible"
            class="fa fa-eye category-icon"
            :style="{ color: showAnnotations ? 'white' : color }"
            aria-hidden="true"
          />
          <i v-else class="fa fa-eye-slash category-icon" aria-hidden="true" />
        </div>

        <button
          class="btn btn-link btn-sm collapsed category-text"
          style="color: inherit"
          aria-expanded="false"
          :aria-controls="'collapse' + category.id"
          @click="onClick"
        >
          {{ category.name }} ({{ category.annotations.length }})
        </button>

        <i
          class="fa fa-gear category-icon"
          data-toggle="modal"
          :data-target="'#categorySettings' + category.id"
          style="float: right; color: white"
          aria-hidden="true"
        />

        <i
          @click="createAnnotation"
          class="fa fa-plus category-icon"
          style="float: right; color: white; padding-right: 0"
          aria-hidden="true"
        />
      </div>
    </div>

    <ul v-show="showAnnotations" ref="collapse" class="list-group">
      <li
        v-show="this.category.annotations.length > 0"
        class="list-group-item btn btn-link btn-sm text-left"
        :style="{ 'background-color': backgroundColor, color: 'white' }"
      >
        <input
          v-model="search"
          class="annotation-search"
          placeholder="Search"
          :disabled="this.category.annotations.length < 2"
        />
      </li>

      <!-- <AnnotationPanel
        v-for="(annotation, listIndex) in category.annotations"
        :search="search"
        :key="annotation.id"
        :simplify="simplify"
        :annotation="annotation"
        :current="current.annotation"
        @click="onAnnotationClick(listIndex)"
        @keypoint-click="onKeypointClick(listIndex, $event)"
        @keypoints-complete="$emit('keypoints-complete')"
        :opacity="opacity"
        :index="listIndex"
        :keypoint-edges="keypoint.edges"
        :keypoint-labels="keypoint.labels"
        :keypoint-colors="keypoint.colors"
        ref="annotation"
        :hover="hover.annotation"
        :active-tool="activeTool"
        :scale="scale"
        @deleted="annotationDeleted"
        :all-categories="getCategoriesList"
        @AnnotationPanel_unite="AnnotationPanel_unite"
        @AnnotationPanel_emitModify="AnnotationPanel_emitModify"
      /> -->
      <AnnotationPanel
        v-for="(annotation, listIndex) in category.annotations"
        :search="search"
        :key="annotation.id"
        :simplify="simplify"
        :annotation="annotation"
        :current="current.annotation"
        @click="onAnnotationClick(listIndex)"
        @keypoint-click="onKeypointClick(listIndex, $event)"
        @keypoints-complete="$emit('keypoints-complete')"
        :opacity="opacity"
        :index="listIndex"
        :keypoint-edges="keypoint.edges"
        :keypoint-labels="keypoint.labels"
        :keypoint-colors="keypoint.colors"
        ref="annotation"
        :hover="hover.annotation"
        :active-tool="activeTool"
        :scale="scale"
        @deleted="annotationDeleted"
        :all-categories="getCategoriesList"
        @AnnotationPanel_unite="AnnotationPanel_unite"
        @AnnotationPanel_emitModify="AnnotationPanel_emitModify"
      />
    </ul>

    <div
      class="modal fade"
      tabindex="-1"
      role="dialog"
      ref="category_settings"
      :id="'categorySettings' + category.id"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ category.name }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label>Supercategory</label>
                <input
                  type="text"
                  class="form-control"
                  :value="supercategory"
                  @input="supercategory = $event.target.value"
                />
              </div>

              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Color</label>
                <div class="col-sm-9">
                  <input v-model="color" type="color" class="form-control" />
                </div>
              </div>

              <div class="form-group">
                <KeypointsDefinition ref="keypoints"
                  :value="keypoint"
                  element-id="keypointLabels"
                ></KeypointsDefinition>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success"
              @click="onUpdateClick"
              :disabled="!isFormValid"
              :class="{ disabled: !isFormValid }"
              data-dismiss="modal"
            >Update</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import paper from "paper";

// import Annotations from "@/models/annotations";
import AnnotationPanel from "@/components/annotator/AnnotationPanel";
import KeypointsDefinition from "@/components/KeypointsDefinition";
import JQuery from "jquery";

let $ = JQuery;

export default {
  name: "CategoryPanel",
  components: {
    AnnotationPanel,
    KeypointsDefinition
   },
  props: {
    test: {},
    category: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    current: {
      type: Object,
      required: true
    },
    hover: {
      type: Object,
      required: true
    },
    opacity: {
      type: Number,
      required: true
    },
    scale: {
      type: Number,
      default: 1
    },
    categorysearch: {
      type: String,
      required: true
    },
    simplify: {
      type: Number,
      default: 1
    },
    activeTool: {
      type: String,
      required: true
    },
    allCategories: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      group: null,
      supercategory: this.category.supercategory,
      color: this.category.color,
      keypoint: {
        labels: [...this.category.keypoint_labels],
        edges: [...this.category.keypoint_edges],
        colors: [...this.category.keypoint_colors],
      },
      selectedAnnotation: -1,
      showAnnotations: false,
      isVisible: true,
      search: "",
      isMounted: false,
    };
  },
  methods: {
    // AnnotationPanel 의 prop(annotation) 변경 error 개선 위한 emit 함수
    AnnotationPanel_unite(data) {
      // 와 이걸 또 emit으로 올려야되네 ㄷㄷ
      // this.annotation.ixbbox = data;
      // this.category.annotations[0].isbbox = data;
      this.$emit('CategoryPanel_unite', data)
    },
    AnnotationPanel_emitModify(data) {
      // this.annotation.paper_object = this.compoundPath.exportJSON({
      //   asString: false,
      //   precision: 1
      // });
      // this.category.annotations[0].paper_object = this.compoundPath.exportJSON({
      //   asString: false,
      //   precision: 1
      // });
      this.$emit('CategoryPanel_emitModify', data)
    },

    show(index) {
      if (this.search.length === 0) return true;
      return this.filterFound.indexOf(index) > -1;
    },
    resetCategorySettings() {
      this.supercategory = this.category.supercategory;
      this.color = this.category.color;
      this.keypoint = {
        labels: [...this.category.keypoint_labels],
        edges: [...this.category.keypoint_edges],
        colors: [...this.category.keypoint_colors],
      };
    },
    /**
     * Created
     */
    // createAnnotation() {
    //   let parent = this.$parent;
    //   let annotationId = this.category.annotations.length;
    //   Annotations.create({
    //     image_id: parent.image.id,
    //     category_id: this.category.id,
    //   }).then(response => {
    //     // this.$socket.emit("annotation", {
    //     //   action: "create",
    //     //   category_id: this.category.id,
    //     //   annotation: response.data
    //     // });

    //     // prop으로 받은 데이터니까, 여기서 push 하지말고 emit해서 부모 페이지에서 바꿔주자.
    //     // this.category.annotations.push(response.data);

    //     this.$emit('createAnnotation_push', response.data)

    //     this.selectedAnnotation = annotationId;
    //     this.$nextTick(() => {
    //       this.$parent.selectLastEditorTool();
    //       this.$emit("click", {
    //         annotation: annotationId,
    //         category: this.index,
    //         keypoint: -1,
    //       });
    //     });

    //     this.isVisible = true;
    //     this.showAnnotations = true;

    //     let annotations = this.$refs.annotation;
    //     if (annotations == null) return;

    //     let annotation = annotations[annotationId - 1];
    //     if (annotation == null) {
    //       this.$parent.scrollElement(this.$el);
    //     } else {
    //       this.$parent.scrollElement(annotation.$el);
    //     }
    //   });
    // },

    //// 임시
    createAnnotation() {
      console.log("[CategoryPanel][createAnnotation]")
      // let parent = this.$parent;
      let annotationId = this.category.annotations.length;

      var aa = {
          area: 0,
          bbox: [0, 0, 0, 0],
          category_id : 6,
          color : "#d78200",
          creator : "ghbang",
          dataset_id : 13,  // 수정 필
          deleted : false,
          events: [],
          // height: 2048,  // 수정 필
          id: 1, // 수정 필
          image_id: 0,  // 수정 필
          isbbox: false,
          iscrowd: false,
          keypoints: [],
          // metadata: {},
          milliseconds: 0,
          paper_object: [],
          // paper_object: ["CompoundPath", {"applyMatrix": true, 'children':[], data:{annotationId:0, categoryId:0}, fillColor:[0, 0.6, 0.7], opacity:0.6, strokeWidth: 0}],
          segmentation: [],
          // width: 2448, // 수정 필
        }

      // this.category.annotations 에다가 넣는게 안되니까, emit으로 처리해준건데, 여기서도 더 쓰이나?
      // this.category.annotations.push(response.data);
      this.$emit('createAnnotation_push', aa)

      this.selectedAnnotation = annotationId;
      this.$nextTick(() => {
        // this.$parent.selectLastEditorTool();
        console.log("[CategoryPanel][createAnnotation] $nextTick")
        this.$emit("clickcategory", {
          annotation: annotationId,
          category: this.index,
          keypoint: -1,
        });
      });

      this.isVisible = true;
      this.showAnnotations = true;

      let annotations = this.$refs.annotation;
      if (annotations == null) return;

      let annotation = annotations[annotationId - 1];
      if (annotation == null) {
        this.$parent.scrollElement(this.$el);
      } else {
        this.$parent.scrollElement(annotation.$el);
      }
    },






    onUpdateClick() {
      // category는 prop으로 받은 데이터니까, 여기서 push 하지말고 emit해서 부모 페이지에서 바꿔주자.
      // this.category.keypoint_labels = [...this.keypoint.labels];
      // this.category.keypoint_edges = [...this.keypoint.edges];
      // this.category.keypoint_colors = [...this.keypoint.colors];
      // this.category.supercategory = this.supercategory;
      this.$emit("onUpdateClick_keypoint_labels", this.keypoint.labels)
      this.$emit("onUpdateClick_keypoint_edges", this.keypoint.edges)
      this.$emit("onUpdateClick_keypoint_colors", this.keypoint.colors)
      this.$emit("onUpdateClick_supercategory", this.supercategory)
    },
    /**
     * Exports data for send to backend
     * @returns {json} Annotation data, and settings
     */
    export() {
      let refs = this.$refs;
      let categoryData = {
        // Category Identification
        id: this.category.id,
        name: this.category.name,
        // Show in side bar
        show: this.category.show,
        // Show groups on canvas
        visualize: this.isVisible,
        color: this.color,
        // metadata: [],
        annotations: [],
        supercategory: this.category.supercategory,
        keypoint_labels: this.category.keypoint_labels,
        keypoint_edges: this.category.keypoint_edges,
        keypoint_colors: this.category.keypoint_colors,
      };

      // if (refs.hasOwnProperty("annotation")) {
      if (Object.prototype.hasOwnProperty.call(refs, "annotation")) {
        refs.annotation.forEach(annotation => {
          categoryData.annotations.push(annotation.export());
        });
      }

      return categoryData;
    },

    addKeypointEdge(edge) {
      this.keypoint.edges.push(edge);
    },
    removeKeypointEdge(edge) {
      let index = this.keypoint.edges.findIndex(e => {
        let i1 = Math.min(edge[0], edge[1]) == Math.min(e[0], e[1]);
        let i2 = Math.max(edge[0], edge[1]) == Math.max(e[0], e[1]);

        return i1 && i2;
      });

      if (index !== -1) {
        let edge = this.keypoint.edges[index];
        this.keypoint.edges.splice(index, 1);
        let annotations = this.$refs.annotation;
        if (annotations) {
          annotations.forEach(a => a.keypoints.removeLine(edge));
        }
      }
    },
    /**
     * Event handler for visibility button
     */
    onEyeClick() {
      this.isVisible = !this.isVisible;

      if (this.showAnnotations && !this.isVisible) {
        this.showAnnotations = false;
      }

      if (this.showAnnotations)
        if (this.isCurrent) {
          console.log("[CategoryPanel][onEyeClick]")
          this.$emit("clickcategory", {
            annotation: this.selectedAnnotation,
            category: this.index,
            keypoint: -1,
          });
        }
    },
    /**
     * Event handler for keypoint click
     */
    onKeypointClick(annotation_index, keypoint_index) {
      let indices = {
        annotation: annotation_index,
        category: this.index,
        keypoint: keypoint_index,
      };
      this.selectedAnnotation = annotation_index;
      this.showAnnotations = true;

      console.log("[CategoryPanel][onKeypointClick]")
      this.$emit("clickcategory", indices);
    },
    /**
     * Event handler for annotation click
     */
    onAnnotationClick(index) {
      let indices = {
        annotation: index,
        category: this.index,
        keypoint: -1
      };
      this.selectedAnnotation = index;
      this.showAnnotations = true;

      console.log("[CategoryPanel][onAnnotationClick]")
      this.$emit("clickcategory", indices);
    },
    /**
     * Event Handler for category click
     */
    onClick() {
      let indices = {
        annotation: this.selectedAnnotation,
        category: this.index,
        keypoint: -1
      };
      console.log("[CategoryPanel][onClick]")
      this.$emit("clickcategory", indices);

      if (this.category.annotations.length === 0) return;
      this.showAnnotations = !this.showAnnotations;

      if (this.showAnnotations && !this.isVisible) {
        this.isVisible = true;
      }
    },
    /**
     * Creates paperjs group
     */
    initCategory() {
      this.setColor();
    },
    /**
     * @returns {Annotation} returns annotation and provided index
     */
    getAnnotation(index) {
      console.log('[CategoryPanel][getAnnotation] - index : ' + index)
      let ref = this.$refs.annotation;
      console.log('[CategoryPanel][getAnnotation] - ref : ')
      console.log(ref)
      if (ref == null) return null;

      console.log('[CategoryPanel][getAnnotation] - this.$refs.annotation[index]')
      console.log(this.$refs.annotation[index])
      return this.$refs.annotation[index];
    },
    /**
     * Sets color of current group depending on state.
     * Show annotation colors if showAnnotations is true,
     * Show as group color if showAnnotations is false
     */
    setColor() {
      let annotations = this.$refs.annotation;
      if (annotations == null) return;
      if (!this.isVisible) return;

      if (this.showAnnotations) {
        annotations.forEach(a => a.setColor());
      } else {
        annotations.forEach(a => {
          a.compoundPath.fillColor = this.color;
          a.keypoints.color = this.darkHSL;
          a.keypoints.bringToFront();
        });
      }
    },
    annotationDeleted(index) {
      if (this.selectedAnnotation >= index) {
        this.selectedAnnotation--;
      }

      let indices = {
        annotation: this.selectedAnnotation,
        category: this.index,
        keypoint: -1,
      };
      console.log("[CategoryPanel][annotationDeleted]")
      this.$emit("clickcategory", indices);

      if (this.category.annotations.length === 0) this.isVisible = false;
    },

    // 임시 함수
    initAnnotation(index) {
      this.$refs.annotation[index].initAnnotation()
    }
  },
  computed: {
    showCategory() {
      let search = this.categorysearch.toLowerCase();
      if (search.length === 0) return true;
      return this.category.name.toLowerCase().includes(search);
    },
    getCategoriesList() {
      return this.allCategories.map(category => ({
        value: category.id,
        text: category.name
      }));
    },
    isCurrent() {
      return this.current.category === this.index;
    },
    isHover() {
      return this.hover.category === this.index;
    },
    backgroundColor() {
      if (this.isHover && !this.showAnnotations) {
        return "#646c82";
      }
      return "inherit";
    },
    borderColor() {
      if (this.isCurrent) return "rgba(255, 255, 255, 0.25)";
      return "#404552";
    },
    darkHSL() {
      let color = new paper.Color(this.color);
      let h = Math.round(color.hue);
      let l = Math.round(color.lightness * 50);
      let s = Math.round(color.saturation * 100);
      return "hsl(" + h + "," + s + "%," + l + "%)";
    },
    isFormValid() {
      return (
        this.isMounted &&
        this.$refs &&
        this.$refs.keypoints &&
        this.$refs.keypoints.valid
      );
    }
  },
  watch: {

    color() {
      console.log("[watch][CategoryPanel][color]")
      this.setColor();
    },
    opacity() {
      console.log("[watch][CategoryPanel][opacity]")
      let annotations = this.$refs.annotation;
      if (annotations == null) return;

      annotations.forEach(a => (a.compoundPath.opacity = this.opacity));
    },
    isVisible(newVisible) {
      let annotations = this.$refs.annotation;
      console.log("[CategoryPanel][watch][isVisible] - newVisible")
      console.log(newVisible)
      console.log("[CategoryPanel][watch][isVisible] - this.$refs.annotation")
      console.log(this.$refs.annotation)
      if (annotations == null) return;

      console.log("[CategoryPanel][watch][isVisible] - annotations")
      console.log(annotations)
      annotations.forEach(a => {
        // a.keypoints.visible = newVisible;
        a.isVisible = newVisible;
      });
      this.setColor();
    },
    showAnnotations(showing) {
      console.log("[watch][CategoryPanel][showAnnotations] - showing")
      console.log(showing)
      if (!showing) {
        console.log("[CategoryPanel][showAnnotations]")
        this.$emit("clickcategory", {
          annotation: -1,
          keypoint: -1,
          category: this.index
        });
      }
      this.setColor();
    },
    category() {
      console.log("[watch][CategoryPanel][category]")
      this.initCategory();
    }
  },
  sockets: {
    annotation(data) {
      let action = data.action;
      let annotation = data.annotation;

      if (annotation.image_id != this.$parent.image.id) return;
      if (annotation.category_id != this.category.id) return;

      let found = this.category.annotations.findIndex(
        a => a.id == annotation.id
      );

      if (found == -1) {
        if (action == "create") {
          // category는 prop으로 받은 데이터니까, 여기서 push 하지말고 emit해서 부모 페이지에서 바꿔주자.
          // this.category.annotations.push(annotation);
          this.$emit("annotation_push", annotation)
        }
      }
    }
  },
  created() {
    console.log('[created][CategoryPanel] - index : ' + this.index)
    console.log('[created][CategoryPanel] - key : ' + this.test)
    console.log('[created][CategoryPanel] - category : ')
    console.log(this.category)
    // + 버튼 누르면 category 정보 세팅해주는건데, 그냥 create 시 바로 하자.
    this.createAnnotation()

    // if(this.category.annotations == []) {
    //   // 어?! 근데 createAnnotation 을 안하면, tool을 못쓰네??
    //   console.log('[created][CategoryPanel] - call(createAnnotation)')
    //   this.createAnnotation()
    // }
  },
  mounted() {
    console.log('[mounted][CategoryPanel] - index : ' + this.index)
    console.log('[mounted][CategoryPanel] - key : ' + this.test)
    this.initCategory();
    $(this.$refs.category_settings).on(
      "hidden.bs.modal", this.resetCategorySettings);
    this.isMounted = true;

    console.log('[mounted][CategoryPanel] - ref.annotation')
    console.log(this.$refs.annotation)

    // if(this.category.annotations == []) {
    //   // 어?! 근데 createAnnotation 을 안하면, tool을 못쓰네??
    //   console.log('[created][CategoryPanel] - call(createAnnotation)')
    //   this.createAnnotation()
    // }
  },
  unmounted() {
    console.log('[unmounted][CategoryPanel] - index : ' + this.index)
    console.log('[unmounted][CategoryPanel] - key : ' + this.test)
  }
};
</script>

<style scoped>
.list-group-item {
  height: 22px;
  font-size: 13px;
  padding: 2px;
  background-color: #4b5162;
}

.category-icon {
  display: block;
  float: left;
  margin: 0;
  padding: 5px 10px 5px 10px;
}

.btn-link {
  margin: 0;
  padding: 0;
}
.annotation-icon {
  margin: 0;
  padding: 3px;
}

.card-header {
  display: block;
  margin: 0;
  padding: 0;
}

.card {
  background-color: #404552;
}

.annotation-search {
  width: 100%;
  height: 18px;
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  text-align: center;
  border-radius: 4px;
}

::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: lightgray;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: lightgray;
  opacity: 1;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: lightgray;
  opacity: 1;
}
:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: lightgray;
}
::-ms-input-placeholder {
  /* Microsoft Edge */
  color: lightgray;
}
::placeholder {
  /* Most modern browsers support this now. */
  color: lightgray;
}
</style>
