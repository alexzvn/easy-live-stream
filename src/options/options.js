import Vue from 'vue';
import App from './App';
import Vuetify from 'vuetify/lib';

global.browser = require('webextension-polyfill');

Vue.use(Vuetify);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  render: h => h(App),
});
