import Vue from 'vue';
import Template from './App';
import vuetify from './../plugins/vuetify';
import router from './router';
import Application from './../plugins/app';

global.app = new Application();

app.user().then(user => {
  global.user = user;

  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    router,
    vuetify,
    render: h => h(Template),
  });
});
