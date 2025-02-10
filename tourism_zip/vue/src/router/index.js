import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import index from "../components/index.vue";
// import houseDetails from "../components/houseDetails.vue";
import personCenter from "../components/personCenter.vue";
import person from "../components/person.vue";

const router = createRouter({
  routes: [
    {
      path: "/",
      component: index,
    },
    {
      path: "/person",
      component: person,
    },
    // {
    //   path: "/houseDetails/:id",
    //   component: houseDetails,
    // },
    {
      path: "/personCenter",
      component: personCenter,
    },
  ],
  history: createWebHashHistory(),
});
//引入nprogress
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; //这个样式必须引入
// 简单配置
NProgress.inc(0.2);
NProgress.configure({
  easing: "ease",
  speed: 500,
  showSpinner: false,
});

// 当路由请求之前

router.beforeEach((to, from, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start();
  // 这个一定要加，没有next()页面不会跳转的
  next();
});
// 当路由请求之后：关闭进度条
router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done();
});
export default router;
