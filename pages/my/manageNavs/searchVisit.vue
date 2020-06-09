<template>
	<view>
		<view class="searchBox">
			<view class="searchInputBox">
				<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
				<input class="uni-input" placeholder="搜索客户手机号、标的物名称或业务员" confirm-type="search" placeholder-style="font-size:26rpx;color:#B8B8B8;"
				 v-model="searchVal" @confirm="confirmSearch" @input="realtimeSearch" />
			</view>

		</view>
		<view class="content">
			<view class="visitBox" v-if="total!==0">
				<view class="recordItem" v-for="(item,index) in list" :key="index" @click="selected(item.id,item.customerName,item.customerMobile,item.houseName,item.employeeName,item.paimaiId,item.houseSource,item.customerId)">
					<view class="recordPersonBox">
						<view class="recordPersonInfo">
							<image class="recordPersonPic" mode="aspectFill"  :src="item.headImgUrl"></image>
							<view class="recordPersonInfoCont">
								<view class="recordPersonName">{{item.employeeName}}的客户</view>
								<view class="recordTime">
									{{item.createTime}}
								</view>
							</view>
						</view>
						<view class="nowStatus">选择</view>
					</view>
					<view class="recordInfoBox">
						<view class="recordInfoItem">
							客户名称：{{item.customerName}} {{item.customerMobile}}
						</view>
						<view class="recordInfoItem">
							意向房源：{{item.houseName}}
						</view>
						<view class="recordInfoItem">
							业务员：{{item.employeeName}}
						</view>
					</view>
				</view>
				<uni-load-more iconType="snow" :status="loadStatus" />
			</view>
			<view class="noData" v-else>
				<image src="../../../static/images/noRecord.png" mode="" class="noDataImg"></image>
				<text class="noDataText">暂无记录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchVal: "",
				pageSize: 10,
				loadStatus: 'more',
				pageNum: 1,
				total: "",
				list: []
			}
		},
		created() {
			let that = this;
			that.getList(1);
		},

		onReachBottom() {
			const that = this;
			console.log("onReachBottom");
			if (that.loadStatus == "noMore") {
				return;
			} else if (that.pageNum != 1) {
				that.getList(that.pageNum);
			}
		},
		methods: {

			getList(startPage) {
				const that = this;
				let param = {
					dynamicParam: that.searchVal,
					startPage: startPage,
					pageSize: that.pageSize
				}
				that.loadStatus = "loading";
				that.$api.housevisitList(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
						for(var i in result){
							result[i].headImgUrl = result[i].headImgUrl?result[i].headImgUrl:'../../../../static/images/defaultUserPic.png';
							that.list.push(result[i]);
						}
						let total = res.datas.total;
						that.total = total;

						let totalPageNum = Math.ceil(total / that.pageSize);
						if (parseInt(totalPageNum) > parseInt(that.pageNum)) {
							that.pageNum++;
							that.loadStatus = "more";
						} else {
							that.loadStatus = "noMore";
						}

					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			realtimeSearch(e) {
				const that = this;
				clearTimeout(that.timer);
				that.timer = setTimeout(function() {
					that.clearList();
					that.getList(that.pageNum);
				}, 800);
			},
			confirmSearch() {
				const that = this;
				that.clearList();
				that.getList(that.pageNum);
				uni.hideKeyboard();
			},
			clearList() {
				const that = this;
				that.pageNum = 1;
				that.total = "";
				that.list = [];
			},
			selected(id,customerName,customerMobile,houseName,employeeName,paimaiId,houseSource,appUserId) {
				const that = this;
				var pages = getCurrentPages(),
					prevPage = null;
				if (pages.length > 1) {
					prevPage = pages[pages.length - 2];
				}
				if (prevPage) {
					// #ifdef H5
					prevPage.oriVisitId = id;
					prevPage.customerName = customerName;
					prevPage.customerMobile = customerMobile;
					prevPage.houseName = houseName;
					prevPage.employeeName = employeeName;
					prevPage.paimaiId=paimaiId;
					prevPage.houseSource=houseSource;
					prevPage.appUserId=appUserId;
					// #endif
					// #ifdef APP-PLUS || MP-WEIXIN
					prevPage.$vm.oriVisitId = id;
					prevPage.$vm.customerName = customerName;
					prevPage.$vm.customerMobile = customerMobile;
					prevPage.$vm.houseName = houseName;
					prevPage.$vm.employeeName = employeeName;
					prevPage.$vm.paimaiId=paimaiId;
					prevPage.$vm.houseSource=houseSource;
					prevPage.$vm.appUserId=appUserId;
					// #endif
				}
				setTimeout(() => {
					that.$Router.back(1);
				}, 100)
			},
		}
	}
</script>

<style>
	page {
		background-color: #F7F7F7;
	}

	.searchBox {
		padding: 10rpx 30rpx;
		display: flex;
		align-items: center;
		position: fixed;
		width: 100%;
		height: 100rpx;
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		/* #ifdef H5 */
		top: calc(44px + env(safe-area-inset-top));
		/* #endif */
		background-color: #FFFFFF;
		z-index: 999;
		box-sizing: border-box;
		box-shadow: 0 9px 11px 0 rgba(229, 229, 229, 0.60);
	}


	.searchInputBox {
		margin-left: 0;
	}

	.content {
		padding-top: 120rpx;
	}

	.visitBox {}

	.recordItem {
		padding: 30rpx;
	}
</style>
