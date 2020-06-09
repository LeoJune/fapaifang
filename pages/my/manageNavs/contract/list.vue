<template>
	<view>
		<view class="recordFixHeader">
			<view class="headerBox">
			<view class="searchInputBox">
				<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
				<input class="uni-input" placeholder="搜索客户手机号、房源、或业务员" confirm-type="search" placeholder-style="font-size:26rpx;color:#B8B8B8;"
				 v-model="searchVal" @confirm="search" />
			</view>
			<view class="searchCancel" v-if="searchVal.length>0" @click="searchCancel">
				取消
			</view>
			</view>
			<view class="recordScreenBox">
				<view class="ScreenBox">
					<view class="screenItem" @click="datePicker">
						<view class="screenItemLabel">
							{{dateText}}
						</view>
						<uni-icons type="arrowdown" size="18" color="#b8b8b8"></uni-icons>
					</view>
				</view>
			</view>
			<view class="clearDatePicker" @click="clearDate" v-if="startDate!=''">
				<text class="clearText">取消日期筛选</text>
				<uni-icons type="clear" color="#ffffff" size="16"></uni-icons>
			</view>
		</view>
		<view class="commRecordList" v-if="total!==0">
			<view class="recordItem" v-for="(item,index) in list" :key="index">
				<view class="recordPersonBox">
					<view class="recordPersonInfo">
						<image class="recordPersonPic" mode="aspectFill" :src="item.headImgUrl"></image>
						<view class="recordPersonInfoCont">
							<view class="recordPersonName">{{item.employeeName}}上传的合同</view>
							<view class="recordTime">
								{{item.createTime}}
							</view>
						</view>
					</view>
					<view class="nowStatus"  @click="gotoProcess(item.id)">当前进展</view>
				</view>
				<view class="recordInfoBox">
					<view class="recordInfoItem">
						客户名称：{{item.appUserRealname}}  {{item.appUserMobile}}
					</view>
					<view class="recordInfoItem">
						意向房源：{{item.houseName}}
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
			<text class="noDataText">暂无合同</text>
		</view>
		<view class="recordFixBtn" @click="gotoAdd">
			<uni-icons type="compose" class="fixBtnIcon" color="#ffffff" size="20"></uni-icons>
			<text class="fixBtnText">新增</text>
		</view>
		<w-picker
			mode="range" 
			startDate="2017" 
			endYear="2030"
			:defaultVal="rangeDval"
			:current="false"
			@confirm="onConfirm" 
			ref="range" 
			themeColor="#f00"
		></w-picker>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		 components:{
		        wPicker
		    },
		data() {
			return {
				loadStatus:"more",
				pageNum:1,
				pageSize:10,
				total:"",
				list:[],
				searchVal: "",
				dateText: "按日期筛选",
				startDate:"",
				endDate:"",
				rangeDval:['2019-12-30','2025-12-07'],
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
			getList(startPage){
				const that = this;
				let param = {
					dynamicParam:that.searchVal,
					startPage: startPage,
					pageSize: that.pageSize,
					dateStart:that.startDate,
					dateEnd:that.endDate
				}
				that.loadStatus="loading";
				that.$api.contractList(param).then(res => {
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
			search() {
				const that = this;
				that.clearList();
				that.getList(1);
			},
			searchCancel() {
				const that = this;
				that.searchVal = "";
				that.clearList();
				that.getList(1);
				uni.hideKeyboard();
			},
			datePicker: function(e) {
				const that = this;
				that.$refs.range.show();
			},
			onConfirm(val){
				const that= this;
				that.dateText=val.result;
				that.startDate=val.from;
				that.endDate=val.to;
				that.clearList();
				that.getList(1);
			},
			clearDate(){
				const that = this;
				that.startDate="";
				that.endDate="";
				that.dateText="按日期筛选";
				that.clearList();
				that.getList(1);
			},
			gotoDetail(id){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/contract/detail",
					query:{
						id:id
					}
				})
			},
			gotoAdd(){
				const that =this;
				that.$Router.push({
					path:"/pages/my/manageNavs/contract/add"
				})
			},
			gotoProcess(id){
				const that =this;
				that.$Router.push({
					path:"/pages/my/manageNavs/process/index",
					query:{
						contractId:id
					}
				})
			}
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
	
</style>
