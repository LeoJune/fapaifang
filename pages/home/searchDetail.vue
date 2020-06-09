<template>

	<view class="container">
		<!-- #ifndef MP-WEIXIN -->
		<view class="title-contents">
			<view class="top-view status"></view>
			<view class="_top titles">
				<uni-icons color="#555555" class="backIocn" size="22" type="arrowleft" @click="back" />
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
		</view>
		<!-- #endif -->
		<view class="content uni-padding-wrap uni-common-mt">
			<!-- #ifdef MP-WEIXIN -->
			<view :class="{'weixinHead':true,'weixinHeadFixed':scrollTop>1}">
				<view class="searchInputBox">
					<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
					<input class="uni-input" placeholder="搜索标的物名称" confirm-type="search" placeholder-style="font-size:26rpx;color:#B8B8B8;"
					 v-model="searchVal" @confirm="search" />
				</view>
				<picker mode="multiSelector" @columnchange="cityChange" @change="citySel" :value="cityIndex" :range="cities" range-key="name">
					<view class="citySel"><text class="cityName">{{theCity}}</text>
						<uni-icons type="arrowdown" size="20" />
					</view>
				</picker>
			</view>
			<view class="weixinHead" v-if="scrollTop>1">
				
			</view>
			<!-- #endif -->
			<view class="listTabs">
				<view :class="{'tabItem':true,'tabActive':tabCurrent==0}" @click="selectTab(0)"><text>最新发布</text></view>
				<view :class="{'tabItem':true,'tabActive':tabCurrent==1}" @click="selectTab(1)"><text>收藏更多</text></view>
				<view :class="{'tabItem':true,'tabActive':tabCurrent==2}" @click="selectTab(2)"><text>价格</text><text :class="{'sortIcon':true,'sortIconUp':priceSort==1}"></text></view>
			</view>
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
					<image src="../../static/images/noRecord.png" mode="" class="noDataImg"></image>
					<text class="noDataText">暂无数据</text>
				</view>
			</view>
			
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
		computed: mapState(['address']),
		data() {
			return {
				scrollTop:0,
				tabCurrent: 0,
				priceSort: 0,
				searchVal: "",
				isFresh: false,
				theCity: '',
				optionType: 1,
				loadStatus: 'more',
				pageNum: 1,
				total:'',
				pageSize:10,
				cityIndex: [0, 0],
				cities: [],
				houseList:[]
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
			that.getHouseList(1, that.provinceId, that.cityId, 1);
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
				that.getHouseList(1, that.provinceId, that.cityId, 1);
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
			getHouseList(optionType, provinceId, cityId, pageNo) {
				const that = this;
				let param = {
					title:that.searchVal,
					optionType: optionType, //1-最新 2-收藏数 3-价格正序 4-价格倒序
					provinceId: provinceId,
					cityId: cityId,
					pageNo: pageNo
				}
				that.loadStatus="loading";
				that.$api.houseSearch(param).then(res => {
					if (res.success) {
						if(that.isFresh){
							setTimeout(()=>{
								uni.stopPullDownRefresh();
							},1000)
							that.isFresh=false;	
						}
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
								result[i].timeText = that.$utils.formatTime(startTime,'MM月DD日 hh:mm');
							} else if (nowTime >= startTime && nowTime <= endTime) {
								result[i].paimaiStatus = 2; //拍卖中
								result[i].timeText = that.$utils.timeCount(endTime);
							} else {
								result[i].paimaiStatus = 3; //已结束
								result[i].timeText = that.$utils.formatTime(endTime,'YYYY年MM月DD日');
							}
							that.houseList.push(result[i])
						}
						let total = res.datas.total;
						that.total=total;
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
			search(){
				const that = this;
				that.clearList();
				that.getHouseList(1, that.provinceId, that.cityId, 1);
				uni.hideKeyboard();
			},
			clearList(){
				const that = this;
				that.pageNum=1;
				that.total="";
				that.houseList=[];
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
			onPageScroll(e) {
				let that = this;
				that.scrollTop = e.scrollTop;		
			},
			back() {
				this.$Router.back(1);
			},
			 ...mapMutations(['updateAddress'])
		}
	}
</script>

<style>
	.weixinHead{
		width: 100%;
		height: 108rpx;
		display: flex;
		flex-direction: row;
		padding: 20rpx;
		box-sizing: border-box;
		background: #ffffff;
		box-shadow: 0 6rpx 6rpx 2rpx rgba(133,133,133,.1);
	}
	.weixinHeadFixed{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 776;
	}
	/* #ifdef MP-WEIXIN */
	.searchInputBox{
		margin-left: 0;
	}
	/* #endif */
	
	.goodsBox {
		padding: 0 30rpx;
	}

	.boxHead {
		font-size: 44rpx;
		color: #222222;
		line-height: 60rpx;
		padding-bottom: 20rpx;
	}

	.listTabs {
		padding: 10rpx 30rpx 30rpx 30rpx;
	}
</style>
