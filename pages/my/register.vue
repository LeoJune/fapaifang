<template>
	<view>
		<view class="content">
			<text class="pageTitle">用手机号码注册</text>
			<view class="inputBox">
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">+86</view>
					<input class="uni-input" maxlength="11" placeholder="请输入手机号码" type="number" v-model="mobile" />
					<uni-icons color="#999999" class="uni-icon"  size="18" type="clear"   v-if="mobile.length>0"  @click="clearIcon" />
				</view>
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">验证码</view>
					<input class="uni-input" placeholder="请输入验证码" maxlength="4" type="number" v-model="code" />
					<button class="mini-btn getCode" v-if="!hasSendCode" :disabled="mobile.length==11?false:true" type="warn" size="mini"
					 @click="getCode">获取验证码</button>
					<button class="mini-btn getCode" disabled="true" type="warn" size="mini" v-else>重新获取({{codeSecond}})</button>
				</view>
				<view class="uni-input-wrapper inputItem">
					<view class="inputLabel">推荐码</view>
					<input class="uni-input" maxlength="6" placeholder="请输入推荐码(选填)" type="number" v-model="invitationCode" />
				</view>
				<button type="warn" :disabled="mobile.length==11&&code.length==4?false:true" class="loginBtn" @click="next">下一步</button>
				<view class="loginTips">点击下一步即表示您已同意<text class="loginTipsText" @click="gotoAgreement1">《服务协议》</text>和<text @click="gotoAgreement2"  class="loginTipsText">《隐私协议》</text></view>
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
				code: '',
				invitationCode:""
			}
		},
		methods: {
			clearIcon() {
				const that = this;
				that.mobile = "";
			},
			getCode() {
				const that = this;
				uni.showLoading({
					title:"请稍等..."
				})
				that.$api.isphonecanuse({
					"mobile":that.mobile
				}).then(res=>{
					if(res.success){
						that.$api.sendvcode({
							"mobile":that.mobile,
							"sendType":1
						}).then(res2=>{
							uni.hideLoading();
							if(res2.success){
								that.timeCount();
								uni.showToast({
									title: "验证码发送成功",
									icon: "none"
								})
							}
							else{
								uni.showToast({
									title: res2.message,
									icon: "none"
								})
							}
						})
					}
					else{
						uni.hideLoading();
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
				
			},
			timeCount(){
				const that = this;
				that.hasSendCode = true;
				var interval = setInterval(() => {
					--that.codeSecond
				}, 1000)
				setTimeout(() => {
					clearInterval(interval)
					that.hasSendCode = false;
					that.codeSecond=60;
				}, 60000)
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
			next(){
				const that = this;
				that.$Router.push({
					path:"/pages/my/setPassword",
					query:{
						code:that.code,
						mobile:that.mobile,
						invitationCode:that.invitationCode
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
