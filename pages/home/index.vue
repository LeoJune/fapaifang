<template>

	<view class="container">
		<!-- #ifndef MP-WEIXIN -->
		<view class="title-contents">
			<view class="top-view status"></view>
			<view class="_top titles">
				<view class="headBg">
					<picker mode="multiSelector" @columnchange="cityChange" @change="citySel" :value="cityIndex" :range="cities"
					 range-key="name">
						<view class="citySel"><text class="cityName">{{theCity}}</text>
							<uni-icons type="arrowdown" size="20" />
						</view>
					</picker>
					<view class="searchInputBox">
						<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
						<input class="uni-input" placeholder="搜索标的物名称" confirm-type="search" placeholder-style="font-size:26rpx;color:#B8B8B8;"
						 v-model="searchVal" @confirm="search" />
					</view>
				</view>
				<view class="noticeBox" @click="gotoNotice">
					<image src="../../static/images/noticeIcon.png" class="noticeIcon"></image>
					<text class="noticeText">公告</text>
					<view class="tipPoint" v-if="hasNewNotice">
					</view>
				</view>

			</view>
		</view>
		<!-- #endif -->
		<view class="content uni-padding-wrap uni-common-mt">
			<!-- #ifdef MP-WEIXIN -->
			<view :class="{'weixinHead':true,'weixinHeadFixed':scrollTop>1}">
				<view class="headBg">
					<picker mode="multiSelector" @columnchange="cityChange" @change="citySel" :value="cityIndex" :range="cities"
					 range-key="name">
						<view class="citySel"><text class="cityName">{{theCity}}</text>
							<uni-icons type="arrowdown" size="20" />
						</view>
					</picker>
					<view class="searchInputBox">
						<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
						<input class="uni-input" placeholder="搜索标的物名称" confirm-type="search" placeholder-style="font-size:26rpx;color:#B8B8B8;"
						 v-model="searchVal" @confirm="search" />
					</view>
				</view>
				<view class="noticeBox" @click="gotoNotice">
					<image src="../../static/images/noticeIcon.png" class="noticeIcon"></image>
					<text class="noticeText">公告</text>
					<view class="tipPoint" v-if="hasNewNotice">
					</view>
				</view>
			</view>
			<view class="weixinHead" v-if="scrollTop>1">

			</view>
			<!-- #endif -->
			<swiper class="swiper" circular indicator-dots="true" autoplay="true" indicator-color="rgba(255,255,255,0.80)"
			 indicator-active-color="rgba(205,40,47,0.80)">
				<swiper-item v-for="(item, index) in bannerList" :key="index" class="swiper-item">
					<image :src="item.url" class="bannerImg" mode="aspectFill" />
				</swiper-item>
			</swiper>
			<view class="gridBtns">
				<view class="gridItem" @click="gotoAreaHousing">
					<image class="gridImg" src="../../static/images/navBtn1.png"></image>
					<text class="gridText">区域选房</text>
				</view>
				<view class="gridItem" @click="gotoLeakHousing">
					<image class="gridImg" src="../../static/images/navBtn2.png"></image>
					<text class="gridText">捡漏必看</text>
				</view>
				<view class="gridItem" @click="gotoAreaPrice">
					<image class="gridImg" src="../../static/images/navBtn3.png"></image>
					<text class="gridText">区域均价</text>
				</view>
			</view>
			<view class="goodsBox" v-if="hasLogin&&recList.length>0">
				<view class="boxHead">推荐房源</view>
				<view class="goodsList">
					<view class="goodsItem" v-for="(item,index) in recList" :key="index" @click="itemTap(item.paimaiId,item.houseSource)">
						<view class="goodsPic">
							<text class="goodsTag">{{item.paimaiTimesText}}</text>
							<image class="goodsImage" :src="item.productImage" mode="aspectFill"></image>
						</view>
						<view class="goodsInfo">
							<view class="goodsName"><jyf-parser :html="item.title" ref="article" autoscroll></jyf-parser></view>
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
				</view>
			</view>
			<view class="goodsBox">
				<view class="boxHead">最新房源</view>
				<view class="listTabs">
					<view :class="{'tabItem':true,'tabActive':tabCurrent==0}" @click="selectTab(0)"><text>最新发布</text></view>
					<view :class="{'tabItem':true,'tabActive':tabCurrent==1}" @click="selectTab(1)"><text>收藏更多</text></view>
					<view :class="{'tabItem':true,'tabActive':tabCurrent==2}" @click="selectTab(2)"><text>价格</text><text :class="{'sortIcon':true,'sortIconUp':priceSort==1}"></text></view>
				</view>
				<view class="goodsList">
					<view class="goodsItem" v-for="(item,index) in newHouseList" :key="index" @click="itemTap(item.paimaiId,item.houseSource)">
						<view class="goodsPic">
							<text class="goodsTag">{{item.paimaiTimesText}}</text>
							<image class="goodsImage" :src="item.productImage" mode="aspectFill"></image>
						</view>
						<view class="goodsInfo">
							<view class="goodsName"><jyf-parser :html="item.title" ref="article" autoscroll></jyf-parser></view>
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
				</view>
			</view>
			<uni-load-more iconType="snow" :status="loadStatus" />
		</view>
	</view>
