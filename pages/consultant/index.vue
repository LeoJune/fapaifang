<template>
	<view class="container">
		<view class="status">
			<view class="top-view"></view>
		</view>
		<view class="content">
			<view class="consultHead">
				咨询<text class="totalNum"></text>
			</view>
			<view class="itemList" v-if="chatList.length>0">
				<view class="item" v-for="(item,index) in chatList" :key="index" @click="gotoChart(item.myUserId,item.chatUserId)">
					<view class="picBox">
						<image :src="item.chatUserHeadImg"  class="itemPic" mode="aspectFill"></image>
						<!-- <view class="badgeNum">
							123
						</view> -->
					</view>

					<view class="nameAndInfo">
						<view class="friName nowrap">
							{{item.chatUserNickName}}
						</view>
						<view class="lastMsg nowrap">
							{{item.lastestChat.chatMsg}}
						</view>
					</view>
				</view>
			</view>
			<view class="noData" v-else>
				<image src="../../static/images/noRecord.png" mode="" class="noDataImg"></image>
				<text class="noDataText" v-if="hasLogin">暂无咨询</text>
				<text class="noDataText" v-else>请先登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: mapState(['hasLogin', 'userInfo']),
		data() {
			return {
				chatList: [],
				isLogin: false,
				isFresh:false
			}
		},
		onShow() {
			console.log("onShow");
			var accessToken = uni.getStorageSync('userInfo').accessToken;
			if (accessToken) {
				this.getChatList();
				this.isLogin = true;
			} else {
			
			}
		},
		onTabItemTap(){
			var accessToken = uni.getStorageSync('userInfo').accessToken;
			if (accessToken) {
				this.getChatList();
				this.isLogin = true;
			} 
		},
		methods: {
			gotoChart(myId,toId) {
				console.log(myId+"   "+toId);
				const that = this;
				that.$Router.push({
					path: "/pages/consultant/charRoom",
					query:{
						myUserId:myId,
						chatUserId:toId
					}
				})
			},
			getChatList() {
				const that = this;
				that.$api.mychatList({}).then(res => {
					if (res.success) {
						if (that.isFresh) {
							setTimeout(() => {
								uni.stopPullDownRefresh();
							}, 1000)
							that.isFresh = false;
						}
						let result = res.datas.rows;
						for (var i in result) {
							result[i].chatUserHeadImg = result[i].chatUserHeadImg ? result[i].chatUserHeadImg :
								"../../static/images/defaultUserPic.png";
						}
						that.chatList = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			onPullDownRefresh: function() {
				const that = this;
				that.getChatList();
				that.isFresh = true;
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 10000)
			}
		}
	}
</script>

<style>
	.consultHead {
		width: 100%;
		height: 140rpx;
		background-color: #FFFFFF;
		padding: 30rpx;
		line-height: 80rpx;
		font-size: 56rpx;
		box-sizing: border-box;
	}

	.totalNum {
		margin-left: 10rpx;
		font-size: 32rpx;
	}

	.itemList {}

	.item {
		height: 120rpx;
		padding: 30rpx;
		transition: all linear .1s;
		display: flex;
		align-items: center;

	}

	.item:active {
		background-color: #F7F7F7;
	}

	.picBox {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		border: 1rpx solid #F7F7F7;
	}

	.itemPic {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
	}

	.badgeNum {
		position: absolute;
		right: -30rpx;
		top: -18rpx;
		display: inline-block;
		line-height: 36rpx;
		color: #FFFFFF;
		font-size: 26rpx;
		padding: 0 10rpx;
		border-radius: 18rpx;
		background-color: #CD282F;
	}

	.nameAndInfo {
		width: 526rpx;
		display: flex;
		flex-direction: column;
		margin-left: 24rpx;
	}

	.friName {
		line-height: 50rpx;
		padding-top: 10rpx;
		font-size: 36rpx;
	}

	.lastMsg {
		color: #888888;
		font-size: 30rpx;
		line-height: 40rpx;
		margin-top: 14rpx;
	}
</style>
