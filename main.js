import Vue from 'vue'
import App from './App'
import request from './common/request.js'
import api from './api'
import utils from './utils/utils'
import store from './store'
import router from './router'
import { RouterMount } from 'uni-simple-router'

Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$api = api
Vue.prototype.$utils = utils

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,'#app');
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
