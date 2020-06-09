<template>
	<view>
		<view class="recordFixHeader">
			<view class="searchInputBox">
				<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
				<input class="uni-input" placeholder="搜索公告标题" confirm-type="search" placeholder-style="font-size:26rpx;color:#B8B8B8;"
				 v-model="searchVal" @confirm="search" />
			</view>
		</view>
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
					<view class="czBtns" v-if="myEmployeeId==item.createEmployeeId">
						<image src="../../../../static/images/edit.png" class="czIcons" @click="editNotice(item.id)"></image>
						<image src="../../../../static/images/del.png" class="czIcons" @click="delNotice(item.id,index)"></image>
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
		<view class="recordFixBtn" @click="gotoAdd">
			<uni-icons type="compose" class="fixBtnIcon" color="#ffffff" size="20"></uni-icons>
			<text class="fixBtnText">新增</text>
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
				statusArr: [
					"全部",
					"未付款",
					"已付款"
				],
				status: "按状态筛选"
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
			
			gotoDetail(id){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/notice/detail",
					query:{
						id:id
					}
				})
			},
			gotoAdd(){
				const that =this;
				that.$Router.push({
					path:"/pages/my/manageNavs/notice/add"
				})
			},
			getList(startPage) {
				const that = this;
				let param = {
					dynamicParam: that.searchVal,
					queryStatus:that.queryStatus,
					startPage: startPage,
					pageSize: that.pageSize
				}
				that.loadStatus = "loading";
				that.$api.noticeListB(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
			
						for (var i in result) {
							result[i].createEmployeeHeadImg = result[i].createEmployeeHeadImg?result[i].createEmployeeHeadImg:"../../../../static/images/defaultUserPic.png";
							that.list.push(result[i]);
						}
						let total = res.datas.total;
						that.total = total;
						that.myEmployeeId = res.datas.myEmployeeId;
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
			delNotice(id,index){
				const that = this;
				uni.showModal({
					content: "确定要删除公告吗？",
					confirmText: "确认删除",
					cancelText: "取消",
					success: function(res) {
						if (res.confirm) {
							var param={
								id:id
							}
							that.$api.noticeDelete(param).then(res => {
								if (res.success) {
									that.list.splice(index, 1);
									uni.showToast({
										title: "删除成功"
									})
								} else {
									uni.showToast({
										title: res.message,
										icon: "none"
									})
								}
							})
							
						} else if (res.cancel) {
				
						}
					}
				});
			},
			editNotice(id){
				const that =this;
				that.$Router.push({
					path:"/pages/my/manageNavs/notice/edit",
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
		padding-top: 110rpx;
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
