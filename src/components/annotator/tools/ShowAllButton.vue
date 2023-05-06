<template>
  <div><i v-tooltip.right='name' class='fa fa-x' :class='icon' :style='{ color: iconColor }' @click='click'></i><br></div>
</template>


<script>
import button from "@/mixins/toolBar/button";

export default {
  name: "ShowAllButton",
  mixins: [button],
  data() {
    return {
      name: "Show All",
      icon: "fa-eye"
    };
  },
  methods: {
    execute() {
      this.$parent.showAll();
    }
  }
};
</script>
