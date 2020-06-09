<template>
	<view>
		<view class="headerBox">
			<view class="searchInputBox">
				<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
				<input class="uni-input" placeholder="搜索客户手机号" confirm-type="search" @input="constantlySearch" @confirm="confirmSearch" maxlength="20" placeholder-style="font-size:26rpx;color:#B8B8B8;"
				 v-model="searchVal"  />
			</view>
			<view class="searchCancel" v-if="searchVal.length>0" @click="searchCancel">
				取消
			</view>
		</view>
		<view class="customerList" v-if="total!==0">
			<view class="customerItem" v-for="(item,index) in userList" :key="index"  @click="selectItem(item.id,item.nickname)">
				<image :src="item.headImgUrl" class="customerImg"></image>
				<view class="customerInfo">
					<view class="customerNickName">
						{{item.nickname}}
					</view>
					<view class="customerName" v-if="item.realName">
						姓名：{{item.realName}}
					</view>
				</view>
			</view>
			<uni-load-more iconType="snow" :status="loadStatus" />
		</view>
		<view class="noData" v-else>
			<image src="../../../static/images/noRecord.png" mode="" class="noDataImg"></image>
			<text class="noDataText">暂无数据</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadStatus: 'more',
				searchVal: '',
				canSearch: true,
				timer: null,
				userList:[],
				pageNum:1,
				total:"",
				pageSize:15
			}
		},
		created() {
			const that = this;
			that.appuserSearch(1);
		},
		
		methods: {
			appuserSearch(startPage){
				const that = this;
				let param = {
					username: that.searchVal,
					startPage:startPage,
					pageSize:that.pageSize
				}
				that.loadStatus="loading";
				that.$api.appuserSearch(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
						that.total=res.datas.total;
						for(var i in result){
							result[i].headImgUrl = result[i].headImgUrl?result[i].headImgUrl:'../../../static/images/defaultUserPic.png';
							result[i].nickname=result[i].nickname?result[i].nickname:result[i].username;
							that.userList.push(result[i]);
						}
						let total = res.datas.total;
						let totalPageNum =Math.ceil(total/that.pageSize);
						if(parseInt(totalPageNum)>parseInt(that.pageNum)){
							that.pageNum++;
							that.loadStatus="more";
						}
						else{
							that.loadStatus="noMore";
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			
			searchCancel() {
				this.searchVal = "";
				const that = this;
				that.clearList();
				that.appuserSearch(1);
				uni.hideKeyboard();
			},
			constantlySearch(e) {
				const that = this;
				clearTimeout(that.timer);
				that.timer = setTimeout(function() {
					// that.appuserSearch();
				}, 800);
			},
			confirmSearch(){
				const that = this;
				that.clearList();
				that.appuserSearch(1);
			},
			clearList(){
				const that = this;
				that.pageNum=1;
				that.total="";
				that.userList=[];
			},
			selectItem(id, name) {
				const that = this;
				var pages = getCurrentPages(),
					prevPage = null;
				if (pages.length > 1) {
					prevPage = pages[pages.length - 2];
				}
				if (prevPage) {
					// #ifdef H5
					prevPage.customerId = id;
					prevPage.customerName = name
					// #endif
					// #ifdef APP-PLUS || MP-WEIXIN
					prevPage.$vm.customerId = id;
					prevPage.$vm.customerName = name
					// #endif
				}
				setTimeout(() => {
					that.$Router.back(1);
				}, 100)
			}
		},
		onReachBottom() {
			const that = this;
			if(that.loadStatus=="noMore"){
				return;
			}
			else if(that.pageNum!=1){
				that.appuserSearch(that.pageNum);
			}
		},
	}
</script>

<style>
	.headerBox {
		position: fixed;
		top: 0;
		/* #ifdef H5 */
		top: calc(44px + env(safe-area-inset-top)) !important;
		/* #endif */
		left: 0;
		width: 100%;
		height: 88rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		display: flex;
		z-index: 100;
	}

	.headerBox .searchInputBox {
		margin-left: 0;
	}

	.customerList {
		padding: 108rpx 0 0 0;
	}

	.customerItem {
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		transition: all linear 0.1s;
	}

	.customerItem:active {
		background-color: #F7F7F7;
	}

	.customerImg {
		width: 84rpx;
		height: 84rpx;
		border-radius: 100%;
		margin-right: 20rpx;
	}

	.customerNickName {
		line-height: 42rpx;
		font-size: 30rpx;
		color: #222200;
	}

	.customerName {
		line-height: 32rpx;
		color: #B8B8B8;
		font-size: 26rpx;
	}
</style>
