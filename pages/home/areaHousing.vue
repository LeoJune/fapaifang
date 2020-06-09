<template>
	<view>
		<view class="selectCityBox">
			<text class="selCityLabel">当前城市：</text>
			<picker mode="multiSelector" @columnchange="cityChange" @change="citySel" :value="cityIndex" :range="cities"
			 range-key="name">
				<view class="citySel"><text class="cityName">{{theCity}}</text>
					<uni-icons type="arrowdown" size="20" />
				</view>
			</picker>
		</view>
		<view class="content">
			<view class="areaSelBox">
				<view class="selBoxHead">
					<view class="td td1">
						区域
					</view>
					<view class="td td2">
						法拍行情
					</view>
					<view class="td td3">
						月成交量
					</view>
				</view>
				<view class="selBoxList">
					<view class="tr selectedItem">
						<view class="td td1">
							{{selectedArea.countyName}}
						</view>
						<view class="td td2">
							{{selectedArea.avgPrice}}元/m²
						</view>
						<view class="td td3">
							{{selectedArea.count}}套
						</view>
					</view>
					<view class="selectBtnBox" @click="openAreaList">
						<uni-icons class="loopIcon" color="#CD282F" size="16" type="loop" />
						<text class="btnLabel">切换区域</text>
					</view>
				</view>
			</view>


			<view class="goodsBox">
				<view class="listTabs">
					<view :class="{'tabItem':true,'tabActive':tabCurrent==0}" @click="selectTab(0)"><text>最新发布</text></view>
					<view :class="{'tabItem':true,'tabActive':tabCurrent==1}" @click="selectTab(1)"><text>收藏更多</text></view>
					<view :class="{'tabItem':true,'tabActive':tabCurrent==2}" @click="selectTab(2)"><text>价格</text><text :class="{'sortIcon':true,'sortIconUp':priceSort==1}"></text></view>
				</view>
				<view class="goodsList">
					<view class="goodsItem" v-for="(item,index) in houseList" :key="index"  @click="itemTap(item.paimaiId,item.houseSource)">
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
				</view>
			</view>
			<uni-load-more iconType="snow" :status="loadStatus" />
		</view>
		<view class="areaListBox" v-if="openAreaSel">
			<view class="listShardow" @click="openAreaList">

			</view>
			<view class="areaSelBox theOpenList">
				<view class="selBoxHead">
					<view class="td td1">
						区域
					</view>
					<view class="td td2">
						法拍行情
					</view>
					<view class="td td3">
						月成交量
					</view>
				</view>
				<view class="selBoxList">
					<view v-for="(item, index) in areaList" :key="index" :class="{'tr':true,'selectedItem':index==selectedArea.index}"
					 @click="selectArea(index)">
						<view class="td td1">
							{{item.countyName}}
						</view>
						<view class="td td2">
							{{item.avgPrice}}元/m²
						</view>
						<view class="td td3">
							{{item.count}}套
						</view>
					</view>
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
				index: 0,
				tabCurrent: 0,
				priceSort: 0,
				selectedArea: {},
				loadStatus: 'more',
				pageNum:1,
				total:"",
				pageSize:10,
				provinceId: 0,
				cityId: 0,
				countyId:0,
				theCity: '',
				cityIndex: [0, 0],
				cities: [],
				openAreaSel: false,
				areaList: [],
				houseList:[]
			}
		},
		created() {
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
			that.houseArea(that.cityId);
		},
		onReachBottom() {
			const that = this;
			console.log("onReachBottom");
			if(that.loadStatus=="noMore"){
				return;
			}
			else if(that.pageNum!=1){
				that.getHouseList(that.optionType, that.provinceId, that.cityId,that.countyId, that.pageNum);
			}
		},
		methods: {
			houseArea: function(id) {
				const that = this;
				let param = {
					cityId: id
				}
				that.$api.houseArea(param).then(res => {
					if (res.success) {
						var result = res.datas;					
						that.areaList=result;
						that.countyId=result[0].countyId;
						that.selectedArea = result[0];
						that.getHouseList(1, that.provinceId, that.cityId, that.countyId,1);
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			getHouseList(optionType, provinceId, cityId,countyId, pageNo) {
				const that = this;
				let param = {
					optionType: optionType, //1-最新 2-收藏数 3-价格正序 4-价格倒序
					provinceId: provinceId,
					cityId: cityId,
					countyId:countyId,
					pageNo: pageNo
				}
				that.loadStatus="loading";
				that.$api.houseList(param).then(res => {
					if (res.success) {
						if(that.isFresh){
							setTimeout(()=>{
								uni.stopPullDownRefresh();
							},1000)
							that.isFresh=false;	
						}
						let result = res.datas.rows;
						that.total=res.datas.total;
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
				that.houseArea(that.cityId);
				// that.getHouseList(1, that.provinceId, that.cityId, 1);
			},
			selectTab(index) {
				let that = this;
				if (index == 2 && that.tabCurrent == 2) {
					if(that.priceSort==0){
						that.optionType=4;
					}
					else{
						that.optionType=3;
					}
					that.priceSort = that.priceSort == 0 ? 1 : 0
				} else {
					that.tabCurrent = index;
					if(index==0){
						that.optionType=1;
					}
					else if(index==1){
						that.optionType=2;
					}
					else if(index==2){
						that.optionType=3;
					}
				}
				that.clearList();
				that.getHouseList(that.optionType, that.provinceId, that.cityId,that.countyId,that.pageNum);
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
			clearList(){
				const that = this;
				that.pageNum=1;
				that.total="";
				that.houseList=[];
			},
			openAreaList() {
				let that = this;
				that.openAreaSel = !that.openAreaSel;
			},
			selectArea(index) {
				let that = this;
				that.selectedArea = that.areaList[index];
				that.selectedArea.index = index;
				that.countyId = that.areaList[index].countyId;
				that.clearList();
				that.getHouseList(that.optionType, that.provinceId, that.cityId,that.countyId,1);
				that.openAreaList();
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0
				})
			},
			...mapMutations(['updateAddress'])

		}
	}
</script>

<style>
	/* #ifndef H5 */
	.selectCityBox {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		position: fixed;
		width: 100%;
		height: 68rpx;
		top: 0;
		background-color: #FFFFFF;
		z-index: 999;
		/* top:calc(44px + env(safe-area-inset-top)); */
	}

	/* #endif */
	/* #ifdef H5 */
	.selectCityBox {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		position: fixed;
		width: 100%;
		height: 68rpx;
		z-index: 999;
		background-color: #FFFFFF;
		top: calc(44px + env(safe-area-inset-top));
	}

	/* #endif */
	.selCityLabel {
		font-size: 26rpx;
		color: #555555;
	}

	.cityPicker {
		max-width: 250rpx;
	}

	.citySel .cityName {
		display: block;
		max-width: 150rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: 30rpx;
		color: #222222;
		margin-right: 5rpx;
	}

	.content {
		padding-top: 68rpx;
	}

	.areaSelBox {
		width: 690rpx;
		margin: 10rpx 30rpx;
		background: #FFFFFF;
		box-shadow: 0 5px 16px 0 rgba(0, 0, 0, 0.08);
		border-radius: 5px;
		border-radius: 5px;
		overflow: hidden;
	}

	.selBoxHead {
		background-color: #444444;
		height: 76rpx;
		display: flex;
	}

	.selBoxHead .td {
		text-align: center;
		color: #ffffff;
		font-size: 26rpx;
		height: 100%;
		line-height: 76rpx;
	}

	.areaSelBox .td1 {
		width: 180rpx;
		box-sizing: border-box;
		padding: 0 10rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.areaSelBox .td2 {
		width: 330rpx;
	}

	.areaSelBox .td3 {
		flex: 1;
	}

	.selBoxList {
		background-color: #FFFFFF;
	}

	.selBoxList .tr {
		display: flex;
		height: 98rpx;
		border-bottom: 1rpx solid #eeeeee;
		align-items: center;
	}

	.selBoxList .tr.selectedItem {
		height: 108rpx;
	}

	.selBoxList .tr .td {
		font-size: 30rpx;
		color: #222222;
		text-align: center;
	}

	.selBoxList .tr.selectedItem .td {
		font-size: 36rpx;
		color: #000000;
	}

	.selectBtnBox {
		width: 100%;
		height: 75rpx;
		text-align: center;
		line-height: 75rpx;
		color: #CD282F;
		transition: all linear .1s;
	}

	.selectBtnBox:active {
		background-color: #F7F7F7;
	}

	.selectBtnBox .loopIcon {
		display: inline-block;
		vertical-align: middle;
	}

	.selectBtnBox .btnLabel {
		margin-left: 10rpx;
		font-size: 26rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.goodsBox {
		padding: 30rpx 30rpx 0 30rpx;
	}

	/* #ifndef H5 */
	.areaListBox {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 998;
	}

	/* #endif */
	/* #ifdef H5 */
	.areaListBox {
		position: fixed;
		left: 0;
		top: calc(44px + env(safe-area-inset-top));
		bottom: 0;
		right: 0;
		z-index: 998;
	}

	/* #endif */
	.theOpenList {
		position: absolute;
		left: 0;
		top: 0;
		padding-top: 68rpx;
		margin: 0;
		width: 750rpx;
		border-radius: 0;
		max-height: 80vh;
		overflow-y: scroll;
		z-index: 998;
	}

	.theOpenList .selBoxHead {
		padding: 0 30rpx;
	}

	.theOpenList .tr {
		padding: 0 30rpx;
		transition: linear all .1s;
	}

	.theOpenList .tr:active {
		background-color: #F7F7F7;
	}

	.listShardow {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .7);
		z-index: 997;
	}

	.theOpenList .tr.selectedItem {
		height: 96rpx;
	}
</style>
