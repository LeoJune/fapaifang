<template>
	<view>
		<view class="commRecordList" v-if="total!==0">
			<view class="recordItem" v-for="(item,index) in list" :key="index">
				<view class="recordPersonBox">
					<view class="recordPersonInfo">
						<image class="recordPersonPic" mode="aspectFill" :src="item.headImgUrl"></image>
						<view class="recordPersonInfoCont">
							<view class="recordPersonName">{{item.createEmployeeName}}的客户</view>
							<view class="recordTime">
								{{item.createTime}}
							</view>
						</view>
					</view>
				</view>
				<view class="recordInfoBox">
					<view class="recordInfoItem">
						客户名称：{{item.customerName}}  {{item.customerMobile}}
					</view>
					<view class="recordInfoItem">
						意向房源：{{item.houseName}}
					</view>
					<view class="recordInfoItem processLabelBox">
						<view class="processLabelBox_L">
							沟通自评分：
						</view>
						<view class="processLabelBox_R">
							<uni-rate class="recordDetailRate" :margin="5" active-color="#d03b41" :is-fill="false" color="#dadada" :disabled="true" :size="16" :value="item.evaluateScore" />
						</view>
					</view>
					<view class="recordInfoItem">
						日志描述:  {{item.content}}
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
			<text class="noDataText">暂无日志</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:"",
				loadStatus:"more",
				pageNum:1,
				pageSize:10,
				total:"",
				list:[],

			}
		},
		onLoad(options) {
			this.id = options.id;
			this.clearList();
			this.getList(1);
		},
		
		methods: {
			reload(){
				this.clearList();
				this.getList(1);
			},
			getList(startPage){
				const that = this;
				let param = {
					startPage: startPage,
					pageSize: that.pageSize,
					visitId: that.id
				}
				that.loadStatus="loading";
				that.$api.housevisitDailyList(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
						that.total= res.datas.total;
						for(var i in result){
							result[i].headImgUrl = result[i].headImgUrl?result[i].headImgUrl:'../../../../static/images/defaultUserPic.png';
							that.list.push(result[i]);
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
			clearList(){
				const that = this;
				that.pageNum=1;
				that.total="";
				that.list=[];
			},
			
			gotoDetail(id){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/journal/detail",
					query:{
						id:id
					}
				})
			},
		},
		onReachBottom() {
			const that = this;
			if(that.loadStatus=="noMore"){
				return;
			}
			else if(that.pageNum!=1){
				that.getList(that.pageNum);
			}
		},
	}
</script>

<style>
	page{
		background-color: #F7F7F7;
	}
	.headerBox{
		display: flex;
	}
	.searchInputBox {
		margin-left: 0;
	}
	.commRecordList{
		padding-top: 4rpx;
	}
</style>
