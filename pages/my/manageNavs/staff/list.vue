<template>
	<view>
		<view class="headerBox">
			<view class="searchInputBox">
				<uni-icons color="#f44a33" class="searchIcon" size="18" type="search" />
				<input class="uni-input" placeholder="搜索员工姓名" confirm-type="search" @input="constantlySearch" placeholder-style="font-size:26rpx;color:#B8B8B8;"
				 v-model="searchVal" @confirm="search" />
			</view>
			<view class="searchCancel" v-if="searchVal.length>0" @click="searchCancel">
				取消
			</view>
		</view>
		<view class="customerList">
			<view class="compInfoBox">
				<image src="../../../../static/images/logo.png" mode="aspectFill" class="compPic"></image>
				<view class="compInfoCont">
					<view class="compName nowrap">法拍网</view>
					<view class="staffNum">
						共{{total}}名员工
					</view>
				</view>
				<view class="czBtn" @click="editBtn" v-if="!isEdit">
					管理员工
				</view>
				<view class="czBtn2" @click="editBtn" v-else>
					取消
				</view>
			</view>
			<view class="customerItem" v-for="(item,index) in list" :key="index">
				<view class="staffInfoBox" @click="gotoDetail(item.id)">
					<image :src="item.headImgUrl" class="customerImg"></image>
					<view class="customerInfo">
						<view class="customerNickName">
							{{item.name}}
						</view>
						<view class="customerName">
							{{item.mobile}}
						</view>
					</view>
				</view>
				<view class="staffEditBtns" v-if="isEdit">
					<image src="../../../../static/images/addia.png" class="staffItemBtn" @click="gotoDistri(item.id)"></image>
					<image src="../../../../static/images/edit.png" class="staffItemBtn" @click="czBtn(item.id,index)"></image>

				</view>
			</view>
		</view>
		<uni-load-more iconType="snow" :status="loadStatus" />
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
				loadStatus: "more",
				pageNum: 1,
				pageSize: 10,
				total: "",
				list: [],
				searchVal: "",
				timer: null,
				isEdit: false,
				staffList: [{
						name: "张三",
						img: "../../../../static/images/defaultUserPic.png",
						mobile: "13432221112",
						id: 1
					},
					{
						name: "李四",
						img: "../../../../static/images/defaultUserPic.png",
						mobile: "13432226222",
						id: 2
					},
					{
						name: "adsa",
						img: "../../../../static/images/defaultUserPic.png",
						mobile: "13432222262",
						id: 3
					},
					{
						name: "fasfas",
						img: "../../../../static/images/defaultUserPic.png",
						mobile: "13432222432",
						id: 4
					},
					{
						name: "aaaa",
						img: "../../../../static/images/defaultUserPic.png",
						mobile: "13432221222",
						id: 5
					}
				]
			}
		},
		onLoad() {
			this.clearList();
			this.getList(1);
		},
		methods: {
			reload() {
				this.clearList();
				this.getList(1);
			},
			getList(startPage) {
				const that = this;
				let param = {
					name: that.searchVal,
					startPage: startPage,
					pageSize: that.pageSize,
				}
				that.loadStatus = "loading";
				that.$api.employeeList(param).then(res => {
					if (res.success) {
						let result = res.datas.rows;
						that.total = res.datas.total;
						for (var i in result) {
							result[i].headImgUrl = result[i].headImgUrl ? result[i].headImgUrl :
								'../../../../static/images/defaultUserPic.png';
							that.list.push(result[i]);
						}
						let total = res.datas.total;
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
			editBtn() {
				this.isEdit = !this.isEdit
			},
			constantlySearch(e) {
				const that = this;
				clearTimeout(that.timer);
				that.timer = setTimeout(function() {
					that.search();
				}, 800);
			},
			gotoDetail(id) {
				const that = this;
				that.$Router.push({
					path: "/pages/my/manageNavs/staff/detail",
					query: {
						id: id
					}
				})
			},
			gotoDistri(id) {
				const that = this;
				that.$Router.push({
					path: "/pages/my/manageNavs/staff/distribution",
					query: {
						id: id
					}
				})
			},
			czBtn(id, index) {
				const that = this;
				uni.showActionSheet({
					itemList: ['编辑员工资料', '删除员工'],
					success: (e) => {
						if (e.tapIndex == 0) {
							that.gotoEdit(id);
						} else if (e.tapIndex == 1) {
							uni.showModal({
								content: "确定要删除员工？",
								confirmText: "确认删除",
								cancelText: "取消",
								success: function(res) {
									if (res.confirm) {
										that.delEmployee(id, index);
										
									} else if (res.cancel) {

									}
								}
							});
						}
					}
				})
			},
			delEmployee(id,index) {
				const that = this;
				let param = {
					id:id
				}
				that.$api.employeeDelete(param).then(res => {
					if (res.success) {
						that.list.splice(index, 1);
						uni.showToast({
							title: "删除成功"
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			},
			gotoEdit(id) {
				this.$Router.push({
					path: "/pages/my/manageNavs/staff/edit",
					query:{
						id:id
					}
				})
			},
			gotoAdd() {
				this.$Router.push({
					path: "/pages/my/manageNavs/staff/add"
				})
			},
			clearList() {
				const that = this;
				that.pageNum = 1;
				that.total = "";
				that.list = [];
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
		}
	}
</script>

<style>
	.headerBox {
		position: fixed;
		top: 0;
		/* #ifdef H5 */
		top: calc(44px + env(safe-area-inset-top)) !important;
		/* #endif */
		left: 0;
		width: 100%;
		height: 88rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		display: flex;
		box-shadow: 0 6rpx 20rpx 10rpx rgba(122, 122, 122, .1);
	}

	.compInfoBox {
		height: 150rpx;
		border-bottom: 1rpx solid #E5E5E5;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
	}

	.compInfoBox .compPic {
		width: 68rpx;
		height: 68rpx;
		border-radius: 100%;
		margin-right: 16rpx;
	}

	.compInfoBox .compInfoCont {
		flex: 1;
		margin-right: 20rpx;
	}

	.compName {
		font-size: 34rpx;
		color: #222222;
		line-height: 40rpx;
	}

	.staffNum {
		color: #B8B8B8;
		font-size: 22rpx;
		line-height: 30rpx;
	}

	.compInfoBox .czBtn {
		width: 156rpx;
		height: 54rpx;
		text-align: center;
		line-height: 54rpx;
		border: 1rpx solid #CD282F;
		color: #CD282F;
		font-size: 24rpx;
	}

	.compInfoBox .czBtn2 {
		width: 156rpx;
		height: 54rpx;
		text-align: center;
		line-height: 54rpx;
		border: 1rpx solid #B8B8B8;
		color: #B8B8B8;
		font-size: 24rpx;
	}

	.headerBox .searchInputBox {
		margin-left: 0;
	}

	.customerList {
		padding: 108rpx 0 0 0;
	}

	.customerItem {
		padding: 36rpx 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		transition: all linear 0.1s;
		position: relative;
	}

	.staffInfoBox {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.staffEditBtns {
		width: 144rpx;
		height: 56rpx;
	}

	.staffItemBtn {
		width: 56rpx;
		height: 56rpx;
		margin-left: 16rpx;
	}


	.customerItem::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 134rpx;
		right: 0;
		height: 1rpx;
		background-color: #E5E5E5;
	}

	.customerItem:last-child::after {
		height: 0;
	}

	.customerItem:active {
		background-color: #F7F7F7;
	}

	.customerImg {
		width: 84rpx;
		height: 84rpx;
		border-radius: 100%;
		margin-right: 20rpx;
	}

	.customerNickName {
		line-height: 42rpx;
		font-size: 30rpx;
		color: #222200;
	}

	.customerName {
		line-height: 32rpx;
		color: #B8B8B8;
		font-size: 26rpx;
	}
</style>
