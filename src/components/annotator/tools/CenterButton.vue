<template>
  <div><i v-tooltip.right='name' class='fa fa-x' :class='icon' :style='{ color: iconColor }' @click='click'></i><br></div>
</template>

<script>
import button from "@/mixins/toolBar/button";

export default {
  name: "CenterButton",
  mixins: [button],
  data() {
    return {
      name: "Center Image",
      icon: "fa-align-center"
    };
  },
  methods: {
    execute() {
      this.$parent.fit();
    }
  }
};
</script>
