<template>
	<view>
		<view class="headerStatus">
			<scroll-view scroll-x="true" class="headerScroll" :show-scrollbar="showScrollBar" :scroll-left="scrollLeft">
				<block v-for="(item, index) in statuses" :key="index">
					<view class="statusItem" :class="{'active':item.active}">
						<view class="circle">
							{{item.name}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="content">
			<view class="staffInfoBox whiteBg">
				<view class="recordDetailItem">
					<view class="detailHead">
						<view class="detailHeadTitle">
							客户姓名:
						</view>
						<view class="detailHeadLink">
							<text class="detailHeadLinkLabel">查看个人主页</text>
							<uni-icons type="arrowright" size="18" color="#B8B8B8"></uni-icons>
						</view>
					</view>
					<view class="recordDetailText">{{detail.customerName}}   {{detail.customerMobile}}</view>
				</view>
				<view class="recordDetailItem marginBtm0">
					<view class="detailHead">
						<view class="detailHeadTitle">
							意向房源:
						</view>
						<view class="detailHeadLink"  @click="gotoHouse(detail.paimaiId,detail.houseSource)">
							<text class="detailHeadLinkLabel">查看房源详情</text>
							<uni-icons type="arrowright" size="18" color="#B8B8B8"></uni-icons>
						</view>
					</view>
					<view class="recordDetailText nowrap">{{detail.houseName}}</view>
				</view>
			</view>
			<view class="processBox" v-if="dailyList.length>0">
				<view class="processBoxHead">
					<view class="boxHeadLeft">
						日志<text class="num">({{dailyListNum}})</text>
					</view>
					<view class="detailHeadLink" @click="gotoAllDaily">
						<text class="detailHeadLinkLabel">全部日志</text>
						<uni-icons type="arrowright" size="18" color="#B8B8B8"></uni-icons>
					</view>
				</view>
				<view class="recordItem" v-for="(item,index) in dailyList" :key="index">
					<view class="recordPersonBox">
						<view class="recordPersonInfo">
							<image class="recordPersonPic" mode="aspectFill" src="../../../../static/images/defaultUserPic.png"></image>
							<view class="recordPersonInfoCont">
								<view class="recordPersonName">{{item.createEmployeeName}}的客户</view>
								<view class="recordTime">
									{{item.createTime}}
								</view>
							</view>
						</view>
						
					</view>
					<view class="recordInfoBox">
						<view class="recordInfoItem processLabelBox">
							<view class="processLabelBox_L">
								沟通自评分：
							</view>
							<view class="processLabelBox_R">
								<uni-rate class="recordDetailRate" :margin="5" active-color="#d03b41" :is-fill="false" color="#dadada" :disabled="true" :size="16" :value="item.evaluateScore" />
							</view>
						</view>
						<view class="recordInfoItem">
							日志描述：{{item.houseName}}
						</view>
						
					</view>
					<view class="recordLookAll" @click="gotoDaily(item.id)">
						<text class="lookAllText">查看全文</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowright" />
					</view>
				</view>
				
			</view>
			<view class="processBox" v-if="returnList.length>0">
				<view class="processBoxHead">
					<view class="boxHeadLeft">
						客户回访<text class="num">({{returnListNum}})</text>
					</view>
					<view class="detailHeadLink" @click="gotoAllReturn">
						<text class="detailHeadLinkLabel">全部回访</text>
						<uni-icons type="arrowright" size="18" color="#B8B8B8"></uni-icons>
					</view>
				</view>
				<view class="recordItem" v-for="(item,index) in returnList" :key="index">
					<view class="recordInfoBox">
						<view class="recordInfoItem">
							回访人：{{item.employeeName}}
						</view>
						<view class="recordInfoItem">
							回访时间：{{item.visitTime}}
						</view>
						<view class="recordInfoItem">
							回访内容：{{item.content}}
						</view>
					</view>
					<view class="recordLookAll" @click="gotoReturn(item.id)">
						<text class="lookAllText">查看全文</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowright" />
					</view>
				</view>
			</view>
			<view class="processBox" v-if="contractDetail">
				<view class="processBoxHead">
					<view class="boxHeadLeft">
						合同
					</view>
					
				</view>
				<view class="recordItem">
					<view class="recordInfoBox">
						<view class="detailHead">
							<view class="detailHeadTitle">
								合同附件:
							</view>
						</view>
						<view class="fujianList">
							<view class="fujianItem" v-for="(item,index) in contractDetail.appendixList" :key="index">
								<view class="fujianTitle">
									{{item.title}}
								</view>
								<view class="fujianMedia"  @click="previewImage(item.url)">
									查看附件
								</view>
							</view>
						</view>
						
					</view>
					<view class="recordLookAll" @click="gotoContract(contractDetail.id)">
						<text class="lookAllText">查看全文</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowright" />
					</view>
				</view>
				
			</view>
			<view class="progressBox">
				<view class="processBoxHead">
					<view class="boxHeadLeft">
						进度
					</view>
				</view>
				<view class="progressList">
					<view class="progressItem">
						<view class="progressHead">
							<uni-icons type="checkbox-filled" color="#cd282f" size="20" v-if="detail.flowLogList[0]"></uni-icons>
							<uni-icons type="checkbox-filled" color="#DDDDDD" size="20" v-else @click="gotoOperate(1)"></uni-icons>
							<view class="progressName">
								付款成功
							</view>
						</view>
						
						<view class="progressTips" v-if="detail.flowLogList[0]">
							<view class="progressTipsText">
								备注: {{detail.flowLogList[0].memo}}
							</view>
						</view>
					</view>
					<view class="progressItem">
						<view class="progressHead">
							<uni-icons type="checkbox-filled" color="#cd282f" size="20" v-if="detail.flowLogList[1]"></uni-icons>
							<uni-icons type="checkbox-filled" color="#DDDDDD" size="20" v-else @click="gotoOperate(2)"></uni-icons>
							<view class="progressName">
								尽职调查
							</view>
						</view>
						<view class="progressTips"  v-if="detail.flowLogList[1]">
							<view class="progressTipsAnnex" v-for="(item,index) in detail.flowLogList[1].appendixUrlList" :key="index">
								<view class="lookAnnex" @click="previewImage(item)">
									查看附件
								</view>
							</view>
							<view class="progressTipsText">
								备注: {{detail.flowLogList[1].memo}}
							</view>
						</view>
					</view>
					<view class="progressItem">
						<view class="progressHead">
							<uni-icons type="checkbox-filled" color="#cd282f" size="20" v-if="detail.flowLogList[2]!=undefined"></uni-icons>
							<uni-icons type="checkbox-filled" color="#DDDDDD" size="20" v-else @click="gotoOperate(3)"></uni-icons>
							<view class="progressName">
								贷款
							</view>
						</view>
						<view class="progressTips" v-if="detail.flowLogList[2]!=undefined">
							<view class="progressTipsText">
								备注: {{detail.flowLogList[2].memo}}
							</view>
						</view>
					</view>
					<view class="progressItem">
						<view class="progressHead">
							<uni-icons type="checkbox-filled" color="#cd282f" size="20" v-if="detail.flowLogList[3]!=undefined"></uni-icons>
							<uni-icons type="checkbox-filled" color="#DDDDDD" size="20" v-else @click="gotoOperate(4)"></uni-icons>
							<view class="progressName">
								参拍中
							</view>
						</view>
						<view class="progressTips" v-if="detail.flowLogList[3]!=undefined">
							<view class="progressTipsText">
								备注: {{detail.flowLogList[3].memo}}
							</view>
						</view>
					</view>
					<view class="progressItem">
						<view class="progressHead">
							<uni-icons type="checkbox-filled" color="#cd282f" size="20" v-if="detail.flowLogList[4]!=undefined"></uni-icons>
							<uni-icons type="checkbox-filled" color="#DDDDDD" size="20" v-else @click="gotoOperate(5)"></uni-icons>
							<view class="progressName">
								办理过户
							</view>
						</view>
						<view class="progressTips" v-if="detail.flowLogList[4]!=undefined">
							<view class="progressTipsText">
								备注: {{detail.flowLogList[4].memo}}
							</view>
						</view>
					</view>
					<view class="progressItem">
						<view class="progressHead">
							<uni-icons type="checkbox-filled" color="#cd282f" size="20" v-if="detail.flowLogList[5]!=undefined"></uni-icons>
							<uni-icons type="checkbox-filled" color="#DDDDDD" size="20" v-else @click="gotoOperate(6)"></uni-icons>
							<view class="progressName">
								腾退
							</view>
						</view>
						<view class="progressTips" v-if="detail.flowLogList[5]!=undefined">
							<view class="progressTipsText">
								备注: {{detail.flowLogList[5].memo}}
							</view>
						</view>
					</view>
					<view class="progressItem">
						<view class="progressHead">
							<uni-icons type="checkbox-filled" color="#cd282f" size="20" v-if="detail.flowLogList[6]!=undefined"></uni-icons>
							<uni-icons type="checkbox-filled" color="#DDDDDD" size="20" v-else @click="gotoOperate(7)"></uni-icons>
							<view class="progressName">
								交房
							</view>
						</view>
						<view class="progressTips" v-if="detail.flowLogList[6]!=undefined">
							<view class="progressTipsText">
								备注: {{detail.flowLogList[6].memo}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="endBox">
				没有更多了
			</view>
		</view>
	</view>
</template>

<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	export default {
		components: {
			uniRate
		},
		data() {
			return {
				id:"",
				type:"",
				flowStatus:10,
				active:false,
				scrollLeft:0,
				showScrollBar:false,
				detail:"",
				contractDetail:"",
				dailyList:[],
				dailyListNum:0,
				returnList:[],
				imgList:[],
				returnListNum:0,
				statuses: [{
					name: '咨询',
					active: false
				},{
					name: '签约',
					active: false
				},{
					name: '尽职调查',
					active: false
				},{
					name: '贷款',
					active: false
				},{
					name: '参拍',
					active: false
				},{
					name: '办理过户',
					active: false
				},{
					name: '腾退',
					active: false
				},{
					name: '交房',
					active: false
				}]
			}
		},
		onLoad(options) {
			let that = this;
			that.id = options.id;
			that.contractId = options.contractId;
			let theId;
			if(options.contractId){
				theId=options.contractId;
			}
			else{
				theId=options.id;
			}
			that.getDetail(theId);
			
		},
		methods: {
			reload(){
				this.getDetail(this.id);
			},
			getDetail(id){
				const that = this;
				let param = {
					id:id
				}
				var interfaceUrl;
				if(that.contractId){
					interfaceUrl=that.$api.housevisitDetailBycontractid;
				}
				else{
					interfaceUrl=that.$api.housevisitDetail;
				}
				interfaceUrl(param).then(res => {
					if (res.success) {
						let result =res.datas;
						let flowStatus = result.flowStatus;
						switch(flowStatus){
							case 10:
							that.statuses[0].active=true;
							break;
							case 20:
							that.statuses[0].active=true;
							that.statuses[1].active=true;
							break;
							case 30:
							that.statuses[0].active=true;
							that.statuses[1].active=true;
							that.statuses[2].active=true;
							break;
							case 40:
							that.statuses[0].active=true;
							that.statuses[1].active=true;
							that.statuses[2].active=true;
							that.statuses[3].active=true;
							that.scrollLeft=60;
							break;
							case 50:
							that.statuses[0].active=true;
							that.statuses[1].active=true;
							that.statuses[2].active=true;
							that.statuses[3].active=true;
							that.statuses[4].active=true;
							that.scrollLeft=121;
							break;
							case 60:
							that.statuses[0].active=true;
							that.statuses[1].active=true;
							that.statuses[2].active=true;
							that.statuses[3].active=true;
							that.statuses[4].active=true;
							that.statuses[5].active=true;
							that.scrollLeft=200;
							break;
							case 70:
							that.statuses[0].active=true;
							that.statuses[1].active=true;
							that.statuses[2].active=true;
							that.statuses[3].active=true;
							that.statuses[4].active=true;
							that.statuses[5].active=true;
							that.statuses[6].active=true;
							that.scrollLeft=200;
							break;
							case 80:
							that.statuses[0].active=true;
							that.statuses[1].active=true;
							that.statuses[2].active=true;
							that.statuses[3].active=true;
							that.statuses[4].active=true;
							that.statuses[5].active=true;
							that.statuses[6].active=true;
							that.statuses[7].active=true;
							that.scrollLeft=250;
							break;
						}
						that.flowStatus = flowStatus;
						if(result.flowLogList[1]){
							result.flowLogList[1].appendixUrlList=result.flowLogList[1].appendixUrls.split(",");
						}
						that.detail=result;
						that.id = result.id;
						that.getDailyList(result.id);
						that.getReturnList(result.id);
						that.getContract(result.id);
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			getDailyList(id){
				const that = this;
				let param = {
					startPage:1,
					pageSize:2,
					visitId: id
				}
				that.$api.housevisitDailyList(param).then(res => {
					if (res.success) {
						let result = res.datas;
						that.dailyListNum = result.total;
						that.dailyList=result.rows;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			getReturnList(id){
				const that = this;
				let param = {
					startPage:1,
					pageSize:2,
					oriVisitId: id
				}
				that.$api.housevisitReturnList(param).then(res => {
					if (res.success) {
						let result = res.datas;
						that.returnListNum = result.total;
						that.returnList=result.rows;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			getContract(id){
				const that = this;
				let param = {
					id: id
				}
				that.$api.housevisitcontract(param).then(res => {
					if (res.success) {
						let result = res.datas;
						that.contractDetail = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			gotoOperate(type){
				const that = this;
				var lengthNum = that.detail.flowLogList.length;
				if(type>(lengthNum+1)){
					uni.showToast({
						title:"请先完成前置进度",
						icon:"none"
					})
					return;
				}
				that.$Router.push({
					path:"/pages/my/manageNavs/process/operate",
					query:{
						type:type,
						visitId:that.id
					}
				})
			},
			gotoAllDaily(){
				const that = this;
				this.$Router.push({
					path: "/pages/my/manageNavs/process/allDaily",
					query:{
						id:that.id
					}
				})
			},
			gotoAllReturn(){
				const that = this;
				this.$Router.push({
					path: "/pages/my/manageNavs/process/allReturn",
					query:{
						id:that.id
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
			gotoDaily(id){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/journal/detail",
					query:{
						id:id
					}
				})
			},
			gotoContract(id){
				const that = this;
				that.$Router.push({
					path:"/pages/my/manageNavs/contract/detail",
					query:{
						id:id
					}
				})
			},
			previewImage(url) {
				const that = this;
				that.imgList = [];
				that.imgList.push(url);
				uni.previewImage({
					urls: that.imgList,
					current: that.imgList[0]
				});
			
			},
		}
	}
</script>

<style>
	page {
		background-color: #F7F7F7;
	}

	.headerStatus {
		position: fixed;
		width: 100%;
		height: 190rpx;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: calc(44px + env(safe-area-inset-top));
		/* #endif */
		box-sizing: border-box;
		padding: 30rpx 0;
		background-color: #FFFFFF;
		box-shadow: 0 18rpx 20rpx 0 rgba(229,229,229,0.60);
		z-index: 100;
	}

	.headerScroll {
		white-space: nowrap;
		width: 100%;
		height: 130rpx;
		margin: 0 auto;
	}
	.statusItem{
		display: inline-block;
		vertical-align: top;
		width: 136rpx;
		height: 100rpx;
		position: relative;
	}
	.statusItem::before{
		content: "";
		position: absolute;
		width: 36rpx;
		height: 12rpx;
		background-color: #EEEEEE;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
	}
	.statusItem.active::before{
		background-color: #1DCFDA;
	}
	.statusItem:first-child{
		width: 100rpx;
		margin-left: 40rpx;
	}
	.statusItem:last-child{
		margin-right: 40rpx;
	}
	.statusItem:first-child::before{
		display: none;
	}
	.circle{
		position: absolute;
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
		background-color: #999999;
		box-shadow: 0 4rpx 20rpx 0 rgba(174,174,174,0.70);
		right: 0;
		top: 0;
		box-sizing: border-box;
		padding: 0 20rpx;
		line-height: 30rpx;
		font-size: 26rpx;
		color: #FFFFFF;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		white-space: initial;
		text-align: center;
		z-index: 1;
	}
	.statusItem.active .circle{
		background-image: linear-gradient(225deg, #1DE9B6 0%, #1DC4E9 100%);
	}
	.content{
		padding-top: 190rpx;
	}
	.staffInfoBox{
		padding:50rpx 30rpx;
		margin-bottom: 20rpx;
	}
	.marginBtm0{
		margin-bottom: 0;
	}
	.processBox{
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
	}
	.processBoxHead{
		padding: 0 30rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #E5E5E5;
	}
	.boxHeadLeft{
		flex: 1;
		height: 100%;
		font-size: 34rpx;
		color: #222222;
		line-height: 88rpx;
	}
	.boxHeadLeft .num{
		font-size: 28rpx;
		color: #555555;
		margin-left: 12rpx;
	}
	.recordItem{
		border-bottom: 1rpx solid #E5E5E5;
	}
	.recordItem:last-child{
		border-bottom: none;
	}
	.annexBox{
		line-height: 44rpx;
		font-size: 26rpx;
		color: #555555;
		padding-bottom: 20rpx;
	}
	
	.progressBox{
		background-color: #FFFFFF;
	}
	.progressItem{
		padding: 40rpx 30rpx;
			border-bottom: 1rpx solid #E5E5E5;
	}
	.progressHead{
		display: flex;
		align-items: center;
	}
	.progressName{
		font-size: 32rpx;
		color: #222222;
		margin-left: 20rpx;
	}
	.progressTips{
		padding-left: 56rpx;
		margin-top: 20rpx;
	}
	.progressTipsText{
		line-height: 42rpx;
		color: #555555;
		font-size: 26rpx;
	}
	.progressTipsAnnex{
		line-height: 42rpx;
		color: #555555;
		font-size: 26rpx;
		margin-bottom: 30rpx;
		padding-top: 10rpx;
	}
	.progressTipsAnnex .lookAnnex{
		margin-top: 0;
		margin-bottom: 20rpx;
	}
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
