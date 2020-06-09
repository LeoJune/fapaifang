<template>
	<view>
		<view class="tags">
			<view v-for="(item,index) in tags" :key="index" :class="{'tagItem':true,'active':tagIndex==index}" @click="tagSel(index,item.flowStatus)">{{item.name}}</view>
		</view>
		<view class="recordList" v-if="total!==0">
			<view class="recordItem" v-for="(item,index) in list" :key="index">
				<view class="recordPersonBox">
					<view class="recordPersonInfo">
						<image class="recordPersonPic" mode="aspectFill" :src="item.headImgUrl"></image>
						<view class="recordPersonInfoCont">
							<view class="recordPersonName">{{item.employeeName}}的客户</view>
							<view class="recordTime">
								{{item.createTime}}
							</view>
						</view>
					</view>
					<view class="nowStatus" @click="gotoProcess(item.id)">当前进展</view>
				</view>
				<view class="recordInfoBox">
					<view class="recordInfoItem">
						客户名称：{{item.customerName}} {{item.customerMobile}}
					</view>
					<view class="recordInfoItem">
						意向房源：{{item.houseName}}
					</view>
					<view class="recordInfoItem">
						业务员：{{item.employeeName}}
					</view>
					<view class="recordInfoItem">
						交易状态:  {{item.flowStatusText}}
					</view>
				</view>
				<view class="recordLookAll"  @click="gotoProcess(item.id)">
					<text class="lookAllText">查看全文</text>
					<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowright" />
				</view>
			</view>
			<uni-load-more iconType="snow" :status="loadStatus" />
		</view>
		<view class="noData" v-else>
			<image src="../../../static/images/noRecord.png" mode="" class="noDataImg"></image>
			<text class="noDataText">暂无记录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tagIndex:0,
				pageSize: 10,
				loadStatus: 'more',
				flowStatus:'',
				pageNum: 1,
				total: "",
				list:[],
				tags: [{
					name: "全部",
					flowStatus:""
				}, {
					name: "咨询",
					flowStatus:10
				}, {
					name: "签约",
					flowStatus:20
				}, {
					name: "尽职调查",
					flowStatus:30
				}, {
					name: "贷款",
					flowStatus:40
				}, {
					name: "参拍中",
					flowStatus:50
				}, {
					name: "办理过户",
					flowStatus:60
				}, {
					name: "腾退",
					flowStatus:70
				}, {
					name: "交房",
					flowStatus:80
				}, ]
			}
		},
		onLoad() {
			this.getList(1);
		},
		onReachBottom() {
			const that = this;
			console.log("onReachBottom");
			if (that.loadStatus == "noMore") {
				return;
			} else if (that.pageNum != 1) {
				that.getList(that.pageNum);
			}
		},
		methods: {
			getList(startPage) {
				const that = this;
				let param = {
					flowStatus: that.flowStatus,
					startPage: startPage,
					pageSize: that.pageSize
				}
				that.loadStatus = "loading";
				that.$api.housevisitList(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
						for(var i in result){
							result[i].headImgUrl = result[i].headImgUrl?result[i].headImgUrl:'../../../static/images/defaultUserPic.png';
							var flowStatusText;
							if(result[i].flowStatus==10){
								flowStatusText="咨询";
							}
							else if(result[i].flowStatus==20){
								flowStatusText="签约";
							}
							else if(result[i].flowStatus==30){
								flowStatusText="尽职调查";
							}
							else if(result[i].flowStatus==40){
								flowStatusText="贷款";
							}
							else if(result[i].flowStatus==50){
								flowStatusText="拍卖中";
							}
							else if(result[i].flowStatus==60){
								flowStatusText="办理过户";
							}
							else if(result[i].flowStatus==70){
								flowStatusText="腾退";
							}
							else if(result[i].flowStatus==80){
								flowStatusText="交房";
							}
							result[i].flowStatusText = flowStatusText;
							
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
			clearList() {
				const that = this;
				that.pageNum = 1;
				that.total = "";
				that.list = [];
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
			tagSel(index,flowStatus){
				const that = this;
				that.tagIndex=index;
				that.flowStatus=flowStatus;
				that.clearList();
				that.getList(1);
			}
		}
	}
</script>

<style>
	.tags{
		padding: 10rpx 0 10rpx 30rpx;
		overflow: hidden;
	}
	.tags .tagItem{
		float: left;
		line-height: 52rpx;
		border: 1rpx solid #DDDDDD;
		color: #B8B8B8;
		font-size: 24rpx;
		padding: 0 18rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}
	.tags .tagItem.active{
		color: #CD282F;
		border: 1rpx solid #CD282F;
	}
	.goodsList{
		padding: 30rpx;
	}
	.recordList{
		border-top: 20rpx solid #F7F7F7;
	}
</style>
