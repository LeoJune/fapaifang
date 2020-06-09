<template>
	<view>
		<view class="searchBox">
			<view class="searchInputBox">
				<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
				<input class="uni-input" placeholder="搜索标的物名称" confirm-type="search" placeholder-style="font-size:26rpx;color:#B8B8B8;"
				 v-model="searchVal" @confirm="search" />
			</view>
			<picker mode="multiSelector" @columnchange="cityChange" @change="citySel" :value="cityIndex" :range="cities"
			 range-key="name">
				<view class="citySel"><text class="cityName">{{theCity}}</text>
					<uni-icons type="arrowdown" size="20" />
				</view>
			</picker>
		</view>
		<view class="content">
			<view class="goodsBox">
				<view class="goodsList" v-if="total!==0">
					<view class="goodsItem" v-for="(item,index) in houseList" :key="index" @click="itemTap(item.paimaiId,item.houseSource)">
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
					<uni-load-more iconType="snow" :status="loadStatus" />
				</view>
				<view class="noData" v-else>
					<image src="../../../static/images/noRecord.png" mode="" class="noDataImg"></image>
					<text class="noDataText">暂无数据</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cityData from '../../../utils/cities.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: mapState(['address']),
		data() {
			return {
				searchVal: "",
				theCity: '',
				loadStatus: 'more',
				pageNum: 1,
				total: '',
				pageSize: 10,
				cityIndex: [0, 0],
				cities: [],
				houseList: []
			}
		},
		onLoad(options) {
			let that = this;
			that.searchVal = options.text;
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
			// that.provinceandcity();
			that.getHouseList(that.provinceId, that.cityId, 1);
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
				that.getHouseList(that.provinceId, that.cityId, 1);
			},
			search() {
				const that = this;
				that.clearList();
				that.getHouseList(that.provinceId, that.cityId, 1);
				uni.hideKeyboard();
			},
			getHouseList(provinceId, cityId, pageNo) {
				const that = this;
				let param = {
					title: that.searchVal,
					provinceId: provinceId,
					cityId: cityId,
					pageNo: pageNo
				}
				that.loadStatus = "loading";
				that.$api.collectList(param).then(res => {
					if (res.success) {
						if (that.isFresh) {
							setTimeout(() => {
								uni.stopPullDownRefresh();
							}, 1000)
							that.isFresh = false;
						}
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
							that.houseList.push(result[i])
						}
						let total = res.datas.totalCount;
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
			clearList() {
				const that = this;
				that.pageNum = 1;
				that.total = "";
				that.houseList = [];
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
			...mapMutations(['updateAddress'])
		}
	}
</script>

<style>
	/* #ifndef H5 */
	.searchBox {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		position: fixed;
		width: 100%;
		height: 80rpx;
		top: 0;
		background-color: #FFFFFF;
		z-index: 999;
		box-sizing: border-box;
		/* top:calc(44px + env(safe-area-inset-top)); */
	}

	/* #endif */
	/* #ifdef H5 */
	.searchBox {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		position: fixed;
		width: 100%;
		height: 80rpx;
		z-index: 999;
		background-color: #FFFFFF;
		box-sizing: border-box;
		top: calc(44px + env(safe-area-inset-top));
	}

	/* #endif */
	.searchInputBox {
		margin-left: 0;
	}

	.content {
		padding-top: 80rpx;
	}

	.goodsBox {
		padding: 30rpx 30rpx 0 30rpx;
	}
</style>
