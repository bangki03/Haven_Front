<template>
  <div v-show="eraser.isActive">
    <PanelInputNumber
      name="Radius"
      min="0"
      max="1000"
      step="5"
      :value="eraser.eraser.pathOptions.radius"
    />
    <PanelInputString
      name="Stroke Color"
      :value="eraser.eraser.pathOptions.strokeColor"
    />
  </div>
</template>

<script>
import PanelInputString from "@/components/PanelInputString";
import PanelInputNumber from "@/components/PanelInputNumber";

export default {
  name: "EraserPanel",
  components: { PanelInputString, PanelInputNumber },
  props: {
    eraser: {
      type: Object,
      required: true
    }
  }
};
</script>
