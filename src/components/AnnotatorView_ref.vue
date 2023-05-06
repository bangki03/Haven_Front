<template>

  <div style="display:flex; flex-direction: column; justify-content: space-evenly; align-items: center;">
    <div id="filter-container" style="width:98%; height:160px; background-color: white; margin-top:1em; border-radius: 1em;">

    </div>

    <div id="annotator-container" style="width:98%; height:500px; margin-top:1em; border-radius: 1em;">

      <aside v-show="panels.show.left" class="left-panel shadow-lg">
        <div v-show="mode == 'segment'">
          <hr />
          <SelectTool v-model="activeTool" :scale="image.scale" @setcursor="setCursor" ref="select" />
          <!-- <hr /> -->
          <BrushTool v-model="activeTool" :scale="image.scale" @setcursor="setCursor" ref="brush" />
          <EraserTool v-model="activeTool" :scale="image.scale" @setcursor="setCursor" ref="eraser" />
        </div>

        <hr />

        <div v-show="mode == 'segment'">
          <ShowAllButton />
          <HideAllButton />
        </div>
        <hr>
          <CenterButton />
          <UndoButton />
        <hr />

        <DownloadButton :image="image" />
        <SaveButton />
      </aside>

      <aside v-show="panels.show.right" class="right-panel shadow-lg">
        <hr />
        <FileTitle :previousimage="image.previous" :nextimage="image.next" :filename="image.filename" ref="filetitle" />

        <div v-if="categories.length > 5">
          <div style="padding: 0px 5px">
            <input
              v-model="search"
              class="search"
              placeholder="Category Search"
            />
          </div>
        </div>

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
            <!-- <Category
              v-for="(category, index) in categories"
              :key="category.id + '-category'"
              :simplify="simplify"
              :categorysearch="search"
              :category="category"
              :all-categories="categories"
              :opacity="shapeOpacity"
              :hover="hover"
              :index="index"
              @click="onCategoryClick"
              @keypoints-complete="onKeypointsComplete"
              :current="current"
              :active-tool="activeTool"
              :scale="image.scale"
              ref="category"
            /> -->
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
      <v-touch @pinch="onpinch" @pinchstart="onpinchstart">
        <div id="frame" class="frame" @wheel="onwheel">
          <canvas class="canvas" id="editor" ref="image" resize />
        </div>
      </v-touch>
      </div>

      <!-- <div v-show="annotating.length > 0" class="fixed-bottom alert alert-warning alert-dismissible fade show">
        <span>
        This image is being annotated by <b>{{ annotating.join(', ') }}</b>.
        </span>

        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div> -->
    </div>

    <div id="thumbnail-container" style="width:98%; height:160px; background-color: white; margin-top:1em; border-radius: 1em;">

    </div>

  </div>





  <!-- <div style="width:calc(100vw - 200px); height:160px;">
  </div> -->
</template>

  <script>
  // import paper from "paper";
  // import axios from "axios";

  // import toastrs from "@/mixins/toastrs";
  // import shortcuts from "@/mixins/shortcuts";

  import FileTitle from "@/components/annotator/FileTitle";
//   import Category from "@/components/annotator/Category";
//   import Label from "@/components/annotator/Label";
  // import Annotations from "@/models/annotations";

//   import PolygonTool from "@/components/annotator/tools/PolygonTool";
//   import BBoxTool from "@/components/annotator/tools/BBoxTool";
  import SelectTool from "@/components/annotator/tools/SelectTool";
//   import MagicWandTool from "@/components/annotator/tools/MagicWandTool";
  import EraserTool from "@/components/annotator/tools/EraserTool";
  import BrushTool from "@/components/annotator/tools/BrushTool";
//   import KeypointTool from "@/components/annotator/tools/KeypointTool";
//   import DEXTRTool from "@/components/annotator/tools/DEXTRTool";

//   import CopyAnnotationsButton from "@/components/annotator/tools/CopyAnnotationsButton";
  import CenterButton from "@/components/annotator/tools/CenterButton";
  import DownloadButton from "@/components/annotator/tools/DownloadButton";
  import SaveButton from "@/components/annotator/tools/SaveButton";
//   import SettingsButton from "@/components/annotator/tools/SettingsButton";
//   import ModeButton from "@/components/annotator/tools/ModeButton";
//   import DeleteButton from "@/components/annotator/tools/DeleteButton";
  import UndoButton from "@/components/annotator/tools/UndoButton";
  import ShowAllButton from "@/components/annotator/tools/ShowAllButton";
  import HideAllButton from "@/components/annotator/tools/HideAllButton";
//   import AnnotateButton from "@/components/annotator/tools/AnnotateButton";

//   import PolygonPanel from "@/components/annotator/panels/PolygonPanel";
//   import BBoxPanel from "@/components/annotator/panels/BBoxPanel";
  import SelectPanel from "@/components/annotator/panels/SelectPanel";
//   import MagicWandPanel from "@/components/annotator/panels/MagicWandPanel";
  import BrushPanel from "@/components/annotator/panels/BrushPanel";
  import EraserPanel from "@/components/annotator/panels/EraserPanel";
//   import KeypointPanel from "@/components/annotator/panels/KeypointPanel";
//   import DEXTRPanel from "@/components/annotator/panels/DEXTRPanel";

  // import { mapMutations } from "vuex";

  export default {
    name: "AnnotatorView",
    components: {
      FileTitle,
    //   CopyAnnotationsButton,
    //   Category,
    //   CLabel: Label,
    //   BBoxTool,
    //   BBoxPanel,
    //   PolygonTool,
    //   PolygonPanel,
      SelectTool,
    //   MagicWandTool,
      EraserTool,
      BrushTool,
    //   KeypointTool,
      DownloadButton,
      SaveButton,
    //   SettingsButton,
    //   DeleteButton,
      CenterButton,
      SelectPanel,
    //   MagicWandPanel,
      BrushPanel,
      EraserPanel,
    //   ModeButton,
      UndoButton,
      HideAllButton,
      ShowAllButton,
    //   KeypointPanel,
    //   AnnotateButton,
    //   DEXTRTool,
    //   DEXTRPanel
    },
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
      setCursor(newCursor) {
        this.cursor = newCursor;
      },
    },

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
    background-color: #4b5162;
    width: 40px;
    padding-top: 40px;
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

  .middle-panel {
    display: block;
    width: calc(100% - 250px - 40px);
    height: 100%;
    /* height: inherit; */
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
