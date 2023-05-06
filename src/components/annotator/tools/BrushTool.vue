<template>
  <div><i v-tooltip.right='tooltip' class='fa fa-x' :class='icon' :style='{ color: iconColor, fontSize: fontSize + "px" }' @click='click'></i><br></div>
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
      icon: "fa-paint-brush",
      name: "Brush",
      cursor: "none",
      fontSize: 40,
      scaleFactor: 3,
      brush: {
        path: null,
        pathOptions: {
          strokeColor: "white",
          strokeWidth: 1,
          radius: 5
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
      console.log("BrushTool-onMouseUp-merge() : "+this.selection)
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
      console.log("Brushhhhhhhhhhhhh")
      this.update();
    },
    update() {
      if (this.isDisabled) return;

      this.$emit("update", this.name);
      console.log("BrushTool > update() : console Parents")
      console.log(this.$parent)
    },
  },
  computed: {
    isDisabled() {
      return this.$parent.current.annotation == -1;
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