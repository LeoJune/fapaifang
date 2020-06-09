<template>
	<view>
		<view class="recordDetailPage" v-if="result!=null">
			<view class="recordPersonBox">
				<view class="recordPersonInfo">
					<image class="recordPersonPic" mode="aspectFill" :src="result.headImgUrl"></image>
					<view class="recordPersonInfoCont">
						<view class="recordPersonName">{{result.employeeName}}的回访</view>
						<view class="recordTime">
							{{result.createTime}}
						</view>
					</view>
				</view>
				<view class="nowStatus" @click="gotoProcess(result.visitId)">当前进展</view>
			</view>
			<view class="recordDetailCont">
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							客户姓名:
						</view>
						<view class="detailHeadLink" @click="gotoSelfPage(result.customerId)">
							<text class="detailHeadLinkLabel">查看个人主页</text>
							<uni-icons type="arrowright" size="18" color="#B8B8B8"></uni-icons>
						</view>
					</view>
					<view class="recordDetailText">{{result.customerName}}  {{result.customerMobile}}</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							意向房源:
						</view>
						<view class="detailHeadLink" @click="gotoHouse(result.paimaiId,result.houseSource)">
							<text class="detailHeadLinkLabel">查看房源详情</text>
							<uni-icons type="arrowright" size="18" color="#B8B8B8"></uni-icons>
						</view>
					</view>
					<view class="recordDetailText">{{result.houseName}}</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							业务员:
						</view>
					</view>
					<view class="recordDetailText">{{result.customerName}}</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							回访内容:
						</view>	
					</view>
					<view class="recordDetailText">{{result.content}}</view>
				</view>
			</view>
		</view>
		<view class="recordFixBtn" @click="gotoAdd">
			<uni-icons type="compose" class="fixBtnIcon" color="#ffffff" size="20"></uni-icons>
			<text class="fixBtnText">写回访</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:"",
				result:null
			}
		},
		onLoad(options) {
			let that = this;
			that.id = options.id;			
			that.detail(options.id);
		},
		methods: {
			detail(id){
				const that = this;
				let param = {
					id: id
				}
				that.$api.returnvisitDetail(param).then(res => {
					if (res.success) {
						let result = res.datas;
						result.headImgUrl = result.headImgUrl?result.headImgUrl:"../../../../static/images/defaultUserPic.png";
						that.result = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			gotoHouse(paimaiId,houseSource) {
				this.$Router.push({
					path: "/pages/home/goodsDetail",
					query:{
						paimaiId:paimaiId,
						houseSource:houseSource
					}
				})
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
			gotoAdd(){
				const that =this;
				that.$Router.push({
					path:"/pages/my/manageNavs/returnVisit/add"
				})
			},
			gotoSelfPage(id){
				const that =this;
				that.$Router.push({
					path:"/pages/my/otherSelfPage",
					query:{
						id:id
					}
				})
			}
		}
	}
</script>

<style>

</style>
