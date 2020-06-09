<template>
	<view class="container" v-if="hasLoad">
		<view class="headerBox">
			<swiper class="swiper" circular indicator-dots="true" indicator-color="rgba(255,255,255,0.80)"
			 indicator-active-color="rgba(205,40,47,0.80)">
				<swiper-item v-for="(item, index) in bannerList" :key="index" class="swiper-item" @click="previewImage(index)">
					<view class="swiperBox">
						<image :src="item" class="bannerBg" mode="aspectFill"></image>
						<view class="shardowBox"></view>
						<image :src="item" class="bannerImg" mode="aspectFit" />
					</view>
				</swiper-item>
			</swiper>
			<view :class="{'goodsStatusBox':true,'statusFixed':scrollTop>scrollTag1}">
				<block v-if="houseInfo.paimaiStatus==1">
					<text class="statusLabel statusLabel1">即将开始</text>
					<text class="statusTime">{{houseInfo.timeText}}开始</text>
				</block>
				<block v-else-if="houseInfo.paimaiStatus==2">
					<text class="statusLabel statusLabel2">拍卖中</text>
					<text class="statusTime">{{houseInfo.timeText}}结束</text>
				</block>
				<block v-else>
					<text class="statusLabel statusLabel3">已结束</text>
					<text class="statusTime">{{houseInfo.timeText}}结束</text>
				</block>
			</view>
			<view class="goodsStatusBox" v-if="scrollTop>scrollTag1"></view>
			<view class="goodsInfoBox">
				<view class="goodsTitle">{{houseInfo.paimaiTimesText}} | {{houseInfo.title}}</view>
				<view class="goodsJoinNum">
					{{houseDetail.accessEnsureNum}}人报名<text>/</text>{{houseDetail.accessNum}}人围观
				</view>
				<view class="startingPrice" v-if="houseInfo.paimaiStatus==1">
					<text class="priceLabel">起拍价</text>
					<view class="priceCont">
						<text class="priceSymbol">￥</text>
						<text class="amount">{{houseInfo.currentPriceText}}</text>
					</view>
				</view>
				<view class="startingPrice inPrice" v-else-if="houseInfo.paimaiStatus==2">
					<text class="priceLabel">当前价</text>
					<view class="priceCont">
						<text class="priceSymbol">￥</text>
						<text class="amount">{{houseInfo.currentPriceText}}</text>
					</view>
				</view>
				<view class="startingPrice endPrice" v-else>
					<text class="priceLabel">成交价</text>
					<view class="priceCont">
						<block v-if="houseDetail.dealPriceText">
							<text class="priceSymbol">￥</text>
							<text class="amount">{{houseDetail.dealPriceText}}</text>
						</block>
						<block v-else>
							<text class="noPrice">无</text>
						</block>
					</view>
				</view>
				<view class="assPrice">
					<text class="priceLabel">评估价</text>
					<view class="priceCont">
						<text class="priceSymbol">￥</text>
						<text class="amount">{{houseInfo.assessmentPriceText}}</text>
					</view>
				</view>
			</view>
		</view>
		<view :class="{'navs':true,'navsFixed':scrollTop>scrollTag2}">
			<view :class="{'navItem':true,'navActive':navCurrent==0}" @click="navTap(0)">
				详情
			</view>
			<view :class="{'navItem':true,'navActive':navCurrent==1}" @click="navTap(1)">
				出价记录（{{recordList.length}}）
			</view>
			<view :class="{'navItem':true,'navActive':navCurrent==2}" @click="navTap(2)">
				同区域成交
			</view>

		</view>
		<view class="navs" v-if="scrollTop>scrollTag2"></view>
		<view class="tabBox1">
			<view class="infoList">
				<view class="infoListItem">起拍价：￥{{houseInfo.currentPriceText}}</view>
				<view class="infoListItem">加价幅度：￥{{houseDetail.priceLowerOffset}}</view>
				<view class="infoListItem">折扣率：{{houseInfo.discount}}折</view>
				<view class="infoListItem">保证金：￥{{houseDetail.ensurePrice}}</view>
				<view class="infoListItem">房源类型：{{houseInfo.houseTypeText}}</view>
			</view>
			<view class="descBox">
				<view class="descBoxHead">
					竞买须知
				</view>
				<view :class="{'descBoxCont':true,'descIsOpen':descIsOpen1}">
					<!-- <rich-text :nodes="noticeHtml"></rich-text> -->
					<jyf-parser :html="noticeHtml" ref="article" autoscroll></jyf-parser>
					<view class="descLookAll" @click="openDesc(1)" v-if="!descIsOpen1">
						<text class="descLookAllText">查看全部</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowdown" />
					</view>
					<view class="descLookAll" @click="openDesc(1)" v-else>
						<text class="descLookAllText">收起</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowup" />
					</view>
				</view>
			</view>
			<view class="descBox">
				<view class="descBoxHead">
					竞买公告
				</view>
				<view :class="{'descBoxCont':true,'descIsOpen':descIsOpen2}">
					<!-- <rich-text :nodes="announcementHtml"></rich-text> -->
					<jyf-parser :html="announcementHtml" ref="article" autoscroll></jyf-parser>
					<view class="descLookAll" @click="openDesc(2)" v-if="!descIsOpen2">
						<text class="descLookAllText">查看全部</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowdown" />
					</view>
					<view class="descLookAll" @click="openDesc(2)" v-else>
						<text class="descLookAllText">收起</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowup" />
					</view>
				</view>
			</view>
			<view class="descBox">
				<view class="descBoxHead">
					标的物详情
				</view>
				<view :class="{'descBoxCont':true,'descIsOpen':descIsOpen3}">
					<scroll-view scroll-x="true" >
						<rich-text :nodes="descriptionHtml"></rich-text>
					</scroll-view>
					
					<!-- <jyf-parser :html="descriptionHtml" ref="article" autoscroll></jyf-parser> -->
					<view class="descLookAll" @click="openDesc(3)" v-if="!descIsOpen3">
						<text class="descLookAllText">查看全部</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowdown" />
					</view>
					<view class="descLookAll" @click="openDesc(3)" v-else>
						<text class="descLookAllText">收起</text>
						<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowup" />
					</view>
				</view>
			</view>
		</view>
		<view class="tabBox2">
			<view class="tabBoxHead">
				出价记录（{{recordList.length}}）
			</view>
			<view :class="{'priceTable':true,'descIsOpen':offerIsOpen}" v-if="recordList.length>0">
				<view class="tableHead">
					<view class="td td1">状态</view>
					<view class="td td2">竞买号</view>
					<view class="td td3">价格</view>
					<view class="td td4">同区域成交</view>
				</view>
				<view class="tableCont">
					<view class="tr" v-for="(item,index) in recordList" :key="index">
						<view class="td td1" v-if="index==0">
							<view class="offerStatus isFirst" v-if="houseInfo.paimaiStatus==2">
								领先
							</view>
							<view class="offerStatus hasDone" v-else-if="houseInfo.paimaiStatus==3">
								成交
							</view>
						</view>
						<view class="td td1" v-else>
							<view class="offerStatus">
								出局
							</view>
						</view>
						<view class="td td2">
							{{item.bidName}}
						</view>
						<view class="td td3">
							￥{{item.bidPrice}}
						</view>
						<view class="td td4">
							{{item.bidTime}}
						</view>
					</view>

				</view>
				<view class="descLookAll" @click="openOffers" v-if="!offerIsOpen">
					<text class="descLookAllText">查看全部</text>
					<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowdown" />
				</view>
				<view class="descLookAll" @click="openOffers" v-else>
					<text class="descLookAllText">收起</text>
					<uni-icons class="arrowIcons" color="#b8b8b8" size="18" type="arrowup" />
				</view>
			</view>
			<view class="noRecord" v-else>
				<image src="../../static/images/noRecord.png" mode="widthFix" class="noRecordImg"></image>
				<text class="noRecordText">暂无出价记录</text>
			</view>
		</view>
		<view class="tabBox3">
			<view class="tabBoxHead">
				同区域历史成交
			</view>
			<view class="goodsList" v-if="total!==0">
				<view class="goodsItem" v-for="(item,index) in dealList" :key="index" @click="itemTap(item.paimaiId,item.houseSource)">
					<view class="goodsPic">
						<text class="goodsTag">{{item.paimaiTimesText}}</text>
						<image class="goodsImage" :src="item.productImage" mode="aspectFill"></image>
					</view>
					<view class="goodsInfo">
						<view class="goodsName">{{item.title}}</view>
						<view class="goodsAddress nowrap" v-if="item.paimaiStatus==1">{{item.accessNum}}次围观/{{item.title}}</view>
						<view class="goodsAddress nowrap" v-else>{{item.bidCount}}次出价 / {{item.countyName}}</view>
						<view class="goodsPrice"><text class="priceLabel">当前价</text><text class="priceNum">{{item.currentPriceText}}万</text>
							<text v-if="item.discount!=10" class="discount">{{item.discount}}折</text></view>
						<view class="goodsStatus goodsStatus1" v-if="item.paimaiStatus==1"><text class="statusName">未开始</text><text class="goodsTime">{{item.timeText}}开始</text></view>
						<view class="goodsStatus goodsStatus2" v-else-if="item.paimaiStatus==2"><text class="statusName">拍卖中</text><text
							 class="goodsTime">{{item.timeText}}开始</text></view>
						<view class="goodsStatus goodsStatus3" v-else><text class="statusName">已结束</text><text class="goodsTime">{{item.timeText}}结束</text></view>
					</view>
				</view>
				<uni-load-more iconType="snow" :status="loadStatus" />
			</view>
			<view class="noRecord" v-else>
				<image src="../../static/images/noRecord.png" mode="widthFix" class="noRecordImg"></image>
				<text class="noRecordText">暂无同区域历史成交</text>
			</view>
		</view>
		<view class="consultantBtns">
			<view class="consultBtn" v-if="collected==0" @click="collectHouse">
				<image class="consultBtnImg" src="../../static/images/follow.png"></image>
				<view class="consultBtnText">
					收藏
				</view>
			</view>
			<view class="consultBtn hasFollow" v-else>
				<image class="consultBtnImg" src="../../static/images/hasFollowed.png"></image>
				<view class="consultBtnText">
					已收藏
				</view>
			</view>
			<view class="consultBtn consultBtn2" @click="gotoChat">
				<image class="consultBtnImg" src="../../static/images/Cons.png"></image>
				<view class="consultBtnText">
					咨询
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 103922280,1
				// 611884335520,2
				// 613252498368,2
				paimaiId: "611884335520",
				houseSource: 2,
				houseInfo: "",
				houseDetail: "",
				noticeHtml: "",
				announcementHtml: "",
				descriptionHtml: "",
				dealPage: 1,
				pageNum: 10,
				total: "",
				dealList: [],
				loadStatus: 'more',
				hasLoad: false,
				descIsOpen1: false,
				descIsOpen2: false,
				descIsOpen3: false,
				descIsOpen4: false,
				offerIsOpen: false,
				scrollTop: 0,
				goodsStatusBoxHeight: 0,
				scrollTag1: 0,
				scrollTag2: 0,
				scrollTag3: 0,
				scrollTag4: 0,
				navCurrent: 0,
				bannerList: [],
				recordList: [],
				houseList: [],
				collected: false
			}
		},
		onLoad(options) {
			const that = this;
			that.paimaiId = options.paimaiId;
			that.houseSource = options.houseSource;
			that.getHouseDetail(that.paimaiId, that.houseSource);
			that.houseDetailRecord(that.paimaiId, that.houseSource);
			that.collectState(that.paimaiId, that.houseSource);
			that.querynotice();
			that.queryannouncement();
			that.queryproductdescription();
		},

		onReady() {
			let that = this;
			setTimeout(() => {
				that.$utils.getBoxheight(`.goodsStatusBox`, (rects) => {
					that.goodsStatusBoxHeight = rects[0].height;
				});
				that.$utils.getBoxheight(`.swiper`, (rects) => {
					that.scrollTag1 = rects[0].height;
				});
				that.$utils.getBoxheight(`.headerBox`, (rects) => {
					that.scrollTag2 = rects[0].height - that.goodsStatusBoxHeight;
				});
				that.$utils.getBoxheight(`.tabBox1`, (rects) => {
					that.scrollTag3 = rects[0].height + that.scrollTag2;
				});
				that.$utils.getBoxheight(`.tabBox2`, (rects) => {
					that.scrollTag4 = rects[0].height + that.scrollTag3;

				});
			}, 300)

		},
		methods: {
			//转义方法
			escape2Html(str) {
				var arrEntities = {
					'lt': '<',
					'gt': '>',
					'nbsp': ' ',
					'amp': '&',
					'quot': '"'
				};
				return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
					return arrEntities[t];
				}).replace('<section', '<div').replace('<img', '<img style="max-width:100%;height:auto" ');
			},
			getHouseDetail(paimaiId, houseSource) {
				const that = this;
				uni.showLoading({
					title: "加载中..."
				})
				let param = {
					paimaiId: paimaiId,
					houseSource: houseSource
				}
				that.$api.houseDetail(param).then(res => {
					uni.hideLoading();
					if (res.success) {
						let houseDetail = res.datas.houseDetailDO;
						let houseInfo = res.datas.houseInfoDO;
						that.bannerList = JSON.parse(houseDetail.imgList);
						var nowTime = new Date().getTime();
						var startTime = new Date(houseInfo.startTime).getTime();
						var endTime = new Date(houseInfo.endTime).getTime();
						if (startTime > nowTime) {
							houseInfo.paimaiStatus = 1; //未开始	
							houseInfo.timeText = that.$utils.formatTime(startTime, 'MM月DD日 hh:mm');
						} else if (nowTime >= startTime && nowTime <= endTime) {
							houseInfo.paimaiStatus = 2; //拍卖中
							houseInfo.timeText = that.$utils.formatTime(endTime, 'MM月DD日 hh:mm');
						} else {
							houseInfo.paimaiStatus = 3; //已结束
							houseInfo.timeText = that.$utils.formatTime(endTime, 'YYYY年MM月DD日');
						}
						if (houseInfo.paimaiTimes == 1) {
							houseInfo.paimaiTimesText = "一拍";
						} else if (houseInfo.paimaiTimes == 2) {
							houseInfo.paimaiTimesText = "二拍";
						} else if (houseInfo.paimaiTimes == 4) {
							houseInfo.paimaiTimesText = "变卖";
						} else if (houseInfo.paimaiTimes == 5) {
							houseInfo.paimaiTimesText = "重新拍卖";
						}
						houseDetail.dealPriceText = that.$utils.formatCurrency(houseDetail.dealPrice); //成交价
						houseInfo.assessmentPriceText = that.$utils.formatCurrency(houseInfo.assessmentPrice); //评估价
						houseInfo.currentPriceText = that.$utils.formatCurrency(houseInfo.currentPrice); //当前价
						if (houseInfo.houseType == 1) {
							houseInfo.houseTypeText = '住宅用房';
						} else if (houseInfo.houseType == 2) {
							houseInfo.houseTypeText = '商业用房';
						} else if (houseInfo.houseType == 3) {
							houseInfo.houseTypeText = '工业用房';
						} else if (houseInfo.houseType == 4) {
							houseInfo.houseTypeText = '其他';
						}
						// houseDetail.productDescription=houseDetail.productDescription.replace(/width:[^;]+;/gi, 'max-width:100%;');
						// houseDetail.productDescription=houseDetail.productDescription.replace(/width=[^;]+;/gi, 'width="100%');
						// houseDetail.productDescription=houseDetail.productDescription.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
						// houseDetail.notice=houseDetail.notice.replace(/\\&quot;/gi,'"')
						that.houseDetail = houseDetail;
						that.houseInfo = houseInfo;
						that.hasLoad = true;
						that.dealdoneList(houseInfo.cityId, 1);
						that.browsesAdd();
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			dealdoneList(id, dealPage) {
				const that = this;
				let param = {
					cityId: id,
					startPage: dealPage
				}
				that.loadStatus = "loading";
				that.$api.dealdoneList(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
						for (var i in result) {
							result[i].currentPriceText = (result[i].currentPrice * 0.0001).toFixed(2);
							if (result[i].paimaiTimes == 1) {
								result[i].paimaiTimesText = "一拍";
							} else if (result[i].paimaiTimes == 2) {
								result[i].paimaiTimesText = "二拍";
							} else if (result[i].paimaiTimes == 4) {
								result[i].paimaiTimesText = "变卖";
							} else if (result[i].paimaiTimes == 5) {
								result[i].paimaiTimesText = "重新拍卖";
							}
							var nowTime = new Date().getTime();
							var startTime = new Date(result[i].startTime).getTime();
							var endTime = new Date(result[i].endTime).getTime();
							if (startTime > nowTime) {
								result[i].paimaiStatus = 1; //未开始	
								result[i].timeText = that.$utils.formatTime(startTime, 'MM月DD日 hh:mm');
							} else if (nowTime >= startTime && nowTime <= endTime) {
								result[i].paimaiStatus = 2; //拍卖中
								result[i].timeText = that.$utils.timeCount(endTime);
							} else {
								result[i].paimaiStatus = 3; //已结束
								result[i].timeText = that.$utils.formatTime(endTime, 'YYYY年MM月DD日');
							}
							that.dealList.push(result[i])
						}
						let total = res.datas.total;
						that.total = total;
						let totalPageNum = Math.ceil(total / 10);
						if (parseInt(totalPageNum) > parseInt(that.pageNum)) {
							that.dealPage++;
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
			querynotice() {
				const that = this;
				let param = {
					paimaiId: that.paimaiId,
					houseSource: that.houseSource
				}
				that.$api.querynotice(param).then(res => {
					if (res.success) {
						that.noticeHtml = that.escape2Html(res.datas);
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			queryannouncement() {
				const that = this;
				let param = {
					paimaiId: that.paimaiId,
					houseSource: that.houseSource
				}
				that.$api.queryannouncement(param).then(res => {
					if (res.success) {
						that.announcementHtml = res.datas;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			itemTap(paimaiId, houseSource) {
				this.$Router.push({
					path: "/pages/home/goodsDetail",
					query: {
						paimaiId: paimaiId,
						houseSource: houseSource
					}
				})
			},
			queryproductdescription() {
				const that = this;
				let param = {
					paimaiId: that.paimaiId,
					houseSource: that.houseSource
				}
				that.$api.queryproductdescription(param).then(res => {
					if (res.success) {
						that.descriptionHtml = res.datas;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},

			browsesAdd() {
				const that = this;
				let param = {
					paimaiId: that.paimaiId,
					houseSource: that.houseSource
				}
				that.$api.browsesAdd(param).then(res => {
					if (res.success) {} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			houseDetailRecord(paimaiId, houseSource) {
				const that = this;
				let param = {
					paimaiId: paimaiId,
					houseSource: houseSource
				}
				that.$api.houseDetailRecord(param).then(res => {
					if (res.success) {
						var result = res.datas;
						that.recordList = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			collectState(paimaiId, houseSource) {
				const that = this;
				let param = {
					paimaiId: paimaiId,
					houseSource: houseSource
				}
				that.$api.collectState(param).then(res => {
					if (res.success) {
						var result = res.datas.collected;
						that.collected = result;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			collectHouse() {
				const that = this;
				let param = {
					paimaiId: that.paimaiId,
					houseSource: that.houseSource
				}
				that.$api.houseCollect(param).then(res => {
					if (res.success) {
						that.collected = 1;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			gotoChat() {
				const that = this;
				let param = {}
				that.$api.chatGetcsinfo(param).then(res => {
					if (res.success) {
						let chatUserId = res.datas.csId;
						let myUserId = res.datas.curUserId;
						that.$Router.push({
							path: "/pages/consultant/charRoom",
							query: {
								myUserId: myUserId,
								chatUserId: chatUserId
							}
						})
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
					urls: that.bannerList,
					current: that.bannerList[index]
				});

			},
			onPageScroll(e) {
				let that = this;
				that.scrollTop = e.scrollTop;
				if (e.scrollTop <= that.scrollTag3) {
					that.navCurrent = 0;
				} else if (e.scrollTop > that.scrollTag3 && e.scrollTop <= that.scrollTag4 && that.scrollTag3 != 0) {
					that.navCurrent = 1;
				} else if (e.scrollTop > that.scrollTag4 && that.scrollTag4 != 0) {
					that.navCurrent = 2;
				}
			},
			openDesc: function(index) {
				let that = this;
				if (index == 1) {
					that.descIsOpen1 = !that.descIsOpen1;
				} else if (index == 2) {
					that.descIsOpen2 = !that.descIsOpen2;
				} else if (index == 3) {
					that.descIsOpen3 = !that.descIsOpen3;
				} else if (index == 4) {
					that.descIsOpen4 = !that.descIsOpen4;
				}
				setTimeout(() => {
					that.$utils.getBoxheight(`.tabBox1`, (rects) => {
						that.scrollTag3 = rects[0].height + that.scrollTag2;
					});
					that.$utils.getBoxheight(`.tabBox2`, (rects) => {
						that.scrollTag4 = rects[0].height + that.scrollTag3;
					});
				}, 500)
			},
			navTap: function(index) {
				let that = this;
				let scrollTo = 0;
				if (index == 0) {
					scrollTo = that.scrollTag2;
				} else if (index == 1) {
					scrollTo = that.scrollTag3 + 10;
				} else if (index == 2) {
					scrollTo = that.scrollTag4 + 10;
				}
				uni.pageScrollTo({
					duration: 600,
					scrollTop: scrollTo
				})
			},
			openOffers: function(e) {
				let that = this;
				that.offerIsOpen = !that.offerIsOpen;
				setTimeout(() => {
					that.$utils.getBoxheight(`.tabBox2`, (rects) => {
						that.scrollTag4 = rects[0].height + that.scrollTag3;
					});
				}, 500)
			},

		},
	}
</script>

<style>
	.swiper {
		height: 558rpx;
	}

	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #999;
		color: #fff;
	}

	.swiperBox {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.swiperBox .bannerBg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transform: scale(1.3);
		filter: blur(10px);
		-webkit-filter: blur(10px);
		overflow: hidden;
	}

	.swiperBox .shardowBox {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .4);
		z-index: 1;
	}

	.swiperBox .bannerImg {
		position: absolute;
		width: inherit;
		height: inherit;
		z-index: 2;
	}

	.goodsStatusBox {
		width: 100%;
		height: 68rpx;
		display: flex;
		line-height: 68rpx;
		background-color: #DDDDDD;
	}

	.statusLabel {
		display: block;
		width: 208rpx;
		font-size: 30rpx;
		text-align: center;
		color: #ffffff;
	}

	.statusLabel1 {
		background: #00BBC3;
	}

	.statusLabel2 {
		background: #CD282F;
	}

	.statusLabel3 {
		background: #999999;
	}

	.statusTime {
		flex: 1;
		padding-left: 30rpx;
		color: #222222;
		font-size: 28rpx;
		background: #DDDDDD;
	}

	.goodsInfoBox {
		padding: 20rpx 30rpx 30rpx 30rpx;
	}

	.goodsList {
		padding: 30rpx 30rpx 0 30rpx;
	}

	.goodsTitle {
		font-size: 34rpx;
		color: #222222;
		line-height: 48rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.goodsJoinNum {
		font-size: 26rpx;
		color: #555555;
		line-height: 36rpx;
		margin-top: 10rpx;
	}

	.goodsJoinNum .backslash {
		color: #B8B8B8;
		padding: 0 10rpx;
	}

	.startingPrice {
		margin-top: 20rpx;
		display: flex;
		align-items: flex-end;
	}

	.assPrice {
		display: flex;
		align-items: flex-end;
		margin-top: 10rpx;
	}

	.priceLabel {
		display: block;
		width: 100rpx;
		font-size: 26rpx;
		color: #B8B8B8;
	}

	.priceCont {
		flex: 1;
	}

	.startingPrice .priceLabel {
		font-size: 28rpx;
		line-height: 50rpx;
	}

	.startingPrice .amount {
		font-size: 48rpx;
	}

	.startingPrice .priceCont {
		color: #00BBC3;
	}

	.inPrice .priceCont {
		color: #CD282F;
	}

	.endPrice .priceCont {
		color: #CD282F;
	}

	.assPrice .priceCont {
		color: #222222;
		font-size: 28rpx;
	}

	.noPrice {
		line-height: 50rpx;
	}

	.navs {
		height: 90rpx;
		width: 100%;
		box-shadow: 0 9rpx 25rpx 0 #E5E5E5;
		background-color: #fff;
	}

	.navsFixed {
		position: fixed;
		left: 0;
		top: 68rpx;
		z-index: 999;
	}

	.navItem {
		width: 33.3%;
		height: 90rpx;
		position: relative;
		text-align: center;
		line-height: 90rpx;
		color: #555555;
		font-size: 28rpx;
		float: left;
	}

	.navItem.navActive {
		color: #CD282F;
	}

	.navItem.navActive::after {
		content: "";
		position: absolute;
		display: block;
		width: 52rpx;
		height: 6rpx;
		background: #CD282F;
		border-radius: 2rpx;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
	}

	.infoList {
		padding: 30rpx;
		overflow: hidden;
	}

	.infoListItem {
		width: 50%;
		box-sizing: border-box;
		padding-right: 20rpx;
		font-size: 24rpx;
		color: #222222;
		line-height: 50rpx;
		float: left;
	}

	.descBox {
		border-top: 1rpx solid #eaeaea;
		padding: 30rpx;
	}

	.descBoxHead {
		font-size: 28rpx;
		color: #CD282F;
	}

	.descBoxCont {
		height: 480rpx;
		overflow: hidden;
		position: relative;
		padding-bottom: 70rpx;
		margin-top: 20rpx;
	}

	.descIsOpen {
		height: auto !important;
		max-height: inherit !important;
	}

	.descLookAll {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		padding-top: 60rpx;
		box-sizing: border-box;
		color: #B8B8B8;
		font-size: 24rpx;
		line-height: 54rpx;
		text-align: center;
		background: linear-gradient(to bottom, rgba(255, 255, 255, .3), rgba(255, 255, 255, 1), rgba(255, 255, 255, 1));
	}

	.descIsOpen .descLookAll {
		height: 70rpx;
		background: #ffffff;
		padding-top: 10rpx;
	}

	.descLookAll .descLookAllText {
		display: inline-block;
		vertical-align: middle;
		padding: 0 5rpx;
	}

	.descLookAll .arrowIcons {
		display: inline-block;
		vertical-align: middle;
	}

	.tabBox2,
	.tabBox3 {
		border-top: 20rpx solid #F7F7F7;
		padding: 30rpx 0;
	}

	.tabBoxHead {
		color: #555555;
		font-size: 28rpx;
		line-height: 35rpx;
		padding-left: 30rpx;
	}

	.priceTable {
		position: relative;
		margin-top: 20rpx;
		padding-bottom: 70rpx;
		max-height: 280rpx;
		overflow: hidden;
	}

	.tableHead {
		height: 70rpx;
		line-height: 70rpx;
		border-bottom: 1rpx solid #DDDDDD;
	}

	.tableHead .td {
		font-size: 24rpx;
		color: #888888;
		float: left;
		text-align: center;
	}

	.td1 {
		width: 130rpx;
	}

	.td2 {
		width: 140rpx;
	}

	.td3 {
		width: 190rpx;
	}

	.td4 {
		width: 290rpx;
	}

	.tableCont .td {
		color: #222222;
		float: left;
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
	}

	.tableCont {
		padding-top: 20rpx;
	}

	.tableCont .tr {
		padding: 16rpx 0;
		height: 40rpx;
	}

	.offerStatus {
		width: 92rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		color: #FFFFFF;
		background: #DDDDDD;
		border-radius: 8rpx;
		font-size: 24rpx;
		margin: 0 auto;
	}

	.isFirst {
		background: #CD282F;
	}

	.hasDone {
		background: #D8AF60;
	}

	.statusFixed {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}

	.consultantBtns {
		position: fixed;
		right: 30rpx;
		bottom: 40rpx;
		width: 116rpx;
		height: 272rpx;
		z-index: 99;
	}

	.consultBtn {
		width: 116rpx;
		height: 116rpx;
		border-radius: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #FFFFFF;
		box-shadow: 0 0 20rpx 2rpx rgba(193, 193, 193, .2);
		margin-top: 20rpx;
		justify-content: center;
	}

	.consultBtn2 {
		background-color: #CD282F;
	}

	.consultBtnImg {
		width: 44rpx;
		height: 44rpx;
	}

	.consultBtn .consultBtnText {
		line-height: 40rpx;
		font-size: 24rpx;
	}

	.hasFollow .consultBtnText {
		color: #CD282F;
	}

	.consultBtn2 .consultBtnText {
		color: #FFFFFF;
	}

	.noRecord {
		height: 360rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.noRecord .noRecordImg {
		width: 200rpx;
	}

	.noRecord .noRecordText {
		color: #B8B8B8;
		font-size: 24rpx;
		line-height: 34rpx;
		margin-top: 20rpx;
		display: block;
	}
</style>
