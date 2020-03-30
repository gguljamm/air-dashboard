import Vue from 'vue';
import api from '../utils/api.js';
import format from '../utils/format.js';

const x = api;
x.install = function() {
  Vue.prototype.$apis = this;
};

Vue.use(x);

const y = format;
y.install = function() {
  Vue.prototype.$format = this;
};

Vue.use(y);
