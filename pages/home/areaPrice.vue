<template>
	<view>
		<view class="fixHead">
			<view class="selectCityBox">
				<text class="selCityLabel">当前城市：</text>
				<picker mode="multiSelector" @columnchange="cityChange" @change="citySel" :value="cityIndex" :range="cities"
				 range-key="name">
					<view class="citySel"><text class="cityName">{{theCity}}</text>
						<uni-icons type="arrowdown" size="20" />
					</view>
				</picker>
			</view>
			<view class="tableHead">
				<view class="tableTd">
					区域
				</view>
				<view class="tableTd">
					均价
				</view>
			</view>
		</view>
		
		<view class="content">
			<view class="areaList">
				<view class="areaItem" v-for="(item, index) in areaList" :key="index">
					<view class="tableTd">
						{{item.countyName}}
					</view>
					<view class="tableTd">
						{{item.avgPrice}}元/m²
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
				provinceId: 0,
				cityId: 0,
				countyId:0,
				theCity: '',
				cityIndex: [0, 0],
				cities: [],
				areaList: []
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
				uni.showLoading({
					title:"加载中..."
				})
				that.$api.houseArea(param).then(res => {
					uni.hideLoading();
					if (res.success) {
						var result = res.datas;
						that.areaList=result;
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
			},
	
			clearList(){
				const that = this;
				that.areaList=[];
			},
			...mapMutations(['updateAddress'])

		}
	}
</script>

<style>
	.fixHead{
		position: fixed;
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		/* #ifdef H5 */
		top: calc(44px + env(safe-area-inset-top));
		/* #endif */
		width: 100%;
		height: 164rpx;
		background-color: #FFFFFF;
		z-index: 999;
		left: 0;
	}
	.tableHead{
		width: 100%;
		height: 76rpx;
		background-color: #444444;
		display: flex;
		margin-top: 20rpx;
	}
	.tableTd{
		box-sizing: border-box;
		padding: 0 10rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 30rpx;
		color: #222222;
		width: 50%;
		text-align: center;
	}
	.tableHead .tableTd{
		color: #FFFFFF;
		font-size: 26rpx;
		line-height: 76rpx;
		
	}
	.selectCityBox {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		width: 100%;
		height: 68rpx;	
	}
	

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
		padding-top: 164rpx;
	}

	.areaList{
		
	}
	.areaItem{
		position: relative;	
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
	}
	.areaItem::after{
		position: absolute;
		content: "";
		left: 30rpx;
		right: 30rpx;
		bottom: 0;
		background-color: #F7F7F7;
		height: 1rpx;
	}
</style>
