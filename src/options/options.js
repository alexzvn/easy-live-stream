import Vue from 'vue';
import Template from './App';
import vuetify from './../plugins/vuetify';
import router from './router';
import Application from './../plugins/app';

global.app = new Application();

Vue.prototype.$app = global.app;

global.app
  .token()
  .then(token => {
    if (token) {
      return global.app.user();
    }
  })
  .then(user => {
    global.user = user;

    // eslint-disable-next-line no-new
    new Vue({
      el: '#app',
      router,
      vuetify,
      render: h => h(Template),
    });
  });
