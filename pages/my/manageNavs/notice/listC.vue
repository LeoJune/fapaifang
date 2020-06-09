<template>
	<view>
		<view class="commRecordList" v-if="total!==0">
			
			
			
			
			<view class="recordItem" v-for="(item,index) in list" :key="index">
				<view class="recordPersonBox">
					<view class="recordPersonInfo">
						<image class="recordPersonPic" mode="aspectFill" :src="item.createEmployeeHeadImg"></image>
						<view class="recordPersonInfoCont">
							<view class="recordPersonName">{{item.createEmployeeName}}的公告</view>
							<view class="recordTime">
								{{item.startTime}}
							</view>
						</view>
					</view>
				</view>
				<view class="recordInfoBox">
					<view class="recordInfoItem noticeTitle">
						{{item.title}}
					</view>
					<view class="recordInfoItem noticeContent">
						{{item.content}}
					</view>
					
				</view>
				<view class="recordLookAll" @click="gotoDetail(item.id)">
					<text class="lookAllText">查看全文</text>
					<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowright" />
				</view>
			</view>
			
			
			<uni-load-more iconType="snow" :status="loadStatus" />
		</view>
		<view class="noData" v-else>
			<image src="../../../../static/images/noRecord.png" mode="" class="noDataImg"></image>
			<text class="noDataText">暂无公告</text>
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
				myEmployeeId:"",
				searchVal: "",
			}
		},
		onLoad() {
			this.clearList();
			this.getList(1);
		},
		methods: {
			reload(){
				this.clearList();
				this.getList(1);	
			},
			statusPicker: function(e) {
				const that = this;
				that.status = that.statusArr[e.detail.value];
			},
			
			getList(startPage) {
				const that = this;
				let param = {
					pageNo: startPage,
					pageSize: that.pageSize
				}
				that.loadStatus = "loading";
				that.$api.noticeListC(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
			
						for (var i in result) {
							result[i].createEmployeeHeadImg = result[i].createEmployeeHeadImg?result[i].createEmployeeHeadImg:"../../../../static/images/defaultUserPic.png";
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
			gotoDetail(id){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/notice/detail",
					query:{
						id:id
					}
				})
			},
			clearList() {
				const that = this;
				that.pageNum = 1;
				that.total = "";
				that.list = [];
			},
			search() {
				const that = this;
				that.clearList();
				that.getList(1);
			}
		}
	}
</script>

<style>
	page{
		background-color: #F7F7F7;
	}
	.commRecordList{
		padding-top: 5rpx;
	}
	.recordFixHeader{
		height: 100rpx;
	}
	.searchInputBox {
		margin-left: 0;
	}
	.readStatus{
		font-size: 24rpx;
		color: #CD282F;
		margin-left: 10rpx;
	}
	.readStatus.hasRead{
		color: #00BBC3;
	}
	.noticeTitle{
		font-size: 32rpx;
		color: #222222;
	}
	.noticeContent{
		color: #666666;
	}
</style>
