import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MyPageView from "../views/MyPageView2.vue";
import ProjectMainView from "../views/ProjectMainView.vue";
import AnnotatorView from "../components/AnnotatorView.vue";
import QualityStatusView from "../components/QualityStatusView.vue";
// import RealTimeMonitoringView from "../components/RealTimeMonitoringView.vue";
import ModelTrainView from "../components/ModelTrainView.vue";
import ModelTestView from "../components/ModelTestView.vue";
import AuthView from "../components/AuthView.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/mypage",
    name: "MyPage",
    component: MyPageView,
  },
  {
    path: "/project",
    name: "ProjectMainView",
    component: ProjectMainView,
    children: [
      {
        path: "",
        name: "QualityStatusView",
        component: QualityStatusView,
      },
      {
        path: "annotate/",
        name: "AnnotatorView",
        component: AnnotatorView,
        props: true
      },
      {
        path: "train/",
        name: "ModelTrainView",
        component: ModelTrainView,
      },
      {
        path: "test/",
        name: "ModelTestView",
        component: ModelTestView,
      },
      {
        path: "members/",
        name: "AuthView",
        component: AuthView,
      },
    ]
  },

  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
