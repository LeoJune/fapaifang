<template>
	<view>
		<view class="recordDetailPage" v-if="result!=null">
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
					<view class="recordDetailText">{{result.username}} {{result.mobile}}</view>
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
							尽职调查状态:
						</view>
					</view>
					<view class="recordDetailText" v-if="result.completeState==0">未完成</view>
					<view class="recordDetailText" v-else>已完成</view>
				</view>
				<view class="recordDetailItem" v-if="result.appendixUrls.length>0">
					<view class="detailHead">
						<view class="detailHeadTitle">
							尽职调查附件:
						</view>
					</view>
					<view class="fujianList">
						<view class="fujianItem" v-for="(item,index) in result.appendixUrls" :key="index">
							<view class="fujianTitle">
								{{item.title}}
							</view>
							<view class="fujianMedia"  @click="previewImage(index)">
								查看附件
							</view>
						</view>
					</view>
				</view>
				<view class="recordDetailItem" v-if="result.completeState==1">
					<view class="detailHead">
						<view class="detailHeadTitle">
							尽职调查完成时间:
						</view>
					</view>
					<view class="recordDetailText">{{result.completeTime}}</view>
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
			this.id = options.id;
			this.getDetail(options.id);
		},
		methods: {
			getDetail(id){
				const that = this;
				let param = {
					id: id
				}
				that.$api.diligenceDetail(param).then(res => {
					if (res.success) {
						let result = res.datas;
						result.memo = result.memo ?result.memo :"暂无";
						that.result = res.datas;
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
.recordDetailCont{
	margin-top: 0;
}
</style>
