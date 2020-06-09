<template>
	<view>
		<view class="userInfoBox">
			<image :src="userData.headImgUrl" mode="aspectFill" class="userPicImg"></image>
			<view class="userName">
				{{userData.nickName}}
			</view>
			<view class="detailed" @click="gotoDetailed">
				<image src="../../../../static/images/dialist.png" class="detailedIcon" mode="aspectFill"></image>
				<text class="detailedLabel">激励明细</text>
			</view>
			<view class="distractionNum">
				<image src="../../../../static/images/dia.png" mode="aspectFill" class="distractionIcon"></image>
				<text class="nums">{{availNum}}</text>
				<text class="distLabel">钻</text>
			</view>
			<view class="disInputBox">
				<view class="disInputLabel">
					奖励钻值
				</view>
				<input type="number" class="uni-input" value="" placeholder="请输入" placeholder-style="color:#B8B8B8" v-model="num" maxlength="8" />
			</view>
			<button type="warn" :disabled="num.length==0" class="subBtn" @click="sub">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:"",
				num:"",
				userData:"",
				availNum:""
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.getUserInfo();
			this.availableqtybyempid();
		},
		methods: {
			getUserInfo() {
				const that = this;
				let param={
					id:that.id
				}
				that.$api.userinfoByid(param).then(res => {
					if (res.success) {
						let result = res.datas;
						result.headImgUrl = result.headImgUrl ? result.headImgUrl : '../../../../static/images/defaultUserPic.png';
						result.nickName = result.nickName ? result.nickName : result.mobile;
						that.userData = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			availableqtybyempid(){
				const that = this;
				that.$api.availableqtybyempid({
					id:that.id
				}).then(res => {
					if (res.success) {
						that.availNum=res.datas;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			sub(){
				const that = this;
				let numText=/^[0-9]*[1-9][0-9]*$/;
				console.log(that.num);
				if(!numText.test(that.num)){
					uni.showToast({
						title:"请输入整数",
						icon:"none"
					})
				}
				else{
					that.$api.givediamond({
						employeeId:that.id,
						"qty":that.num
					}).then(res => {
						if (res.success) {
							uni.showToast({
								title:"分配成功",
							})
							setTimeout(()=>{
								that.num="";
								that.availableqtybyempid();	
							},1000)
						} else {
							uni.showToast({
								title: res.message,
								icon: "none"
							})
						}
					})
				}
			},
			gotoDetailed(){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/staff/detailed",
					query:{
						id:that.id
					}
				})
			}
		}
	}
</script>

<style>
	.userInfoBox{
		padding: 50rpx;
		text-align: center;
	}
	.userPicImg{
		width: 150rpx;
		height: 150rpx;
		border-radius: 100%;
		display: inline-block;
	}
	.userName{
		line-height: 50rpx;
		font-size: 36rpx;
		margin-top: 14rpx;
	}
	.detailed{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40rpx;
		margin-top: 18rpx;
	}
	.detailedIcon{
		width: 40rpx;
		height: 40rpx;
		margin-right: 8rpx;
	}
	.detailedLabel{
		font-size: 24rpx;
		color: #888888;
	}
	.distractionNum{
		height: 76rpx;
		display: inline-block;
		color: #FFA800;
		background-color: #FFFBE8;
		border-radius: 38rpx;
		margin-top: 50rpx;
		padding: 0 50rpx;
	}
	.distractionIcon{
		width: 40rpx;
		height: 37rpx;
		display: inline-block;
	}
	.distractionNum .nums{
		font-size: 48rpx;
		line-height: 76rpx;
		display: inline-block;
		margin-left: 12rpx;
		margin-right: 10rpx;
	}
	.distLabel{
		font-size: 28rpx;
		display: inline-block;
		vertical-align: middle;
		margin-top: -10rpx;
	}
	.disInputBox{
		height: 92rpx;
		display: flex;
		align-items: center;
		background-color: #F7F7F7;
		border-radius: 10rpx;
		margin-top: 60rpx;
	}
	.disInputLabel{
		font-size: 32rpx;
		width: 168rpx;
		text-align: center;
	}
	.disInputBox .uni-input{
		flex: 1;
		padding: 0 10rpx;
		text-align: left;
		font-size: 32rpx;
	}
	.subBtn{
		margin-top: 40rpx;
		font-size: 32rpx;
		height: 92rpx;
		line-height: 92rpx;
	}
</style>
