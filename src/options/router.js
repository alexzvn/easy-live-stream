import Vue from 'vue';
import VueRouter from 'vue-router';
import PageIndex from './pages/index'
import PageLiveStream from './pages/livestream'
import PageProducts from './pages/products'
import PageOrders from './pages/orders'

Vue.use(VueRouter);

export default new VueRouter({
    // mode: "history",
    routes: [
      {
        name: 'home',
        path: '/home',
        component: PageIndex
      },
      {
        name: 'livestream',
        path: '/livestream',
        component: PageLiveStream
      },
      {
        name: 'products',
        path: '/products',
        component: PageProducts
      },
      {
        name: 'orders',
        path: '/orders',
        component: PageOrders
      }
    ]
});