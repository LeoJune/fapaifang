import modules from './modules'
import Vue from 'vue'
import store from '../store'

//这里仅示范npm安装方式的引入，其它方式引入请看最上面【安装】部分
import Router from 'uni-simple-router'
Vue.use(Router)

//初始化
const router = new Router({
	encodeURI:false,  
	routes: [...modules] //路由表
});
uni.getStorage({
	key: 'userInfo',
	success: (res) => {
		console.log(res.data);
		store.commit('login', res.data)

	}
});
uni.getStorage({
	key: 'address',
	success: (res) => {
		store.commit('updateAddress', res.data)

	}
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if(to.name=="previewImage"){
		//图片预览
		next()
	}
	else{
		if (to.meta.needLogin) {
			if (store.state.hasLogin) {
				next()
			} else {
				let toQuery = getQuery(to.query);
				next({
					path: '/pages/my/login',
					query: {
						path:to.path+toQuery,
					},
					NAVTYPE: 'push'
				});
			}
		} else {
			next()
		}
	}
	

})
function getQuery(obj){
	if(JSON.stringify(obj) === '{}'){
		return "";
	}
	else{
		let arr="?";
		for(var key in obj){
			arr+=key+'='+obj[key]+'&'
		}
		arr=arr.substr(0, arr.length - 1);  
		return arr;
	}
}
// 全局路由后置守卫
router.afterEach((to, from) => {})
export default router;
