<template>
	<view>
		<view class="content">
			<text class="pageTitle">找回密码</text>
			<view class="inputBox">
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">+86</view>
					<input class="uni-input" maxlength="11" placeholder="请输入手机号码" type="number" v-model="mobile" />
					<uni-icons color="#999999" class="uni-icon"  size="18" type="clear"   v-if="mobile.length>0" @click="clearIcon" />
				</view>
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">验证码</view>
					<input class="uni-input" placeholder="请输入验证码" maxlength="4" type="number" v-model="code" />
					<button class="mini-btn getCode" v-if="!hasSendCode" :disabled="mobile.length==11?false:true" type="warn" size="mini"
					 @click="getCode">获取验证码</button>
					<button class="mini-btn getCode" disabled="true" type="warn" size="mini" v-else>重新获取({{codeSecond}})</button>
				</view>
				<button type="warn" :disabled="mobile.length==11&&code.length==4?false:true" class="loginBtn" @click="next">下一步</button>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasSendCode: false,
				codeSecond: 60,
				mobile: '',
				code: ''
			}
		},
		methods: {
			clearIcon() {
				let that = this;
				that.mobile = "";
			},
			getCode() {
				const that = this;
				uni.showLoading({
					title: "请稍等..."
				})
				that.$api.sendvcode({
					"mobile": that.mobile,
					"sendType": 2
				}).then(res => {
					uni.hideLoading();
					if (res.success) {
						that.timeCount();
						uni.showToast({
							title: "验证码发送成功",
							icon: "none"
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})

			},
			timeCount() {
				const that = this;
				that.hasSendCode = true;
				var interval = setInterval(() => {
					--that.codeSecond
				}, 1000)
				setTimeout(() => {
					clearInterval(interval)
					that.hasSendCode = false;
					that.codeSecond = 60;
				}, 60000)
			},
			next() {
				let that = this;
				that.$Router.push({
					path:"/pages/my/forgetpwd2",
					query:{
						code:that.code,
						mobile:that.mobile
					}
				})
			}
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

	.getCode {
		height: 60rpx;
		border-radius: 30rpx;
		line-height: 60rpx;
		margin-top: 16rpx;
	}
</style>
