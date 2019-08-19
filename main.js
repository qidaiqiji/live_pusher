import Vue from 'vue'
import App from './App'

import api from './common/index.js';
import http from './common/http.js';
import store from './store'

Vue.prototype.$api = api;
Vue.prototype.$http = http;
Vue.prototype.$store = store;

Vue.config.productionTip = false;

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
