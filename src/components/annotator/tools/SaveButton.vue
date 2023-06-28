<template>
  <!-- <div><i v-tooltip.right='name' class='far' :class='icon' :style='{ color: iconColor, fontSize: fontSize + "px" }' @click='save'></i><br></div> -->
  <!-- tooltip이 커서 가리나? -->
  <div><i class='far' :class='icon' :style='{ color: iconColor, fontSize: fontSize + "px" }' @click='save'></i><br></div>
</template>

<script>
import button from "@/mixins/toolBar/button";

export default {
  name: "SaveButton",
  mixins: [button],
  data() {
    return {
      name: "Save",
      icon: "fa-save",
      fontSize: 40,
    };
  },
  methods: {
    save() {
      this.$parent.save1();
    }
  }
};
</script>
