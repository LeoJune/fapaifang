<template>
	<view>
		<view class="statisHead">
			<view class="tr">
				<view class="td1">
					<view class="tdText">排名</view>
				</view>
				<view class="td2">
					<view class="tdText">姓名</view>
				</view>
				<view class="td3">
					<view class="tdText">成交量 (套/7天)</view>
				</view>
			</view>
		</view>
		<view class="statisCont" v-if="list.length!==0">
			<view class="tr" v-for="(item,index) in list" :key="index">
				<view class="td1">
					<view class="tdText">
						<view class="indexBox" v-if="item.seqNo==1">
							<image class="firstTr" src="../../static/images/first_n.png" mode=""></image>
						</view>
						<view class="indexBox" v-else>
							{{item.seqNo}}
						</view>
					</view>
				</view>
				<view class="td2">
					<view class="tdText">{{item.empName}}</view>
				</view>
				<view class="td3">
					<view class="tdText">{{item.saleQty}}</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			getList(){
				const that = this;
				let param = {
				}
				that.$api.salereport(param).then(res => {
					if (res.success) {
						that.list=res.datas;
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			}
		}
	}
</script>

<style>
	.statisHead {
		width: 100%;
		height: 76rpx;
		background: linear-gradient(90deg, #FFA76E, #EE6F5E);
	}

	.tr {
		width: 100%;
		height: 98rpx;
		display: flex;
		align-items: center;
		color: #222222;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.statisHead .tr {
		height: 76rpx;
		color: #FFFFFF;
		font-size: 26rpx;
		line-height: 36rpx;
		border-bottom: none;
	}

	.td1,
	.td3 {
		width: 210rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.td2 {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.indexBox{
		width: 44rpx;
		height: 44rpx;
		display: block;
		text-align: center;
		line-height: 44rpx;
	}
	.firstTr{
		width: 44rpx;
		height: 44rpx;
	}
</style>
