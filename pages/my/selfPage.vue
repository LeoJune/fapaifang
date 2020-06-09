<template>
	<view v-if="userData">
		<view class="userBox">
			<image :src="userData.headImgUrl" mode="aspectFill" class="blurBg"></image>
			<view class="userBoxShadow"></view>
			<view class="userInfoBox">
				<image class="userPhoto" :src="userData.headImgUrl"></image>
				<view class="userName nowrap">
					{{userData.nickName}}
				</view>
				<view class="userInfoBtn" @click="edit">
					<text class="editIcon"></text>编辑资料
				</view>
			</view>
		</view>
		<view :class="{'navBox':true,'navFix':scrollTop>scrolltag}">
			<view :class="{'navItem':true,'active':current==0}" @click="changeNav(0)">收藏（{{total1}}）</view>
			<view :class="{'navItem':true,'active':current==1}" @click="changeNav(1)">最近浏览（{{houseList2.length}}）</view>
		</view>
		<view class="navBox" v-if="scrollTop>scrolltag">

		</view>
		<swiper class="swiper" :current="current" :style="'height:'+swiperHeight+'px'" @change='swiperChange'>
			<swiper-item class="swiper-item">
				<view class="itemList itemList1" >
					<block v-if="total1>0">
					<view class="goodsItem" v-for="(item,index) in houseList1" :key="index" @click="itemTap(item.paimaiId,item.houseSource)">
						<view class="goodsPic">
							<text class="goodsTag">{{item.paimaiTimesText}}</text>
							<image class="goodsImage" :src="item.productImage" mode="aspectFill"></image>
						</view>
						<view class="goodsInfo">
							<view class="goodsName">{{item.title}}</view>
							<view class="goodsAddress nowrap" v-if="item.paimaiStatus==1">{{item.accessNum}}次围观/{{item.title}}</view>
							<view class="goodsAddress nowrap" v-else>{{item.bidCount}}次出价 / {{item.countyName}}</view>
							<view class="goodsPrice"><text class="priceLabel">当前价</text><text class="priceNum">{{item.currentPriceText}}万</text>
								<text v-if="item.discount!=10" class="discount">{{item.discount}}折</text></view>
							<view class="goodsStatus goodsStatus1" v-if="item.paimaiStatus==1"><text class="statusName">未开始</text><text
								 class="goodsTime">{{item.timeText}}开始</text></view>
							<view class="goodsStatus goodsStatus2" v-else-if="item.paimaiStatus==2"><text class="statusName">拍卖中</text><text
								 class="goodsTime">{{item.timeText}}开始</text></view>
							<view class="goodsStatus goodsStatus3" v-else><text class="statusName">已结束</text><text class="goodsTime">{{item.timeText}}结束</text></view>
						</view>
					</view>
					<uni-load-more iconType="snow" :status="loadStatus1" />
					</block>
					<view class="noData" v-else>
						<image src="../../static/images/noRecord.png" mode="" class="noDataImg"></image>
						<text class="noDataText">暂无数据</text>
					</view>
				</view>
				
			</swiper-item>
			<swiper-item class="swiper-item">
				<view class="itemList itemList2" v-if="houseList2.length!==0">
					<view class="goodsItem" v-for="(item,index) in houseList2" :key="index"  @click="itemTap(item.paimaiId,item.houseSource)">
						<view class="goodsPic">
							<text class="goodsTag">{{item.paimaiTimesText}}</text>
							<image class="goodsImage" :src="item.productImage" mode="aspectFill"></image>
						</view>
						<view class="goodsInfo">
							<view class="goodsName">{{item.title}}</view>
							<view class="goodsAddress nowrap" v-if="item.paimaiStatus==1">{{item.accessNum}}次围观/{{item.title}}</view>
							<view class="goodsAddress nowrap" v-else>{{item.bidCount}}次出价 / {{item.countyName}}</view>
							<view class="goodsPrice"><text class="priceLabel">当前价</text><text class="priceNum">{{item.currentPriceText}}万</text>
							<text  v-if="item.discount!=10" class="discount">{{item.discount}}折</text></view>
							<view class="goodsStatus goodsStatus1" v-if="item.paimaiStatus==1"><text class="statusName">未开始</text><text class="goodsTime">{{item.timeText}}开始</text></view>
							<view class="goodsStatus goodsStatus2" v-else-if="item.paimaiStatus==2"><text class="statusName">拍卖中</text><text class="goodsTime">{{item.timeText}}开始</text></view>
							<view class="goodsStatus goodsStatus3" v-else><text class="statusName">已结束</text><text class="goodsTime">{{item.timeText}}结束</text></view>
						</view>
					</view>
					<uni-load-more iconType="snow" :status="loadStatus2" />
				</view>
				<view class="noData" v-else>
					<image src="../../static/images/noRecord.png" mode="" class="noDataImg"></image>
					<text class="noDataText">暂无数据</text>
				</view>
			</swiper-item>
		</swiper>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				swiperHeight: 0,
				scrollTop: 0,
				scrolltag: 0,
				list1Height: 0,
				list2Height: 0,
				userData: null,
				houseList1: [],
				houseList2: [],
				loadStatus1: 'more',
				pageNum1: 1,
				total1: '',
				loadStatus2: 'noMore',
				pageNum2: 1,
				total2: '',
				pageSize: 10,
			}
		},
		onLoad() {
			const that = this;
			that.getUserInfo();
			that.getCollectList(1);
			that.getBrowsesList(1);
		},
		onReady() {
			const that = this;
			setTimeout(() => {
				that.$utils.getBoxheight(`.itemList1`, (rects) => {
					that.list1Height = rects[0].height;
					that.swiperHeight = rects[0].height;
				});
				that.$utils.getBoxheight(`.itemList2`, (rects) => {
					that.list2Height = rects[0].height;
				});
				that.$utils.getBoxheight(`.userBox`, (rects) => {
					that.scrolltag = rects[0].height - 20;
				});
			}, 200)

		},
		onReachBottom() {
			const that = this;
			console.log("onReachBottom");
			if (that.current == 0) {
				if (that.loadStatus1 == "noMore") {
					return;
				} else if (that.pageNum1 != 1) {
					that.getCollectList(that.pageNum1);
				}
			} else {
				// if (that.loadStatus2 == "noMore") {
				// 	return;
				// } else if (that.pageNum2 != 1) {
				// 	that.getBrowsesList(that.pageNum2);
				// }
			}

		},
		methods: {
			getUserInfo() {
				const that = this;
				that.$api.userinfoQuery({}).then(res => {
					if (res.success) {
						let result = res.datas;
						result.headImgUrl = result.headImgUrl ? result.headImgUrl : '../../static/images/defaultUserPic.png';
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
			getCollectList(pageNo) {
				const that = this;
				let param = {
					pageNo: pageNo
				}
				that.loadStatus1 = "loading";
				that.$api.collectList(param).then(res => {
					if (res.success) {

						let result = res.datas.list;
						for (var i in result) {
							result[i].currentPriceText = (result[i].currentPrice * 0.0001).toFixed(2);
							if (result[i].paimaiTimes == 1) {
								result[i].paimaiTimesText = "一拍";
							} else if (result[i].paimaiTimes == 2) {
								result[i].paimaiTimesText = "二拍";
							} else if (result[i].paimaiTimes == 4) {
								result[i].paimaiTimesText = "变卖";
							} else if (result[i].paimaiTimes == 5) {
								result[i].paimaiTimesText = "重新拍卖";
							}
							var nowTime = new Date().getTime();
							var startTime = new Date(result[i].startTime).getTime();
							var endTime = new Date(result[i].endTime).getTime();
							if (startTime > nowTime) {
								result[i].paimaiStatus = 1; //未开始	
								result[i].timeText = that.$utils.formatTime(startTime, 'MM月DD日 hh:mm');
							} else if (nowTime >= startTime && nowTime <= endTime) {
								result[i].paimaiStatus = 2; //拍卖中
								result[i].timeText = that.$utils.timeCount(endTime);
							} else {
								result[i].paimaiStatus = 3; //已结束
								result[i].timeText = that.$utils.formatTime(endTime, 'YYYY年MM月DD日');
							}
							that.houseList1.push(result[i])
						}
						let total = res.datas.totalCount;
						that.total1 = total;
						let totalPageNum = Math.ceil(total / that.pageSize);
						if (parseInt(totalPageNum) > parseInt(that.pageNum)) {
							that.pageNum1++;
							that.loadStatus1 = "more";
						} else {
							that.loadStatus1 = "noMore";
						}

					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			getBrowsesList(pageNo) {
				const that = this;
				let param = {}
				that.$api.browsesList(param).then(res => {
					if (res.success) {
						let result = res.datas;
						that.total = res.datas.total;
						for (var i in result) {
							result[i].currentPriceText = (result[i].currentPrice * 0.0001).toFixed(2);
							if (result[i].paimaiTimes == 1) {
								result[i].paimaiTimesText = "一拍";
							} else if (result[i].paimaiTimes == 2) {
								result[i].paimaiTimesText = "二拍";
							} else if (result[i].paimaiTimes == 4) {
								result[i].paimaiTimesText = "变卖";
							} else if (result[i].paimaiTimes == 5) {
								result[i].paimaiTimesText = "重新拍卖";
							}
							var nowTime = new Date().getTime();
							var startTime = new Date(result[i].startTime).getTime();
							var endTime = new Date(result[i].endTime).getTime();
							if (startTime > nowTime) {
								result[i].paimaiStatus = 1; //未开始	
								result[i].timeText = that.$utils.formatTime(startTime, 'MM月DD日 hh:mm');
							} else if (nowTime >= startTime && nowTime <= endTime) {
								result[i].paimaiStatus = 2; //拍卖中
								result[i].timeText = that.$utils.timeCount(endTime);
							} else {
								result[i].paimaiStatus = 3; //已结束
								result[i].timeText = that.$utils.formatTime(endTime, 'YYYY年MM月DD日');
							}
							that.houseList2.push(result[i])
						}
						// let total = res.datas.totalCount;
						// that.total2 = total;
						// that.loadStatus2 = "noMore";
						// if (parseInt(totalPageNum) > parseInt(that.pageNum)) {
						// 	that.pageNum2++;
						// 	that.loadStatus2 = "more";
						// } else {
						// 	that.loadStatus2 = "noMore";
						// }

					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			itemTap(paimaiId,houseSource) {
				this.$Router.push({
					path: "/pages/home/goodsDetail",
					query:{
						paimaiId:paimaiId,
						houseSource:houseSource
					}
				})
			},
			edit() {
				const that = this;
				uni.navigateTo({
					url: "./edit"
				})
			},
			onPageScroll(e) {
				const that = this;
				that.scrollTop = e.scrollTop;
			},
			changeNav(current) {
				const that = this;
				that.current = current;
			},
			swiperChange(e) {
				const that = this;
				that.current = e.detail.current;
				if (e.detail.current == 0) {
					that.swiperHeight = that.list1Height;
				} else {
					that.swiperHeight = that.list2Height;
				}
			}
		},

	}
</script>

<style>
	.userBox {
		width: 100%;
		height: 420rpx;
		background: url(../../static/images/userTopBg.png) no-repeat center;
		background-size: cover;
		position: relative;
		overflow: hidden;
	}

	.blurBg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transform: scale(1.2);
		filter: blur(10px);
		-webkit-filter: blur(10px);
		z-index: 2;
		overflow: hidden;
	}

	.userBoxShadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
		z-index: 3;
	}

	.userInfoBox {
		position: absolute;
		width: 100%;
		top: 70rpx;
		left: 0;
		display: flex;
		z-index: 4;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.userPhoto {
		width: 138rpx;
		height: 138rpx;
		border: 1rpx solid #FFFFFF;
		border-radius: 70rpx;
	}

	.userName {
		max-width: 375rpx;
		color: #FFFFFF;
		font-size: 30rpx;
		margin-top: 20rpx;
	}

	.navBox {
		padding-top: 30rpx;
		background: #FFFFFF;
		border-top-right-radius: 30rpx;
		border-top-left-radius: 30rpx;
		margin-top: -20px;
		z-index: 5;
		position: relative;
		width: 100%;
		box-sizing: border-box;
		height: 90rpx;
	}

	.navItem {
		float: left;
		width: 50%;
		height: 60rpx;
		text-align: center;
		position: relative;
		line-height: 40rpx;
		color: #555555;
		font-size: 28rpx;
	}

	.navItem.active {
		color: #CD282F;
	}

	.navItem.active::after {
		content: "";
		position: absolute;
		width: 52rpx;
		height: 6rpx;
		background-color: #CD282F;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0;
	}

	.swiper {
		min-height: 500px;
		margin-top: 30rpx;
	}

	.itemList {
		padding: 20rpx 30rpx;
	}

	.navFix {
		position: fixed;
		top: 0;
		left: 0;
		border-radius: 0;
		z-index: 99;
		margin-top: 0;
	}

	/* #ifdef H5 */
	.navFix {
		top: calc(44px + env(safe-area-inset-top)) !important;
	}

	/* #endif */

	.userInfoBtn {
		width: 188rpx;
		height: 52rpx;
		border-radius: 26rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 24rpx;
		background-color: rgba(205, 40, 47, .5);
		margin-top: 20rpx;
	}

	.userInfoBtn.noLogin {
		background-color: #CD282F;
	}

	.editIcon {
		display: block;
		width: 44rpx;
		height: 44rpx;
		background: url(../../static/images/editUser.png) no-repeat;
		background-size: cover;
		margin-right: 1rpx;
		margin-top: 2rpx;
	}
	.noData{
		height: 40vh;
	}
</style>
