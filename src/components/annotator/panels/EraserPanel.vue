<template>
  <div v-show="eraser.isActive">

    <div style="height:200px;">
      <Slider class="slider-blue" v-model="eraser_radius" orientation="vertical" direction="rtl" :tooltips=true :min=0 :max=20
      style="height:inherit"
      @update="update_value"
      />
    </div>

    <!-- <PanelInputNumber
      name="Radius"
      min="0"
      max="1000"
      step="5"
      :value="eraser.eraser.pathOptions.radius"
    /> -->
    <PanelInputString v-show="false"
      name="Stroke Color"
      :value="eraser.eraser.pathOptions.strokeColor"
    />
  </div>
</template>

<script>
import PanelInputString from "@/components/PanelInputString";
// import PanelInputNumber from "@/components/PanelInputNumber";
import Slider from '@vueform/slider'

export default {
  name: "EraserPanel",
  components: { PanelInputString, Slider },
  props: {
    eraser: {
      type: Object,
      required: true
    },
    radius: Number,
  },
  data() {
    return{
      eraser_radius : this.radius
    }
  },
  methods: {
    update_value() {
      this.$emit('update', this.eraser_radius)
    },
  },
  watch: {
    "radius"(newValue) {
      this.eraser_radius = newValue
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