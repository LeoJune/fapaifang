<template>
	<view>
		<view class="recordDetailPage" v-if="result!=null">
			<view class="recordPersonBox">
				<view class="recordPersonInfo">
					<image class="recordPersonPic" mode="aspectFill" :src="result.employeeHeadImg"></image>
					<view class="recordPersonInfoCont">
						<view class="recordPersonName">{{result.employeeName}}上传的合同</view>
						<view class="recordTime">
							{{result.createTime}}
						</view>
					</view>
				</view>
			</view>
			<view class="recordDetailCont">
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							客户姓名:
						</view>
						<view class="detailHeadLink" @click="gotoSelfPage(result.appUserId)">
							<text class="detailHeadLinkLabel">查看个人主页</text>
							<uni-icons type="arrowright" size="18" color="#B8B8B8"></uni-icons>
						</view>
					</view>
					<view class="recordDetailText">{{result.appUserRealname}}  {{result.appUserMobile}}</view>
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
					<view class="recordDetailText">{{result.employeeName}}</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							合同附件:
						</view>
					</view>
					<view class="fujianList">
						<view class="fujianItem" v-for="(item,index) in result.appendixList" :key="index">
							<view class="fujianTitle">
								{{item.title}}
							</view>
							<view class="fujianMedia"  @click="previewImage(index)">
								查看附件
							</view>
						</view>
					</view>
				</view>
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							备注:
						</view>	
					</view>
					<view class="recordDetailText">{{result.memo}}</view>
				</view>
			</view>
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
				id:"",
				result:null,
				mediaList:[]
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
				that.$api.contractDetail(param).then(res => {
					if (res.success) {
						let result = res.datas;
						result.employeeHeadImg = result.employeeHeadImg?result.employeeHeadImg:"../../../../static/images/defaultUserPic.png";
						for(var i in result.appendixList){
							result.memo = result.memo ?result.memo :"暂无";
							that.mediaList.push(result.appendixList[i].url)
						}
						that.result = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			
			previewImage(index) {
				const that = this;
				uni.previewImage({
					urls: that.mediaList,
					current: that.mediaList[index]
				});
			},
			gotoAdd(){
				const that =this;
				that.$Router.push({
					path:"/pages/my/manageNavs/contract/add"
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
.fujianList{
	margin-top: 20rpx;
}
.fujianItem{
	margin-bottom: 20rpx;
}
.fujianTitle{
	font-size: 30rpx;
	color: #555555;
}
.fujianMedia{
	display: inline-block;
	line-height: 54rpx;
	width: 140rpx;
	height: 54rpx;
	border: 1rpx solid #555555;
	font-size: 24rpx;
	color: #555555;
	text-align: center;
	margin-top: 15rpx;
}
</style>
