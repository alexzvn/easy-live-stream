import Vue from 'vue';
import App from './App';
import vuetify from './../plugins/vuetify';
import router from './router';

global.browser = require('webextension-polyfill');


/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  vuetify,
  render: h => h(App),
});
