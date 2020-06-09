<template>
	<view>
		<view class="tags">
			<view v-for="(item,index) in tags" :key="index" :class="{'tagItem':true,'active':tagIndex==index}" @click="tagSel(index,item.flowStatus)">{{item.name}}</view>
		</view>
		<view class="goodsList" v-if="total!==0">
			<view class="goodsItem" v-for="(item,index) in list" :key="index"  @click="itemTap(item.houseInfoResp.paimaiId,item.houseInfoResp.houseSource)">
				<view class="goodsPic">
					<text class="goodsTag">{{item.houseInfoResp.paimaiTimesText}}</text>
					<image class="goodsImage" :src="item.houseInfoResp.productImage" mode="aspectFill"></image>
					<view class="recordStatus">
						{{item.flowStatusText}}
					</view>
				</view>
				<view class="goodsInfo">
					<view class="goodsName">{{item.houseInfoResp.title}}</view>
					<view class="goodsAddress nowrap" v-if="item.houseInfoResp.paimaiStatus==1">{{item.houseInfoResp.accessNum}}次围观/{{item.houseInfoResp.title}}</view>
					<view class="goodsAddress nowrap" v-else>{{item.houseInfoResp.bidCount}}次出价 / {{item.houseInfoResp.countyName}}</view>
				<view class="goodsPrice"><text class="priceLabel">当前价</text><text class="priceNum">{{item.houseInfoResp.currentPriceText}}万</text>
				<text  v-if="item.houseInfoResp.discount!=10" class="discount">{{item.houseInfoRespdiscount}}折</text></view>
				<view class="goodsStatus goodsStatus1" v-if="item.houseInfoResp.paimaiStatus==1"><text class="statusName">未开始</text><text class="goodsTime">{{item.houseInfoResp.timeText}}开始</text></view>
				<view class="goodsStatus goodsStatus2" v-else-if="item.houseInfoResp.paimaiStatus==2"><text class="statusName">拍卖中</text><text class="goodsTime">{{item.houseInfoResp.timeText}}开始</text></view>
				<view class="goodsStatus goodsStatus3" v-else><text class="statusName">已结束</text><text class="goodsTime">{{item.houseInfoResp.timeText}}结束</text></view>
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
							
							
							
							result[i].houseInfoResp.currentPriceText = (result[i].houseInfoResp.currentPrice * 0.0001).toFixed(2);
							if (result[i].houseInfoResp.paimaiTimes == 1) {
								result[i].houseInfoResp.paimaiTimesText = "一拍";
							} else if (result[i].houseInfoResp.paimaiTimes == 2) {
								result[i].houseInfoResp.paimaiTimesText = "二拍";
							} else if (result[i].houseInfoResp.paimaiTimes == 4) {
								result[i].paimaiTimesText = "变卖";
							} else if (result[i].houseInfoResp.paimaiTimes == 5) {
								result[i].houseInfoResp.paimaiTimesText = "重新拍卖";
							}
							var nowTime = new Date().getTime();
							var startTime = new Date(result[i].houseInfoResp.startTime).getTime();
							var endTime = new Date(result[i].houseInfoResp.endTime).getTime();
							if (startTime > nowTime) {
								result[i].houseInfoResp.paimaiStatus = 1; //未开始	
								result[i].houseInfoResp.timeText = that.$utils.formatTime(startTime,'MM月DD日 hh:mm');
							} else if (nowTime >= startTime && nowTime <= endTime) {
								result[i].houseInfoResp.paimaiStatus = 2; //拍卖中
								result[i].houseInfoResp.timeText = that.$utils.timeCount(endTime);
							} else {
								result[i].houseInfoResp.paimaiStatus = 3; //已结束
								result[i].houseInfoResp.timeText = that.$utils.formatTime(endTime,'YYYY年MM月DD日');
							}
							
							
							
						
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
			itemTap(paimaiId,houseSource) {
				this.$Router.push({
					path: "/pages/home/goodsDetail",
					query:{
						paimaiId:paimaiId,
						houseSource:houseSource
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
	.recordStatus{
		position: absolute;
		width: 120rpx;
		height: 120rpx;
		border-radius: 100%;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		box-sizing: border-box;
		padding: 0 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		overflow: hidden;
		background-color: rgba(0,0,0,.35);
	}
</style>
