<template>
  <!-- <div><i v-tooltip.right='tooltip' class='fa-solid fa-brush' :style='{ color: iconColor, fontSize: fontSize + "px" }' @click='click'></i><br></div> -->
  <!-- tooltip이 커서 가리나? -->
  <div><i class='fa-solid fa-brush' :style='{ color: iconColor, fontSize: fontSize + "px" }' @click='click'></i><br></div>
</template>

<script>
import paper from "paper";
import tool from "@/mixins/toolBar/tool";

export default {
  name: "EraserTool",
  mixins: [tool],
  props: {
    scale: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      icon: "fa-light fa-brush",
      name: "Brush",
      cursor: "none",
      fontSize: 40,
      scaleFactor: 3,
      brush: {
        path: null,
        pathOptions: {
          strokeColor: "white",
          strokeWidth: 1,
          radius: 2
        }
      },
      selection: null
    };
  },
  methods: {
    removeBrush() {
      if (this.brush.path != null) {
        this.brush.path.remove();
        this.brush.path = null;
      }
    },
    removeSelection() {
      if (this.selection != null) {
        this.selection.remove();
        this.selection = null;
      }
    },
    moveBrush(point) {
      if (this.brush.path == null) this.createBrush();

      this.brush.path.bringToFront();
      this.brush.path.position = point;
    },
    createBrush(center) {
      console.log("createBrush: " + this.brush.pathOptions.radius)
      center = center || new paper.Point(0, 0);

      this.brush.path = new paper.Path.Circle({
        strokeColor: this.brush.pathOptions.strokeColor,
        strokeWidth: this.brush.pathOptions.strokeWidth,
        radius: this.brush.pathOptions.radius,
        center: center
      });
    },
    createSelection() {
      this.selection = new paper.Path({
        strokeColor: this.brush.pathOptions.strokeColor,
        strokeWidth: this.brush.pathOptions.strokeWidth
      });
    },
    onMouseMove(event) {
      // console.log("onMouseMove")
      this.moveBrush(event.point);
    },
    onMouseDown() {
      console.log("onMouseDown")
      this.createSelection();
      this.draw();
    },
    onMouseUp() {
      console.log("onMouseUp")
      this.merge();
      this.removeSelection();
    },
    onMouseDrag(event) {
      console.log("onMouseDrag")
      this.moveBrush(event.point);
      this.draw();
    },

    /**
     * Unites current brush with selection
     */
    draw() {
      let newSelection = this.selection.unite(this.brush.path);

      this.selection.remove();
      this.selection = newSelection;
    },
    /**
     * Unites current selection with selected annotation
     */
    merge() {
      console.log("[BrushTool][onMouseUp][merge] - this.selection")
      console.log(this.selection)
      this.$parent.uniteCurrentAnnotation(this.selection);
    },
    decreaseRadius() {
      if (!this.isActive) return;
      this.brush.pathOptions.radius -= 2;
    },
    increaseRadius() {
      if (!this.isActive) return;
      this.brush.pathOptions.radius += 2;
    },
    export() {
      return {
        strokeColor: this.brush.pathOptions.strokeColor,
        radius: this.brush.pathOptions.radius
      };
    },
    setPreferences(pref) {
      this.brush.pathOptions.strokeColor =
        pref.strokeColor || this.brush.pathOptions.strokeColor;
      this.brush.pathOptions.radius =
        pref.radius || this.brush.pathOptions.radius;
    },
    click() {
      this.update();
    },
    update() {
      if (this.isDisabled) return;

      this.$emit("update", this.name);
    },
  },
  computed: {
    isActive() {
      if (this.selected == this.name) {
        this.$emit("setcursor", this.cursor);
        return true;
      }
      return false;
    },
    isDisabled() {
      // return false  // 지금 tool 그대로 사용
      return this.$parent.current.annotation == -1;  // 기본 select로 돌아감
    }
  },
  watch: {
    "brush.pathOptions.radius"() {
      if (this.brush.path == null) return;

      let position = this.brush.path.position;
      this.brush.path.remove();
      this.createBrush(position);
    },
    "brush.pathOptions.strokeColor"(newColor) {
      if (this.brush.path == null) return;

      this.brush.path.strokeColor = newColor;
    },
    isActive(active) {
      console.log("[watch brush] isActive")
      if (this.brush.path != null) {
        this.brush.path.visible = active;
      }

      if (active) {
        this.tool.activate();
        localStorage.setItem("editorTool", this.name);
      }
    },
    /**
     * Change width of stroke based on zoom of image
     */
    scale(newScale) {
      this.brush.pathOptions.strokeWidth = newScale * this.scaleFactor;
      if (this.brush.path != null)
        this.brush.path.strokeWidth = newScale * this.scaleFactor;
    }
  },
  mounted() {
    this.tool = new paper.Tool();

    this.tool.onMouseDown = this.onMouseDown;
    this.tool.onMouseDrag = this.onMouseDrag;
    this.tool.onMouseMove = this.onMouseMove;
    this.tool.onMouseUp = this.onMouseUp;
  }
};
</script>