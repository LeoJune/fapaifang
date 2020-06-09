
// import store from '../store'
const request = {}
let accessToken ="";


request.globalRequest = (url, method, data) => {
	accessToken =uni.getStorageSync('userInfo').accessToken;
	return uni.request({
		url:  url,
		method,
		data:{
			"param":data
		},
		dataType: 'json',
		header: {
				'AccessToken': accessToken,
				'Accept': 'application/json',
				'Content-Type': 'application/json', //自定义请求头信息
			}
	}).then(res => {
		if (res[1].statusCode && res[1].statusCode == 200) {
			return res[1].data
		} else {
			throw res[1]
		}
	}).catch(parmas => {
		switch (parmas.statusCode) {
			case 401:
				uni.clearStorageSync()
				uni.showToast({
					title: "服务器异常，请稍后再试",
					icon: 'none'
				})
				break
			default:
				uni.showToast({
					title: "服务器异常，请稍后再试",
					icon: 'none'
				})
				return Promise.reject()
				break
		}
	})
}


export default request
