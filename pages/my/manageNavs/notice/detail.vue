<template>
	<view>
		<view class="recordDetailPage" v-if="result">
			<view class="recordDetailCont">
				<view class="noticeDetailTitle">
					{{result.title}}
					<view class="times">
						{{result.startTime}}   至   {{result.endTime}}
					</view>
				</view>
				<view class="noticeDetailCont">
					{{result.content}}
				</view>
			</view>
		</view>
		<!-- <view class="recordFixBtn" @click="gotoAdd">
			<uni-icons type="compose" class="fixBtnIcon" color="#ffffff" size="20"></uni-icons>
			<text class="fixBtnText">新增</text>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: "",
				result:null
			}
		},
		onLoad(options) {
			const that = this;
			that.id = options.id;
			that.getDetail(options.id);
			uni.showLoading({
				title:"加载中..."
			})
		},
		methods: {
			getDetail(id) {
				const that = this;
				let param = {
					id: id
				}
				that.$api.noticeDetail(param).then(res => {
					if (res.success) {
						that.result=res.datas;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
					uni.hideLoading();
				})
			},
			gotoAdd() {
				const that = this;
				that.$Router.push({
					path: "/pages/my/manageNavs/notice/add"
				})
			}
		}
	}
</script>

<style>
	.noticeDetailTitle {
		font-size: 34rpx;
		color: #222222;
	}

	.noticeDetailCont {
		font-size: #555555;
		color: #555555;
		margin-top: 30rpx;
		line-height: 42rpx;
	}
	.times{
		color: #999999;
		font-size: 24rpx;
		margin-top: 10rpx;
	}
</style>
