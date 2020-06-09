<template>
	<view>
		<view class="recordFixHeader">
			<view class="searchInputBox">
				<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
				<input class="uni-input" placeholder="搜索客户名称或房源" confirm-type="search" placeholder-style="font-size:26rpx;color:#B8B8B8;"
				 v-model="searchVal" @confirm="search" />
			</view>
			<view class="recordScreenBox">
				<view class="ScreenBox">
					<picker @change="statusPicker" :range="statusArr" class="pickers">
						<view class="screenItem">
							<view class="screenItemLabel">
								{{status}}
							</view>
							<uni-icons type="arrowdown" size="18" color="#b8b8b8"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="commRecordList"  v-if="total!==0">
			<view class="paySignItem" v-for="(item,index) in list" :key="index">
				<view class="pagTagHead payStatus1" v-if="item.completeState==0">
					<view class="pagTagHeadLeft">
						<image class="pagStatusImg" src="../../../../static/images/noInquire.png"></image>
						<text class="pagStatusText">未完成</text>
					</view>
					<view class="pagTagHeadBtn" @click="gotoProcess(item.visitId)">
						去操作
					</view>
				</view>
				<view class="pagTagHead payStatus2" v-else>
					<view class="pagTagHeadLeft">
						<image class="pagStatusImg" src="../../../../static/images/hasInquire.png"></image>
						<text class="pagStatusText">已完成</text>
					</view>
					<view class="pagTagHeadBtn status2" @click="gotoProcess(item.visitId)">
						当前进展
					</view>
				</view>
				<view class="recordInfoBox">
					<view class="recordInfoItem">
						客户名称：{{item.username}} {{item.mobile}}
					</view>
					<view class="recordInfoItem">
						意向房源：{{item.houseName}}
					</view>
					<view class="recordInfoItem">
						业务员：{{item.employeeName}}
					</view>
					<block v-if="item.completeState==0">
						<view class="recordInfoItem">
							参拍状态：未完成
						</view>
						<view class="recordInfoItem">
							参拍完成时间: 暂无
						</view>
					</block>
					<block v-else>
						<view class="recordInfoItem">
							参拍状态：已完成
						</view>
						<view class="recordInfoItem">
							参拍完成时间: {{item.completeTime}}
						</view>
					</block>
					<view class="recordInfoItem">
						备注: {{item.memo}}
					</view>
				</view>
				<view class="recordLookAll" @click="gotoDetail(item.visitId)">
					<text class="lookAllText">查看全文</text>
					<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowright" />
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
				searchVal: "",
				queryStatus:0,//0-所有  1-已完成  2-未完成
				statusArr: [
					"全部",
					"已完成",
					"未完成"
				],
				status: "按状态筛选"
			}
		},
		onLoad() {
			this.getList(1);
		},
		methods: {
			getList(startPage) {
				const that = this;
				let param = {
					dynamicParam: that.searchVal,
					queryStatus:that.queryStatus,
					startPage: startPage,
					pageSize: that.pageSize
				}
				that.loadStatus = "loading";
				that.$api.auctionList(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
						for (var i in result) {
							result[i].memo = result[i].memo?result[i].memo:"暂无";
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
			},

			statusPicker: function(e) {
				const that = this;
				that.status = that.statusArr[e.detail.value];
				that.queryStatus = e.detail.value;
				that.clearList();
				that.getList(1);
			},
			gotoProcess(id){
				const that =this;
				that.$Router.push({
					path:"/pages/my/manageNavs/process/index",
					query:{
						id:id
					}
				})
			},
			gotoDetail(id) {
				const that = this;
				that.$Router.push({
					path: "/pages/my/manageNavs/hasJoin/detail",
					query: {
						id: id
					}
				})
			},
		},
		onReachBottom() {
			const that = this;
			if (that.loadStatus == "noMore") {
				return;
			} else if (that.pageNum != 1) {
				that.getList(that.pageNum);
			}
		},
	}
</script>

<style>
	page{
		background-color: #F7F7F7;
	}
	.commRecordList{
		padding-top: 170rpx;
	}
	.searchInputBox {
		margin-left: 0;
	}
</style>
