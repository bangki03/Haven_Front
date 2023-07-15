import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueToastr2 from "vue-toastr-2";
import paper from "paper";
import VTooltip from "v-tooltip";
import Loading from "vue-loading-overlay";
// import VueTouch from 'vue-touch'
import VueAwesomePaginate from "vue-awesome-paginate";

// import GAuth from "vue-google-oauth2"
// const gauthOption = {
//     clientId: '669331276233-gvtjd1fbgfccs72mh72v8ghlkijfdjc2.apps.googleusercontent.com',
//     scope: 'profile email openid',
//   }


import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "vue-toastr-2/dist/vue-toastr-2.min.css";
// import "vue-loading-overlay/dist/vue-loading.css";
import "vue-awesome-paginate/dist/style.css";


// vue-slider
// import VueSlider from 'vue-slider-component'
// import 'vue-slider-component/theme/default.css'

// @vue-form/slider
import "@vueform/slider/themes/default.css";


paper.install(window);
window.toastr = require("toastr");

const app = createApp(App)

app.use(store).use(router).use(VTooltip).use(Loading).use(VueAwesomePaginate)
app.mount("#app");

app.mixin({
    mounted() {
        // this.$toastr = this.$refs.toastr;
        if (this.$refs.toastr) {
            this.$toastr = this.$refs.toastr;
        }
    }
})

app.component('vue-toastr', VueToastr2);

// createApp(App).use(store).use(router).use(VueToastr2).use(VTooltip).use(Loading).use((VueTouch,{name:'v-touch'})).mount("#app");
