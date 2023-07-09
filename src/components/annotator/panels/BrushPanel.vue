<template>
  <div v-show="brush.isActive">

    <div style="height:200px;">
      <Slider class="slider-blue" v-model="brush_radius" orientation="vertical" direction="rtl" :tooltips=true :min=0 :max=20
      style="height:inherit"
      @update="update_value"
      />
    </div>

    <!-- <PanelInputNumber
      name="Radius"
      min="0"
      max="1000"
      step="5"
      :value="brush.brush.pathOptions.radius"
    /> -->
    <PanelInputString v-show="false"
      name="Stroke Color"
      :value="brush.brush.pathOptions.strokeColor"
    />
  </div>
</template>

<script>
import PanelInputString from "@/components/PanelInputString";
// import PanelInputNumber from "@/components/PanelInputNumber";
import Slider from '@vueform/slider'

export default {
  name: "BrushPanel",
  components: { PanelInputString, Slider },
  props: {
    brush: {
      type: Object,
      required: true
    },
    radius: Number,
  },
  data() {
    return{
      brush_radius : this.radius
    }
  },
  methods: {
    update_value() {
      // console.log("updateSlider: " + this.brush_radius)
      // this.brush.brush.pathOptions.radius = this.brush_radius
      this.$emit('update', this.brush_radius)
    },
  },
  watch: {
    "radius"(newValue) {
      this.brush_radius = newValue
    }
  }
};
</script>

<style>
.slider-blue {
  --slider-connect-bg: #3B82F6;
  --slider-tooltip-bg: #3B82F6;
  --slider-handle-ring-color: #3B82F630;
}
</style>