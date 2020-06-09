import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {},
		address:{},
		hasLogin: false
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true
			state.userInfo.accessToken = provider.accessToken
			uni.setStorageSync( 'userInfo',provider)
		},
		updateAddress(state,provider){
			state.address.provinceId=provider.provinceId
			state.address.cityId=provider.cityId
			state.address.cityIndex=provider.cityIndex
			uni.setStorage({
				key: 'address',
				data: provider
			})
		},
		logout(state) {
			state.hasLogin = false
			state.userInfo = {
				accessToken:""
			}
			uni.removeStorage({
				key: 'userInfo'
			});
		}
	}
})

export default store
