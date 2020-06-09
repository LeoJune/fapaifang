<template>
	<view>
		<view class="content">
			<text class="pageTitle">登录/注册</text>
			<view class="inputBox">
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">+86</view>
					<input class="uni-input" maxlength="11" placeholder="请输入手机号码/账号" type="number" v-model="loginInfo.mobile" />
					<uni-icons color="#999999" class="uni-icon"  size="18" type="clear"  v-if="loginInfo.mobile.length>0" @click="clearIcon" />
				</view>
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">密码</view>
					<input class="uni-input" placeholder="请输入密码" :password="showPassword" v-model="loginInfo.password" />
					<uni-icons :color="(!showPassword ? '#FC6B5A' : '#999999')" class="uni-icon"  size="20" type="eye-filled"   @click="changePassword"  />
				</view>
				<button type="warn" :disabled="loginInfo.mobile.length>0&&loginInfo.password.length>0?false:true" class="loginBtn" @click="toLogin">登
					录</button>
				<view class="forgetPwdBox">
					<view class="forgetPwd" @click="forgetPassword">忘记密码？</view>
					<view class="register" @click="register">新用户注册</view>
				</view>
			</view>
		<!-- 	<view class="wxLogin">
				<text class="wxLoginText">微信登录</text>
				<image class="image" src="../../static/images/weixinIcon.png"></image>
			</view> -->
			<view class="loginTips">点击按钮即表示您同意并愿意遵守法拍网<text @click="gotoAgreement1" class="loginTipsText">《服务协议》</text>和<text @click="gotoAgreement2" class="loginTipsText">《隐私协议》</text></view>

		</view>
		<image class="logo" src="../../static/images/logo.png"></image>
	</view>

</template>

<script>
	import {
	    mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				showPassword: true,
				loginInfo: {
					mobile: "",
					password: ""
				},
				path:"",
			}
		},
		onLoad(options) {
			let that = this;
			that.path = that.$Route.query.path;
		},
		methods: {
			changePassword() {
				let that = this;
				that.showPassword = !that.showPassword;
			},
			clearIcon() {
				let that = this;
				that.loginInfo.mobile = "";
			},
			toLogin() {
				let that = this;
				let mobile = that.loginInfo.mobile;
				let password = that.loginInfo.password;
				if (!that.$utils.common.phoneTest.test(mobile)) {
					uni.showToast({
						title: "请输入正确的手机号",
						icon: "none"
					})
				} else if (password.length < 6) {
					uni.showToast({
						title: "密码需六位以上字符",
						icon: "none"
					})
				} else {
						uni.showLoading({
							title:"登录中..."
						})
						that.$api.login(that.loginInfo).then(res => {
							uni.hideLoading();
							if(res.success){
								var storageData={
									accessToken:res.datas.accessToken
								}
								that.login(storageData);
								uni.showToast({
									title: "登录成功",
									icon: "success"
								})
								setTimeout(()=>{
									that.goback();
								},400)
								
							}
							else{
								uni.showToast({
									title: res.message,
									icon: "none"
								})
							}
							
						})
					
				}
			},
			goback(){
				const that = this;
				if(that.path){
						var path = decodeURIComponent(that.path);
						this.$Router.replace({
							path:decodeURIComponent(that.path).split("?")[0],
							query:that.$utils.getParameter(path)
						})
				}
				else{
					uni.switchTab({
					    url: '/pages/my/index',
					    success: function(e) {
					       // #ifdef H5
					       var pages = getCurrentPages(); //当前页
					       var beforePage = pages[pages.length - 2]; //上个页面
					       beforePage.reload()
					       // #endif
					       // #ifndef H5
					       var page = getCurrentPages()[0]
					       if (page == undefined || page == null) return;
					       page.onLoad()
					       // #endif
					    }
					});
					// this.$Router.pushTab({
					// 	path:"/pages/my/index"
					// })
				}
			},
			forgetPassword(){
				let that = this;
				that.$Router.push({
					path:"/pages/my/forgetpwd"
				})
			},
			gotoAgreement1(){
				let that = this;
				that.$Router.push({
					path:"/pages/my/agreement/agreement1"
				})
			},	
			gotoAgreement2(){
				let that = this;
				that.$Router.push({
					path:"/pages/my/agreement/agreement2"
				})
			},	
			register(){
				let that = this;
				that.$Router.push({
					path:"/pages/my/register"
				})
			},
			  ...mapMutations(['login'])
		}
	}
</script>

<style>
	.content {
		padding: 20rpx 50rpx;
	}

	.pageTitle {
		font-size: 60rpx;
		color: #222222;
		display: block;
		margin-top: 30rpx;
	}

	.inputItem {
		display: flex;
		width: 100%;
		height: 92rpx;
		background: #F7F7F7;
		flex-direction: row;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
	}

	.inputItem .uni-input {
		flex: 1;
		height: 92rpx;
		font-size: 32rpx;
	}

	.inputLabel {
		width: 156rpx;
		line-height: 92rpx;
		padding-left: 20rpx;
		font-size: 32rpx;
	}

	.uni-icon {
		font-family: uniicons;
		font-size: 20px;
		font-weight: normal;
		font-style: normal;
		width: 20px;
		height: 92rpx;
		line-height: 92rpx;
		color: #999999;
		padding-right: 20rpx;
	}

	.uni-eye-active {
		color: #FC6B5A;
	}

	.inputBox {
		padding: 70rpx 0;
	}

	.loginBtn {
		font-size: 32rpx;
		line-height: 92rpx;
		margin-bottom: 30rpx;
	}

	.forgetPwdBox {
		height: 36rpx;
	}

	.forgetPwdBox .forgetPwd {
		font-size: 26rpx;
		color: #888888;
		float: left;
	}

	.forgetPwdBox .register {
		font-size: 26rpx;
		color: #CD282F;
		float: right;
	}

	.wxLogin {
		width: 150rpx;
		height: 175rpx;
		display: block;
		margin: 13% auto 0 auto;
		text-align: center;
	}

	.wxLogin .wxLoginText {
		text-align: center;
		display: block;
		font-size: 32rpx;
		color: #555555;
		line-height: 45rpx;
		letter-spacing: 5rpx;
	}

	.wxLogin .image {
		width: 108rpx;
		height: 108rpx;
		margin-top: 20rpx;
	}

	.loginTips {
		padding: 0 105rpx;
		margin-top: 100rpx;
		font-size: 24rpx;
		color: #B8B8B8;
		text-align: center;
		line-height: 32rpx;
	}

	.loginTips  .loginTipsText {
		color: #b9ccde;
	}

	.logo {
		position: fixed;
		width: 340rpx;
		height: 67rpx;
		left: 205rpx;
		bottom: 21rpx;
	}
</style>
