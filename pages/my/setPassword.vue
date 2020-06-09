<template>
	<view>
		<view class="content">
			<text class="pageTitle">用手机号码注册</text>
			<view class="inputBox">
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">设置密码</view>
					<input class="uni-input" placeholder="请输入密码" maxlength="14" :password="showPassword1" v-model="password1" />
					<uni-icons :color="(!showPassword1 ? '#FC6B5A' : '#999999')" class="uni-icon"  size="20" type="eye-filled"   @click="changePassword1"  />
				</view>
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">重复密码</view>
					<input class="uni-input" placeholder="请再次输入密码" maxlength="14" :password="showPassword2" v-model="password2" />
					<uni-icons :color="(!showPassword2 ? '#FC6B5A' : '#999999')" class="uni-icon"  size="20" type="eye-filled"   @click="changePassword2"  />
				</view>
				<button type="warn" :disabled="password1.length>0&&password2.length>0?false:true" class="loginBtn" @click="register">注册</button>
				<view class="loginTips">注册即表示您已同意<text class="loginTipsText" @click="gotoAgreement1">《服务协议》</text>和<text @click="gotoAgreement2"
					 class="loginTipsText">《隐私协议》</text></view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPassword1: true,
				showPassword2: true,
				password1: '',
				password2: '',
				code: "",
				mobile: "",
				invitationCode:""
			}
		},
		onLoad(options) {
			let that = this;
			that.code = options.code;
			that.mobile = options.mobile;
			that.invitationCode = options.invitationCode;
		},
		methods: {
			changePassword1() {
				let that = this;
				that.showPassword1 = !that.showPassword1;
			},
			changePassword2() {
				let that = this;
				that.showPassword2 = !that.showPassword2;
			},
			register() {
				let that = this;
				if (!that.$utils.common.passwordTest.test(that.password1)) {
					uni.showToast({
						title: '密码需是8-14位数字或字母',
						icon: 'none'
					})
				} else if (that.password1 != that.password2) {
					uni.showToast({
						title: '两次密码不一致',
						icon: 'none'
					})
				} else {
					uni.showLoading({
						title:"请稍等..."
					})
					var param = {
						mobile: that.mobile,
						password: that.password1,
						repassword: that.password2,
						vcode: that.code,
						invitationCode:that.invitationCode
					}
					that.$api.bymobile(param).then(res => {
						uni.hideLoading();
						if (res.success) {
							uni.showToast({
								title: '注册成功',
								icon: 'success'
							})
							setTimeout(()=>{
								that.$Router.back(2);
							},2000)
						} else {
							uni.showToast({
								title: res.message,
								icon: "none"
							})
						}	
					})

				}
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

	.loginTips {
		font-size: 24rpx;
		color: #B8B8B8;
	}

	.loginTips .loginTipsText {
		color: #f44a33;
	}
</style>