</template>
<script>
	import cityData from '../../utils/cities.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: mapState(['hasLogin', 'userInfo', 'address']),
		data() {
			return {
				provinceId: 0,
				cityId: 0,
				scrollTop: 0,
				searchVal: "",
				tabCurrent: 0,
				priceSort: 0,
				total: "",
				isFresh: false,
				isLogin: false,
				theCity: '',
				optionType: 1,
				loadStatus: 'more',
				pageNum: 1,
				pageSize: 10,
				cityIndex: [0, 0],
				cities: [],
				bannerList: [{
						colorClass: 'uni-bg-red',
						url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg',
						content: '内容 A'
					},
					{
						colorClass: 'uni-bg-green',
						url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg',
						content: '内容 B'
					},
					{
						colorClass: 'uni-bg-blue',
						url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg',
						content: '内容 C'
					}
				],
				newHouseList: [],
				recList: [],
				hasNewNotice:false
			}
		},
		created() {

			// that.provinceandcity();
		},
		onLoad() {
			const that = this;
			that.cities[0] = cityData;
			if (that.address.cityIndex) {
				var provinceIndex = that.address.cityIndex[0];
				var cityIndex = that.address.cityIndex[1];
				that.cityIndex = that.address.cityIndex;
				that.cities[1] = cityData[provinceIndex].cities;
				that.provinceId = that.address.provinceId;
				that.cityId = that.address.cityId;
			} else {
				that.cityIndex = [16, 0];
				that.cities[1] = cityData[16].cities;
				that.provinceId = 17; //湖北
				that.cityId = 1381; //武汉市
			}
			that.theCity = that.cities[1][that.cityIndex[1]].name;
			that.getHouseList(1, that.provinceId, that.cityId, 1);

			that.getRecommend();


		},
		onShow() {
			const that = this;
			if (that.hasLogin && !that.isLogin) {
				that.getRecommend();
			}
			that.noticeHasunread();
		},
		onReachBottom() {
			const that = this;
			console.log("onReachBottom");
			if (that.loadStatus == "noMore") {
				return;
			} else if (that.pageNum != 1) {
				that.getHouseList(that.optionType, that.provinceId, that.cityId, that.pageNum);
			}
		},
		methods: {
			provinceandcity() {
				const that = this;
				that.$api.provinceandcity().then(res => {
					if (res.success) {
						let result = res.datas;
						that.multiArray[0] = result;
						that.multiIndex = [16, 0];
						that.multiArray[1] = result[16].cities;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			noticeHasunread(){
				const that = this;
				that.$api.noticeHasunread({}).then(res => {
					if (res.success) {
						let result = res.datas;
						that.hasNewNotice = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			cityChange: function(e) {
				this.cityIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.cities[1] = this.cities[0][this.cityIndex[0]].cities;
						this.cityIndex.splice(1, 1)
						this.cityIndex.splice(2, 1, 0)
						break
					case 1: //拖动第2列
						this.cityIndex.splice(2, 1)
						break
				}
				this.$forceUpdate()

			},
			citySel() {
				const that = this;
				that.theCity = that.cities[1][that.cityIndex[1]].name;
				let provinceId = that.cities[0][that.cityIndex[0]].id;
				let cityId = that.cities[1][that.cityIndex[1]].id;
				that.provinceId = provinceId;
				that.cityId = cityId;
				let storageData = {
					provinceId: provinceId,
					cityId: cityId,
					cityIndex: that.cityIndex
				}
				that.updateAddress(storageData);
				that.clearList();
				that.getHouseList(1, that.provinceId, that.cityId, 1);
			},

			getHouseList(optionType, provinceId, cityId, pageNo) {
				const that = this;
				let param = {
					optionType: optionType, //1-最新 2-收藏数 3-价格正序 4-价格倒序
					provinceId: provinceId,
					cityId: cityId,
					pageNo: pageNo
				}
				that.loadStatus = "loading";
				that.$api.houseList(param).then(res => {
					if (res.success) {
						if (that.isFresh) {
							setTimeout(() => {
								uni.stopPullDownRefresh();
							}, 1000)
							that.isFresh = false;
						}
						let result = res.datas.rows;
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
							that.newHouseList.push(result[i])
						}
						let total = res.datas.total;
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
			getRecommend() {
				const that = this;
				let param = {
					pageNo: 1,
					pageSize: 3
				}
				that.$api.recommendList(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
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
						}
						that.recList = result;

					} else {
						console.log(res.message);
						// uni.showToast({
						// 	title: res.message,
						// 	icon: "none"
						// })
					}
				})
			},
			selectTab(index) {
				let that = this;
				if (index == 2 && that.tabCurrent == 2) {
					if (that.priceSort == 0) {
						that.optionType = 4;
					} else {
						that.optionType = 3;
					}
					that.priceSort = that.priceSort == 0 ? 1 : 0
				} else {
					that.tabCurrent = index;
					if (index == 0) {
						that.optionType = 1;
					} else if (index == 1) {
						that.optionType = 2;
					} else if (index == 2) {
						that.optionType = 3;
					}
				}
				that.clearList();
				that.getHouseList(that.optionType, that.provinceId, that.cityId, that.pageNum);
			},
			itemTap(paimaiId, houseSource) {
				this.$Router.push({
					path: "/pages/home/goodsDetail",
					query: {
						paimaiId: paimaiId,
						houseSource: houseSource
					}
				})
			},
			clearList() {
				const that = this;
				that.pageNum = 1;
				that.total = "";
				that.newHouseList = [];
			},
			onPullDownRefresh: function() {
				const that = this;
				that.clearList();
				if (that.hasLogin) {
					that.getRecommend();
				}
				that.getHouseList(that.optionType, that.provinceId, that.cityId, that.pageNum);
				that.noticeHasunread();
				that.isFresh = true;
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 10000)
			},
			search(res) {
				let that = this;
				that.$Router.push({
					path: "/pages/home/searchDetail",
					query: {
						text: that.searchVal
					}
				})
				uni.hideKeyboard();
			},
			gotoAreaHousing() {
				this.$Router.push({
					path: "/pages/home/areaHousing"
				})
			},
			gotoAreaPrice() {
				this.$Router.push({
					path: "/pages/home/areaPrice"
				})
			},
			gotoLeakHousing() {
				this.$Router.push({
					path: "/pages/home/leakHousing"
				})
			},
			gotoNotice(){
				this.$Router.push({
					path: "/pages/my/manageNavs/notice/listC"
				})
			},
			onPageScroll(e) {
				let that = this;
				that.scrollTop = e.scrollTop;

			},
			...mapMutations(['updateAddress'])
		}
	}
</script>

<style>
	.weixinHead {
		width: 100%;
		height: 108rpx;
		display: flex;
		flex-direction: row;
		padding: 20rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: 0 6rpx 6rpx 2rpx rgba(133, 133, 133, .1);
	}

	.weixinHeadFixed {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 776;
	}

	.headBg {
		display: flex;
		flex: 1;
		height: 100%;
		padding-left: 20rpx;
		background-color: #F7F7F7;
		border-radius: 5px;
	}

	.citySel {
		margin-left: 0;
		padding-right: 20rpx;
		position: relative;
	}

	.citySel::after {
		content: "";
		position: absolute;
		width: 2rpx;
		height: 42rpx;
		background-color: #d6d6d6;
		right: 0;
		top: 50%;
		border-radius: 2rpx;
		transform: translateY(-50%);
	}

	.searchInputBox {
		margin-left: 0;
	}

	.citySel .cityName {
		display: block;
		max-width: 120rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: 26rpx;
		color: #222222;
		margin-right: 5rpx;
	}

	.downIcon {
		font-family: uniicons;
		font-size: 20px;
		font-weight: normal;
		font-style: normal;
		width: 20px;
		color: #222222;
	}

	.swiper-box {
		height: 260rpx;
	}

	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #999;
		color: #fff;
	}

	.bannerImg {
		width: 750rpx;
	}

	.gridBtns {
		height: 200rpx;
		margin-top: 10rpx;
	}

	.gridBtns .gridItem {
		width: 33.3%;
		float: left;
		height: 100%;
		text-align: center;
		transition: all linear 0.2s;
	}

	.gridItem:active {
		background: #f7f7f7;
	}

	.gridItem .gridImg {
		width: 88rpx;
		height: 88rpx;
		display: inline-block;
		margin-top: 32rpx;
	}

	.gridItem .gridText {
		display: block;
		font-size: 26rpx;
		color: #555555;
		margin-top: 12rpx;
	}

	.goodsBox {
		padding: 20rpx 30rpx;
	}

	.boxHead {
		font-size: 44rpx;
		color: #222222;
		line-height: 60rpx;
		padding-bottom: 20rpx;
	}
	.noticeBox{
		height: 100%;
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.noticeIcon{
		width: 44rpx;
		height: 38rpx;
	}
	.noticeText{
		 font-size: 20rpx;
		 line-height: 28rpx;
		 color: #555555;
	}
	.tipPoint{
		position: absolute;
		right: -10rpx;
		top: -10rpx;
	}
</style>
