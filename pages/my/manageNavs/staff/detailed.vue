<template>
	<view>
		<view class="detailedList" v-if="total!==0">
			<view class="detailedItem" v-for="(item,index) in list" :key="index">
				<view class="recordPersonBox">
					<view class="recordPersonInfo">
						<image class="recordPersonPic" mode="aspectFill" :src="item.employeeHeadImg"></image>
						<view class="recordPersonInfoCont">
							<view class="recordPersonName">{{item.employeeName}}的奖励</view>
						</view>
					</view>
				</view>
				<view class="detailsInfo">
					<view class="detailsCont">
						奖励钻值：{{item.quantity}}
					</view>
					<view class="detailsCont">
						奖励时间：{{item.exchangeTime}}
					</view>
					<view class="detailsCont">
						操作人：{{item.createEmployeeName}}
					</view>
				</view>
			</view>
			<uni-load-more iconType="snow" :status="loadStatus" />
		</view>
		<view class="noData" v-else>
			<image src="../../../../static/images/noRecord.png" mode="" class="noDataImg"></image>
			<text class="noDataText">暂无数据</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadStatus: "more",
				pageNum: 1,
				pageSize: 10,
				total: "",
				list: [],
			}
		},
		onLoad() {
			this.getList(1);
		},
		methods: {
			getList(startPage) {
				const that = this;
				let param = {
					startPage: startPage,
					pageSize: that.pageSize
				}
				that.loadStatus = "loading";
				that.$api.givelogs(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
						for (var i in result) {
							result[i].employeeHeadImg = result[i].employeeHeadImg?result[i].employeeHeadImg:'../../../../static/images/defaultUserPic.png';
							that.list.push(result[i]);
						}
						let total = res.datas.total;
						that.total = total;
						let totalPageNum = Math.ceil(total / that.pageSize);
						console.log(totalPageNum);
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
		}
	}
</script>

<style>
	.detailedItem{
		padding: 30rpx;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
	}
	page {
	background-color: #f7f7f7;
	}
	.detailsCont{
		font-size: 26rpx;
		color: #555555;
		line-height: 36rpx;
		margin-top: 20rpx;
	}
	.detailsInfo{
		padding: 20rpx 0;
	}
</style>
