<template>
	<view class="container" v-if="!hasLogin||userData">
		<!-- #ifdef APP-PLUS -->
		<view class="status">
			<view class="top-view"></view>
		</view>
		<!-- #endif -->
		<view class="userBox" v-if="!hasLogin">
			<view class="userInfoBox">
				<image class="defaultUserPhoto" src="../../static/images/defaultUserPic.png"></image>
				<view class="userInfoBoxCont">
					<view class="userName nowrap">
						未登录
					</view>
					<view class="userInfoBoxBot">
						<view class="userInfoBtn noLogin" @click="toLogin">
							登录/注册
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="userBox" v-else>
			<image :src="userData.headImgUrl" mode="aspectFill" class="blurBg"></image>
			<view class="userBoxShadow"></view>
			<view class="userInfoBox">
				<image class="userPhoto" :src="userData.headImgUrl"></image>
				<view class="userInfoBoxCont">
					<view class="userName nowrap">
						{{userData.nickName}}
					</view>
					<view class="userInfoBoxBot">
						<view class="userInfoBtn" @click="edit">
							<text class="editIcon"></text>编辑资料
						</view>
						<view class="toSelfPage" @click="gotoSelfPage">
							个人主页
							<uni-icons class="gotoIcon" color="#B8B8B8" size="18" type="arrowright"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="userBtnsBox1">
			<uni-grid :column="4" :show-border="false" @change="btnTap1">
				<uni-grid-item v-for="(item,index) in navBtns1" :key="index" :index="index">
					<view class="grid-item-box">
						<image class="navBtnImg" :src="item.src" mode="aspectFill" />
						<view class="navBtnName">
							{{item.name}}
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="userBtnsBox2" v-if="hasLogin&&userType==2">
			<uni-grid :column="4" :show-border="false" @change="btnTap2">
				<uni-grid-item v-for="(item,index) in navBtns2" :key="index" :index="index">
					<view class="grid-item-box">
						<image class="navBtnImg" :src="item.icon" mode="aspectFill" />
						<view class="navBtnName">
							{{item.name}}
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="echatsBox" v-if="hasLogin">
			<view class="echatsItem1">
				<view class="chatHead">
					<view class="chatHeadLeft">
						成交统计
					</view>
				</view>
				<view class="threeNums">
					<view class="threeNumBox">
						<view class="numsTitle">今日成交 (套)</view>
						<view class="numsCont">{{chatAll.todayCount}}</view>
					</view>
					<view class="threeNumBox middleBox">
						<view class="numsTitle">本周成交 (套)</view>
						<view class="numsCont">{{chatAll.weekCount}}</view>
					</view>
					<view class="threeNumBox">
						<view class="numsTitle">本月成交 (套)</view>
						<view class="numsCont">{{chatAll.monthCount}}</view>
					</view>
				</view>
			</view>
			<view class="graphBox" v-if="userType==2">
				<view class="graphItem" @click="gotograph1">
					<image src="../../static/images/Graph1.png" class="graphImg" mode=""></image>
					<view class="graphTitle">
						<view class="graphText">
							员工成交排行
						</view>
						<image src="../../static/images/goRight.png" mode="" class="goRightIcon"></image>
					</view>
				</view>
				<view class="graphItem" @click="gotograph2">
					<image src="../../static/images/Graph2.png" class="graphImg" mode=""></image>
					<view class="graphTitle">
						<view class="graphText">
							推荐客户排行
						</view>
						<image src="../../static/images/goRight.png" mode="" class="goRightIcon"></image>
					</view>
				</view>
			</view>
			<view class="echatsItem2">
				<view class="chatHead">
					<view class="chatHeadLeft">
						拍品数量 (套)
					</view>
					<view class="seltab"  v-if="userType==2">
						<view :class="{'seltabItem':true,'active':tabCurrent1==0}" @click="tabChange1(0)">
							全部
						</view>
						<view :class="{'seltabItem':true,'active':tabCurrent1==1}" @click="tabChange1(1)">
							淘宝
						</view>
						<view :class="{'seltabItem':true,'active':tabCurrent1==2}" @click="tabChange1(2)">
							京东
						</view>
					</view>
				</view>
				<view class="qiun-charts">
					<canvas canvas-id="canvasColumn1" id="canvasColumn1" class="charts"></canvas>
				</view>
			</view>
			<view class="echatsItem2">
				<view class="chatHead">
					<view class="chatHeadLeft">
						拍品金额 (万元)
					</view>
					<view class="seltab"  v-if="userType==2">
						<view :class="{'seltabItem':true,'active':tabCurrent2==0}" @click="tabChange2(0)">
							全部
						</view>
						<view :class="{'seltabItem':true,'active':tabCurrent2==1}" @click="tabChange2(1)">
							淘宝
						</view>
						<view :class="{'seltabItem':true,'active':tabCurrent2==2}" @click="tabChange2(2)">
							京东
						</view>
					</view>
				</view>
				<view class="qiun-charts">
					<canvas canvas-id="canvasColumn2" id="canvasColumn2" class="charts"></canvas>
				</view>
			</view>
			<view class="echatsItem2">
				<view class="chatHead">
					<view class="chatHeadLeft">
						市场折价率 (%)
					</view>
				</view>
				<view class="qiun-charts">
					<canvas canvas-id="canvasLine1" id="canvasLine1" class="charts"></canvas>
				</view>
			</view>
			<view class="echatsItem2">
				<view class="chatHead">
					<view class="chatHeadLeft">
						成交趋势 (%)
					</view>
				</view>
				<view class="qiun-charts">
					<canvas canvas-id="canvasLine2" id="canvasLine2" class="charts"></canvas>
				</view>
			</view>
			<view class="echatsItem2">
				<view class="chatHead">
					<view class="chatHeadLeft">
						公司成交数量趋势分析 (套)
					</view>
				</view>
				<view class="qiun-charts">
					<canvas canvas-id="canvasLine3" id="canvasLine3" class="charts"></canvas>
				</view>
			</view>
		</view>
		<button type="default" class="logoutBtn" v-if="hasLogin" @click="logout">退出登录</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaColumn = null;
	var canvaLine = null;
	export default {
		computed: mapState(['hasLogin', 'userInfo']),
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				userData: "",
				tabCurrent1:0,
				tabCurrent2:0,
				chatAll: [],
				chatData1: [],
				chatData2: [],
				userType: 1,
				navBtns1: [{
						name: "我的收藏",
						src: '../../static/images/Btns/publicBtn1.png',
						router: '/pages/my/navs/myCollection'
					},
					{
						name: "最近浏览",
						src: '../../static/images/Btns/publicBtn2.png',
						router: '/pages/my/navs/history'
					},
					{
						name: "进度查询",
						src: '../../static/images/Btns/publicBtn3.png',
						router: '/pages/my/navs/recordTypeC'

					},
					{
						name: "帮助与反馈",
						src: '../../static/images/Btns/publicBtn4.png',
						router: '/pages/my/navs/feedback'
					}
				],
				navBtns2: [
					//	 {
					// 		name: "日志",
					// 		src: '../../static/images/Btns/myBtn1.png',
					// 		router: '/pages/my/manageNavs/journal/list'
					// 	},
					// 	{
					// 		name: "回访",
					// 		src: '../../static/images/Btns/myBtn2.png',
					// 		router: '/pages/my/manageNavs/returnVisit/list'
					// 	},
					// 	{
					// 		name: "合同",
					// 		src: '../../static/images/Btns/myBtn3.png',
					// 		router: '/pages/my/manageNavs/contract/list'

					// 	},
					// 	{
					// 		name: "付款标记",
					// 		src: '../../static/images/Btns/myBtn4.png',
					// 		router: '/pages/my/manageNavs/payTag/list'
					// 	},
					// 	{
					// 		name: "尽职调查",
					// 		src: '../../static/images/Btns/myBtn5.png',
					// 		router: '/pages/my/manageNavs/inquire/list'
					// 	},
					// 	{
					// 		name: "贷款",
					// 		src: '../../static/images/Btns/myBtn6.png',
					// 		router: '/pages/my/manageNavs/loan/list'
					// 	},
					// 	{
					// 		name: "参拍",
					// 		src: '../../static/images/Btns/myBtn7.png',
					// 		router: '/pages/my/manageNavs/hasJoin/list'
					// 	},
					// 	{
					// 		name: "办理过户",
					// 		src: '../../static/images/Btns/myBtn8.png',
					// 		router: '/pages/my/manageNavs/transfer/list'
					// 	},
					// 	{
					// 		name: "腾退",
					// 		src: '../../static/images/Btns/myBtn9.png',
					// 		router: '/pages/my/manageNavs/vacate/list'
					// 	},
					// 	{
					// 		name: "交房",
					// 		src: '../../static/images/Btns/myBtn10.png',
					// 		router: '/pages/my/manageNavs/handed/list'
					// 	},
					// 	{
					// 		name: "公告",
					// 		src: '../../static/images/Btns/myBtn11.png',
					// 		router: '/pages/my/manageNavs/notice/list'
					// 	},
					// 	{
					// 		name: "员工",
					// 		src: '../../static/images/Btns/myBtn12.png',
					// 		router: '/pages/my/manageNavs/staff/list'
					// 	},
					// 	{
					// 		name: "兑换名额",
					// 		src: '../../static/images/Btns/myBtn13.png',
					// 		router: '/pages/my/manageNavs/exchange/index'
					// 	}
					// 
				]
			}
		},
		onLoad() {
			_self = this;
			if (this.hasLogin) {
				this.cWidth = uni.upx2px(690);
				this.cHeight = uni.upx2px(500);
				this.transactionstatistics();
				this.housestatisticscount("");
				this.housestatisticsamount("");
				this.transratiostatistics(1);
				this.transratiostatistics(2);
				this.corptransactionstatistics();
				this.getUserInfo();

			}


		},

		onShow() {
			if (this.hasLogin) {
				setTimeout(() => {
					this.getUserInfo();
				}, 300)
			}
		},
		methods: {
			...mapMutations(['logout']),
			reload() {
				if (this.hasLogin) {
					this.getUserInfo();
					this.transactionstatistics();
					this.housestatisticscount("");
					this.housestatisticsamount("");
					this.transratiostatistics(1);
					this.transratiostatistics(2);
					this.corptransactionstatistics();
				}
			},
			transactionstatistics() {
				const that = this;
				that.$api.transactionstatistics({}).then(res => {
					if (res.success) {
						let result = res.datas;
						that.chatAll = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			housestatisticscount(platform) {
				const that = this;
				let garam = {
					platform: platform
				}
				that.$api.housestatisticscount(garam).then(res => {
					if (res.success) {
						let result = res.datas;
						that.chatData1 = result;
						let column1 = {
							categories: [],
							series: [{
								"name": "挂拍住宅",
								"data": [],
								"color": "#1dd7cf",
							}, {
								"name": "成交住宅",
								"data": [],
								"color": "#9495d4",
							}]
						};
						for (var i in result) {
							column1.categories.push(result[i].month);
							column1.series[0].data.push(result[i].qty);
							column1.series[1].data.push(result[i].successQty);
						}
						that.showColumn("canvasColumn1", column1);
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			housestatisticsamount(platform) {
				const that = this;
				let garam = {
					platform: platform
				}
				that.$api.housestatisticsamount(garam).then(res => {
					if (res.success) {
						let result = res.datas;
						that.chatData2 = result;
						let column2 = {
							categories: [],
							series: [{
								"name": "挂拍住宅",
								"data": [],
								"color": "#1dd7cf",
							}, {
								"name": "成交住宅",
								"data": [],
								"color": "#9495d4",
							}]
						};
						for (var i in result) {
							column2.categories.push(result[i].month);
							column2.series[0].data.push(result[i].allAMount);
							column2.series[1].data.push(result[i].allSuccessAMount);
						}
						that.showColumn("canvasColumn2", column2);
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			transratiostatistics(type) {
				const that = this;
				let garam = {
					type: type
				}
				that.$api.transratiostatistics(garam).then(res => {
					if (res.success) {
						let result = res.datas;
						that.chatData3 = result;
						let seriesName="";
						if(type==1){
							seriesName="市场折价率 (%)";
						}
						else{
							seriesName="成交率"
						}
						let line1 = {
							categories: [],
							series: [{
								"name": seriesName,
								"data": [],
								"color": "#04A9F5",
							}]
						};
						for (var i in result) {
							line1.categories.push(result[i].month);
							line1.series[0].data.push(result[i].ratio);
						}
						if(type==1){
							that.showLine("canvasLine1", line1);
						}
						else{
							that.showLine("canvasLine2", line1);
						}
						
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			corptransactionstatistics(type) {
				const that = this;
				let garam = {
				}
				that.$api.corptransactionstatistics().then(res => {
					if (res.success) {
						let result = res.datas;
						that.chatData3 = result;
						let line = {
							categories: [],
							series: [{
								"name": "成交付款完成的住宅",
								"data": [],
								"color": "#04A9F5",
							}]
						};
						for (var i in result) {
							line.categories.push(result[i].month);
							line.series[0].data.push(result[i].qty);
						}

						that.showLine("canvasLine3", line);

						
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			tabChange1(platform){
				const that = this;
				that.tabCurrent1=platform;
				var platformType = platform==0?"":platform;
				that.housestatisticscount(platformType);
			},
			tabChange2(platform){
				const that = this;
				that.tabCurrent2=platform;
				var platformType = platform==0?"":platform;
				that.housestatisticsamount(platformType);
			},
			showColumn(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					padding: [15, 15, 0, 5],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						data: [{
							position: 'left',
							axisLine: false,
							format: (val) => {
								return val.toFixed(0)
							},
						}]
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});

			},
			showLine(canvasId, chartData) {
				canvaLine = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'line',
					colors: ['#facc14', '#f04864', '#8543e0', '#90ed7d'],
					fontSize: 11,
					padding: [15, 15, 0, 15],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					dataLabel: false,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type: 'grid',
						gridColor: '#CCCCCC',
						gridType: 'dash',
						dashLength: 8,
						//disableGrid:true
					},
					yAxis: {
						gridType: 'dash',
						gridColor: '#CCCCCC',
						dashLength: 8,
						data: [{
							position: 'left',
							format: (val) => {
								return val.toFixed(0)
							},
						}]
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						line: {
							type: 'straight'
						}
					}
				});

			},
			getUserInfo() {
				const that = this;
				that.$api.userinfoQuery({}).then(res => {
					if (res.success) {
						let result = res.datas;
						result.headImgUrl = result.headImgUrl ? result.headImgUrl : '../../static/images/defaultUserPic.png';
						result.nickName = result.nickName ? result.nickName : result.mobile;
						that.userType = result.userType;
						if (result.userType == 2) {
							that.queryjiumenu();
							that.navBtns1[2].router = "/pages/my/navs/recordTypeB";
						} else {
							that.navBtns1[2].router = "/pages/my/navs/recordTypeC";
						}
						that.userData = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			queryjiumenu() {
				const that = this;
				that.$api.queryjiumenu().then(res => {
					if (res.success) {
						let result = res.datas;
						for (var i in result) {
							if (result[i].code == "log") {
								//回访
								result[i].icon = "../../static/images/Btns/myBtn1.png";
								result[i].router = "/pages/my/manageNavs/journal/list";
							} else if (result[i].code == "return_visit") {
								//回访
								result[i].icon = "../../static/images/Btns/myBtn2.png";
								result[i].router = "/pages/my/manageNavs/returnVisit/list";
							} else if (result[i].code == "contract") {
								//合同
								result[i].icon = "../../static/images/Btns/myBtn3.png";
								result[i].router = "/pages/my/manageNavs/contract/list";
							} else if (result[i].code == "pay") {
								//付款标记
								result[i].icon = "../../static/images/Btns/myBtn4.png";
								result[i].router = "/pages/my/manageNavs/payTag/list";
							} else if (result[i].code == "diligence") {
								//尽职调查
								result[i].icon = "../../static/images/Btns/myBtn5.png";
								result[i].router = "/pages/my/manageNavs/inquire/list";
							} else if (result[i].code == "loan") {
								//贷款
								result[i].icon = "../../static/images/Btns/myBtn6.png";
								result[i].router = "/pages/my/manageNavs/loan/list";
							} else if (result[i].code == "auction") {
								//参拍
								result[i].icon = "../../static/images/Btns/myBtn7.png";
								result[i].router = "/pages/my/manageNavs/hasJoin/list";
							} else if (result[i].code == "transfer") {
								//办理过户
								result[i].icon = "../../static/images/Btns/myBtn8.png";
								result[i].router = "/pages/my/manageNavs/transfer/list";
							} else if (result[i].code == "retreat") {
								//腾退
								result[i].icon = "../../static/images/Btns/myBtn9.png";
								result[i].router = "/pages/my/manageNavs/vacate/list";
							} else if (result[i].code == "over") {
								//交房
								result[i].icon = "../../static/images/Btns/myBtn10.png";
								result[i].router = "/pages/my/manageNavs/handed/list";
							} else if (result[i].code == "notice") {
								//公告
								result[i].icon = "../../static/images/Btns/myBtn11.png";
								result[i].router = "/pages/my/manageNavs/notice/list";
							} else if (result[i].code == "employee") {
								//员工管理
								result[i].icon = "../../static/images/Btns/myBtn12.png";
								result[i].router = "/pages/my/manageNavs/staff/list";
							}
						}
						that.navBtns2 = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			btnTap1(e) {
				this.$Router.push({
					path: this.navBtns1[e.detail.index].router
				})
			},
			btnTap2(e) {
				const that = this;
				this.$Router.push({
					path: this.navBtns2[e.detail.index].router
				})
			},
			toLogin() {
				const that = this;
				this.$Router.push({
					path: "/pages/my/login"
				})
			},
			gotoSelfPage() {
				const that = this;
				this.$Router.push({
					path: "/pages/my/selfPage"
				})
			},
			gotograph1() {
				const that = this;
				this.$Router.push({
					path: "/pages/my/statisticsEmy"
				})
			},
			gotograph2() {
				const that = this;
				this.$Router.push({
					path: "/pages/my/statisticsCus"
				})
			},
			edit() {
				const that = this;
				this.$Router.push({
					path: "/pages/my/edit"
				})
			}
		}
	}
</script>

<style>
	.userBox {
		width: 100%;
		height: 365rpx;
		background: url(../../static/images/userTopBg.png) no-repeat center;
		background-size: cover;
		position: relative;
		overflow: hidden;
	}

	.userInfoBox {
		position: absolute;
		width: 685rpx;
		height: 150rpx;
		top: 115rpx;
		left: 38rpx;
		display: flex;
		z-index: 4;
	}

	.userPhoto {
		width: 148rpx;
		height: 148rpx;
		border: 1rpx solid #FFFFFF;
		border-radius: 75rpx;
	}

	.defaultUserPhoto {
		width: 150rpx;
		height: 150rpx;
	}

	.userInfoBoxCont {
		width: 505rpx;
		height: 150rpx;
		padding-left: 30rpx;
	}

	.userName {
		line-height: 60rpx;
		color: #FFFFFF;
		font-size: 36rpx;
	}

	.userInfoBoxBot {
		height: 52rpx;
		margin-top: 25rpx;
		position: relative;
	}

	.userInfoBtn {
		width: 188rpx;
		height: 52rpx;
		border-radius: 26rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 24rpx;
		background-color: rgba(205, 40, 47, .5);
	}

	.userInfoBtn.noLogin {
		background-color: #CD282F;
	}

	.editIcon {
		display: block;
		width: 44rpx;
		height: 44rpx;
		background: url(../../static/images/editUser.png) no-repeat;
		background-size: cover;
		margin-right: 1rpx;
		margin-top: 2rpx;
	}

	.blurBg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transform: scale(1.2);
		filter: blur(10px);
		-webkit-filter: blur(10px);
		z-index: 2;
		overflow: hidden;
	}

	.userBoxShadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
		z-index: 3;
	}

	.toSelfPage {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #B8B8B8;
		position: absolute;
		top: 6rpx;
		right: 0;
	}

	.toSelfPage .gotoIcon {
		margin-left: 6rpx;
	}

	.userBtnsBox1 {
		padding: 30rpx;
		background: #FFFFFF;
		border-top-right-radius: 30rpx;
		border-top-left-radius: 30rpx;
		margin-top: -30rpx;
		z-index: 5;
		position: relative;
		width: 100%;
		box-sizing: border-box;
	}

	.grid-item-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.navBtnImg {
		width: 60rpx;
		height: 60rpx;
	}

	.navBtnName {
		margin-top: 16rpx;
		font-size: 26rpx;
		color: #555555;
	}

	.userBtnsBox2 {
		margin: 0 30rpx;
		padding-top: 50rpx;
		padding-bottom: 30rpx;
		border-top: 1rpx solid #E5E5E5;
	}

	.logoutBtn {
		margin: 30rpx 50rpx;
		font-size: 24rpx;
		color: #B8B8B8;
		padding: 10rpx;
		background-color: #FFFFFF;
	}

	.logoutBtn:active {
		background-color: #F7F7F7;
	}

	.echatsBox {
		border-top: 2rpx solid #E5E5E5;
		padding: 30rpx 0;
	}

	.echatsItem1 {
		margin-top: 20rpx;
		padding: 30rpx;
	}

	.echatsItem2 {
		margin-top: 20rpx;
		padding: 30rpx;
	}

	.chatHead {
		height: 60rpx;
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.chatHeadLeft {
		font-size: 36rpx;
		line-height: 50rpx;
		color: #222222;
		flex: 1;
	}

	.threeNums {
		margin-top: 40rpx;
		width: 100%;
		height: 150rpx;
		display: block;
	}

	.threeNumBox {
		width: 192rpx;
		height: 128rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
		float: left;
	}

	.numsTitle {
		font-size: 24rpx;
		color: #B8B8B8;
		line-height: 34rpx;
	}

	.numsCont {
		color: #555555;
		font-size: 35rpx;
		line-height: 36rpx;
		margin-top: 22rpx;

	}

	.middleBox {
		margin-left: 56rpx;
		margin-right: 56rpx;
	}

	.qiun-charts {
		width: 690upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 690upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.graphBox {
		width: 100%;
		height: 160rpx;
		display: flex;
		align-items: center;
	}

	.graphItem {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.graphImg {
		width: 80rpx;
		height: 48rpx;
	}

	.graphTitle {
		height: 40rpx;
		width: 100%;
		margin-top: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.graphText {
		color: #393C40;
		font-size: 28rpx;
	}

	.goRightIcon {
		width: 18rpx;
		height: 26rpx;
		display: block;
		margin-left: 16rpx;
	}
	.seltab{
		width: 324rpx;
		height: 54rpx;
		display: flex;
	}
	.seltabItem{
		width: 88rpx;
		height: 54rpx;
		text-align: center;
		line-height: 54rpx;
		box-sizing: border-box;
		border: 1rpx solid #DDDDDD;
		color: #B8B8B8;
		font-size: 24rpx;
		margin-left: 20rpx;
	}
	.seltabItem.active{
		color: #CD282F;
		border: 1rpx solid #CD282F;
	}
</style>
