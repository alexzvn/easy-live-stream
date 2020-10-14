import Vue from 'vue';
import VueRouter from 'vue-router';
import PageIndex from './pages/index';
import PageComment from './pages/comment';
import PageProducts from './pages/products';
import PageOrders from './pages/orders';
import PageLivestream from './pages/livestream';

Vue.use(VueRouter);

export default new VueRouter({
  // mode: "history",
  routes: [
    {
      name: 'home',
      path: '/home',
      component: PageIndex,
    },
    {
      name: 'livestream',
      path: '/livestream',
      component: PageLivestream,
    },
    {
      name: 'comment',
      path: '/comment',
      component: PageComment,
    },
    {
      name: 'products',
      path: '/products',
      component: PageProducts,
    },
    {
      name: 'orders',
      path: '/orders',
      component: PageOrders,
    },
  ],
});
